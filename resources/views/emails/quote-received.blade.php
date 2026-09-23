<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Cotización recibida</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f5f7; font-family: Arial, Helvetica, sans-serif; color:#1f2937;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5f7; padding:24px 0;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden;">
                    <tr>
                        <td style="background-color:#F4E300; padding:18px 32px;">
                            <img src="{{ $message->embed(public_path('assets/img/logo-email.png')) }}" width="180" height="38" alt="Tuboplast" style="display:block;">
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:32px;">
                            <h1 style="font-size:20px; margin:0 0 16px;">¡Hola {{ $quote->name }}!</h1>
                            <p style="font-size:15px; line-height:1.6; margin:0 0 16px;">
                                Hemos recibido tu cotización <strong>{{ $quote->code }}</strong>. En breve un encargado se pondrá en contacto contigo.
                            </p>
                            <p style="font-size:15px; line-height:1.6; margin:0 0 24px;">
                                Adjuntamos un PDF con el detalle de los productos solicitados para que lo tengas siempre a la mano.
                            </p>

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; margin-bottom:24px;">
                                <thead>
                                    <tr>
                                        <th align="left" style="font-size:13px; text-transform:uppercase; color:#6b7280; border-bottom:1px solid #e5e7eb; padding:8px 0;">Producto</th>
                                        <th align="right" style="font-size:13px; text-transform:uppercase; color:#6b7280; border-bottom:1px solid #e5e7eb; padding:8px 0;">Cantidad</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach ($quote->items as $item)
                                        <tr>
                                            <td style="font-size:14px; padding:8px 0; border-bottom:1px solid #f1f1f1;">{{ $item['title'] }}</td>
                                            <td align="right" style="font-size:14px; padding:8px 0; border-bottom:1px solid #f1f1f1;">{{ $item['quantity'] }}</td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>

                            <p style="font-size:13px; color:#6b7280; line-height:1.6; margin:0;">
                                Código de cotización: {{ $quote->code }}<br>
                                Fecha: {{ $quote->created_at?->format('d/m/Y H:i') }}
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color:#f4f5f7; padding:16px 32px; font-size:12px; color:#9ca3af;">
                            Este es un correo automático, por favor no respondas a este mensaje.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
