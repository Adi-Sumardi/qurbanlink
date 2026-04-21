<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Helvetica', Arial, sans-serif; font-size: 11px; color: #1a1a1a; background: #fff; }

  .header { background: #004532; color: #fff; padding: 24px 30px; }
  .header-inner { display: flex; justify-content: space-between; align-items: flex-start; }
  .header h1 { font-size: 20px; font-weight: 800; letter-spacing: -0.5px; }
  .header .sub { font-size: 11px; opacity: 0.7; margin-top: 2px; }
  .header .badge { background: #6ffbbe; color: #002113; padding: 4px 10px; border-radius: 20px; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
  .header .meta { font-size: 10px; opacity: 0.6; margin-top: 6px; }

  .event-bar { background: #f2f4f6; padding: 10px 30px; border-bottom: 1px solid #e0e3e5; font-size: 10px; color: #3f4944; }
  .event-bar strong { color: #004532; }

  .content { padding: 24px 30px; }

  .section-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #004532; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 2px solid #004532; }

  .stat-grid { display: flex; gap: 12px; margin-bottom: 24px; }
  .stat-box { flex: 1; border: 1px solid #e0e3e5; border-radius: 8px; padding: 12px; text-align: center; }
  .stat-box .val { font-size: 22px; font-weight: 800; color: #004532; }
  .stat-box .lbl { font-size: 9px; text-transform: uppercase; letter-spacing: 1px; color: #3f4944; opacity: 0.6; margin-top: 2px; }
  .stat-box.highlight { background: #004532; border-color: #004532; }
  .stat-box.highlight .val { color: #6ffbbe; }
  .stat-box.highlight .lbl { color: #fff; opacity: 0.7; }

  .progress-wrap { margin-bottom: 24px; }
  .progress-bar-bg { background: #e0e3e5; border-radius: 4px; height: 10px; }
  .progress-bar-fill { background: #004532; border-radius: 4px; height: 10px; }
  .progress-label { display: flex; justify-content: space-between; margin-top: 4px; font-size: 10px; color: #3f4944; }

  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 10px; }
  thead tr { background: #004532; color: #fff; }
  thead th { padding: 8px 10px; text-align: left; font-weight: 700; font-size: 9px; text-transform: uppercase; letter-spacing: 0.8px; }
  thead th.right { text-align: right; }
  tbody tr:nth-child(even) { background: #f7f9fb; }
  tbody tr:last-child { border-top: 2px solid #004532; font-weight: 700; background: #e8f5f0; }
  tbody td { padding: 7px 10px; border-bottom: 1px solid #eceef0; }
  tbody td.right { text-align: right; }
  .badge-claimed { background: #d1fae5; color: #065f46; padding: 2px 6px; border-radius: 10px; font-size: 9px; font-weight: 700; }
  .badge-pending { background: #fef3c7; color: #92400e; padding: 2px 6px; border-radius: 10px; font-size: 9px; font-weight: 700; }
  .badge-status { background: #e8f5f0; color: #004532; padding: 2px 6px; border-radius: 10px; font-size: 9px; font-weight: 700; }

  .section { margin-bottom: 28px; }

  .footer { margin-top: 20px; padding: 14px 30px; border-top: 1px solid #e0e3e5; display: flex; justify-content: space-between; font-size: 9px; color: #3f4944; opacity: 0.6; }

  .page-break { page-break-after: always; }
  .no-break { page-break-inside: avoid; }
</style>
</head>
<body>

{{-- HEADER --}}
<div class="header">
  <div class="header-inner">
    <div>
      <h1>Laporan Distribusi Kurban</h1>
      <div class="sub">Tawzii Digital by adilabs.id</div>
    </div>
    <div style="text-align:right">
      <div class="badge">Laporan Resmi</div>
      <div class="meta">Dicetak: {{ now()->locale('id')->isoFormat('D MMMM YYYY, HH:mm') }}</div>
    </div>
  </div>
</div>

{{-- EVENT INFO --}}
<div class="event-bar">
  <strong>Event:</strong> {{ $event->name }} &nbsp;|&nbsp;
  <strong>Tanggal:</strong> {{ $event->event_date ? \Carbon\Carbon::parse($event->event_date)->locale('id')->isoFormat('D MMMM YYYY') : '-' }} &nbsp;|&nbsp;
  <strong>Tenant:</strong> {{ $event->tenant->name ?? '-' }}
</div>

<div class="content">

{{-- ===== DISTRIBUTION SUMMARY ===== --}}
@if(!empty($distribution))
@php $s = $distribution['summary'] ?? []; @endphp
<div class="section no-break">
  <div class="section-title">Ringkasan Distribusi</div>

  <div class="stat-grid">
    <div class="stat-box">
      <div class="val">{{ number_format($s['total_recipients'] ?? 0) }}</div>
      <div class="lbl">Total Penerima</div>
    </div>
    <div class="stat-box">
      <div class="val">{{ number_format($s['total_coupons'] ?? 0) }}</div>
      <div class="lbl">Total Kupon</div>
    </div>
    <div class="stat-box highlight">
      <div class="val">{{ number_format($s['total_claimed'] ?? 0) }}</div>
      <div class="lbl">Terdistribusi</div>
    </div>
    <div class="stat-box">
      <div class="val">{{ number_format($s['total_unclaimed'] ?? 0) }}</div>
      <div class="lbl">Belum Diambil</div>
    </div>
    <div class="stat-box">
      <div class="val">{{ $s['percentage'] ?? 0 }}%</div>
      <div class="lbl">Progress</div>
    </div>
  </div>

  <div class="progress-wrap">
    <div class="progress-bar-bg">
      <div class="progress-bar-fill" style="width: {{ $s['percentage'] ?? 0 }}%"></div>
    </div>
    <div class="progress-label">
      <span>{{ number_format($s['total_claimed'] ?? 0) }} kupon terdistribusi</span>
      <span>{{ $s['percentage'] ?? 0 }}% selesai</span>
    </div>
  </div>
</div>

{{-- Per Category --}}
@if(!empty($distribution['categories']))
<div class="section no-break">
  <div class="section-title">Distribusi per Kategori</div>
  <table>
    <thead>
      <tr>
        <th>Kategori</th>
        <th class="right">Penerima</th>
        <th class="right">Porsi</th>
        <th class="right">Kupon</th>
        <th class="right">Terdistribusi</th>
        <th class="right">Belum</th>
        <th class="right">Progress</th>
      </tr>
    </thead>
    <tbody>
      @foreach($distribution['categories'] as $cat)
      <tr>
        <td style="text-transform:capitalize">{{ $cat['category'] ?: 'Umum' }}</td>
        <td class="right">{{ number_format($cat['total_recipients']) }}</td>
        <td class="right">{{ number_format($cat['total_portions']) }}</td>
        <td class="right">{{ number_format($cat['total_coupons']) }}</td>
        <td class="right"><span class="badge-claimed">{{ number_format($cat['claimed']) }}</span></td>
        <td class="right"><span class="badge-pending">{{ number_format($cat['unclaimed']) }}</span></td>
        <td class="right">{{ $cat['percentage'] }}%</td>
      </tr>
      @endforeach
      <tr>
        <td><strong>Total</strong></td>
        <td class="right"><strong>{{ number_format($s['total_recipients']) }}</strong></td>
        <td class="right"><strong>{{ number_format($s['total_portions']) }}</strong></td>
        <td class="right"><strong>{{ number_format($s['total_coupons']) }}</strong></td>
        <td class="right"><strong>{{ number_format($s['total_claimed']) }}</strong></td>
        <td class="right"><strong>{{ number_format($s['total_unclaimed']) }}</strong></td>
        <td class="right"><strong>{{ $s['percentage'] }}%</strong></td>
      </tr>
    </tbody>
  </table>
</div>
@endif
@endif

{{-- ===== ANIMALS ===== --}}
@if(!empty($animals))
<div class="section no-break page-break">
  <div class="section-title">Data Hewan Kurban</div>
  @php
    $totalWeight = collect($animals)->sum('weight');
    $totalPortions = collect($animals)->sum('estimated_portions');
  @endphp
  <div class="stat-grid" style="margin-bottom:16px">
    <div class="stat-box"><div class="val">{{ count($animals) }}</div><div class="lbl">Total Hewan</div></div>
    <div class="stat-box"><div class="val">{{ number_format($totalWeight) }} kg</div><div class="lbl">Total Berat</div></div>
    <div class="stat-box highlight"><div class="val">{{ number_format($totalPortions) }}</div><div class="lbl">Est. Porsi</div></div>
  </div>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Jenis</th>
        <th>Ras / Warna</th>
        <th class="right">Berat (kg)</th>
        <th class="right">Est. Porsi</th>
        <th>Donor</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      @foreach($animals as $i => $animal)
      <tr>
        <td>{{ $i + 1 }}</td>
        <td>{{ $animalTypeLabels[$animal['type']] ?? $animal['type'] }}</td>
        <td>{{ $animal['breed'] ?? '-' }}{{ $animal['color'] ? ' / '.$animal['color'] : '' }}</td>
        <td class="right">{{ number_format($animal['weight']) }}</td>
        <td class="right">{{ number_format($animal['estimated_portions']) }}</td>
        <td>{{ $animal['donor']['name'] ?? '-' }}</td>
        <td><span class="badge-status">{{ $animal['status'] }}</span></td>
      </tr>
      @endforeach
      <tr>
        <td colspan="3"><strong>Total ({{ count($animals) }} hewan)</strong></td>
        <td class="right"><strong>{{ number_format($totalWeight) }}</strong></td>
        <td class="right"><strong>{{ number_format($totalPortions) }}</strong></td>
        <td colspan="2"></td>
      </tr>
    </tbody>
  </table>
</div>
@endif

{{-- ===== UNCLAIMED ===== --}}
@if(!empty($unclaimed))
<div class="section no-break">
  <div class="section-title">Kupon Belum Diambil ({{ count($unclaimed) }})</div>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>No. Kupon</th>
        <th>Nama Penerima</th>
        <th>Kategori</th>
        <th class="right">Porsi</th>
        <th>Alamat</th>
        <th>Telepon</th>
      </tr>
    </thead>
    <tbody>
      @foreach($unclaimed as $i => $coupon)
      <tr>
        <td>{{ $i + 1 }}</td>
        <td style="font-family:monospace">{{ $coupon['coupon_number'] }}</td>
        <td>{{ $coupon['recipient']['name'] ?? '-' }}</td>
        <td style="text-transform:capitalize">{{ $coupon['recipient']['category'] ?? '-' }}</td>
        <td class="right">{{ $coupon['recipient']['portions'] ?? '-' }}</td>
        <td>{{ implode(', ', array_filter([$coupon['recipient']['address'] ?? null, $coupon['recipient']['kelurahan'] ?? null, $coupon['recipient']['kecamatan'] ?? null])) ?: '-' }}</td>
        <td>{{ $coupon['recipient']['phone'] ?? '-' }}</td>
      </tr>
      @endforeach
    </tbody>
  </table>
</div>
@endif

</div>{{-- /content --}}

<div class="footer">
  <span>Tawzii Digital by adilabs.id &mdash; Dokumen ini digenerate otomatis</span>
  <span>{{ now()->locale('id')->isoFormat('D MMMM YYYY HH:mm') }}</span>
</div>

</body>
</html>
