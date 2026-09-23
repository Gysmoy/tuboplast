<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SubmissionReceived extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * @param  array<string, string>  $details  Pares etiqueta => valor a mostrar (ej. "Especialidad" => "Gasfitero").
     */
    public function __construct(
        public string $name,
        public string $subjectLine,
        public string $intro,
        public ?string $quotedMessage = null,
        public array $details = [],
        public string $closing = 'En breve un encargado se pondrá en contacto contigo.',
    ) {
    }

    public function build(): static
    {
        return $this
            ->subject($this->subjectLine)
            ->view('emails.submission-received')
            ->with([
                'name' => $this->name,
                'intro' => $this->intro,
                'quotedMessage' => $this->quotedMessage,
                'details' => $this->details,
                'closing' => $this->closing,
            ]);
    }
}
