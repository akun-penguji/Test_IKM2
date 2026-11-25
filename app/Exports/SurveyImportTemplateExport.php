<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

class SurveyImportTemplateExport implements FromArray, ShouldAutoSize, WithHeadings
{
    public function array(): array
    {
        return [];
    }

    public function headings(): array
    {
        return [
            'Tanggal Diisi',
            'Jenis Kelamin',
            'Pendidikan',
            'Pekerjaan',
            'U1',
            'U2',
            'U3',
            'U4',
            'U5',
            'U6',
            'U7',
            'U8',
            'U9',
            'Pesan dan Saran',
            'Layanan',
            'Lokus',
        ];
    }
}
