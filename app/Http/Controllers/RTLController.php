<?php

namespace App\Http\Controllers;

use App\Models\RTL;
use Inertia\Inertia;
use App\Models\Period;
use App\Models\Service;
use App\Exports\RTLExport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Redirect;

class RTLController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $valid = $request->validate([
            "serviceId" => "sometimes|nullable|integer",
            "periodId" => "sometimes|nullable|integer",
        ]);

        $period = Period::where('is_active', '=', 1)->first();

        if($period == null) {
            return Redirect::route('periods.index')->with('message', 'Periode belum diatur')->with('type', 'error');
        }

        $user = Auth::user();

        if ($request->filled("periodId")) {
            $period = Period::find((integer)$request->input('periodId'));
        };

        if($period != null){
            $data = RTL::with(['unsur', 'period', 'service'])->where('periodId', '=', $period['id']);

            if ($request->filled("serviceId")) {
                if($user->roleId == 1){
                    $data = $data->where('serviceId', '=', $request->input('serviceId'))->get();
                } else {
                    $data = $data->where('serviceId', '=', $user->id_service)->get();
                }
            } else {
                $data = $data->whereNull('serviceId')->get();
            }
            if($user->roleId != 1){
                return Inertia::render('RTL', [
                    'data' => $data,
                    'period' => $period,
                    'serviceId' => $user->id_service,
                    'periodId' => $request->input("periodId", $period->id),
                ]);
            } else {
                return Inertia::render('RTL', [
                    'data' => $data,
                    'period' => $period,
                    'serviceId' => $request->input("serviceId", ""),
                    'periodId' => $request->input("periodId", $period->id),
                ]);
            }
        } else {
            return Inertia::render('RTL', [
                'period' => $period,
                'serviceId' => $request->input("serviceId", ""),
                'periodId' => $request->input("periodId", $period->id),
            ]);
        }
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(RTL $rTL)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(RTL $rTL)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $input = $request->all();
        $status = RTL::find($id)->update($input);
        if ($status) {
            return Redirect::route('rtl.index')->with('message', 'Data berhasil diisi')->with('type', 'success');
        } else {
            return Redirect::route('rtl.index')->with('message', 'Data gagal diisi')->with('type', 'error');;
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(RTL $rTL)
    {
        //
    }

    public function exportExcel(Request $request)
    {
        $valid = $request->validate([
            "serviceId" => "sometimes|nullable|integer",
            "periodId" => "sometimes|nullable|integer",
        ]);

        $period = Period::where('is_active', '=', 1)->first();
        $user = Auth::user();

        if ($request->filled("periodId")) {
            $period = Period::find((integer)$request->input('periodId'));
        };

        $data = RTL::with(['unsur', 'period', 'service'])->where('periodId', '=', $period['id']);

        if ($request->filled("serviceId")) {
            if($user->roleId == 1){
                $data = $data->where('serviceId', '=', $request->input('serviceId'))->get();
            } else {
                $data = $data->where('serviceId', '=', $user->id_service)->get();
            }
        } else {
            $data = $data->whereNull('serviceId')->get();
        }
        if($user->roleId != 1){
            $service = Service::find($user->id_service);
            return Excel::download(new RTLExport($data, $period, $service), 'Rencana Tindak Lanjut.xlsx');
        } else {
            $service = Service::find($request->input('serviceId'));
            return Excel::download(new RTLExport($data, $period, $service), 'Rencana Tindak Lanjut.xlsx');
        }
    }
}
