<?php

namespace App\Models;

use App\Models\Unsur;
use App\Models\Period;
use App\Models\Service;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RTL extends Model
{
    use HasFactory;

    protected $table = 'rtl';

    protected $fillable = [
        'nilai',
        'saran',
        'program',
        'tahun',
        'pj',
        'periodId',
        'unsurId',
        'serviceId',
    ];

    public function period(): BelongsTo
    {
        return $this->belongsTo(Period::class, 'periodId');
    }

    public function unsur(): HasOne
    {
        return $this->hasOne(Unsur::class, 'id', 'unsurId');
    }

    public function service(): HasOne
    {
        return $this->hasOne(Service::class, 'id', 'serviceId');
    }
}
