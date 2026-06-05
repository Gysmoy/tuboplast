<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlogPage extends Model
{
    use HasFactory;

    protected $fillable = [
        'hero_image',
        'hero_badge',
        'hero_title',
        'hero_description',
        'section_title',
        'posts',
        'most_read',
        'newsletter_eyebrow',
        'newsletter_title',
        'newsletter_description',
        'newsletter_placeholder',
        'newsletter_button_label',
        'status',
    ];

    protected $casts = [
        'posts' => 'array',
        'most_read' => 'array',
        'status' => 'boolean',
    ];

    public static function defaults(): array
    {
        return [
            'hero_image' => null,
            'hero_badge' => 'Blog Tuboplast',
            'hero_title' => 'Construyendo el futuro',
            'hero_description' => 'Explora las ultimas innovaciones tecnicas, proyectos emblematicos y consejos de ingenieria para el mercado peruano.',
            'section_title' => 'Ultimas actualizaciones',
            'posts' => [
                [
                    'category' => 'Productos',
                    'title' => 'Tuberia PVC-U vs HDPE: cual elegir segun el tipo de proyecto?',
                    'description' => 'Comparamos resistencia, costo y aplicacion para que tomes la mejor decision tecnica en cada obra.',
                    'image_path' => null,
                ],
                [
                    'category' => 'Etiqueta',
                    'title' => 'Como instalar tuberias CPVC en proyectos de agua caliente sin errores',
                    'description' => 'Guia paso a paso para una instalacion segura, duradera y certificada. Todo lo que el maestro necesita saber.',
                    'image_path' => null,
                ],
                [
                    'category' => 'Industria',
                    'title' => 'Infraestructura hidrica en el Peru: los retos del sector construccion en 2025',
                    'description' => 'Analizamos el panorama actual del sector, las normativas vigentes y como Tuboplast responde a la demanda.',
                    'image_path' => null,
                ],
                [
                    'category' => 'Productos',
                    'title' => 'Tuberia PVC-U vs HDPE: cual elegir segun el tipo de proyecto?',
                    'description' => 'Comparamos resistencia, costo y aplicacion para que tomes la mejor decision tecnica en cada obra.',
                    'image_path' => null,
                ],
                [
                    'category' => 'Etiqueta',
                    'title' => 'Como instalar tuberias CPVC en proyectos de agua caliente sin errores',
                    'description' => 'Guia paso a paso para una instalacion segura, duradera y certificada. Todo lo que el maestro necesita saber.',
                    'image_path' => null,
                ],
                [
                    'category' => 'Industria',
                    'title' => 'Infraestructura hidrica en el Peru: los retos del sector construccion en 2025',
                    'description' => 'Analizamos el panorama actual del sector, las normativas vigentes y como Tuboplast responde a la demanda.',
                    'image_path' => null,
                ],
            ],
            'most_read' => [
                [
                    'number' => '01',
                    'title' => 'Manual de instalacion de valvulas mariposa',
                    'category' => 'Soporte tecnico',
                ],
                [
                    'number' => '02',
                    'title' => 'Norma tecnica peruana para PVC-U',
                    'category' => 'Normativa',
                ],
                [
                    'number' => '03',
                    'title' => 'Comparativo: CPVC vs PPR en edificios',
                    'category' => 'Infraestructura',
                ],
            ],
            'newsletter_eyebrow' => 'Newsletter',
            'newsletter_title' => 'Se el primero en saber',
            'newsletter_description' => 'Tips de instalacion, nuevos productos y actualizaciones exclusivas para profesionales.',
            'newsletter_placeholder' => 'Correo electronico',
            'newsletter_button_label' => 'Suscribirme ahora',
            'status' => true,
        ];
    }

    public static function current(): self
    {
        return self::query()->firstOrCreate(['id' => 1], self::defaults());
    }
}
