<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Period;
use App\Models\Service;
use App\Models\QuizResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Exports\QuizResponseExport;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Redirect;

class QuizResponseController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $data = QuizResponse::with(['service', 'lokus'])->orderBy('created_at', 'desc')->get();

        if($user->roleId != 1){
            $data = QuizResponse::with(['service', 'lokus'])->where('serviceId', '=', $user->id_service)->orderBy('created_at', 'desc')->get();
        }


        return Inertia::render('QuizResponse', [
            'data' => $data,
        ]);
    }

    public function show($id)
    {
        $data = QuizResponse::with(['service', 'lokus'])->where('id', '=' , $id)->get();
        return Inertia::render('Questionnaire', [
            'editData' => $data
        ]);
    }

    public function store(Request $request)
    {
        // dd($request);
        $this->validate($request, [
            'gender' => ['required'],
            'education' => ['required'],
            'job' => ['required'],
            'serviceId' => ['required'],
            'q1' => ['required'],
            'q2' => ['required'],
            'q3' => ['required'],
            'q4' => ['required'],
            'q5' => ['required'],
            'q6' => ['required'],
            'q7' => ['required'],
            'q8' => ['required'],
            'q9' => ['required'],
            'suggestion' => ['nullable'],
        ]);
        $input = $request->all();
        $input['suggestion'] = $input['suggestion'] ?? '-';
        QuizResponse::create($input);

        return Redirect::route('survey.guest.index')->with('message', 'Survey berhasil diisi');
    }

    public function update(Request $request, $id)
    {
        $input = $request->all();
        $input['suggestion'] = $input['suggestion'] ?? '-';

        $status = QuizResponse::find($id)->update($input);

        if ($status) {
            return Redirect::route('survey.guest.index')->with('message', 'Survey berhasil diubah')->with('type', 'success');
        } else {
            return Redirect::route('survey.guest.index')->with('message', 'Survey gagal diubah')->with('type', 'error');;
        }
    }

    public function calculate(Request $request)
    {
        $this->validate($request, [
            'start_at' => ['required'],
            'end_at' => ['required']
        ]);
        $input = $request->all();
        // $method = Request::method();
        $summedData = $this->getSummedData($input['start_at'], $input['end_at'], $input['id_service']);
        $avgData = $this->getAVGData($input['start_at'], $input['end_at'], $input['id_service']);
        $avgTtb = $this->getNRRTertimbang($input['start_at'], $input['end_at'], $input['id_service']);
        $count = $this->getDataCount($input['start_at'], $input['end_at'], $input['id_service']);
        $countByEducation = $this->getCountByEducation($input['start_at'], $input['end_at'], $input['id_service']);
        $countByJob = $this->getCountByJob($input['start_at'], $input['end_at'], $input['id_service']);
        $countByGender = $this->getCountByGender($input['start_at'], $input['end_at'], $input['id_service']);
        // dd($avgData);

        return response()->json([
            'sum' => $summedData,
            'avg' => $avgData,
            'nrr_ttb' => $avgTtb,
            'count' => $count,
            'countByEducation' => $countByEducation,
            'countByJob' => $countByJob,
            'countByGender' => $countByGender
        ]);
    }

    public function getCalculateTable(Request $request) {
        $valid = $request->validate([
                "serviceId" => "sometimes|nullable|integer",
                "periodId" => "sometimes|nullable|integer",
            ]);

        $period = Period::where('is_active', '=', 1)->first();

        if($period == null) {
            return Redirect::route('periods.index')->with('message', 'Periode belum diatur')->with('type', 'error');
        }

        $input = $request->all();

        if ($request->filled("periodId")) {
            $period = Period::find((integer)$request->input('periodId'));
        };

        $start_at = Carbon::parse($period->start_at)->format('Y-m-d');
        $end_at = Carbon::parse($period->end_at)->format('Y-m-d');

        // dd($period);
        $user = Auth::user();
        $data = QuizResponse::whereBetween('created_at', [$start_at, $end_at]);
        if ($request->filled("serviceId")) {
            if($user->roleId == 1){
                $data = $data->where('serviceId', '=', $request->input('serviceId'))->get();
            } else {
                $data = $data->where('serviceId', '=', $user->id_service)->get();
            }
        } else {
            $data = $data->get();
        };

        $summedData = $this->getSummedData($start_at, $end_at, $request->input('serviceId'));
        $avgData = $this->getAVGData($start_at, $end_at, $request->input('serviceId'));
        $avgTtb = $this->getNRRTertimbang($start_at, $end_at, $request->input('serviceId'));

        $sumAvgData = $avgTtb->q1 + $avgTtb->q2 + $avgTtb->q3 + $avgTtb->q4 + $avgTtb->q5 + $avgTtb->q6
        + $avgTtb->q7 + $avgTtb->q8 + $avgTtb->q9;

        $ikmVal = $sumAvgData * 25;

        $calculation = [
            'sum' => $summedData,
            'avg' => $avgData,
            'avg_ttb' => $avgTtb,
            'sumAvg' => $sumAvgData,
            'ikm' => $ikmVal,
        ];

        if($user->roleId != 1){
            return Inertia::render('TablePerhitungan', [
            'data' => $data,
            'serviceId' => $user->id_service,
            'periodId' => $request->input("periodId", $period->id),
            'calculation' => $calculation,
            'period' => $period
        ]);
        } else {
            return Inertia::render('TablePerhitungan', [
            'data' => $data,
            'serviceId' => $request->input("serviceId", ""),
            'periodId' => $request->input("periodId", $period->id),
            'calculation' => $calculation,
            'period' => $period
        ]);
        }
    }

    public function exportExcel(Request $request){
        $valid = $request->validate([
            "serviceId" => "sometimes|nullable|integer",
            "periodId" => "sometimes|nullable|integer",
        ]);

        $period = Period::where('is_active', '=', 1)->first();
        $input = $request->all();

        if ($request->filled("periodId")) {
            $period = Period::find((integer)$request->input('periodId'));
        };

        $start_at = Carbon::parse($period->start_at)->format('Y-m-d');
        $end_at = Carbon::parse($period->end_at)->format('Y-m-d');

        $user = Auth::user();
        $data = QuizResponse::whereBetween('created_at', [$start_at, $end_at]);
        $service = Service::find($request->input('serviceId'));

        if ($request->filled("serviceId")) {
            if($user->roleId == 1){
                $data = $data->where('serviceId', '=', $request->input('serviceId'))->get();
            } else {
                $data = $data->where('serviceId', '=', $user->id_service)->get();
                $service = Service::find($user->id_service);
            }
        } else {
            $data = $data->get();
        };

        $summedData = $this->getSummedData($start_at, $end_at, $request->input('serviceId'));
        $avgData = $this->getAVGData($start_at, $end_at, $request->input('serviceId'));
        $avgTtb = $this->getNRRTertimbang($start_at, $end_at, $request->input('serviceId'));

        $sumAvgData = $avgTtb->q1 + $avgTtb->q2 + $avgTtb->q3 + $avgTtb->q4 + $avgTtb->q5 + $avgTtb->q6
        + $avgTtb->q7 + $avgTtb->q8 + $avgTtb->q9;

        $ikmVal = $sumAvgData * 25;

        $calculation = [
            'sum' => $summedData,
            'avg' => $avgData,
            'avg_ttb' => $avgTtb,
            'sumAvg' => $sumAvgData,
            'ikm' => $ikmVal,
        ];

        return Excel::download(new QuizResponseExport($data, $calculation, $period, $service), 'Indeks Kepuasan Masyarakat.xlsx');
    }

    private function getSummedData($start_at, $end_at , $id_service)
    {
        // $sql = 'SELECT CAST(SUM(q1) AS SIGNED) as q1, CAST(SUM(q2) AS SIGNED) as q2, CAST(SUM(q3) AS SIGNED) as q3, CAST(SUM(q4) AS SIGNED) as q4,'.
        // ' CAST(SUM(q5) AS SIGNED) as q5, CAST(SUM(q6) AS SIGNED) as q6, CAST(SUM(q7) AS SIGNED) as q7, CAST(SUM(q8) AS SIGNED) as q8, CAST(SUM(q9) AS SIGNED) as q9'.
        // ' FROM quiz_responses WHERE created_at BETWEEN "'.$start_at.'" AND "'.$end_at.'"';
        // if($id_service > 0) {
        //     $sql = $sql.' AND serviceId='.$id_service;
        // }
        // $summedData = DB::select($sql);

        $summedData = DB::table('quiz_responses')
        ->selectRaw('
            CAST(SUM(q1) AS SIGNED) AS q1,
            CAST(SUM(q2) AS SIGNED) AS q2,
            CAST(SUM(q3) AS SIGNED) AS q3,
            CAST(SUM(q4) AS SIGNED) AS q4,
            CAST(SUM(q5) AS SIGNED) AS q5,
            CAST(SUM(q6) AS SIGNED) AS q6,
            CAST(SUM(q7) AS SIGNED) AS q7,
            CAST(SUM(q8) AS SIGNED) AS q8,
            CAST(SUM(q9) AS SIGNED) AS q9
        ')
        ->when($id_service > 0, function ($query) use ($id_service) {
            return $query->where('serviceId', $id_service);
        })
        ->whereBetween('created_at', [$start_at, $end_at])
        ->first();

        return $summedData;
    }

    private function getAVGData($start_at, $end_at , $id_service)
    {
        // $sql = 'SELECT CAST(AVG(q1) AS DECIMAL(10,3)) as q1, CAST(AVG(q2) AS DECIMAL(10,3)) as q2, CAST(AVG(q3) AS DECIMAL(10,3)) as q3, CAST(AVG(q4) AS DECIMAL(10,3)) as q4,'.
        // ' CAST(AVG(q5) AS DECIMAL(10,3)) as q5, CAST(AVG(q6) AS DECIMAL(10,3)) as q6, CAST(AVG(q7) AS DECIMAL(10,3)) as q7, CAST(AVG(q8) AS DECIMAL(10,3)) as q8, CAST(AVG(q9) AS DECIMAL(10,3)) as q9'.
        // ' FROM quiz_responses WHERE created_at BETWEEN "'.$start_at.'" AND "'.$end_at.'"';
        // if($id_service > 0) {
        //     $sql = $sql.' AND serviceId='.$id_service;
        // }
        // $avgData = DB::select($sql);

        $avgData = DB::table('quiz_responses')
        ->selectRaw('
            CAST(AVG(q1) AS DECIMAL(10,3)) AS q1,
            CAST(AVG(q2) AS DECIMAL(10,3)) AS q2,
            CAST(AVG(q3) AS DECIMAL(10,3)) AS q3,
            CAST(AVG(q4) AS DECIMAL(10,3)) AS q4,
            CAST(AVG(q5) AS DECIMAL(10,3)) AS q5,
            CAST(AVG(q6) AS DECIMAL(10,3)) AS q6,
            CAST(AVG(q7) AS DECIMAL(10,3)) AS q7,
            CAST(AVG(q8) AS DECIMAL(10,3)) AS q8,
            CAST(AVG(q9) AS DECIMAL(10,3)) AS q9
        ')
        ->when($id_service > 0, function ($query) use ($id_service) {
            return $query->where('serviceId', $id_service);
        })
        ->whereBetween('created_at', [$start_at, $end_at])
        ->first();

        return $avgData;
    }

    private function getNRRTertimbang($start_at, $end_at , $id_service)
    {
        // $sql = 'SELECT CAST(AVG(q1) * 0.111 AS DECIMAL(10,3)) as q1, CAST(AVG(q2) * 0.111 AS DECIMAL(10,3)) as q2, CAST(AVG(q3) * 0.111 AS DECIMAL(10,3)) as q3,'.
        // ' CAST(AVG(q4) * 0.111 AS DECIMAL(10,3)) as q4, CAST(AVG(q5) * 0.111 AS DECIMAL(10,3)) as q5, CAST(AVG(q6) * 0.111 AS DECIMAL(10,3)) as q6,'.
        // ' CAST(AVG(q7) * 0.111 AS DECIMAL(10,3)) as q7, CAST(AVG(q8) * 0.111 AS DECIMAL(10,3)) as q8, CAST(AVG(q9) * 0.111 AS DECIMAL(10,3)) as q9'.
        // ' FROM quiz_responses WHERE created_at BETWEEN "'.$start_at.'" AND "'.$end_at.'"';
        // if($id_service > 0) {
        //     $sql = $sql.' AND serviceId='.$id_service;
        // }
        // $nrrttb = DB::select($sql);

        $nrrttb = DB::table('quiz_responses')
        ->selectRaw('
            CAST(AVG(q1) * 0.111 AS DECIMAL(10,3)) as q1,
            CAST(AVG(q2) * 0.111 AS DECIMAL(10,3)) as q2,
            CAST(AVG(q3) * 0.111 AS DECIMAL(10,3)) as q3,
            CAST(AVG(q4) * 0.111 AS DECIMAL(10,3)) as q4,
            CAST(AVG(q5) * 0.111 AS DECIMAL(10,3)) as q5,
            CAST(AVG(q6) * 0.111 AS DECIMAL(10,3)) as q6,
            CAST(AVG(q7) * 0.111 AS DECIMAL(10,3)) as q7,
            CAST(AVG(q8) * 0.111 AS DECIMAL(10,3)) as q8,
            CAST(AVG(q9) * 0.111 AS DECIMAL(10,3)) as q9
        ')
        ->when($id_service > 0, function ($query) use ($id_service) {
            return $query->where('serviceId', $id_service);
        })
        ->whereBetween('created_at', [$start_at, $end_at])
        ->first();

        return $nrrttb;
    }

    private function getDataCount($start_at, $end_at , $id_service)
    {
        // $sql = 'SELECT CAST(COUNT(*) AS SIGNED) as count FROM quiz_responses WHERE created_at BETWEEN "'.$start_at.'" AND "'.$end_at.'"';
        // if($id_service > 0) {
        //     $sql = $sql.' AND serviceId='.$id_service;
        // }
        // $count = DB::select($sql);

        $count = DB::table('quiz_responses')
        ->selectRaw('CAST(COUNT(*) AS SIGNED) as count')
        ->when($id_service > 0, function ($query) use ($id_service) {
            return $query->where('serviceId', $id_service);
        })
        ->whereBetween('created_at', [$start_at, $end_at])
        ->first();

        return $count;
    }

    private function getCountByEducation($start_at, $end_at , $id_service)
    {
        // $sql = 'SELECT CAST(COUNT(CASE education WHEN "SD" THEN 1 ELSE NULL END) AS SIGNED) as SD, CAST(COUNT(CASE education WHEN "SMP" THEN 1 ELSE NULL END) AS SIGNED) as SMP,'.
        // ' CAST(COUNT(CASE education WHEN "SMA" THEN 1 ELSE NULL END) AS SIGNED) as SMA, CAST(COUNT(CASE education WHEN "S1" THEN 1 ELSE NULL END) AS SIGNED) as S1,'.
        // ' CAST(COUNT(CASE education WHEN "S2" THEN 1 ELSE NULL END) AS SIGNED) as S2, CAST(COUNT(CASE education WHEN "S3" THEN 1 ELSE NULL END) AS SIGNED) as S3, COUNT(*) as count'.
        // ' FROM quiz_responses WHERE created_at BETWEEN "'.$start_at.'" AND "'.$end_at.'"';
        // if($id_service > 0) {
        //     $sql = $sql.' AND serviceId='.$id_service;
        // }
        // $count = DB::select($sql);

        $count = DB::table('quiz_responses')
        ->selectRaw('
            CAST(COUNT(CASE WHEN education = "SD" THEN 1 ELSE NULL END) AS SIGNED) AS SD,
            CAST(COUNT(CASE WHEN education = "SMP" THEN 1 ELSE NULL END) AS SIGNED) AS SMP,
            CAST(COUNT(CASE WHEN education = "SMA" THEN 1 ELSE NULL END) AS SIGNED) AS SMA,
            CAST(COUNT(CASE WHEN education = "S1" THEN 1 ELSE NULL END) AS SIGNED) AS S1,
            CAST(COUNT(CASE WHEN education = "S2" THEN 1 ELSE NULL END) AS SIGNED) AS S2,
            CAST(COUNT(CASE WHEN education = "S3" THEN 1 ELSE NULL END) AS SIGNED) AS S3,
            COUNT(*) AS count
        ')
        ->when($id_service > 0, function ($query) use ($id_service) {
            return $query->where('serviceId', $id_service);
        })
        ->whereBetween('created_at', [$start_at, $end_at])
        ->first();

        return $count;
    }

    private function getCountByJob($start_at, $end_at , $id_service)
    {
        // $sql = 'SELECT CAST(COUNT(CASE job WHEN "PNS" THEN 1 ELSE NULL END) AS SIGNED) as PNS, CAST(COUNT(CASE job WHEN "POLRI" THEN 1 ELSE NULL END) AS SIGNED) as POLRI,'.
        // ' CAST(COUNT(CASE job WHEN "SWASTA" THEN 1 ELSE NULL END) AS SIGNED) as SWASTA, CAST(COUNT(CASE job WHEN "TNI" THEN 1 ELSE NULL END) AS SIGNED) as TNI,'.
        // ' CAST(COUNT(CASE job WHEN "WIRAUSAHA" THEN 1 ELSE NULL END) AS SIGNED) as WIRAUSAHA, CAST(COUNT(CASE job WHEN job IN ("PNS","TNI","POLRI","SWASTA","WIRAUSAHA") THEN 1 ELSE NULL END) AS SIGNED) AS LAINNYA, COUNT(*) as count'.
        // ' FROM quiz_responses WHERE created_at BETWEEN "'.$start_at.'" AND "'.$end_at.'"';
        // if($id_service > 0) {
        //     $sql = $sql.' AND serviceId='.$id_service;
        // }
        // $count = DB::select($sql);

        $count = DB::table('quiz_responses')
        ->selectRaw('
            CAST(COUNT(CASE WHEN job = "PNS" THEN 1 ELSE NULL END) AS SIGNED) AS PNS,
            CAST(COUNT(CASE WHEN job = "POLRI" THEN 1 ELSE NULL END) AS SIGNED) AS POLRI,
            CAST(COUNT(CASE WHEN job = "SWASTA" THEN 1 ELSE NULL END) AS SIGNED) AS SWASTA,
            CAST(COUNT(CASE WHEN job = "TNI" THEN 1 ELSE NULL END) AS SIGNED) AS TNI,
            CAST(COUNT(CASE WHEN job = "WIRAUSAHA" THEN 1 ELSE NULL END) AS SIGNED) AS WIRAUSAHA,
            CAST(COUNT(CASE WHEN job NOT IN ("PNS", "TNI", "POLRI", "SWASTA", "WIRAUSAHA") THEN 1 ELSE NULL END) AS SIGNED) AS LAINNYA,
            COUNT(*) AS count
        ')
        ->when($id_service > 0, function ($query) use ($id_service) {
            return $query->where('serviceId', $id_service);
        })
        ->whereBetween('created_at', [$start_at, $end_at])
        ->first();

        return $count;
    }

    private function getCountByGender($start_at, $end_at , $id_service)
    {
        // $sql = 'SELECT CAST(COUNT(CASE gender WHEN "P" THEN 1 ELSE NULL END) AS SIGNED) as P, CAST(COUNT(CASE gender WHEN "L" THEN 1 ELSE NULL END) AS SIGNED) as L,'.
        // ' COUNT(*) as count FROM quiz_responses WHERE created_at BETWEEN "'.$start_at.'" AND "'.$end_at.'"';
        // if($id_service > 0) {
        //     $sql = $sql.' AND serviceId='.$id_service;
        // }
        // $count = DB::select($sql);

        $count = DB::table('quiz_responses')
        ->selectRaw('
            CAST(COUNT(CASE WHEN gender = "P" THEN 1 ELSE NULL END) AS SIGNED) AS P,
            CAST(COUNT(CASE WHEN gender = "L" THEN 1 ELSE NULL END) AS SIGNED) AS L,
            COUNT(*) AS count
        ')
        ->when($id_service > 0, function ($query) use ($id_service) {
            return $query->where('serviceId', $id_service);
        })
        ->whereBetween('created_at', [$start_at, $end_at])
        ->first();

        return $count;
    }
}
