<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use SoDe\Extend\Response;

class RoleController extends BasicController
{
    public $reactView = 'Admin/Roles';
    public $model = Role::class;
    public $ignoreStatusFilter = true;

    private array $pendingPermissionIds = [];

    public function setPaginationInstance(string $model)
    {
        return Role::query()
            ->select('roles.*')
            ->withCount('permissions');
    }

    public function beforeSave(Request $request)
    {
        $id = $request->input('id');
        $name = trim((string) $request->input('name', ''));

        if ($name === '') {
            throw new \Exception('El nombre del rol es obligatorio');
        }

        if (strcasecmp($name, 'Root') === 0) {
            if ($id) {
                throw new \Exception('El rol Root es intocable');
            }
            throw new \Exception('No se permite crear el rol Root desde este modulo');
        }

        $duplicate = Role::query()
            ->where('guard_name', 'web')
            ->whereRaw('LOWER(name) = ?', [mb_strtolower($name)])
            ->when($id, fn($q) => $q->where('id', '!=', $id))
            ->exists();

        if ($duplicate) {
            throw new \Exception('Ya existe un rol con ese nombre');
        }

        $permissionIds = collect($request->input('permissions', []))
            ->filter(fn($x) => is_numeric($x))
            ->map(fn($x) => (int) $x)
            ->values()
            ->all();

        if (count($permissionIds) > 0) {
            $validCount = Permission::query()
                ->whereIn('id', $permissionIds)
                ->where('guard_name', 'web')
                ->count();

            if ($validCount !== count($permissionIds)) {
                throw new \Exception('Uno o mas permisos no son validos');
            }
        }

        $this->pendingPermissionIds = $permissionIds;

        return [
            'id' => $id,
            'name' => $name,
            'guard_name' => 'web',
        ];
    }

    public function afterSave(Request $request, object $jpa, bool $isNew)
    {
        if ($jpa instanceof Role) {
            if (strcasecmp($jpa->name, 'Root') === 0) {
                throw new \Exception('El rol Root es intocable');
            }

            $jpa->syncPermissions($this->pendingPermissionIds);
            $jpa->load('permissions:id,name');
        }
        return $jpa;
    }

    public function get(Request $request, string $id)
    {
        $response = Response::simpleTryCatch(function () use ($id) {
            $role = Role::query()
                ->with('permissions:id,name')
                ->find($id);
            if (!$role) {
                throw new \Exception('El rol no existe');
            }
            return $role;
        });
        return response($response->toArray(), $response->status);
    }

    public function options()
    {
        $roles = Role::query()
            ->select('id', 'name')
            ->where('guard_name', 'web')
            ->where('name', '!=', 'Root')
            ->orderBy('name')
            ->get();

        return response([
            'status' => 200,
            'message' => 'Operacion correcta',
            'data' => $roles,
        ], 200);
    }

    public function permissionsOptions()
    {
        $permissions = Permission::query()
            ->select('id', 'name')
            ->where('guard_name', 'web')
            ->orderBy('name')
            ->get();

        return response([
            'status' => 200,
            'message' => 'Operacion correcta',
            'data' => $permissions,
        ], 200);
    }

    public function delete(Request $request, string $id)
    {
        $response = new Response();
        DB::beginTransaction();
        try {
            $role = Role::query()->find($id);
            if (!$role) {
                throw new \Exception('El rol no existe');
            }
            if (strcasecmp($role->name, 'Root') === 0) {
                throw new \Exception('El rol Root es intocable');
            }

            $role->permissions()->detach();
            $role->delete();

            DB::commit();
            $response->status = 200;
            $response->message = 'Operacion correcta';
        } catch (\Throwable $th) {
            DB::rollBack();
            $response->status = 400;
            $response->message = $th->getMessage();
        } finally {
            return response($response->toArray(), $response->status);
        }
    }

    public function status(Request $request)
    {
        $response = new Response();
        try {
            $role = Role::query()->find($request->id);
            if (!$role) {
                throw new \Exception('El rol no existe');
            }
            if (strcasecmp($role->name, 'Root') === 0) {
                throw new \Exception('El rol Root es intocable');
            }
            $response->status = 200;
            $response->message = 'No aplica para roles';
        } catch (\Throwable $th) {
            $response->status = 400;
            $response->message = $th->getMessage();
        } finally {
            return response($response->toArray(), $response->status);
        }
    }
}
