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

class RTLExport implements FromView, ShouldAutoSize, WithEvents, WithColumnWidths
{
    use Exportable;
    public function __construct($data, $period, $service){
        $this->data = $data;
        $this->period = $period;
        $this->service = $service;
    }
    public function columnWidths(): array
    {
        return [
            'A' => 6,
            'B' => 15,
            'C' => 10,
            'D' => 15,
            'E' => 15,
            'F' => 10,
            'G' => 15,
        ];
    }
    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $data = $this->data;
                $event->sheet->mergeCells('A1:G1');
                $event->sheet->mergeCells('A2:G2');
                $event->sheet->styleCells(
                    'A1:G1',
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
                    'A2:G2',
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
                $cellHeader = "A4:G4";
                $cellContent = "A5:G".($count + 4);
                $cellFull = "A4:G".($count + 4);

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
        $period = $this->period;
        $service = $this->service;

        $passedData['data'] = $data;
        $passedData['period'] = $period;
        $passedData['service'] = $service;
        return view('excel.rtl',$passedData);
    }
}
