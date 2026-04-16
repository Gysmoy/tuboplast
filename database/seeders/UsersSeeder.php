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
            'email' => 'admin@tuboplastperu.com'
        ],[
            'name' => 'Admin',
            'lastname' => 'Tuboplast',
            'email' => 'admin@tuboplastperu.com',
            'password' => '7u8op1ast2026'
        ])->assignRole('Admin');

        User::updateOrCreate([
            'email' => 'admin@xplain.pe'
        ],[
            'name' => 'Admin',
            'lastname' => 'xPlain',
            'email' => 'admin@xplain.pe',
            'password' => '202526'
        ])->assignRole('Admin');

         User::updateOrCreate([
            'email' => 'admin@devex.pe'
        ],[
            'name' => 'Admin',
            'lastname' => 'DevEx',
            'email' => 'admin@devex.pe',
            'password' => '4ccessme'
        ])->assignRole('Admin');
    }
}
