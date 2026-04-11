<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate([
            'email' => 'admin@xplain.pe'
        ],[
            'name' => 'Admin',
            'lastname' => 'xPlain',
            'email' => 'admin@xplain.pe',
            'password' => '4ccessme'
        ])->assignRole('Admin');
    }
}
