<?php

namespace Database\Seeders;

use App\Models\Constant;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use SoDe\Extend\File;

class ConstantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Constant::updateOrCreate([
            'correlative' => 'terms',
        ], [
            'name' => 'Terminos y condiciones',
            'value' => File::get('storage/app/utils/terms.html'),
            'type' => 'html'
        ]);

        Constant::updateOrCreate([
            'correlative' => 'confirm-email',
        ], [
            'name' => 'Confirmar correo electrónico',
            'value' => File::get('storage/app/utils/confirm-email.html'),
            'type' => 'html'
        ]);

        Constant::updateOrCreate([
            'correlative' => 'accept-invitation',
        ], [
            'name' => 'Aceptar invitacion',
            'value' => File::get('storage/app/utils/invitation.html'),
            'type' => 'html'
        ]);
    }
}
