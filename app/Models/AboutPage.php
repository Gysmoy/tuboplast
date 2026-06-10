<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AboutPage extends Model
{
    use HasFactory;

    protected $fillable = [
        'family_image',
        'policy_image',
        'hero_badge',
        'hero_title',
        'hero_description',
        'hero_primary_label',
        'hero_secondary_label',
        'hero_cards',
        'milestones',
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
            'policy_image' => null,
            'hero_badge' => 'Nosotros',
            'hero_title' => 'Construimos infraestructura confiable para el futuro',
            'hero_description' => 'Tuboplast es una empresa peruana especializada en tuberias y conexiones de PVC y HDPE, con foco en calidad, respaldo tecnico y soluciones duraderas.',
            'hero_primary_label' => 'Ver catalogo',
            'hero_secondary_label' => 'Hablemos de tu proyecto',
            'hero_cards' => [
                [
                    'label' => 'Trayectoria',
                    'value' => '60+',
                    'description' => 'Anios de experiencia respaldando proyectos en el pais.',
                ],
                [
                    'label' => 'Cobertura',
                    'value' => 'Nacional',
                    'description' => 'Soporte para obras en distintas regiones y sectores.',
                ],
                [
                    'label' => 'Especialidad',
                    'value' => 'PVC-U y HDPE',
                    'description' => 'Soluciones para edificaciones, infraestructura, mineria e industria con respaldo tecnico.',
                ],
            ],
            'milestones' => [
                [
                    'year' => '1960s',
                    'title' => 'Origen industrial',
                    'text' => 'Nacimos como una apuesta peruana por fabricar soluciones confiables para agua y saneamiento.',
                ],
                [
                    'year' => 'Hoy',
                    'title' => 'Cobertura nacional',
                    'text' => 'Acompanamos proyectos de edificaciones, infraestructura, mineria e industria en todo el Peru.',
                ],
                [
                    'year' => 'Futuro',
                    'title' => 'Innovacion continua',
                    'text' => 'Seguimos fortaleciendo procesos, calidad y soporte tecnico para responder a nuevas exigencias.',
                ],
            ],
            'values' => [
                [
                    'title' => 'Experiencia',
                    'text' => 'Mas de seis decadas desarrollando soluciones de conduccion para diferentes sectores.',
                ],
                [
                    'title' => 'Calidad',
                    'text' => 'Procesos y materiales pensados para resistir, durar y rendir en obra.',
                ],
                [
                    'title' => 'Soporte',
                    'text' => 'Asesoria tecnica cercana para especificacion, instalacion y seguimiento.',
                ],
                [
                    'title' => 'Cobertura',
                    'text' => 'Red de atencion para proyectos en distintas regiones del pais.',
                ],
            ],
            'commitment_eyebrow' => 'Compromiso',
            'commitment_title' => 'Acompanamos cada etapa de la obra con respaldo tecnico',
            'commitment_description' => 'Nuestra prioridad es entregar productos consistentes y una experiencia de atencion que ayude a tomar mejores decisiones en proyecto, compra e instalacion.',
            'family_eyebrow' => 'Familia e historia',
            'family_title' => 'Somos Tuboplast',
            'family_lead' => "La primera fabrica 100% peruana con mas de 60 anos en la industria de la construccion, fabricando tuberias y conexiones de PVC y HDPE con todas las lineas completas desde 1/2\" hasta 24\".",
            'family_paragraph_1' => 'No solo fabricamos tuberias; disenamos la infraestructura del manana con ingenieria de precision y materiales de vanguardia.',
            'family_paragraph_2' => '',
            'family_metric_value' => '30+',
            'family_metric_label' => 'ANOS FORJANDO EL PERU',
            'family_aside_1_title' => 'Infraestructura',
            'family_aside_1_text' => 'Capacidad de produccion optimizada para megaproyectos.',
            'family_aside_2_title' => 'I+D+i',
            'family_aside_2_text' => 'Laboratorio de pruebas mecanicas de ultima generacion.',
            'mission_eyebrow' => 'Proposito',
            'mission_title' => 'Mision',
            'mission_text' => 'Ofrecer los mejores productos y servicios con altos estandares de calidad, con el objetivo de generar valor a nuestros clientes a traves del compromiso de nuestros colaboradores.',
            'vision_eyebrow' => 'Proposito',
            'vision_title' => 'Vision',
            'vision_text' => 'Ser una empresa de nivel mundial, contribuyendo a mejorar la calidad de vida de las personas y fortaleciendo los 51 anos de experiencia ganados en el mercado de soluciones conductivas para los servicios basicos.',
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
            'policy_title' => 'Politica del Sistema de Gestion Integrado',
            'policy_scope_eyebrow' => 'Familia e historia',
            'policy_scope_title' => 'Alcance',
            'policy_scope_paragraph_1' => 'Fabricacion, comercializacion, capacitacion en obra, atencion al cliente, asistencia tecnica, almacenamiento, distribucion y despacho de tubos y conexiones de PVC-U (policloruro de vinilo no plastificado) para instalaciones de canalizaciones electricas, abastecimiento de agua, fluidos a presion, desague y sistemas de drenaje y alcantarillado.',
            'policy_scope_paragraph_2' => 'Fabricacion, comercializacion, atencion al cliente, asistencia tecnica, almacenamiento, distribucion y despacho de tubos y conexiones de polietileno. Procesos realizados en el local industrial ubicado en calle Maria Curie 313 - Urbanizacion Industrial Santa Rosa, Distrito de Ate. Lima - Peru.',
            'policy_commitment_text' => 'Compromiso con calidad, seguridad, medio ambiente y mejora continua.',
            'policy_certifications_title' => 'Certificaciones de los Sistemas de Gestion',
            'policy_description' => 'En TUBOPLAST nos dedicamos a la fabricacion de tuberias, accesorios de PVC y polietileno, y estamos comprometidos con la satisfaccion de nuestros clientes para lo cual ponemos a su disposicion nuestros recursos humanos y materiales, ofrecemos un excelente trato personalizado; garantizamos y aseguramos que todo producto brindado cumplira con los requisitos acordados con el cliente.',
            'policy_bullets' => [
                'Fomentar y ejecutar acciones para garantizar que sus operaciones se realicen aplicando estandares de seguridad apropiados, para el control y mitigacion de los riesgos.',
                'Controlar y mitigar nuestros aspectos ambientales significativos.',
                'Mejorar continuamente nuestros procesos, desempeno ambiental y nuestro sistema de gestion integrado.',
                'Sensibilizar, capacitar y entrenar a nuestros colaboradores, a fin de desarrollar una cultura preventiva y promover el cumplimiento de las normas, reglamentos y procedimientos.',
                'Prevenir la contaminacion ambiental.',
                'Cumplir con la legislacion vigente y otros requisitos relacionados a la fabricacion de tuberias y accesorios de PVC, respecto a la seguridad, salud ocupacional y ambiental.',
            ],
            'certifications' => [
                [
                    'title' => 'ISO 9001',
                    'description' => 'Gestion de calidad y mejora continua en procesos industriales.',
                ],
                [
                    'title' => 'ISO 14001',
                    'description' => 'Compromiso con la gestion ambiental y el uso responsable de recursos.',
                ],
                [
                    'title' => 'ISO 45001',
                    'description' => 'Seguridad y salud en el trabajo como prioridad operacional.',
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
