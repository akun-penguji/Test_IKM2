<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use Inertia\Inertia;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Redirect;

class QuestionController extends Controller
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
        return Inertia::render('Setting/QuestionSetting', [
            'data' => $data,
        ]);
    }

    public function getAll()
    {
        $data = Question::with(['answers' => function ($query) {
            $query->orderBy('value', 'desc');
        }])->get();
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
        //
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
    public function update(Request $request, Question $question)
    {
        $input = $request->all();
        for ($i = 1; $i <= 4; $i++) {
            $this->updateAnswerName($i, $input['answer' . $i], $question->id);
        }
        $status = $question->update([
            'name' => $input['name'],
        ]);
        if ($status) {
            return Redirect::route('questions.index')->with('message', 'Data berhasil diupdate')->with('type', 'success');
        } else {
            return Redirect::route('questions.index')->with('message', 'Data gagal diupdate')->with('type', 'error');;
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Question $question)
    {
        //
    }

    private function updateAnswerName($value, $name, $questionId)
    {
        Answer::where('value', $value)
            ->where('questionId', $questionId)
            ->update([
                'name' => $name,
            ]);
    }
}
