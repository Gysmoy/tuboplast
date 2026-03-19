<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $root = Role::updateOrCreate(['name' => 'Root'], ['name' => 'Root']);
        $admin = Role::updateOrCreate(['name' => 'Admin'], ['name' => 'Admin']);

        Permission::updateOrCreate(['name' => 'general.root'], ['name' => 'general.root'])
            ->syncRoles([$root]);
        Permission::updateOrCreate(['name' => 'general.all'], ['name' => 'general.all'])
            ->syncRoles([$root, $admin]);
    }
}
