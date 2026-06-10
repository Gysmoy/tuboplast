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
            'hero_title' => 'Contenido técnico para instalaciones confiables',
            'hero_description' => 'Guías prácticas, criterios de instalación y recomendaciones técnicas para trabajar con tuberías PVC en proyectos residenciales, comerciales e industriales.',
            'section_title' => 'Últimas actualizaciones',
            'posts' => [
                [
                    'category' => 'Materiales',
                    'title' => '¿Por qué se usa PVC en tuberías?',
                    'description' => 'Conoce por qué el PVC se ha convertido en uno de los materiales más usados en conducción de agua, drenaje y aplicaciones técnicas en construcción.',
                    'eyebrow' => 'Guía técnica',
                    'author' => 'Equipo Tuboplast',
                    'role' => 'Contenido editorial',
                    'published' => '10 de junio, 2026',
                    'read_time' => '6 min de lectura',
                    'lead' => 'El PVC es uno de los materiales más utilizados en el mundo gracias a su versatilidad, resistencia y eficiencia en costos. En tuberías, su desempeño lo ha convertido en una referencia para obras seguras y duraderas.',
                    'content_html' => "El cloruro de polivinilo – PVC – es uno de los polímeros más utilizados en el mundo. Gracias a su versatilidad, el PVC se utiliza en una amplia gama de aplicaciones industriales, técnicas y de uso diario, desde marcos para ventanas y tuberías hasta tarjetas de crédito y bolsas de sangre.\n\nCreado a partir de sal (57%) y petróleo (43%), el PVC fue producido comercialmente por primera vez a finales de 1920 y rápidamente se popularizó debido a su flexibilidad, dureza y rentabilidad. En tuberías, el PVC ha sido utilizado durante más de 75 años y hoy en día es la resina más utilizada en tubos de plástico. A nivel mundial, las tuberías de PVC representan un 39% del mercado.\n\n## Usos de las tuberías de PVC\n### Transporte de agua\nTanto para beber como en desagües, las tuberías de PVC transportan agua en diversas formas:\n- Aguas residuales\n- Agua potable\n- Riego\n- Agua de lluvia\n- Descarga de sólidos y residuos\n- Drenaje\n- Agua fría y caliente\n\n### Otros usos\nLas tuberías de PVC tienen muchos otros usos que no están limitados al transporte de líquidos:\n- Protección para cables\n- Distribución de gas\n- Juntas\n- Aplicaciones industriales\n- Extintores para fuego\n\n## Beneficios de las tuberías de PVC\n### Fácil instalación y bajo mantenimiento\nLas tuberías de PVC son más ligeras que las de otros materiales y por lo tanto fáciles de instalar. Una vez colocadas, requieren un mantenimiento mínimo o ninguno.\n\n### Extremadamente duraderas\nLas tuberías de PVC tienen una esperanza de vida útil de más de 100 años ya que son prácticamente inmunes a la corrosión y no se oxidan o reaccionan químicamente con los líquidos que transportan.\n\n### Fuertes y flexibles\nLas tuberías de PVC son fuertes, pero lo suficientemente flexibles como para doblarse sin romperse, lo que les permite soportar la presión del suelo y los movimientos de tierra. También se pueden dilatar y contraer para compensar las variaciones de presión en el sistema.\n\n### Rentables\nLas tuberías de PVC ofrecen una excelente relación precio-rendimiento, directamente ligada a su bajo coste de instalación y mantenimiento, su larga vida útil y la gestión eficiente de los residuos al retirarlas.\n\n### Reciclables\nLas tuberías de PVC pueden ser fácilmente recicladas y utilizadas en nuevos productos. Las propiedades del PVC permanecen intactas durante varias fases de utilización.\n\n## Construyendo un futuro sostenible\nEl PVC tiene importantes características clave para la sostenibilidad. Ante todo, es un material mucho menos dependiente del petróleo comparado con otros termoplásticos y, al tratarse de un material duradero y eficiente a nivel energético, ayuda a reducir el uso de recursos naturales. Además, las tuberías de PVC necesitan un mantenimiento mínimo, lo que reduce aún más el consumo de energía, materias primas y productos químicos. Su ligero peso significa que menos combustible será necesario durante su transporte.\n\nLa industria de las tuberías en Perú va de la mano con Tuboplast S.A., una empresa peruana con más de 50 años en el mercado. Reconocemos la importancia de nuestros productos en el mercado de la construcción, por eso es que siempre estamos buscando entregar productos con la seguridad que las obras necesitan. Estamos de la mano con muchos aliados ferreteros y expertos gasfiteros, quienes son el eje de nuestra empresa y nos ayudan a llevar la marca a más ciudades del Perú.",
                    'highlight_label' => 'Dato clave',
                    'highlight' => 'El PVC combina durabilidad, facilidad de instalación y eficiencia operativa, lo que explica su presencia constante en sistemas modernos de conducción.',
                    'image_path' => null,
                ],
                [
                    'category' => 'Instalación',
                    'title' => 'Errores comunes en instalaciones de tuberías de PVC y cómo evitarlos en obra',
                    'description' => 'Identifica los fallos más frecuentes en obra y aprende cómo prevenir fugas, uniones deficientes y retrabajos en instalaciones con PVC.',
                    'eyebrow' => 'Buenas prácticas',
                    'author' => 'Equipo Tuboplast',
                    'role' => 'Asesoría técnica',
                    'published' => '10 de junio, 2026',
                    'read_time' => '4 min de lectura',
                    'lead' => 'Una instalación correcta es determinante para asegurar sistemas duraderos, libres de fugas y con mejor rendimiento. Muchos problemas en obra nacen de errores básicos que pueden evitarse con procedimientos claros.',
                    'content_html' => "Una correcta instalación de tuberías de PVC es clave para garantizar sistemas seguros, duraderos y libres de fugas en cualquier tipo de edificación. Sin embargo, en obra es común cometer errores que pueden afectar el rendimiento del sistema y generar costos adicionales.\n\n## Errores más frecuentes en instalaciones de PVC\n### 1. Cortes irregulares en la tubería\nUn corte mal ejecutado puede provocar un mal sellado, generando fugas con el tiempo.\n\n### 2. No limpiar la superficie antes de pegar\nEl polvo, grasa o humedad afectan la adherencia del cemento solvente.\n\n### 3. Uso incorrecto del pegamento PVC\nNo todos los adhesivos son iguales. Es importante elegir el adecuado según diámetro y tipo de instalación.\n\n### 4. No respetar tiempos de secado\nActivar el sistema antes del curado completo puede debilitar las uniones.\n\n## Recomendaciones clave\n- Usar herramientas adecuadas como cortatubos\n- Aplicar cemento solvente de manera uniforme\n- Asegurar que las superficies estén limpias y secas\n- Utilizar productos de calidad como Tuboplast, diseñados para máxima resistencia",
                    'highlight_label' => 'Recomendación técnica',
                    'highlight' => 'Una buena instalación no depende solo del material: depende del detalle con el que se corta, limpia, pega y prueba cada tramo.',
                    'image_path' => null,
                ],
                [
                    'category' => 'Construcción',
                    'title' => 'Tipos de tuberías de PVC y sus aplicaciones en proyectos de construcción',
                    'description' => 'Revisa los principales tipos de tuberías de PVC y en qué situaciones conviene usar cada una para saneamiento, presión y protección eléctrica.',
                    'eyebrow' => 'Selección de producto',
                    'author' => 'Equipo Tuboplast',
                    'role' => 'Contenido técnico',
                    'published' => '10 de junio, 2026',
                    'read_time' => '3 min de lectura',
                    'lead' => 'Elegir el tipo correcto de tubería es fundamental para asegurar el buen funcionamiento de un sistema sanitario, eléctrico o de drenaje.',
                    'content_html' => "Elegir el tipo correcto de tubería es fundamental para asegurar el buen funcionamiento de un sistema sanitario, eléctrico o de drenaje.\n\n## Tipos de tuberías más utilizados\n### 1. PVC sanitario\nIdeal para sistemas de desagüe y evacuación de aguas residuales.\n\n### 2. PVC presión\nDiseñado para transportar agua a presión en sistemas hidráulicos.\n\n### 3. PVC eléctrico\nUtilizado para proteger instalaciones eléctricas.\n\n## ¿Cómo elegir correctamente?\n- Evaluar el tipo de proyecto (residencial, comercial o industrial)\n- Considerar presión, temperatura y uso\n- Verificar certificaciones de calidad\n\n## Solución recomendada\nLas tuberías Tuboplast ofrecen soluciones versátiles para:\n- Saneamiento\n- Alcantarillado\n- Electricidad",
                    'highlight_label' => 'Criterio de elección',
                    'highlight' => 'No todas las tuberías cumplen la misma función. Escoger bien desde el inicio evita sobredimensionamientos, fallas y costos innecesarios.',
                    'image_path' => null,
                ],
                [
                    'category' => 'Prevención',
                    'title' => 'Cómo prevenir filtraciones de agua y problemas de humedad en edificaciones',
                    'description' => 'Descubre las causas más comunes de filtraciones y las prácticas que ayudan a evitar humedad, hongos y reparaciones costosas.',
                    'eyebrow' => 'Control en obra',
                    'author' => 'Equipo Tuboplast',
                    'role' => 'Asesoría de aplicación',
                    'published' => '10 de junio, 2026',
                    'read_time' => '5 min de lectura',
                    'lead' => 'Las filtraciones de agua suelen empezar como fallas pequeñas, pero con el tiempo pueden convertirse en problemas estructurales, sanitarios y económicos para cualquier edificación.',
                    'content_html' => "Las filtraciones de agua son uno de los problemas más frecuentes en construcciones residenciales, comerciales e industriales. Aunque muchas veces pasan desapercibidas al inicio, con el tiempo pueden generar daños estructurales, afectar la salud de los ocupantes y aumentar considerablemente los costos de mantenimiento.\n\nUna correcta instalación de tuberías de PVC, junto con el uso de materiales de calidad, es clave para prevenir este tipo de problemas.\n\n## ¿Por qué se producen las filtraciones?\nLas filtraciones suelen originarse por errores en la instalación o por el uso de productos inadecuados. Entre las causas más comunes encontramos:\n- Uniones mal selladas: una aplicación incorrecta del cemento solvente puede generar microfugas que aumentan con el tiempo.\n- Superficies contaminadas: polvo, grasa o humedad afectan la adherencia entre tubería y accesorio.\n- Materiales de baja calidad: tuberías o conexiones que no cumplen estándares pueden deformarse o deteriorarse rápidamente.\n- Mala planificación del sistema: instalaciones sin pruebas previas o con diseños deficientes incrementan el riesgo de fallas.\n\n## Impacto de la humedad en edificaciones\nCuando una fuga no se detecta a tiempo, la humedad comienza a expandirse en muros, techos o pisos. Esto puede generar:\n- Aparición de hongos y moho, afectando la salud respiratoria\n- Malos olores persistentes en el ambiente\n- Deterioro de acabados como pintura, yeso o revestimientos\n- Debilitamiento estructural en casos más avanzados\n- Incremento en costos de reparación y mantenimiento\n\n## Buenas prácticas para prevenir fugas\nPara evitar estos problemas, es fundamental aplicar buenas prácticas desde el inicio de la instalación:\n\n### 1. Preparación adecuada de la tubería\nAntes de unir, asegúrate de que las superficies estén completamente limpias y secas. Esto mejora la adherencia del cemento solvente.\n\n### 2. Aplicación correcta del adhesivo\nEl cemento solvente debe aplicarse de forma uniforme tanto en la tubería como en el accesorio, evitando excesos o faltantes.\n\n### 3. Respeto del tiempo de curado\nNo poner en funcionamiento el sistema antes del tiempo recomendado evita debilitamiento en las uniones.\n\n### 4. Pruebas de presión\nRealizar pruebas antes de cerrar muros o pisos permite detectar fugas a tiempo.\n\n## La importancia de elegir productos confiables\nEl uso de tuberías y conexiones de PVC de alta calidad, como las soluciones de Tuboplast, garantiza:\n- Mayor resistencia a la presión\n- Uniones más seguras\n- Mayor durabilidad en el tiempo\n- Menor riesgo de filtraciones",
                    'highlight_label' => 'Punto crítico',
                    'highlight' => 'La mejor manera de combatir la humedad es evitar la fuga desde la instalación inicial, no reaccionar cuando el daño ya se hizo visible.',
                    'image_path' => null,
                ],
                [
                    'category' => 'Guía técnica',
                    'title' => 'Buenas prácticas en instalaciones sanitarias: guía completa para lograr sistemas duraderos',
                    'description' => 'Una guía clara para planificar, ejecutar y verificar instalaciones sanitarias con mejores resultados, menos fallas y mayor vida útil.',
                    'eyebrow' => 'Instalaciones sanitarias',
                    'author' => 'Equipo Tuboplast',
                    'role' => 'Contenido editorial',
                    'published' => '10 de junio, 2026',
                    'read_time' => '5 min de lectura',
                    'lead' => 'Las instalaciones sanitarias son una parte fundamental en cualquier edificación. Su correcto funcionamiento depende no solo del diseño, sino también de la ejecución en obra.',
                    'content_html' => "Las instalaciones sanitarias son una parte fundamental en cualquier edificación. Su correcto funcionamiento depende no solo del diseño, sino también de la ejecución en obra. Aplicar buenas prácticas garantiza sistemas eficientes, seguros y con una larga vida útil.\n\n## La importancia de una buena instalación\nUna instalación mal ejecutada puede generar problemas como fugas, baja presión, malos olores o incluso fallas estructurales. Por eso, cada etapa del proceso debe realizarse con precisión y conocimiento técnico.\n\n## Etapas clave en una instalación sanitaria\n### 1. Planificación del sistema\nAntes de iniciar, es fundamental definir el recorrido de las tuberías, los puntos de conexión y los materiales necesarios. Esto evita improvisaciones y retrabajos.\n\n### 2. Selección de materiales adecuados\nElegir el tipo correcto de tubería y conexiones según el uso (presión, desagüe o electricidad) es clave para el rendimiento del sistema.\n\n### 3. Ejecución de cortes y uniones\nLos cortes deben ser rectos y precisos. Las uniones deben realizarse con cemento solvente aplicado correctamente para garantizar hermeticidad.\n\n### 4. Instalación con pendiente adecuada\nEn sistemas de desagüe, una pendiente incorrecta puede generar acumulaciones o bloqueos.\n\n### 5. Verificación y pruebas\nAntes de cerrar la instalación, se deben realizar pruebas para asegurar que no existan fugas o fallas.\n\n## Errores que debes evitar\n- No respetar tiempos de secado\n- Usar herramientas inadecuadas\n- Improvisar conexiones\n- No realizar pruebas del sistema\n- Utilizar materiales sin certificación\n\n## Recomendaciones para mejores resultados\n- Trabajar siempre con herramientas especializadas\n- Capacitar constantemente al personal\n- Seguir normas técnicas de instalación\n- Utilizar productos de marcas confiables\n\n## El valor de la calidad en los materiales\nEl uso de tuberías y conexiones de PVC de alta calidad permite:\n- Mayor durabilidad\n- Menor mantenimiento\n- Instalaciones más seguras\n- Mejor desempeño en el tiempo\n\nLas soluciones de Tuboplast están diseñadas para cumplir con altos estándares de calidad, ofreciendo confianza en cada instalación.",
                    'highlight_label' => 'Conclusión técnica',
                    'highlight' => 'Una instalación sanitaria bien ejecutada no solo evita fallas: mejora el rendimiento completo del sistema y protege la inversión del proyecto.',
                    'image_path' => null,
                ],
            ],
            'most_read' => [
                [
                    'number' => '01',
                    'title' => '¿Por qué se usa PVC en tuberías?',
                    'category' => 'Materiales',
                ],
                [
                    'number' => '02',
                    'title' => 'Errores comunes en instalaciones de tuberías de PVC y cómo evitarlos en obra',
                    'category' => 'Instalación',
                ],
                [
                    'number' => '03',
                    'title' => 'Tipos de tuberías de PVC y sus aplicaciones en proyectos de construcción',
                    'category' => 'Construcción',
                ],
            ],
            'newsletter_eyebrow' => 'Newsletter',
            'newsletter_title' => 'Sé el primero en saber',
            'newsletter_description' => 'Tips de instalación, nuevos productos y actualizaciones exclusivas para profesionales.',
            'newsletter_placeholder' => 'Correo electrónico',
            'newsletter_button_label' => 'Suscribirme ahora',
            'status' => true,
        ];
    }

    public static function current(): self
    {
        return self::query()->firstOrCreate(['id' => 1], self::defaults());
    }
}
