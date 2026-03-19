<?php

namespace App\Helpers;

use PHPMailer\PHPMailer\PHPMailer;

class EmailConfig
{
    /* variable $name que se recibió */
    static  function config($name): PHPMailer
    {
        $mail = new PHPMailer(true);
        // $mail->SMTPDebug = SMTP::DEBUG_SERVER;
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'sodeworld@gmail.com';
        $mail->Password = 'tyiuxfbugobqlvbf';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = 465;
        $mail->Subject = '' . $name . ', Gracias por comunicarte con DevEx Consulting';
        $mail->CharSet = 'UTF-8';
        $mail->setFrom('sodeworld@gmail.com', 'DevEx Consulting');
        return $mail;
    }
}