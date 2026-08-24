<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $this->copyPublicAsset('assets/img/sliders/hero-obras-alto-rendimiento.png', 'sliders/hero-obras-alto-rendimiento.png');
        $this->copyPublicAsset('assets/img/about/control-calidad-sgi.png', 'about/policy/control-calidad-sgi.png');
        $this->copyPublicAsset('assets/img/blog/blog-cotizaciónes-banner.png', 'blog/hero/blog-cotizaciónes-banner.png');

        $this->updateSliders();
        $this->updateAbout();
        $this->updateBlog();
    }

    public function down(): void
    {
        //
    }

    private function updateSliders(): void
    {
        if (!Schema::hasTable('sliders')) {
            return;
        }

        DB::table('sliders')->updateOrInsert(
            ['sort_order' => 1],
            [
                'title' => 'Expertos en Tuberías y Conexiones de PVC',
                'description' => 'Más de 60 años fabricando sistemas de conducción confiables para los sectores de Edificaciones, Infraestructura, Minería e Industria y Agrícola en todo el Perú.',
                'image' => 'sliders/hero-home.webp',
                'primary_button_text' => 'Ver catálogo',
                'primary_button_link' => '/catalog',
                'secondary_button_text' => 'Solicitar cotización',
                'secondary_button_link' => '/contact',
                'metric_one_value' => '60+',
                'metric_one_label' => 'Años de trayectoria',
                'metric_two_value' => 'ISO',
                'metric_two_label' => 'Calidad certificada',
                'sort_order' => 1,
                'status' => true,
                'updated_at' => now(),
                'created_at' => now(),
            ],
        );

        DB::table('sliders')->updateOrInsert(
            ['sort_order' => 2],
            [
                'title' => 'Soluciones de PVC para Obras de Alto Rendimiento',
                'description' => 'Contamos con Líneas completas de tuberías y conexiones de PVC desde ½” hasta 24” con soporte técnico especializado.',
                'image' => 'sliders/hero-obras-alto-rendimiento.png',
                'primary_button_text' => 'Explorar productos',
                'primary_button_link' => '/catalog',
                'secondary_button_text' => 'Hablar con un asesor',
                'secondary_button_link' => '/contact',
                'metric_one_value' => '24”',
                'metric_one_label' => 'Línea completa',
                'metric_two_value' => '50+',
                'metric_two_label' => 'Años de vida útil',
                'sort_order' => 2,
                'status' => true,
                'updated_at' => now(),
                'created_at' => now(),
            ],
        );
    }

    private function updateAbout(): void
    {
        if (!Schema::hasTable('about_pages')) {
            return;
        }

        DB::table('about_pages')->updateOrInsert(
            ['id' => 1],
            [
                'family_image' => null,
                'policy_image' => 'about/policy/control-calidad-sgi.png',
                'family_eyebrow' => 'Familia e historia',
                'family_title' => 'Somos Tuboplast',
                'family_lead' => 'La primera fábrica 100% peruana con más de 60 años en la industria de la construcción, fabricando tuberías y conexiones de PVC y HDPE con todas las líneas completas desde ½” hasta 24”.',
                'family_paragraph_1' => 'No solo fabricamos tuberías; diseñamos la infraestructura del mañana con ingeniería de precisión y materiales de vanguardia.',
                'family_paragraph_2' => 'Nuestra presencia en el mercado se sostiene en la confianza, la cercanía y la capacidad de acompañamiento técnico en cada proyecto.',
                'family_metric_value' => '60+',
                'family_metric_label' => 'AÑOS CONSTRUYENDO EL PERÚ',
                'family_aside_1_title' => 'Infraestructura',
                'family_aside_1_text' => 'Capacidad de producción optimizada para megaproyectos.',
                'family_aside_2_title' => 'I+D+i',
                'family_aside_2_text' => 'Laboratorio de pruebas mecánicas de última generación.',
                'mission_title' => 'Misión',
                'mission_text' => 'Ofrecer los mejores productos y servicios con altos estándares de calidad, con el objetivo de generar valor a nuestros clientes a través del compromiso de nuestros colaboradores.',
                'vision_title' => 'Visión',
                'vision_text' => 'Ser una empresa de nivel mundial, contribuyendo a mejorar la calidad de vida de las personas y fortaleciendo los 51 años de experiencia ganados en el mercado de soluciones conductivas para los servicios básicos.',
                'family_values' => json_encode(['Integridad', 'Respeto', 'Responsabilidad', 'Puntualidad', 'Compromiso', 'Confianza', 'Perseverancia'], JSON_UNESCAPED_UNICODE),
                'policy_title' => 'Política del Sistema de Gestión Integrado',
                'policy_scope_title' => 'Alcance',
                'policy_scope_paragraph_1' => 'Fabricación, comercialización, capacitación en obra, atención al cliente, asistencia técnica, almacenamiento, distribución y despacho de tubos y conexiones de PVC-U (policloruro de vinilo no plastificado) para instalaciones de canalizaciones eléctricas, abastecimiento de agua, fluidos a presión, desagüe y sistemas de drenaje y alcantarillado.',
                'policy_scope_paragraph_2' => 'Fabricación, comercialización, atención al cliente, asistencia técnica, almacenamiento, distribución y despacho de tubos y conexiones de polietileno. Procesos realizados en el local industrial ubicado en calle María Curie 313 - Urbanización Industrial Santa Rosa, Distrito de Ate. Lima-Perú.',
                'policy_certifications_title' => 'Certificaciones de los Sistemas de Gestión',
                'policy_description' => 'En TUBOPLAST nos dedicamos a la fabricación de tuberías, accesorios de PVC y polietileno, y estamos comprometidos con la satisfacción de nuestros clientes para lo cual ponemos a su disposición nuestros recursos humanos y materiales, ofrecemos un excelente trato personalizado; garantizamos y aseguramos que todo producto brindado cumplirá con los requisitos acordados con el cliente.',
                'policy_bullets' => json_encode([
                    'Fomentar y ejecutar acciónes para garantizar que sus operaciones se realicen aplicando estándares de seguridad apropiados, para el control y mitigación de los riesgos.',
                    'Controlar y mitigar nuestros aspectos ambientales significativos.',
                    'Mejorar continuamente nuestros procesos, desempeño ambiental y nuestro sistema de gestión integrado.',
                    'Sensibilizar, capacitar y entrenar a nuestros colaboradores, a fin de desarrollar una cultura preventiva y promover el cumplimiento de las normas, reglamentos y procedimientos.',
                    'Prevenir la contaminación ambiental.',
                    'Cumplir con la legislación vigente y otros requisitos relacionados a la fabricación de tuberías y accesorios de PVC, respecto a la seguridad, salud ocupacional y ambiental.',
                ], JSON_UNESCAPED_UNICODE),
                'certifications' => json_encode([
                    ['title' => 'ISO 9001', 'description' => 'Gestión de calidad y mejora continua en procesos industriales.'],
                    ['title' => 'ISO 14001', 'description' => 'Compromiso con la gestión ambiental y el uso responsable de recursos.'],
                    ['title' => 'ISO 45001', 'description' => 'Seguridad y salud en el trabajo como prioridad operacional.'],
                ], JSON_UNESCAPED_UNICODE),
                'status' => true,
                'updated_at' => now(),
                'created_at' => now(),
            ],
        );
    }

    private function updateBlog(): void
    {
        if (!Schema::hasTable('blog_pages')) {
            return;
        }

        DB::table('blog_pages')->updateOrInsert(
            ['id' => 1],
            [
                'hero_image' => 'blog/hero/blog-cotizaciónes-banner.png',
                'updated_at' => now(),
                'created_at' => now(),
            ],
        );
    }

    private function copyPublicAsset(string $sourceRelative, string $targetRelative): void
    {
        $source = public_path($sourceRelative);
        $target = storage_path('app/public/' . $targetRelative);

        if (!File::exists($source)) {
            return;
        }

        File::ensureDirectoryExists(dirname($target));
        File::copy($source, $target);
    }
};
