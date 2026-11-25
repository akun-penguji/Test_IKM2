<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Period;
use App\Models\Service;
use App\Models\QuizResponse;
use Illuminate\Http\Request;
use App\Exports\ReportExport;
use App\Exports\SurveyExport;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Period::where('is_active', '=', 1)->first();
        $periodList = Period::orderBy('start_at', 'desc')->get();
        return Inertia::render('Report', [
            'data' => $data,
            'periodList' => $periodList
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'startDate' => ['required'],
            'endDate' => ['required'],
            'monthLabel' => ['required']
        ]);
        
        $data = QuizResponse::select('serviceId', DB::raw('DATE(created_at) as day'), DB::raw('count(*) as total'))
                    ->whereBetween('created_at', [$request->startDate, $request->endDate])
                    ->groupBy('serviceId', 'day')
                    ->orderBy('serviceId')
                    ->get();
        $services = Service::select('id', 'name')->where('is_active', '=', '1')->orderBy('id')->get();

        $startDate = Carbon::parse($request->startDate)->startOfDay();
        $endDate = Carbon::parse($request->endDate)->startOfDay();
        $days = [];
        
        for($date = $startDate; $date->lte($endDate); $date->addDay()) {
            $days[] = $date->format('d');
        }
        $dailyTotals = [];
        
        foreach ($days as $day) {
            $dailyTotals[$day] = $data->filter(function($item) use ($day) {
                return \Carbon\Carbon::parse($item->day)->format('d') == $day;
            })->sum('total');
        } 
        $year = $startDate->format('Y');
        $label = strtoupper($request->monthLabel).' '.$year;
        
        return Excel::download(new ReportExport($data, $days, $services, $label, $dailyTotals), 'Jumlah SKM '.$request->monthLabel.' - '.$year.'.xlsx');
    }

    public function downloadAllDataSurvey(Request $request)
    {
        $this->validate($request, [
            'startDate' => ['required'],
            'endDate' => ['required'],
        ]);

        $startDate = Carbon::parse($request->startDate)->startOfDay();
        $endDate = Carbon::parse($request->endDate)->endOfDay();
        
        $user = Auth::user();
        $data = QuizResponse::with(['service', 'lokus'])->orderBy('created_at', 'desc')
        ->whereBetween('created_at', [$startDate, $endDate])
        ->get();

        if($user->roleId != 1){
            $data = QuizResponse::with(['service', 'lokus'])->where('serviceId', '=', $user->id_service)->whereBetween('created_at', [$request->startDate, $request->endDate])->orderBy('created_at', 'desc')->get();
        }
        
        return Excel::download(new SurveyExport($data), 'Data Survey '.$request->startDate.' - '.$request->endDate.'.xlsx');
    }
}
