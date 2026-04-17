<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;

class AccountController extends BasicController
{
    public $reactView = 'Admin/Account';

    public function setReactViewProperties(Request $request)
    {
        return [
            'accountCanUploadAvatar' => Schema::hasColumn('users', 'image'),
        ];
    }

    public function updateProfile(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response([
                'status' => 401,
                'message' => 'No autenticado',
            ], 401);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'lastname' => ['required', 'string', 'max:120'],
        ]);

        $user->fill($validated);
        $user->save();

        return response([
            'status' => 200,
            'message' => 'Perfil actualizado correctamente',
            'data' => [
                'name' => $user->name,
                'lastname' => $user->lastname,
                'updated_at' => $user->updated_at,
                'image' => $user->image ?? null,
            ],
        ], 200);
    }

    public function updatePassword(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response([
                'status' => 401,
                'message' => 'No autenticado',
            ], 401);
        }

        $validated = $request->validate([
            'current_password' => ['required', 'string'],
            'new_password' => ['required', 'string'],
            'new_password_confirmation' => ['required', 'string'],
        ]);

        $currentPassword = $this->decodeIfNeeded($validated['current_password']);
        $newPassword = $this->decodeIfNeeded($validated['new_password']);
        $newPasswordConfirmation = $this->decodeIfNeeded($request->input('new_password_confirmation', ''));

        if ($newPassword !== $newPasswordConfirmation) {
            return response([
                'status' => 422,
                'message' => 'La confirmacion de la nueva contrasena no coincide',
            ], 422);
        }

        if (mb_strlen($newPassword) < 8) {
            return response([
                'status' => 422,
                'message' => 'La nueva contrasena debe tener al menos 8 caracteres',
            ], 422);
        }

        if (!Hash::check($currentPassword, $user->password)) {
            return response([
                'status' => 422,
                'message' => 'La contrasena actual no es valida',
            ], 422);
        }

        $user->password = $newPassword;
        $user->save();

        return response([
            'status' => 200,
            'message' => 'Contrasena actualizada correctamente',
        ], 200);
    }

    public function updateAvatar(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response([
                'status' => 401,
                'message' => 'No autenticado',
            ], 401);
        }

        if (!Schema::hasColumn('users', 'image')) {
            return response([
                'status' => 400,
                'message' => 'La columna image no existe en users',
            ], 400);
        }

        $request->validate([
            'avatar' => ['required', 'image', 'max:4096'],
        ]);

        $file = $request->file('avatar');
        $ext = strtolower($file->getClientOriginalExtension() ?: 'jpg');
        $filename = sprintf('%s-%s.%s', $user->id, time(), $ext);
        $path = "images/user/{$filename}";

        Storage::disk('public')->putFileAs('images/user', $file, $filename);

        $oldImage = $user->image ?? null;
        $user->image = $filename;
        $user->save();

        if ($oldImage && $oldImage !== $filename) {
            Storage::disk('public')->delete("images/user/{$oldImage}");
        }

        return response([
            'status' => 200,
            'message' => 'Foto de perfil actualizada correctamente',
            'data' => [
                'image' => $filename,
                'path' => $path,
                'updated_at' => $user->updated_at,
            ],
        ], 200);
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
