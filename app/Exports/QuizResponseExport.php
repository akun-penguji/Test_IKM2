<?php

namespace App\Exports;

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
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;

class QuizResponseExport implements FromView, ShouldAutoSize, WithEvents, WithColumnWidths
{
    use Exportable;
    public function __construct($data, $calculation, $period, $service){
        $this->data = $data;
        $this->calculation = $calculation;
        $this->period = $period;
        $this->service = $service;
    }
    public function columnWidths(): array
    {
        return [
            'A' => 6,
            'B' => 10,
            'C' => 10,
            'D' => 10,
            'E' => 10,
            'F' => 10,
            'G' => 10,
            'H' => 10,
            'I' => 10,
            'J' => 10,
            'K' => 15,
        ];
    }
    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $data = $this->data;
                $event->sheet->mergeCells('A1:K1');
                $event->sheet->mergeCells('A2:K2');
                $event->sheet->mergeCells('A4:A5');
                $event->sheet->mergeCells('B4:J4');
                $event->sheet->mergeCells('K4:K5');
                $event->sheet->styleCells(
                    'A1:K1',
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
                    'A2:K2',
                    [
                        'font' => ['bold' => true],
                        'alignment' => [
                            'horizontal' => Alignment::HORIZONTAL_CENTER,
                            'vertical' => Alignment::VERTICAL_CENTER,
                            'wrapText' => true,
                        ],
                    ]
                );
                $count = count($data);
                $cellHeader = "A4:K5";
                $cellContent = "A6:K".($count + 11);
                $cellFull = "A4:K".($count + 11);

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
        $calculation = $this->calculation;
        $period = $this->period;
        $service = $this->service;

        $passedData['data'] = $data;
        $passedData['calculation'] = $calculation;
        $passedData['period'] = $period;
        $passedData['service'] = $service;
        return view('excel.ikm',$passedData);
    }
}
