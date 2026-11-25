<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\SurveyReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;

class SurveyReportController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth')->except(['index', 'show']);
    }

    public function create()
    {
        return Inertia::render('SurveyReport/Upload');
    }

    public function index()
    {
        $reports = SurveyReport::latest()->get();
        return Inertia::render('SurveyReport/Gallery', [
            'reports' => $reports,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'file' => 'required|file|mimetypes:application/pdf|max:10240',
        ]);

        $file = $request->file('file');
        $filename = time() . '_' . $file->getClientOriginalName();
        $path = $file->storeAs('survey_reports', $filename, 'public');

        SurveyReport::create([
            'name' => $request->name,
            'file_path' => $path,
        ]);

        return Redirect::route('survey-reports.index')->with('message', 'Berhasil upload laporan')->with('type', 'success');
    }

    public function show(SurveyReport $surveyReport)
    {
        return Inertia::render('SurveyReport/Viewer', [
            'report' => $surveyReport,
        ]);
    }

    public function destroy(SurveyReport $surveyReport)
    {
        Storage::disk('public')->delete($surveyReport->file_path);
        $surveyReport->delete();

        return Redirect::route('survey-reports.index')->with('message', 'Berhasil hapus laporan')->with('type', 'success');
    }
}