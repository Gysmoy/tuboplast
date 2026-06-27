<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\ClubExpert;
use App\Models\Item;
use App\Models\Message;
use App\Models\Quote;
use Carbon\Carbon;
use Illuminate\Http\Request;

class HomeController extends BasicController
{
    public $reactView = 'Admin/Home';

    public function setReactViewProperties(Request $request)
    {
        $now = Carbon::now();
        $monthStart = $now->copy()->startOfMonth();
        $monthEnd = $now->copy()->endOfMonth();
        $prevStart = $now->copy()->subMonthNoOverflow()->startOfMonth();
        $prevEnd = $now->copy()->subMonthNoOverflow()->endOfMonth();

        // ---------------------------------------------------------- Conteos del mes
        $quotesMonth = Quote::whereBetween('created_at', [$monthStart, $monthEnd])->count();
        $quotesPrev = Quote::whereBetween('created_at', [$prevStart, $prevEnd])->count();

        $clubMonth = ClubExpert::whereBetween('created_at', [$monthStart, $monthEnd])->count();
        $clubPrev = ClubExpert::whereBetween('created_at', [$prevStart, $prevEnd])->count();

        $messagesMonth = Message::whereBetween('created_at', [$monthStart, $monthEnd])->count();
        $messagesPrev = Message::whereBetween('created_at', [$prevStart, $prevEnd])->count();

        // ---------------------------------------------- Conversión (atendidas / total)
        $attended = fn ($start, $end) => Quote::whereBetween('created_at', [$start, $end])
            ->whereIn('quote_status', ['contactado', 'convertido'])->count();
        $convRate = $quotesMonth ? round($attended($monthStart, $monthEnd) / $quotesMonth * 100, 1) : 0;
        $convPrev = $quotesPrev ? round($attended($prevStart, $prevEnd) / $quotesPrev * 100, 1) : 0;

        // ---------------------------------------------- Montos del mes (por moneda)
        $totals = ['PEN' => 0.0, 'USD' => 0.0];
        Quote::whereBetween('created_at', [$monthStart, $monthEnd])->get(['items'])
            ->each(function ($quote) use (&$totals) {
                foreach ((array) $quote->items as $item) {
                    $currency = strtoupper($item['currency'] ?? 'PEN');
                    if (!isset($totals[$currency])) {
                        $totals[$currency] = 0.0;
                    }
                    $unit = (float) ($item['unitPrice'] ?? 0);
                    $qty = max(1, (int) ($item['quantity'] ?? 1));
                    $totals[$currency] += $unit * $qty;
                }
            });

        $amountLabel = trim(implode(' · ', array_filter([
            $totals['PEN'] > 0 ? 'S/ ' . number_format($totals['PEN'], 2) : null,
            $totals['USD'] > 0 ? '$ ' . number_format($totals['USD'], 2) : null,
        ]))) ?: 'S/ 0.00';
        $ticket = $quotesMonth ? $totals['PEN'] / $quotesMonth : 0;

        // ---------------------------------------------- Serie del mes (por día)
        $days = $now->daysInMonth;
        $qtyByDay = array_fill(1, $days, 0);
        $amountByDay = array_fill(1, $days, 0.0);
        Quote::whereBetween('created_at', [$monthStart, $monthEnd])->get(['created_at', 'items'])
            ->each(function ($quote) use (&$qtyByDay, &$amountByDay) {
                $day = (int) $quote->created_at->day;
                $qtyByDay[$day] = ($qtyByDay[$day] ?? 0) + 1;
                foreach ((array) $quote->items as $item) {
                    if (strtoupper($item['currency'] ?? 'PEN') === 'PEN') {
                        $amountByDay[$day] += (float) ($item['unitPrice'] ?? 0) * max(1, (int) ($item['quantity'] ?? 1));
                    }
                }
            });

        // ---------------------------------------------- Embudo (histórico)
        $pendiente = Quote::where(fn ($q) => $q->where('quote_status', 'pendiente')->orWhereNull('quote_status'))->count();
        $contactado = Quote::where('quote_status', 'contactado')->count();
        $convertido = Quote::where('quote_status', 'convertido')->count();
        $funnelMax = max(1, $pendiente, $contactado, $convertido);

        // ---------------------------------------------- Extras
        $unreadQuotes = Quote::where('seen', false)->count();
        $itemsActive = Item::where('status', true)->count();

        return [
            'dashboard' => [
                'month_label' => ucfirst($now->locale('es')->translatedFormat('F Y')),
                'kpis' => [
                    [
                        'title' => 'Cotizaciones del mes',
                        'value' => number_format($quotesMonth),
                        'icon' => 'ti ti-file-invoice',
                        ...$this->delta($quotesMonth, $quotesPrev),
                    ],
                    [
                        'title' => 'Club experto (mes)',
                        'value' => number_format($clubMonth),
                        'icon' => 'ti ti-users-group',
                        ...$this->delta($clubMonth, $clubPrev),
                    ],
                    [
                        'title' => 'Mensajes recibidos',
                        'value' => number_format($messagesMonth),
                        'icon' => 'ti ti-message-chatbot',
                        ...$this->delta($messagesMonth, $messagesPrev),
                    ],
                    [
                        'title' => 'Conversión a atendido',
                        'value' => $convRate . '%',
                        'icon' => 'ti ti-rotate-2',
                        ...$this->deltaPts($convRate, $convPrev),
                    ],
                ],
                'metrics' => [
                    ['label' => 'Monto cotizado del mes', 'value' => $amountLabel],
                    ['label' => 'Ticket promedio (S/)', 'value' => 'S/ ' . number_format($ticket, 2)],
                    ['label' => 'Cotizaciones sin leer', 'value' => number_format($unreadQuotes)],
                    ['label' => 'Items activos en catálogo', 'value' => number_format($itemsActive)],
                ],
                'funnel' => [
                    ['stage' => 'Cotizaciones pendientes', 'value' => $pendiente, 'color' => 'warning'],
                    ['stage' => 'Cotizaciones atendidas', 'value' => $contactado, 'color' => 'success'],
                    ['stage' => 'Cotizaciones ganadas', 'value' => $convertido, 'color' => 'primary'],
                ],
                'funnel_max' => $funnelMax,
                'chart' => [
                    'labels' => array_map('strval', range(1, $days)),
                    'qty' => array_values($qtyByDay),
                    'amount' => array_map(fn ($value) => round($value, 2), array_values($amountByDay)),
                ],
                'latest_quotes' => $this->latestQuotes(),
            ],
        ];
    }

    /** Últimas cotizaciones para la tabla del dashboard. */
    private function latestQuotes(): array
    {
        return Quote::latest()->take(8)->get()->map(function ($quote) {
            $totals = [];
            foreach ((array) $quote->items as $item) {
                $currency = strtoupper($item['currency'] ?? 'PEN');
                $totals[$currency] = ($totals[$currency] ?? 0)
                    + (float) ($item['unitPrice'] ?? 0) * max(1, (int) ($item['quantity'] ?? 1));
            }
            $amount = trim(implode(' · ', array_filter([
                !empty($totals['PEN']) ? 'S/ ' . number_format($totals['PEN'], 2) : null,
                !empty($totals['USD']) ? '$ ' . number_format($totals['USD'], 2) : null,
            ]))) ?: '—';

            $status = $quote->quote_status ?: 'pendiente';

            return [
                'code' => $quote->code ?: ('#' . $quote->id),
                'customer' => $quote->name,
                'business' => $quote->business ?: '—',
                'region' => $quote->region ?: '—',
                'items' => (int) $quote->total_items,
                'status' => $status,
                'status_label' => ucfirst($status),
                'amount' => $amount,
                'date' => optional($quote->created_at)->locale('es')->isoFormat('DD MMM YYYY'),
            ];
        })->all();
    }

    /** Variación porcentual mes vs mes anterior. */
    private function delta(int $current, int $previous): array
    {
        if ($previous <= 0) {
            return ['delta' => $current > 0 ? 'Nuevo' : 'Sin datos', 'positive' => $current > 0];
        }

        $change = round(($current - $previous) / $previous * 100, 1);

        return ['delta' => ($change >= 0 ? '+' : '') . $change . '%', 'positive' => $change >= 0];
    }

    /** Variación en puntos (para porcentajes como la conversión). */
    private function deltaPts(float $current, float $previous): array
    {
        $change = round($current - $previous, 1);

        return ['delta' => ($change >= 0 ? '+' : '') . $change . ' pts', 'positive' => $change >= 0];
    }
}
