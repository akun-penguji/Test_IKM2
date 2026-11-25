<?php

namespace App\Models;

use App\Models\Service;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class QuizResponse extends Model
{
    use HasFactory;

    protected $fillable = [
        'gender',
        'education',
        'job',
        'serviceId',
        'lokusId',
        'q1',
        'q2',
        'q3',
        'q4',
        'q5',
        'q6',
        'q7',
        'q8',
        'q9',
        'suggestion',
        'created_at'
    ];

    public function service(): HasOne
    {
        return $this->hasOne(Service::class, 'id', 'serviceId');
    }

    public function lokus(): HasOne
    {
        return $this->hasOne(Lokus::class, 'id', 'lokusId');
    }
}
