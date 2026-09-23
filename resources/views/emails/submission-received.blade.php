<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>{{ $subject ?? 'Tuboplast' }}</title>
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
                            <h1 style="font-size:20px; margin:0 0 16px;">¡Hola {{ $name }}!</h1>
                            <p style="font-size:15px; line-height:1.6; margin:0 0 16px;">
                                {{ $intro }}
                            </p>

                            @if (!empty($details))
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; margin:0 0 16px; background-color:#f9fafb; border-radius:6px;">
                                    <tbody>
                                        @foreach ($details as $label => $value)
                                            <tr>
                                                <td style="font-size:13px; color:#6b7280; padding:10px 14px; width:140px; vertical-align:top;">{{ $label }}</td>
                                                <td style="font-size:14px; color:#1f2937; padding:10px 14px; vertical-align:top;">{{ $value }}</td>
                                            </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                            @endif

                            @if ($quotedMessage)
                                <p style="font-size:13px; color:#6b7280; margin:0 0 4px;">Tu mensaje:</p>
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; margin:0 0 16px;">
                                    <tr>
                                        <td style="font-size:14px; line-height:1.6; color:#1f2937; background-color:#f9fafb; border-left:3px solid #F4E300; padding:12px 14px; border-radius:4px;">
                                            {{ $quotedMessage }}
                                        </td>
                                    </tr>
                                </table>
                            @endif

                            <p style="font-size:15px; line-height:1.6; margin:0;">
                                {{ $closing }}
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
