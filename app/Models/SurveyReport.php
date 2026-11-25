<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SurveyReport extends Model
{
    protected $fillable = [
        'name',
        'file_path',
    ];
}