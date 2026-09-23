<?php

namespace App\Mail;

use App\Models\Quote;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class QuoteReceived extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Quote $quote)
    {
    }

    public function build(): static
    {
        $pdf = Pdf::loadView('pdf.quote', ['quote' => $this->quote]);

        return $this
            ->subject('Hemos recibido tu cotización ' . $this->quote->code)
            ->view('emails.quote-received')
            ->with(['quote' => $this->quote])
            ->attachData($pdf->output(), $this->quote->code . '.pdf', [
                'mime' => 'application/pdf',
            ]);
    }
}
