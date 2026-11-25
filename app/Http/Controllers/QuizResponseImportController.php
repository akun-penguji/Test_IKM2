<?php

namespace App\Http\Controllers;

use App\Exceptions\QuizResponseImportException;
use App\Exports\SurveyImportTemplateExport;
use App\Imports\QuizResponseImport;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\HeadingRowImport;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Throwable;

class QuizResponseImportController extends Controller
{
    public function template(): BinaryFileResponse
    {
        return Excel::download(new SurveyImportTemplateExport, 'Template Import SKM.xlsx');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls', 'max:10240'],
        ], [
            'file.required' => 'Pilih file Excel yang akan diimpor.',
            'file.mimes' => 'File harus berformat XLSX atau XLS.',
            'file.max' => 'Ukuran file maksimal 10 MB.',
        ]);

        try {
            $file = $request->file('file');
            $headingSheets = (new HeadingRowImport)->toArray($file);
            $headings = $headingSheets[0][0] ?? [];
            $import = new QuizResponseImport($request->user(), $headings);
            Excel::import($import, $file);

            return back()
                ->with('message', "Import selesai: {$import->insertedCount} data berhasil disimpan dan {$import->skippedCount} duplikat dilewati.")
                ->with('type', 'success')
                ->with('import_summary', [
                    'inserted' => $import->insertedCount,
                    'skipped' => $import->skippedCount,
                ]);
        } catch (QuizResponseImportException $exception) {
            return back()
                ->withErrors(['file' => 'File memiliki data yang tidak valid. Periksa rincian kesalahan.'], 'import')
                ->with('import_errors', $exception->rowErrors)
                ->with('import_open', true);
        } catch (Throwable $exception) {
            report($exception);

            return back()
                ->withErrors(['file' => 'File Excel tidak dapat dibaca. Pastikan file tidak rusak dan menggunakan template yang benar.'], 'import')
                ->with('import_open', true);
        }
    }
}
