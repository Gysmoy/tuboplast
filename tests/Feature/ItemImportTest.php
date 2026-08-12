<?php

namespace Tests\Feature;

use App\Models\Item;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;
use ZipArchive;

class ItemImportTest extends TestCase
{
    use RefreshDatabase;

    public function test_import_without_images_still_creates_items(): void
    {
        $this->actingAs(User::factory()->create());

        $response = $this->post('/api/items/import', [
            'file' => UploadedFile::fake()->createWithContent('items.csv', $this->csv([
                ['ADA112PR', 'Producto ADA'],
            ])),
            'mode' => 'upsert',
        ]);

        $response->assertOk()
            ->assertJsonPath('status', 200)
            ->assertJsonPath('data.created', 1)
            ->assertJsonPath('data.images_associated', 0);

        $this->assertDatabaseHas('items', ['sku' => 'ADA112PR']);
    }

    public function test_import_associates_zip_images_by_sku_and_order(): void
    {
        Storage::fake('public');
        $this->actingAs(User::factory()->create());

        $response = $this->post('/api/items/import', [
            'file' => UploadedFile::fake()->createWithContent('items.csv', $this->csv([
                ['ADA112PR', 'Producto ADA'],
            ])),
            'images_zip' => $this->zipUpload([
                'folder/ADA112PR-2.jpg' => 'second',
                'ADA112PR.png' => 'main',
                'ADA112PR-1.jpeg' => 'first',
            ]),
            'mode' => 'upsert',
        ]);

        $response->assertOk()
            ->assertJsonPath('status', 200)
            ->assertJsonPath('data.images_associated', 3)
            ->assertJsonPath('data.images_ignored', 0);

        $item = Item::with('images')->where('sku', 'ADA112PR')->firstOrFail();
        $this->assertSame($item->images[0]->path, $item->image);
        $this->assertCount(3, $item->images);
        $this->assertSame([0, 1, 2], $item->images->pluck('sort_order')->all());
    }

    public function test_import_reports_unmatched_and_invalid_zip_files_as_ignored(): void
    {
        Storage::fake('public');
        $this->actingAs(User::factory()->create());

        $response = $this->post('/api/items/import', [
            'file' => UploadedFile::fake()->createWithContent('items.csv', $this->csv([
                ['ADA112PR', 'Producto ADA'],
            ])),
            'images_zip' => $this->zipUpload([
                'ADA112PR.png' => 'main',
                'NOEXISTE.jpg' => 'orphan',
                'notes.txt' => 'ignored',
            ]),
            'mode' => 'upsert',
        ]);

        $response->assertOk()
            ->assertJsonPath('status', 200)
            ->assertJsonPath('data.images_associated', 1)
            ->assertJsonPath('data.images_ignored', 2);
    }

    public function test_upsert_without_zip_keeps_existing_images(): void
    {
        $this->actingAs(User::factory()->create());
        $item = Item::create([
            'category_id' => null,
            'sku' => 'ADA112PR',
            'slug' => 'producto-ada',
            'title' => 'Producto ADA',
            'image' => 'items/existing.png',
            'status' => true,
        ]);
        $item->images()->create(['path' => 'items/existing.png', 'sort_order' => 0]);

        $response = $this->post('/api/items/import', [
            'file' => UploadedFile::fake()->createWithContent('items.csv', $this->csv([
                ['ADA112PR', 'Producto ADA Actualizado'],
            ])),
            'mode' => 'upsert',
        ]);

        $response->assertOk()->assertJsonPath('status', 200);

        $item->refresh()->load('images');
        $this->assertSame('items/existing.png', $item->image);
        $this->assertCount(1, $item->images);
    }

    private function csv(array $rows): string
    {
        $lines = ['Codigo Producto,Descripcion de Producto,LINEA DE PRODUCTO'];

        foreach ($rows as [$sku, $title]) {
            $lines[] = "{$sku},{$title},Agua Fria";
        }

        return implode("\n", $lines);
    }

    private function zipUpload(array $files): UploadedFile
    {
        $path = tempnam(sys_get_temp_dir(), 'item-images-') . '.zip';
        $zip = new ZipArchive();
        $zip->open($path, ZipArchive::CREATE);

        foreach ($files as $name => $content) {
            $zip->addFromString($name, $content);
        }

        $zip->close();

        return new UploadedFile($path, 'images.zip', 'application/zip', null, true);
    }
}
