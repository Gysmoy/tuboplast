<?php

namespace App\Jobs;

use App\Http\Controllers\Admin\ItemController;
use App\Models\BulkImport;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessItemsImport implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 590;
    public int $tries = 1;

    public function __construct(public int $bulkImportId)
    {
    }

    public function handle(ItemController $controller): void
    {
        $bulkImport = BulkImport::find($this->bulkImportId);

        if (!$bulkImport) {
            return;
        }

        $controller->runImport($bulkImport);
    }
}
