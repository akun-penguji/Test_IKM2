<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse;
use Illuminate\Auth\Events\Registered;
use App\Providers\RouteServiceProvider;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Validator;

class UserSettingController extends Controller
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
        $userlist = User::with(['role', 'service'])->get();
        return Inertia::render('Setting/UserSetting', [
            'userList' => $userlist,
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
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        // dd($request);
        $input = $request->all();
        // dd($input);
        $this->validate($request, [
            'name' => 'required|string|max:255',
            'username' => 'required|string|lowercase|max:255|unique:'.User::class,
            'password' => 'required',
            'roleId' => 'required',
        ]);

        $status = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'roleId' => $request->roleId,
            'id_service' => $request->id_service,
        ]);


        if ($status) {
            return Redirect::route('settings.user')->with('message', 'Berhasil menambah pengguna')->with('type', 'success');
        } else {
            return Redirect::route('settings.user')->with('message', 'Gagal menambah pengguna')->with('type', 'error');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user, $id)
    {
        $input = $request->all();
        $status = User::find($id)->update($input);
        if ($status) {
            return Redirect::route('settings.user')->with('message', 'Data berhasil diupdate')->with('type', 'success');
        } else {
            return Redirect::route('settings.user')->with('message', 'Data gagal diupdate')->with('type', 'error');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
    }
}
