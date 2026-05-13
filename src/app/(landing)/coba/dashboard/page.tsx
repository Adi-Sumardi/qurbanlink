'use client';

import Link from 'next/link';
import {
  CalendarDays,
  Ticket,
  CheckCircle2,
  MapPin,
  ScanLine,
  ArrowRight,
  Activity,
} from 'lucide-react';
import { useDemoStore } from '@/stores/demo.store';
import {
  DEMO_EVENT,
  DEMO_HEWAN,
  DEMO_MASJID,
  DEMO_PENERIMA,
  DEMO_ZONA,
} from '@/content/demo-seed';

function formatRelative(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.max(1, Math.floor(diffMs / 60_000));
  if (min < 60) return `${min} menit lalu`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} jam lalu`;
  return `${Math.floor(hr / 24)} hari lalu`;
}

export default function DemoDashboardPage() {
  const kupon = useDemoStore((s) => s.kupon);
  const scanLog = useDemoStore((s) => s.scanLog);

  const total = kupon.length;
  const terpakai = kupon.filter((k) => k.status === 'Terpakai').length;
  const aktif = total - terpakai;
  const pct = total ? Math.round((terpakai / total) * 100) : 0;

  // Breakdown per zona
  const perZona = DEMO_ZONA.map((z) => {
    const penerimaIds = new Set(
      DEMO_PENERIMA.filter((p) => p.zonaId === z.id).map((p) => p.id)
    );
    const kuponZona = kupon.filter((k) => penerimaIds.has(k.penerimaId));
    const used = kuponZona.filter((k) => k.status === 'Terpakai').length;
    const t = kuponZona.length;
    const rate = t ? used / t : 0;
    let color: 'green' | 'amber' | 'rose';
    if (rate >= 0.6) color = 'green';
    else if (rate >= 0.3) color = 'amber';
    else color = 'rose';
    return { ...z, used, total: t, rate, color };
  });

  const totalHewan = DEMO_HEWAN.length;
  const sapi = DEMO_HEWAN.filter((h) => h.jenis === 'Sapi').length;
  const kambing = DEMO_HEWAN.filter((h) => h.jenis === 'Kambing').length;
  const totalDaging = DEMO_HEWAN.reduce((sum, h) => sum + h.berat, 0);

  return (
    <div className="space-y-6">
      {/* Event header */}
      <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CalendarDays className="size-4 text-[#3f4944]/60" />
              <p className="text-xs font-bold uppercase tracking-widest text-[#3f4944]/60">
                Event Aktif
              </p>
            </div>
            <h1 className="font-headline mt-2 text-2xl font-extrabold text-[#191c1e] md:text-3xl">
              {DEMO_EVENT.nama}
            </h1>
            <p className="mt-1 text-sm text-[#3f4944]">
              {DEMO_MASJID.nama} · {DEMO_MASJID.alamat}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
            AKTIF
          </span>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={Ticket}
          label="Total Kupon"
          value={total.toLocaleString('id-ID')}
          sub={`${aktif} aktif · ${terpakai} terpakai`}
          iconBg="bg-[#a6f2d1] text-[#004532]"
        />
        <KpiCard
          icon={CheckCircle2}
          label="Tersalurkan"
          value={`${pct}%`}
          sub={`${terpakai} dari ${total} kupon`}
          iconBg="bg-emerald-100 text-emerald-700"
        />
        <KpiCard
          icon={MapPin}
          label="Zona Distribusi"
          value={DEMO_ZONA.length.toString()}
          sub="RT 01-04 / RW 05"
          iconBg="bg-blue-100 text-blue-700"
        />
        <KpiCard
          icon={CalendarDays}
          label="Hewan Kurban"
          value={`${totalHewan} ekor`}
          sub={`${sapi} sapi · ${kambing} kambing · ${totalDaging.toLocaleString('id-ID')} kg`}
          iconBg="bg-amber-100 text-amber-700"
        />
      </div>

      {/* Progress */}
      <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#3f4944]/60">
              Progres Distribusi
            </p>
            <p className="font-headline mt-2 text-3xl font-extrabold text-[#191c1e]">
              {terpakai}
              <span className="text-base font-bold text-[#3f4944]/50">
                {' '}/ {total}
              </span>
            </p>
          </div>
          <p className="font-headline text-3xl font-extrabold text-[#004532]">
            {pct}%
          </p>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#f2f4f6]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#004532] to-[#6ffbbe] transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Zona breakdown */}
        <div className="mt-6 space-y-3">
          {perZona.map((z) => (
            <div key={z.id} className="flex items-center gap-3">
              <span className="w-28 text-xs font-semibold text-[#3f4944] md:w-32">
                {z.nama}
              </span>
              <div className="flex-1 h-2 overflow-hidden rounded-full bg-[#f2f4f6]">
                <div
                  className={`h-full ${
                    z.color === 'green'
                      ? 'bg-emerald-500'
                      : z.color === 'amber'
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                  }`}
                  style={{ width: `${z.rate * 100}%` }}
                />
              </div>
              <span className="w-16 text-right text-xs font-bold tabular-nums text-[#191c1e]">
                {z.used}/{z.total}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Try scan CTA */}
      <Link
        href="/coba/dashboard/scan"
        className="group flex items-center justify-between gap-4 rounded-3xl bg-gradient-to-br from-[#004532] to-[#065f46] p-6 text-white shadow-lg transition-all hover:opacity-95 md:p-8"
      >
        <div className="flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
            <ScanLine className="size-6" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[#6ffbbe]">
              Coba Sekarang
            </p>
            <p className="font-headline mt-1 text-lg font-extrabold md:text-xl">
              Scan kupon QR di demo simulator
            </p>
          </div>
        </div>
        <ArrowRight className="size-6 shrink-0 transition-transform group-hover:translate-x-1" />
      </Link>

      {/* Recent activity */}
      <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
        <div className="mb-5 flex items-center gap-2">
          <Activity className="size-4 text-[#004532]" />
          <p className="text-xs font-bold uppercase tracking-widest text-[#3f4944]/60">
            Aktivitas Terbaru
          </p>
        </div>
        <ul className="space-y-3">
          {scanLog.slice(0, 8).map((log) => (
            <li
              key={`${log.kuponId}-${log.at}`}
              className="flex items-center gap-3 border-b border-[#f2f4f6] pb-3 last:border-0 last:pb-0"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                <ScanLine className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-[#191c1e]">
                  Kupon {log.kuponId} · {log.penerimaNama}
                </p>
                <p className="text-xs text-[#3f4944]/70">
                  {log.zona} · oleh {log.petugas}
                </p>
              </div>
              <span className="text-xs text-[#3f4944]/60">
                {formatRelative(log.at)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  iconBg,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub: string;
  iconBg: string;
}) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm">
      <div className={`mb-3 flex size-10 items-center justify-center rounded-xl ${iconBg}`}>
        <Icon className="size-5" />
      </div>
      <p className="text-xs font-bold uppercase tracking-wider text-[#3f4944]/60">
        {label}
      </p>
      <p className="font-headline mt-1 text-2xl font-extrabold text-[#191c1e]">
        {value}
      </p>
      <p className="mt-1 text-xs text-[#3f4944]/70">{sub}</p>
    </div>
  );
}
