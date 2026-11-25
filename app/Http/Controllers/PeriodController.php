<?php

namespace App\Http\Controllers;

use App\Models\RTL;
use Inertia\Inertia;
use App\Models\Unsur;
use App\Models\Period;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;

class PeriodController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Period::where('is_active', '=', 1)->first();
        $periodList = Period::orderBy('start_at', 'desc')->get();
        return Inertia::render('Period', [
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
            'start_at' => ['required'],
            'end_at' => ['required'],
            'name' => ['required']
        ]);
        $input = $request->all();

        $activePeriod = Period::where('is_active', '=', 1)->first();

        if($activePeriod) {
            $activePeriod->update([
                'is_active' => 0
            ]);
        }

        $createdPeriod = Period::create($input);
        $unsur = Unsur::all();
        $date = \Carbon\Carbon::createFromFormat('Y-m-d', $createdPeriod->start_at);
        $start_at = \Carbon\Carbon::createFromFormat('Y-m-d', $createdPeriod->start_at)->format('Y-m-d');
        $end_at = \Carbon\Carbon::createFromFormat('Y-m-d', $createdPeriod->end_at)->format('Y-m-d');
        $service = DB::table('quiz_responses')
        ->select('serviceId')
        ->distinct()
        ->whereBetween('created_at', [$start_at, $end_at])
        ->orderBy('serviceId')
        ->get();

        $year = $date->year;
        $ikmData = $this->getIKMData($start_at, $end_at, null);
        // dd($ikmData);

        foreach ($unsur as $unsurVal) {
            $dynamicKey = 'q'.(string) ($unsurVal->id);
            RTL::create([
                'nilai' => $ikmData->$dynamicKey ? $ikmData->$dynamicKey : 0,
                'tahun' => $year,
                'periodId' => $createdPeriod->id,
                'unsurId' => $unsurVal->id,
            ]);
        };

        foreach ($service as $serviceVal) {
            $serviceId = $serviceVal->serviceId;
            $ikmData = $this->getIKMData($start_at, $end_at, $serviceId);
            foreach ($unsur as $unsurVal) {
                $dynamicKey = 'q'.(string) ($unsurVal->id);
                $nilai = $ikmData->$dynamicKey;
                RTL::create([
                    'nilai' => $nilai ? $nilai : 0,
                    'tahun' => $year,
                    'periodId' => $createdPeriod->id,
                    'unsurId' => $unsurVal->id,
                    'serviceId' => $serviceId,
                ]);
            };
        };


        return Redirect::route('periods.index')->with('message', 'Periode berhasil diset')->with('type', 'success');
    }

    /**
     * Display the specified resource.
     */
    public function show(Period $period)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Period $period)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $input = $request->all();

        $publishedPeriod = Period::where('is_published', '=', 1)->first();

        if ($input['is_published'] == 1){
            if($publishedPeriod){
                $publishedPeriod->update([
                    'is_published' => 0,
                ]);
            };
        }

        $activatedPeriod = Period::where('is_active', '=', 1)->first();

        if ($input['is_active'] == 1){
            if($activatedPeriod){
                $activatedPeriod->update([
                    'is_active' => 0,
                ]);
            };
        }

        $status = Period::find($id)->update($input);

        if ($status) {
            return Redirect::route('periods.index')->with('message', 'Periode berhasil dipublish')->with('type', 'success');
        } else {
            return Redirect::route('periods.index')->with('message', 'Periode gagal dipublish')->with('type', 'error');;
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Period $period)
    {
        $status = $period->delete();

        if ($status) {
            return Redirect::route('periods.index')->with('message', 'Periode berhasil dihapus')->with('type', 'success');
        } else {
            return Redirect::route('periods.index')->with('message', 'Periode gagal dihapus')->with('type', 'error');;
        }
    }

    private function getIKMData($start_at, $end_at , $id_service)
    {
        $avgData = DB::table('quiz_responses')
        ->selectRaw('
            ROUND(AVG(CAST(q1 AS DECIMAL(10,3))) * 25, 1) AS q1,
            ROUND(AVG(CAST(q2 AS DECIMAL(10,3))) * 25, 1) AS q2,
            ROUND(AVG(CAST(q3 AS DECIMAL(10,3))) * 25, 1) AS q3,
            ROUND(AVG(CAST(q4 AS DECIMAL(10,3))) * 25, 1) AS q4,
            ROUND(AVG(CAST(q5 AS DECIMAL(10,3))) * 25, 1) AS q5,
            ROUND(AVG(CAST(q6 AS DECIMAL(10,3))) * 25, 1) AS q6,
            ROUND(AVG(CAST(q7 AS DECIMAL(10,3))) * 25, 1) AS q7,
            ROUND(AVG(CAST(q8 AS DECIMAL(10,3))) * 25, 1) AS q8,
            ROUND(AVG(CAST(q9 AS DECIMAL(10,3))) * 25, 1) AS q9
        ')
        ->when($id_service > 0, function ($query) use ($id_service) {
            return $query->where('serviceId', $id_service);
        })
        ->whereBetween('created_at', [$start_at, $end_at])
        ->first();

        return $avgData;
    }

    public function getListYear() {
        $year = Period::selectRaw('DISTINCT YEAR(start_at) AS year')->pluck('year');

        return response()->json($year);
    }

    public function getByYear(Request $request) {
        $valid = $request->validate([
            "year" => ['required'],
        ]);

        $period = Period::whereYear('start_at', '=', (integer)$request->input('year'))->get();

        return response()->json($period);
    }
}
