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

class ReportExport implements FromView, ShouldAutoSize, WithEvents, WithColumnWidths
{
    use Exportable;
    public function __construct($data, $days, $services, $label, $dailyTotals){
        $this->data = $data;
        $this->days = $days;
        $this->services = $services;
        $this->label = $label;
        $this->dailyTotals = $dailyTotals;
    }
    public function columnWidths(): array
    {
        return [
            'A' => 6,
            'B' => 45,
        ];
    }
    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                // dd(Coordinate::stringFromColumnIndex(count($this->days) + 3).'2');
                $data = $this->data;
                $services = $this->services;
                $lastCell = Coordinate::stringFromColumnIndex(count($this->days) + 3);
                $daysContentCell = Coordinate::stringFromColumnIndex(count($this->days) + 2);
                $daysCell = Coordinate::stringFromColumnIndex(count($this->days));
                $count = count($services);
                $cellHeader = 'A1:'.$lastCell.'7';
                $cellContent = "A8:".$lastCell.''.($count + 7);
                $cellFull = "A1:".$lastCell.''.($count + 8);
                $cellFooter = "A".($count + 8).":".$lastCell.''.($count + 8);
                $event->sheet->mergeCells('A1:'.$lastCell.'3');
                $event->sheet->mergeCells('A4:A7');
                $event->sheet->mergeCells('B4:B7');
                $event->sheet->mergeCells('C4:'.$daysContentCell.'4');
                $event->sheet->mergeCells($lastCell.'4:'.$lastCell.'7');
                $event->sheet->mergeCells('C7:'.$daysContentCell.'7');
                $event->sheet->styleCells(
                    'A1:'.$lastCell.'7',
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

                $event->sheet->styleCells(
                    $cellFooter,
                    [
                        'font' => ['bold' => true],
                        'alignment' => [
                            'horizontal' => Alignment::HORIZONTAL_CENTER,
                            'vertical' => Alignment::VERTICAL_CENTER,
                            'wrapText' => true,
                        ],
                    ]
                );
            }
        ];
    }
    public function view(): View
    {
        $data = $this->data;
        $days = $this->days;
        $services = $this->services;
        $label = $this->label;
        $dailyTotals = $this->dailyTotals;

        $passedData['data'] = $data;
        $passedData['days'] = $days;
        $passedData['services'] = $services;
        $passedData['label'] = $label;
        $passedData['dailyTotals'] = $dailyTotals;
        return view('excel.report',$passedData);
    }
}
