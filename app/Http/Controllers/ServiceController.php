<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rules;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse;
use Illuminate\Auth\Events\Registered;
use App\Providers\RouteServiceProvider;
use Illuminate\Support\Facades\Validator;

class ServiceController extends Controller
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
        $data = $this->getAll();
        return Inertia::render('Setting/ServiceSetting', [
            'data' => $data,
        ]);
    }

    public function getAll()
    {
        $data = Service::orderBy('is_active', 'desc')->get();
        return $data;
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
        $input = $request->all();
        $this->validate($request, [
            'name' => 'required|string|max:255',
        ]);

        $status = Service::create($input);


        if ($status) {
            return Redirect::route('services.index')->with('message', 'Berhasil menambah layanan')->with('type', 'success');
        } else {
            return Redirect::route('services.index')->with('message', 'Gagal menambah layanan')->with('type', 'error');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Question $question)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Question $question)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Service $service)
    {
        $input = $request->all();
        $status = $service->update($input);
        if ($status) {
            return Redirect::route('services.index')->with('message', 'Data berhasil diupdate')->with('type', 'success');
        } else {
            return Redirect::route('services.index')->with('message', 'Data gagal diupdate')->with('type', 'error');;
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Question $question)
    {
        //
    }
}
