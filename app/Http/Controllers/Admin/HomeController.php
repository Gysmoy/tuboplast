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

    private const MONTHS_SHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    public function setReactViewProperties(Request $request)
    {
        return $this->payload($request);
    }

    /** Endpoint JSON para el filtro de periodo (sin recargar la página). */
    public function data(Request $request)
    {
        return response()->json($this->payload($request));
    }

    private function payload(Request $request): array
    {
        $now = Carbon::now();
        $mode = $request->query('mode', 'month');
        $mode = in_array($mode, ['month', 'year'], true) ? $mode : 'month';
        $year = (int) $request->query('year', $now->year);
        $month = max(1, min(12, (int) $request->query('month', $now->month)));

        return [
            'dashboard' => $this->buildDashboard($mode, $year, $month),
            'filter' => $this->buildFilter($mode, $year, $month),
        ];
    }

    private function buildFilter(string $mode, int $year, int $month): array
    {
        $minDate = Quote::min('created_at');
        $firstYear = $minDate ? Carbon::parse($minDate)->year : Carbon::now()->year;
        $firstYear = min($firstYear, Carbon::now()->year);

        $months = collect(range(1, 12))->map(fn ($m) => [
            'value' => $m,
            'label' => ucfirst(Carbon::create(2000, $m, 1)->locale('es')->translatedFormat('F')),
        ])->all();

        return [
            'mode' => $mode,
            'year' => $year,
            'month' => $month,
            'years' => array_values(range(Carbon::now()->year, $firstYear)),
            'months' => $months,
        ];
    }

    private function buildDashboard(string $mode, int $year, int $month): array
    {
        $isYear = $mode === 'year';

        if ($isYear) {
            $start = Carbon::create($year, 1, 1)->startOfYear();
            $end = $start->copy()->endOfYear();
            $prevStart = $start->copy()->subYear()->startOfYear();
            $prevEnd = $prevStart->copy()->endOfYear();
            $label = (string) $year;
            $bucketCount = 12;
            $bucketOf = fn ($date) => (int) $date->month;
            $labels = self::MONTHS_SHORT;
            $xTitle = 'Mes';
            $word = 'del año';
            $shortWord = 'año';
        } else {
            $start = Carbon::create($year, $month, 1)->startOfMonth();
            $end = $start->copy()->endOfMonth();
            $prevStart = $start->copy()->subMonthNoOverflow()->startOfMonth();
            $prevEnd = $prevStart->copy()->endOfMonth();
            $label = ucfirst($start->locale('es')->translatedFormat('F Y'));
            $bucketCount = $start->daysInMonth;
            $bucketOf = fn ($date) => (int) $date->day;
            $labels = array_map('strval', range(1, $bucketCount));
            $xTitle = 'Día del mes';
            $word = 'del mes';
            $shortWord = 'mes';
        }

        // ---------------------------------------------------------- Conteos del periodo
        $quotesNow = Quote::whereBetween('created_at', [$start, $end])->count();
        $quotesPrev = Quote::whereBetween('created_at', [$prevStart, $prevEnd])->count();

        $clubNow = ClubExpert::whereBetween('created_at', [$start, $end])->count();
        $clubPrev = ClubExpert::whereBetween('created_at', [$prevStart, $prevEnd])->count();

        $messagesNow = Message::whereBetween('created_at', [$start, $end])->count();
        $messagesPrev = Message::whereBetween('created_at', [$prevStart, $prevEnd])->count();

        // ---------------------------------------------- Conversión (atendidas / total)
        $attended = fn ($s, $e) => Quote::whereBetween('created_at', [$s, $e])
            ->whereIn('quote_status', ['contactado', 'convertido'])->count();
        $convRate = $quotesNow ? round($attended($start, $end) / $quotesNow * 100, 1) : 0;
        $convPrev = $quotesPrev ? round($attended($prevStart, $prevEnd) / $quotesPrev * 100, 1) : 0;

        // ---------------------------------------------- Montos del periodo (por moneda)
        $totals = ['PEN' => 0.0, 'USD' => 0.0];
        Quote::whereBetween('created_at', [$start, $end])->get(['items'])
            ->each(function ($quote) use (&$totals) {
                foreach ((array) $quote->items as $item) {
                    $currency = strtoupper($item['currency'] ?? 'PEN');
                    if (!isset($totals[$currency])) {
                        $totals[$currency] = 0.0;
                    }
                    $totals[$currency] += (float) ($item['unitPrice'] ?? 0) * max(1, (int) ($item['quantity'] ?? 1));
                }
            });

        $amountLabel = trim(implode(' · ', array_filter([
            $totals['PEN'] > 0 ? 'S/ ' . number_format($totals['PEN'], 2) : null,
            $totals['USD'] > 0 ? '$ ' . number_format($totals['USD'], 2) : null,
        ]))) ?: 'S/ 0.00';
        $ticket = $quotesNow ? $totals['PEN'] / $quotesNow : 0;

        // ---------------------------------------------- Serie del periodo (por día o mes)
        $qtyBuckets = array_fill(1, $bucketCount, 0);
        $amountBuckets = array_fill(1, $bucketCount, 0.0);
        Quote::whereBetween('created_at', [$start, $end])->get(['created_at', 'items'])
            ->each(function ($quote) use (&$qtyBuckets, &$amountBuckets, $bucketOf) {
                $bucket = $bucketOf($quote->created_at);
                $qtyBuckets[$bucket] = ($qtyBuckets[$bucket] ?? 0) + 1;
                foreach ((array) $quote->items as $item) {
                    if (strtoupper($item['currency'] ?? 'PEN') === 'PEN') {
                        $amountBuckets[$bucket] += (float) ($item['unitPrice'] ?? 0) * max(1, (int) ($item['quantity'] ?? 1));
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
            'month_label' => $label,
            'kpis' => [
                [
                    'title' => 'Cotizaciones ' . $word,
                    'value' => number_format($quotesNow),
                    'icon' => 'ti ti-file-invoice',
                    ...$this->delta($quotesNow, $quotesPrev),
                ],
                [
                    'title' => 'Club experto (' . $shortWord . ')',
                    'value' => number_format($clubNow),
                    'icon' => 'ti ti-users-group',
                    ...$this->delta($clubNow, $clubPrev),
                ],
                [
                    'title' => 'Mensajes recibidos',
                    'value' => number_format($messagesNow),
                    'icon' => 'ti ti-message-chatbot',
                    ...$this->delta($messagesNow, $messagesPrev),
                ],
                [
                    'title' => 'Conversión a atendido',
                    'value' => $convRate . '%',
                    'icon' => 'ti ti-rotate-2',
                    ...$this->deltaPts($convRate, $convPrev),
                ],
            ],
            'metrics' => [
                ['label' => 'Monto cotizado ' . $word, 'value' => $amountLabel],
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
                'labels' => $labels,
                'qty' => array_values($qtyBuckets),
                'amount' => array_map(fn ($value) => round($value, 2), array_values($amountBuckets)),
                'x_title' => $xTitle,
            ],
            'latest_quotes' => $this->latestQuotes($start, $end),
        ];
    }

    /** Últimas cotizaciones del periodo para la tabla del dashboard. */
    private function latestQuotes(Carbon $start, Carbon $end): array
    {
        return Quote::whereBetween('created_at', [$start, $end])
            ->latest()->take(8)->get()->map(function ($quote) {
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

    /** Variación porcentual periodo vs anterior. */
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
