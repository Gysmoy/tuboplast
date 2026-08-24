<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AboutPage extends Model
{
    use HasFactory;

    protected $fillable = [
        'family_image',
        'family_hero_display_mode',
        'policy_image',
        'policy_hero_display_mode',
        'hero_badge',
        'hero_title',
        'hero_description',
        'hero_primary_label',
        'hero_secondary_label',
        'hero_cards',
        'milestones',
        'timeline_sort_direction',
        'values',
        'commitment_eyebrow',
        'commitment_title',
        'commitment_description',
        'family_eyebrow',
        'family_title',
        'family_lead',
        'family_paragraph_1',
        'family_paragraph_2',
        'family_metric_value',
        'family_metric_label',
        'family_aside_1_title',
        'family_aside_1_text',
        'family_aside_2_title',
        'family_aside_2_text',
        'mission_eyebrow',
        'mission_title',
        'mission_text',
        'vision_eyebrow',
        'vision_title',
        'vision_text',
        'family_values',
        'policy_eyebrow',
        'policy_title',
        'policy_scope_eyebrow',
        'policy_scope_title',
        'policy_scope_paragraph_1',
        'policy_scope_paragraph_2',
        'policy_commitment_text',
        'policy_certifications_title',
        'policy_description',
        'policy_bullets',
        'certifications',
        'status',
    ];

    protected $casts = [
        'hero_cards' => 'array',
        'milestones' => 'array',
        'values' => 'array',
        'family_values' => 'array',
        'policy_bullets' => 'array',
        'certifications' => 'array',
        'status' => 'boolean',
    ];

    public static function defaults(): array
    {
        return [
            'family_image' => null,
            'family_hero_display_mode' => 'image_with_text',
            'policy_image' => null,
            'policy_hero_display_mode' => 'image_with_text',
            'hero_badge' => 'Nosotros',
            'hero_title' => 'Construimos infraestructura confiable para el futuro',
            'hero_description' => 'Tuboplast es una empresa peruana especializada en tuberías y conexiones de PVC y HDPE, con foco en calidad, respaldo técnico y soluciones duraderas.',
            'hero_primary_label' => 'Ver catálogo',
            'hero_secondary_label' => 'Hablemos de tu proyecto',
            'hero_cards' => [
                [
                    'label' => 'Trayectoria',
                    'value' => '60+',
                    'description' => 'Años de experiencia respaldando proyectos en el país.',
                ],
                [
                    'label' => 'Cobertura',
                    'value' => 'Nacional',
                    'description' => 'Soporte para obras en distintas regiones y sectores.',
                ],
                [
                    'label' => 'Especialidad',
                    'value' => 'PVC-U y HDPE',
                    'description' => 'Soluciones para edificaciones, infraestructura, minería e industria con respaldo técnico.',
                ],
            ],
            'milestones' => [
                [
                    'year' => '1966',
                    'title' => 'Inicio de la historia',
                    'text' => 'Tuboplast inicia su trayectoria industrial como una empresa peruana enfocada en soluciones confiables para la construcción.',
                ],
                [
                    'year' => 'Hoy',
                    'title' => 'Cobertura nacional',
                    'text' => 'Acompañamos proyectos de edificaciones, infraestructura, minería, agricultura e industria en todo el Perú.',
                ],
                [
                    'year' => 'Futuro',
                    'title' => 'Innovación continua',
                    'text' => 'Seguimos fortaleciendo procesos, calidad y soporte técnico para responder a nuevas exigencias del mercado.',
                ],
            ],
            'timeline_sort_direction' => 'asc',
            'values' => [
                [
                    'title' => 'Experiencia',
                    'text' => 'Más de seis décadas desarrollando soluciones de conducción para diferentes sectores.',
                ],
                [
                    'title' => 'Calidad',
                    'text' => 'Procesos y materiales pensados para resistir, durar y rendir en obra.',
                ],
                [
                    'title' => 'Soporte',
                    'text' => 'Asesoría técnica cercana para especificación, instalación y seguimiento.',
                ],
                [
                    'title' => 'Cobertura',
                    'text' => 'Red de atención para proyectos en distintas regiones del país.',
                ],
            ],
            'commitment_eyebrow' => 'Compromiso',
            'commitment_title' => 'Acompañamos cada etapa de la obra con respaldo técnico',
            'commitment_description' => 'Nuestra prioridad es entregar productos consistentes y una experiencia de atención que ayude a tomar mejores decisiónes en proyecto, compra e instalación.',
            'family_eyebrow' => 'Familia e historia',
            'family_title' => 'Somos Tuboplast',
            'family_lead' => "La primera fábrica 100% peruana con más de 60 años en la industria de la construcción, fabricando tuberías y conexiones de PVC y HDPE con todas las líneas completas desde 1/2\" hasta 24\".",
            'family_paragraph_1' => 'No solo fabricamos tuberías; diseñamos la infraestructura del mañana con ingeniería de precisión y materiales de vanguardia.',
            'family_paragraph_2' => 'Nuestra presencia en el mercado se sostiene en la confianza, la cercanía y la capacidad de acompañamiento técnico en cada proyecto.',
            'family_metric_value' => '60+',
            'family_metric_label' => 'AÑOS CONSTRUYENDO EL PERÚ',
            'family_aside_1_title' => 'Infraestructura',
            'family_aside_1_text' => 'Capacidad de producción optimizada para megaproyectos.',
            'family_aside_2_title' => 'I+D+i',
            'family_aside_2_text' => 'Laboratorio de pruebas mecánicas de última generación.',
            'mission_eyebrow' => 'Proposito',
            'mission_title' => 'Misión',
            'mission_text' => 'Ofrecer los mejores productos y servicios con altos estándares de calidad, con el objetivo de generar valor a nuestros clientes a través del compromiso de nuestros colaboradores.',
            'vision_eyebrow' => 'Proposito',
            'vision_title' => 'Visión',
            'vision_text' => 'Ser una empresa de nivel mundial, contribuyendo a mejorar la calidad de vida de las personas y fortaleciendo los 51 años de experiencia ganados en el mercado de soluciones conductivas para los servicios básicos.',
            'family_values' => [
                'Integridad',
                'Respeto',
                'Responsabilidad',
                'Puntualidad',
                'Compromiso',
                'Confianza',
                'Perseverancia',
            ],
            'policy_eyebrow' => 'Excelencia Industrial',
            'policy_title' => 'Política del Sistema de Gestión Integrado',
            'policy_scope_eyebrow' => 'Familia e historia',
            'policy_scope_title' => 'Alcance',
            'policy_scope_paragraph_1' => 'Fabricación, comercialización, capacitación en obra, atención al cliente, asistencia técnica, almacenamiento, distribución y despacho de tubos y conexiones de PVC-U (policloruro de vinilo no plastificado) para instalaciones de canalizaciones eléctricas, abastecimiento de agua, fluidos a presión, desagüe y sistemas de drenaje y alcantarillado.',
            'policy_scope_paragraph_2' => 'Fabricación, comercialización, atención al cliente, asistencia técnica, almacenamiento, distribución y despacho de tubos y conexiones de polietileno. Procesos realizados en el local industrial ubicado en calle María Curie 313 - Urbanización Industrial Santa Rosa, Distrito de Ate. Lima-Perú.',
            'policy_commitment_text' => 'Compromiso con calidad, seguridad, medio ambiente y mejora continua.',
            'policy_certifications_title' => 'Certificaciones de los Sistemas de Gestión',
            'policy_description' => 'En TUBOPLAST nos dedicamos a la fabricación de tuberías, accesorios de PVC y polietileno, y estamos comprometidos con la satisfacción de nuestros clientes para lo cual ponemos a su disposición nuestros recursos humaños y materiales, ofrecemos un excelente trato personalizado; garantizamos y aseguramos que todo producto brindado cumplirá con los requisitos acordados con el cliente.',
            'policy_bullets' => [
                'Fomentar y ejecutar acciónes para garantizar que sus operaciónes se realicen aplicando estándares de seguridad apropiados, para el control y mitigación de los riesgos.',
                'Controlar y mitigar nuestros aspectos ambientales significativos.',
                'Mejorar continuamente nuestros procesos, desempeño ambiental y nuestro sistema de gestión integrado.',
                'Sensibilizar, capacitar y entrenar a nuestros colaboradores, a fin de desarrollar una cultura preventiva y promover el cumplimiento de las normás, reglamentos y procedimientos.',
                'Prevenir la contaminación ambiental.',
                'Cumplir con la legislación vigente y otros requisitos relacionados a la fabricación de tuberías y accesorios de PVC, respecto a la seguridad, salud ocupacional y ambiental.',
            ],
            'certifications' => [
                [
                    'title' => 'ISO 9001',
                    'description' => 'Gestión de calidad y mejora continua en procesos industriales.',
                ],
                [
                    'title' => 'ISO 14001',
                    'description' => 'Compromiso con la gestión ambiental y el uso responsable de recursos.',
                ],
                [
                    'title' => 'ISO 45001',
                    'description' => 'Seguridad y salud en el trabajo como prioridad operaciónal.',
                ],
            ],
            'status' => true,
        ];
    }

    public static function current(): self
    {
        return self::query()->firstOrCreate(['id' => 1], self::defaults());
    }
}

