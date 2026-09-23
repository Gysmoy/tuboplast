<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>{{ $quote->code }}</title>
    <style>
        body { font-family: Helvetica, Arial, sans-serif; color: #1f2937; font-size: 12px; }
        h1 { font-size: 18px; margin-bottom: 4px; }
        .muted { color: #6b7280; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th, td { text-align: left; padding: 6px 4px; border-bottom: 1px solid #e5e7eb; }
        th { text-transform: uppercase; font-size: 10px; color: #6b7280; }
        .section { margin-top: 16px; }
    </style>
</head>
<body>
    <h1>Cotización {{ $quote->code }}</h1>
    <p class="muted">Fecha: {{ $quote->created_at?->format('d/m/Y H:i') }}</p>

    <div class="section">
        <strong>Cliente:</strong> {{ $quote->name }}<br>
        @if ($quote->business)
            <strong>Empresa:</strong> {{ $quote->business }}<br>
        @endif
        @if ($quote->ruc)
            <strong>RUC:</strong> {{ $quote->ruc }}<br>
        @endif
        <strong>Correo:</strong> {{ $quote->email }}<br>
        @if ($quote->phone)
            <strong>Teléfono:</strong> {{ $quote->phone_prefix }} {{ $quote->phone }}<br>
        @endif
        <strong>Ubicación:</strong> {{ $quote->region }}<br>
        @if ($quote->observations)
            <strong>Observaciones:</strong> {{ $quote->observations }}
        @endif
    </div>

    <table>
        <thead>
            <tr>
                <th>Producto</th>
                <th>SKU</th>
                <th>Cantidad</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($quote->items as $item)
                <tr>
                    <td>{{ $item['title'] }}</td>
                    <td>{{ $item['sku'] ?? '-' }}</td>
                    <td>{{ $item['quantity'] }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
