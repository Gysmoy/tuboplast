<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProductController extends BasicController
{
    public $reactView = 'ProductDetail';
    public $reactRootView = 'public';

    private string $slug;

    public function show(Request $request, string $slug)
    {
        $this->slug = $slug;

        return parent::reactView($request);
    }

    public function setReactViewProperties(Request $request)
    {
        return [
            'token' => csrf_token(),
            'product' => $this->findProductBySlug($this->slug),
            'relatedProducts' => $this->relatedProducts(),
        ];
    }

    /**
     * Replace this dummy resolver with Product::where('slug', $slug)->firstOrFail()
     * when the catalog is connected to the database.
     */
    private function findProductBySlug(string $slug): array
    {
        return [
            'slug' => $slug,
            'sku' => 'NTP-399.002',
            'categoryLabel' => 'Tubería PVC-U',
            'title' => 'Tubería Agua SP Clase 15 NTP 399.002 3/4" x 5m',
            'description' => 'Tubería de PVC de alta presión diseñada para sistemas de abastecimiento de agua potable. Fabricada bajo estrictos estándares industriales para garantizar durabilidad y resistencia hidráulica superior.',
            'image' => '/assets/img/items/item-3.png',
            'gallery' => [
                '/assets/img/items/item-3.png',
                '/assets/img/items/item-1.png',
                '/assets/img/items/item-2.png',
                '/assets/img/items/item-4.png',
                '/assets/img/items/item-1.png',
            ],
            'unitPrice' => 28.30,
            'standard' => 'NTP ISO 4422',
            'stockLabel' => 'Stock disponible',
            'summary' => [
                ['label' => 'Material', 'value' => 'PVC-U Virgen'],
                ['label' => 'Diámetro', 'value' => '110 mm'],
                ['label' => 'Longitud', 'value' => '6.0 Metros'],
                ['label' => 'Presión', 'value' => '10 Bar (PN 10)'],
            ],
            'technicalSpecifications' => [
                [
                    'title' => 'Material',
                    'items' => [
                        ['label' => 'Compuesto', 'value' => 'PVC-U Virgen'],
                        ['label' => 'Densidad', 'value' => '1.42 g/cm³'],
                        ['label' => 'Resistencia UV', 'value' => 'Estabilizado'],
                    ],
                ],
                [
                    'title' => 'Dimensiones',
                    'items' => [
                        ['label' => 'Diámetro nominal', 'value' => '3/4" (26.5 mm)'],
                        ['label' => 'Longitud total', 'value' => '5.00 Metros'],
                        ['label' => 'Espesor de pared', 'value' => '2.4 mm'],
                    ],
                ],
                [
                    'title' => 'Desempeño',
                    'items' => [
                        ['label' => 'Presión de trabajo', 'value' => '1.5 MPa (150 PSI)'],
                        ['label' => 'Temp. máxima', 'value' => '45°C'],
                        ['label' => 'Tipo de unión', 'value' => 'Simple Presión (SP)'],
                    ],
                ],
                [
                    'title' => 'Certificaciones',
                    'items' => [
                        ['label' => 'Norma técnica', 'value' => 'NTP 399.002:2015'],
                        ['label' => 'Registro sanitario', 'value' => 'DIGESA 4452-2023'],
                    ],
                    'badges' => ['ISO', 'NTP'],
                ],
            ],
        ];
    }

    private function relatedProducts(): array
    {
        $defaultProduct = [
            'categoryLabel' => 'Tubería PVC-U',
            'title' => 'Tubería Agua SP Clase 15 NTP 399.002 3/4" x 5m',
            'price' => 'S/ 28.30',
            'pressure' => '150 PSI',
            'diameter' => '33 mm',
            'detailUrl' => route('products.show', ['slug' => 'tuberia-agua-sp-clase-15-ntp-399-002']),
        ];

        return [
            [...$defaultProduct, 'image' => '/assets/img/items/item-1.png'],
            [...$defaultProduct, 'image' => '/assets/img/items/item-2.png'],
            [...$defaultProduct, 'image' => '/assets/img/items/item-3.png'],
            [...$defaultProduct, 'image' => '/assets/img/items/item-4.png'],
        ];
    }
}
