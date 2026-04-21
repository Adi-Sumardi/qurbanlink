<?php

namespace App\Exports;

use App\Models\Event;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class RecipientsExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithTitle, ShouldAutoSize
{
    public function __construct(private Event $event) {}

    public function collection()
    {
        return $this->event->recipients()->orderBy('name')->get();
    }

    public function headings(): array
    {
        return [
            'No',
            'Nama',
            'NIK',
            'Telepon',
            'Alamat',
            'RT/RW',
            'Kelurahan',
            'Kecamatan',
            'Kategori',
            'Jumlah Porsi',
            'Catatan',
        ];
    }

    public function map($recipient): array
    {
        static $i = 0;
        $i++;
        return [
            $i,
            $recipient->name,
            $recipient->nik ?? '',
            $recipient->phone ?? '',
            $recipient->address ?? '',
            $recipient->rt_rw ?? '',
            $recipient->kelurahan ?? '',
            $recipient->kecamatan ?? '',
            $recipient->category ?? '',
            $recipient->portions ?? 1,
            $recipient->notes ?? '',
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            1 => [
                'font' => ['bold' => true, 'color' => ['argb' => 'FFFFFFFF']],
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF004532']],
                'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
            ],
        ];
    }

    public function title(): string
    {
        return 'Data Penerima';
    }
}
