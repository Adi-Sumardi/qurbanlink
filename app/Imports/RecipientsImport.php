<?php

namespace App\Imports;

use App\Models\Event;
use App\Models\Recipient;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsErrors;
use Maatwebsite\Excel\Concerns\WithChunkReading;

// WithBatchInserts intentionally omitted — batch insert bypasses Eloquent
// events so HasUuids cannot auto-generate the primary key.
class RecipientsImport implements ToModel, WithHeadingRow, SkipsOnError, WithChunkReading
{
    use SkipsErrors;

    public int $imported = 0;

    public function __construct(private Event $event) {}

    public function model(array $row): ?Recipient
    {
        $name = trim($row['nama'] ?? $row['nama_'] ?? '');
        if (empty($name)) return null;

        $this->imported++;

        return new Recipient([
            'tenant_id' => $this->event->tenant_id,
            'event_id'  => $this->event->id,
            'name'      => $name,
            'nik'       => $this->clean($row['nik'] ?? ''),
            'phone'     => $this->clean($row['telepon'] ?? $row['phone'] ?? ''),
            'address'   => $this->clean($row['alamat'] ?? $row['address'] ?? ''),
            'rt_rw'     => $this->clean($row['rtrw'] ?? $row['rt_rw'] ?? ''),
            'kelurahan' => $this->clean($row['kelurahan'] ?? ''),
            'kecamatan' => $this->clean($row['kecamatan'] ?? ''),
            'category'  => $this->clean($row['kategori'] ?? $row['category'] ?? ''),
            'portions'  => max(1, (int) ($row['jumlah_porsi'] ?? $row['portions'] ?? 1)),
            'notes'     => $this->clean($row['catatan'] ?? $row['notes'] ?? ''),
        ]);
    }

    public function chunkSize(): int
    {
        return 200;
    }

    private function clean(mixed $value): string
    {
        return trim((string) ($value ?? ''));
    }
}
