<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lokus extends Model
{
    use HasFactory;

    protected $table = 'lokus';
    protected $fillable = ['name', 'is_active'];
}
