@php
    $component = Route::currentRouteName();
@endphp

<!DOCTYPE html>
<html lang="es" data-layout-mode="detached" data-menu-color="dark">

<head>
    @viteReactRefresh
    <meta charset="utf-8" />
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Auth | {{ env('APP_NAME') }}</title>
    <link rel="shortcut icon" href="/assets/img/icon.svg" type="image/svg+xml" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta content="En DevEx Consulting ayudamos a las empresas a optimizar y escalar sus operaciones mediante tecnología, especializándonos en desarrollo de software a medida y consultoría tecnológica con enfoque en automatización de procesos clave y toma de decisiones basada en datos." name="description" />
    <meta content="DevEx Consulting" name="author" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />

    {{-- <link href="/lte/assets/libs/select2/css/select2.min.css" rel="stylesheet" type="text/css" />

  <link href="/lte/assets/css/config/default/bootstrap.min.css" rel="stylesheet" type="text/css"
    id="bs-default-stylesheet" />
  <link href="/lte/assets/css/config/default/app.css" rel="stylesheet" type="text/css"
    id="app-default-stylesheet" />

  <link href="/lte/assets/css/config/default/bootstrap-dark.min.css" rel="stylesheet" type="text/css"
    id="bs-dark-stylesheet" disabled="disabled" />
  <link href="/lte/assets/css/config/default/app-dark.css" rel="stylesheet" type="text/css" id="app-dark-stylesheet"
    disabled="disabled" />

  <link href="/lte/assets/css/icons.min.css" rel="stylesheet" type="text/css" />

  @vite(['resources/css/app.css', 'resources/js/' . Route::currentRouteName()])
  @inertiaHead --}}

    <!-- Theme Config Js -->
    <script src="/lte/assets/js/config.js"></script>

    <!-- Vendor css -->
    <link href="/lte/assets/css/vendor.min.css" rel="stylesheet" type="text/css" />

    <!-- App css -->
    <link href="/lte/assets/css/app.min.css" rel="stylesheet" type="text/css" id="app-style" />

    <!-- Icons css -->
    <link href="/lte/assets/css/icons.min.css" rel="stylesheet" type="text/css" />
    <link href="/lte/assets/css/mdi-icons.css" rel="stylesheet" type="text/css" />

    @vite(['resources/css/app.css', 'resources/js/' . Route::currentRouteName()])
    @inertiaHead

    {{-- <style>
        /* body * {
      font-family: 'Comfortaa', sans-serif;
    } */

        body code,
        body pre {
            font-family: monospace;
        }
    </style> --}}
</head>

<body>
    <div class="auth-bg d-flex min-vh-100">
        <div class="row g-0 justify-content-center w-100 m-xxl-5 px-xxl-4 m-3">
            <div class="col-xxl-3 col-lg-5 col-md-6">
                <a href="/" class="auth-brand d-flex justify-content-center mb-2">
                    <img src="/assets/img/logo.svg" alt="dark logo" height="40" class="logo-dark" style="height: 40px;">
                    <img src="/assets/img/logo-white.svg" alt="logo light" height="40" class="logo-light"
                        style="height: 40px;">
                </a>

                <p class="fw-semibold mb-4 text-center text-muted fs-15">Panel powered by DevEx Consulting</p>
                <div class="card overflow-hidden text-center p-xxl-4 p-3 mb-0">
                    @inertia

                </div>
                <p class="mt-4 text-center mb-0">
                    <script>
                        document.write(new Date().getFullYear())
                    </script> © {{ env('APP_NAME') }} - Todos los derechos reservados
                </p>
            </div>
        </div>
    </div>

    {{-- <script src="/lte/assets/js/vendor.min.js"></script>
    <script src="/lte/assets/libs/select2/js/select2.full.min.js"></script>
    <script src="/lte/assets/js/app.min.js"></script> --}}

    <!-- Vendor js -->
    <script src="/lte/assets/js/vendor.min.js"></script>

    <!-- App js -->
    <script src="/lte/assets/js/app.js"></script>

</body>

</html>
