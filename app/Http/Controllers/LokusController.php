<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Lokus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class LokusController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $data = Lokus::orderBy('is_active', 'desc')->orderBy('name')->get();
        return Inertia::render('Setting/LokusSetting', [
            'data' => $data,
        ]);
    }

    public function apiIndex()
    {
        $lokuses = Lokus::orderBy('name')->get();
        return response()->json($lokuses);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'is_active' => 'nullable|integer|in:0,1',
        ]);

        $lokus = Lokus::create($validated);

        return Redirect::route('lokus.index')->with('message', 'Berhasil menambah lokus')->with('type', 'success');
    }

    public function show(Lokus $loku)
    {
        return response()->json($loku);
    }

    public function update(Request $request, Lokus $loku)
    {
        $input = $request->all();
        $status = $loku->update($input);
        if ($status) {
            return Redirect::route('lokus.index')->with('message', 'Data berhasil diupdate')->with('type', 'success');
        } else {
            return Redirect::route('lokus.index')->with('message', 'Data gagal diupdate')->with('type', 'error');
        }
    }

    public function destroy(Lokus $loku)
    {
        $lokus->delete();
        return response()->json(null, 204);
    }
}