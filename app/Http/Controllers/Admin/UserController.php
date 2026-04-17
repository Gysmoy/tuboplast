<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use SoDe\Extend\Response;
use Spatie\Permission\Models\Role;

class UserController extends BasicController
{
    public $reactView = 'Admin/Users';
    public $model = User::class;
    public $with4get = ['roles:id,name'];
    public $ignoreStatusFilter = false;

    private array $pendingRoleIds = [];

    public function setPaginationInstance(string $model)
    {
        return User::query()
            ->with('roles:id,name');
    }

    public function beforeSave(Request $request)
    {
        $id = $request->input('id');
        $targetUser = $id ? User::query()->with('roles:id,name')->find($id) : null;

        if ($targetUser && $targetUser->hasRole('Root')) {
            throw new \Exception('Los usuarios con rol Root son intocables');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'lastname' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:180', Rule::unique('users', 'email')->ignore($id)],
            'status' => ['nullable', 'boolean'],
            'roles' => ['required', 'array', 'min:1'],
            'roles.*' => ['integer', 'exists:roles,id'],
            'password' => [$id ? 'nullable' : 'required', 'string', 'min:8'],
        ]);

        $roleIds = collect($validated['roles'] ?? [])
            ->map(fn($x) => (int) $x)
            ->unique()
            ->values()
            ->all();

        $hasRootRole = Role::query()
            ->whereIn('id', $roleIds)
            ->where('name', 'Root')
            ->exists();

        if ($hasRootRole) {
            throw new \Exception('El rol Root no se puede asignar desde este modulo');
        }

        $this->pendingRoleIds = $roleIds;

        $payload = [
            'id' => $id,
            'name' => $validated['name'],
            'lastname' => $validated['lastname'],
            'email' => $validated['email'],
            'status' => array_key_exists('status', $validated) ? $validated['status'] : true,
        ];

        if (!empty($validated['password'])) {
            $payload['password'] = $this->decodeIfNeeded($validated['password']);
        }

        return $payload;
    }

    public function afterSave(Request $request, object $jpa, bool $isNew)
    {
        if ($jpa instanceof User) {
            if ($jpa->hasRole('Root')) {
                throw new \Exception('Los usuarios con rol Root son intocables');
            }
            $jpa->syncRoles($this->pendingRoleIds);
            $jpa->load('roles:id,name');
        }
        return $jpa;
    }

    public function status(Request $request)
    {
        $response = new Response();
        try {
            $user = User::query()->with('roles:id,name')->find($request->id);
            if (!$user) {
                throw new \Exception('El usuario no existe');
            }
            if ($user->hasRole('Root')) {
                throw new \Exception('Los usuarios con rol Root son intocables');
            }

            $status = $request->status;
            if ($status === 'null') {
                $status = null;
            } elseif ($status === 'true' || $status === 1 || $status === '1') {
                $status = true;
            } elseif ($status === 'false' || $status === 0 || $status === '0') {
                $status = false;
            }

            $user->status = $status;
            $user->save();

            $response->status = 200;
            $response->message = 'Operacion correcta';
        } catch (\Throwable $th) {
            $response->status = 400;
            $response->message = $th->getMessage();
        } finally {
            return response($response->toArray(), $response->status);
        }
    }

    public function delete(Request $request, string $id)
    {
        $response = new Response();
        try {
            $user = User::query()->with('roles:id,name')->find($id);
            if (!$user) {
                throw new \Exception('El usuario no existe');
            }
            if ($user->hasRole('Root')) {
                throw new \Exception('Los usuarios con rol Root son intocables');
            }

            $user->status = null;
            $user->save();

            $response->status = 200;
            $response->message = 'Operacion correcta';
        } catch (\Throwable $th) {
            $response->status = 400;
            $response->message = $th->getMessage();
        } finally {
            return response($response->toArray(), $response->status);
        }
    }

    private function decodeIfNeeded(string $value): string
    {
        try {
            return BasicController::decode($value);
        } catch (\Throwable $th) {
            return $value;
        }
    }
}
