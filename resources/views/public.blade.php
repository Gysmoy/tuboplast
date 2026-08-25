<!DOCTYPE html>
<html lang="es">

<head>
    @viteReactRefresh
    <meta charset="UTF-8">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    {{-- Preconnect a orígenes remotos de imágenes/scripts para acelerar LCP --}}
    <link rel="preconnect" href="https://images.unsplash.com" crossorigin>
    <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
    @php
        $seo = $seo ?? [];
        $seoTitle = $seo['title'] ?? (env('APP_NAME', 'Tuboplast') . ' | Expertos en Tuberias y Conexiones de PVC');
        $seoDescription = $seo['description'] ?? 'Tuberias y conexiones de PVC para proyectos residenciales e industriales.';
        $seoImage = $seo['image'] ?? asset('/assets/img/icons/og-image.jpg');
        $seoUrl = $seo['url'] ?? url()->current();
        $seoType = $seo['type'] ?? 'website';
        $seoSiteName = $seo['site_name'] ?? env('APP_NAME', 'Tuboplast');
        $seoKeywords = $seo['keywords'] ?? 'tuboplast, tuberias pvc, conexiones pvc';
        // Cache-busting por mtime (evita iconos cacheados que solo salen con Ctrl+Shift+R).
        $v = fn ($p) => '/' . ltrim($p, '/') . '?v=' . (is_file(public_path($p)) ? filemtime(public_path($p)) : '1');
    @endphp

    <title>{{ $seoTitle }}</title>

    <meta name="title" content="{{ $seoTitle }}" />
    <meta name="description" content="{{ $seoDescription }}" />
    <meta name="keywords" content="{{ $seoKeywords }}" />
    {{-- Canonical URL --}}
    <link rel="canonical" href="{{ $seoUrl }}" />

    {{-- Open Graph / Facebook / WhatsApp --}}
    <meta property="og:type" content="{{ $seoType }}" />
    <meta property="og:url" content="{{ $seoUrl }}" />
    <meta property="og:title" content="{{ $seoTitle }}" />
    <meta property="og:description" content="{{ $seoDescription }}" />
    <meta property="og:image" content="{{ $seoImage }}" />
    <meta property="og:image:secure_url" content="{{ $seoImage }}" />
    <meta property="og:image:alt" content="{{ $seoTitle }}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="{{ $seoSiteName }}" />
    <meta property="og:locale" content="es_PE" />

    {{-- Twitter / X --}}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="{{ $seoUrl }}" />
    <meta name="twitter:title" content="{{ $seoTitle }}" />
    <meta name="twitter:description" content="{{ $seoDescription }}" />
    <meta name="twitter:image" content="{{ $seoImage }}" />
    <meta name="twitter:image:alt" content="{{ $seoTitle }}" />


    <link rel="icon" type="image/png" href="/assets/img/icons/icon-96.png" sizes="96x96" />
    <link rel="icon" type="image/svg+xml" href="/assets/img/icon.svg" />
    <link rel="shortcut icon" type="image/svg+xml" href="/assets/img/icon.svg" />
    <link rel="apple-touch-icon" sizes="180x180" href="/assets/img/apple-touch-icon.png" />
    <meta name="apple-mobile-web-app-title" content="Tuboplast" />
    <link rel="manifest" href="/manifest.webmanifest">

    <link href="{{ $v('lte/assets/css/icons.min.css') }}" rel="stylesheet" type="text/css" />
    <link href="{{ $v('lte/assets/css/mdi-icons.css') }}" rel="stylesheet" type="text/css" />

    {{-- Fuentes auto-alojadas (Manrope, Space Grotesk y Noto Color Emoji) --}}
    <link href="{{ asset('fonts/fonts.css') }}" rel="stylesheet">

    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">

    <style>
        * {
            font-family: "Manrope", sans-serif;
            box-sizing: border-box;
        }

        .font-title {
            font-family: "Space Grotesk", sans-serif;
        }

        .font-emoji {
            font-family: "Noto Color Emoji", sans-serif;
        }
    </style>

    @if ($component == 'Formula.jsx')
        <script type="application/javascript" src="https://checkout.culqi.com/js/v4"></script>
        <script type="application/javascript" src="https://3ds.culqi.com" defer></script>
        <script type="application/javascript" src="https://js.openpay.pe/openpay.v1.min.js"></script>
        <script type="application/javascript" src="https://js.openpay.pe/openpay-data.v1.min.js"></script>
    @elseif ($component == 'MyAccount.jsx')
        <link href="/lte/assets/libs/dxdatagrid/css/dx.light.compact.css?v=06d3ebc8-645c-4d80-a600-c9652743c425"
            rel="stylesheet" type="text/css" id="dg-default-stylesheet" />
        <link href="/lte/assets/libs/dxdatagrid/css/dx.dark.compact.css?v=06d3ebc8-645c-4d80-a600-c9652743c425"
            rel="stylesheet" type="text/css" id="dg-dark-stylesheet" disabled="disabled" />
    @endif

    @isset($component)
        @vite(['resources/css/app.css', 'resources/js/' . $component . '.jsx'])
    @else
        @vite(['resources/css/app.css'])
    @endisset
    @inertiaHead

    <style>
        .ql-editor blockquote {
            border-left: 4px solid #f8b62c;
            padding-left: 16px;
        }

        .ql-editor * {
            color: #475569;
        }

        .ql-editor img {
            border-radius: 8px;
        }
    </style>

</head>

<body>
    @inertia

    <script src="/lte/assets/js/vendor.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/flowbite@2.4.1/dist/flowbite.min.js" defer></script>
    {{-- moment removido: ninguna página pública lo usa (ahorra ~840KB) --}}
    <script src="/lte/assets/libs/tippy.js/tippy.all.min.js" defer></script>

    <script>
        document.addEventListener('click', function(event) {
            const target = event.target;

            if (target.tagName === 'BUTTON' && target.hasAttribute('href')) {
                const href = target.getAttribute('href');

                if (target.getAttribute('target') === '_blank') {
                    window.open(href, '_blank');
                } else {
                    window.location.href = href;
                }
            }
        });
    </script>
</body>

</html>
