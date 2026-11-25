<?php

use App\Models\Role;
use App\Models\User;
use App\Models\Lokus;
use Inertia\Inertia;
use App\Models\Unsur;
use App\Models\Period;
use App\Models\Service;
use App\Models\Question;
use App\Models\QuizResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\RTLController;
use App\Http\Controllers\PeriodController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\UserSettingController;
use App\Http\Controllers\QuizResponseController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\LokusController;
use App\Http\Controllers\SurveyReportController;
use App\Http\Controllers\QuizResponseImportController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    $periodActive = Period::where('is_published', '=', 1)->first();
    return Inertia::render('Portal', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'period' => $periodActive
    ]);
})->name('portal.index');

Route::get('/ikm-chart', function () {
    $periodActive = Period::where('is_published', '=', 1)->first();
    return Inertia::render('GraphOnly', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'period' => $periodActive
    ]);
});

Route::get('/isi-survey', function () {
    return Inertia::render('Questionnaire', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('survey.guest.index');

Route::get('/survey', [QuizResponseController::class, 'index'])->name('survey.index');
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/survey/import-template', [QuizResponseImportController::class, 'template'])->name('survey.import.template');
    Route::post('/survey/import', [QuizResponseImportController::class, 'store'])->name('survey.import.store');
});
Route::get('/survey/{id}', [QuizResponseController::class, 'show'])->middleware(['auth', 'verified'])->name('survey.edit');
Route::post('/survey', [QuizResponseController::class, 'store'])->name('survey.store');
Route::patch('/survey/{id}', [QuizResponseController::class, 'update'])->middleware(['auth', 'verified'])->name('survey.update');

Route::get('/dashboard', function (Request $request) {
    $valid = $request->validate([
            "serviceId" => "sometimes|nullable|integer",
        ]);

    $periodActive = Period::where('is_published', '=', 1)->first();
    $user = Auth::user();
    if($user->roleId == 1){
        return Inertia::render('Dashboard', [
            'period' => $periodActive,
            'serviceId' => $request->input("serviceId", ""),
        ]);
    } else {
        return Inertia::render('Dashboard', [
            'period' => $periodActive,
            'serviceId' => $user->id_service,
        ]);
    }
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/questions/survey', function () {
    return Question::whereIn('seq', [1, 2, 3, 4, 5, 6, 7, 8, 9])
        ->with(['answers' => function ($query) {
            $query->orderBy('value', 'desc');
        }])
        ->orderBy('seq')
        ->get();
});
Route::resource('questions', QuestionController::class);
Route::resource('services', ServiceController::class);
Route::get('/lokus-list', function () {
    return Lokus::where('is_active', '=', '1')->orderBy('name')->get();
});
Route::resource('lokus', LokusController::class);
Route::resource('periods', PeriodController::class);

Route::get('/users', [UserSettingController::class, 'index'])->name('settings.user');
Route::post('/users/setting', [UserSettingController::class, 'store'])->name('settings.user.add');
Route::patch('/users/setting/{id}', [UserSettingController::class, 'update'])->name('settings.user.edit');

Route::resource('rtl', RTLController::class);

Route::get('/perhitungan-ikm', [QuizResponseController::class, 'getCalculateTable'])->name('table.calculate');

Route::get('/service-list', function () {
    return Service::where('is_active', '=', '1')->orderBy('name')->get();
});

Route::get('/role-list', function () {
    return Role::orderBy('id')->get();
});

Route::get('/unsur-list', function () {
    return Unsur::all();
});

Route::get('/period-by-year', [PeriodController::class, 'getByYear'])->middleware(['auth', 'verified']);
Route::get('/period-year', [PeriodController::class, 'getListYear'])->middleware(['auth', 'verified']);

Route::get('/calculate-ikm', [QuizResponseController::class, 'calculate'])->name('dashboard.chart');

Route::post('/ikm-excel', [QuizResponseController::class, 'exportExcel']);
Route::post('/rtl-excel', [RTLController::class, 'exportExcel']);

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::resource('report', ReportController::class);
Route::post('download-survey', [ReportController::class, 'downloadAllDataSurvey'])->name('download.survey')->middleware(['auth', 'verified']);

Route::resource('survey-reports', SurveyReportController::class);
Route::get('/laporan-survey', [SurveyReportController::class, 'index'])->name('survey-reports.gallery');


require __DIR__.'/auth.php';
