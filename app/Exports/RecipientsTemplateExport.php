<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;

class RecipientsTemplateExport implements FromArray, WithHeadings, WithStyles, WithTitle, ShouldAutoSize
{
    public function array(): array
    {
        // Sample rows so user knows the format
        return [
            ['Ahmad Fauzi', '3201234567890001', '08123456789', 'Jl. Merdeka No. 1', '001/002', 'Sukajadi', 'Bandung Wetan', 'fakir', 1, ''],
            ['Siti Aminah', '3201234567890002', '08987654321', 'Jl. Pahlawan No. 5', '003/004', 'Babakan', 'Cicendo', 'miskin', 2, 'Lansia'],
        ];
    }

    public function headings(): array
    {
        return [
            'Nama *',
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

    public function styles(Worksheet $sheet): array
    {
        // Header row style
        $sheet->getStyle('A1:J1')->applyFromArray([
            'font' => ['bold' => true, 'color' => ['argb' => 'FFFFFFFF']],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF004532']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
        ]);

        // Sample data rows style
        $sheet->getStyle('A2:J3')->applyFromArray([
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FFE8F5F0']],
        ]);

        // Border all cells
        $sheet->getStyle('A1:J3')->applyFromArray([
            'borders' => [
                'allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['argb' => 'FFCCCCCC']],
            ],
        ]);

        // Add instruction comment above header
        $sheet->insertNewRowBefore(1, 1);
        $sheet->mergeCells('A1:J1');
        $sheet->setCellValue('A1', '⚠ PETUNJUK: Hapus baris contoh ini (baris 3 & 4) sebelum mengimpor. Kolom bertanda * wajib diisi. Kolom Kategori: fakir, miskin, amil, muallaf, gharim, fisabilillah, ibnu_sabil.');
        $sheet->getStyle('A1')->applyFromArray([
            'font' => ['bold' => true, 'color' => ['argb' => 'FF7C4A00']],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['argb' => 'FFFFF3CD']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_LEFT, 'wrapText' => true],
        ]);
        $sheet->getRowDimension(1)->setRowHeight(40);

        return [];
    }

    public function title(): string
    {
        return 'Template Import';
    }
}
