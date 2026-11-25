<?php

namespace App\Exports;

use Carbon\Carbon;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use Maatwebsite\Excel\Events\BeforeSheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Style;
use PhpOffice\PhpSpreadsheet\Style\Color;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithBackgroundColor;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithDrawings;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;

class SurveyExport implements FromView, ShouldAutoSize, WithEvents, WithColumnWidths
{
    use Exportable;
    public function __construct($data){
        $this->data = $data;
    }
    public function columnWidths(): array
    {
        return [
            'A' => 20,
            'B' => 10,
            'C' => 10,
            'D' => 10,
            'E' => 5,
            'F' => 5,
            'G' => 5,
            'H' => 5,
            'I' => 5,
            'J' => 5,
            'K' => 5,
            'L' => 5,
            'M' => 5,
            'N' => 30,
            'O' => 30,
            'P' => 30,
        ];
    }
    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                // dd(Coordinate::stringFromColumnIndex(count($this->days) + 3).'2');
                $data = $this->data;
                // $lastCell = Coordinate::stringFromColumnIndex(count($this->days) + 3);
                $cellHeader = 'A1:P1';
                $cellFull = 'A1:P'.($data->count()+1);
                $cellContent = 'A2:P'.($data->count()+1);
                $event->sheet->styleCells(
                    $cellHeader,
                    [
                        'font' => ['bold' => true],
                        'alignment' => [
                            'horizontal' => Alignment::HORIZONTAL_CENTER,
                            'vertical' => Alignment::VERTICAL_CENTER,
                            'wrapText' => true,
                        ],
                    ]
                );

                $event->sheet->styleCells(
                    $cellFull,
                    [
                        'borders' => [
                            'allBorders' => ['borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN]
                        ],
                        'alignment' => [
                            'horizontal' => Alignment::HORIZONTAL_CENTER,
                            'vertical' => Alignment::VERTICAL_CENTER,
                            'wrapText' => true,
                        ],
                    ]
                );

                $event->sheet->styleCells(
                    $cellHeader,
                    [
                        'font' => ['bold' => true],
                    ]
                );
            }
        ];
    }
    public function view(): View
    {
        $data = $this->data;

        $passedData['data'] = $data;
        return view('excel.survey',$passedData);
    }
}
