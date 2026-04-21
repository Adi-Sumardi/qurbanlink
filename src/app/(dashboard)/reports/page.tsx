'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import {
  BarChart3,
  Loader2,
  Users,
  Ticket,
  CheckCircle,
  Clock,
  TrendingUp,
  Package,
  FileDown,
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { StatusBadge } from '@/components/common/status-badge';
import { EmptyState } from '@/components/common/empty-state';
import { useActiveEvent } from '@/hooks/use-active-event';
import { reportService } from '@/services/report.service';
import { formatNumber } from '@/lib/format';
import {
  COUPON_STATUS_LABELS,
  ANIMAL_TYPE_LABELS,
  ANIMAL_STATUS_LABELS,
} from '@/lib/constants';

interface DistributionData {
  summary: {
    total_recipients: number;
    total_portions: number;
    total_coupons: number;
    total_claimed: number;
    total_unclaimed: number;
    percentage: number;
  };
  categories: {
    category: string;
    total_recipients: number;
    total_portions: number;
    total_coupons: number;
    claimed: number;
    unclaimed: number;
    percentage: number;
  }[];
  hourly_distribution: { hour: string; count: number }[];
}

interface UnclaimedCoupon {
  id: string;
  coupon_number: string;
  status: string;
  generated_at: string;
  expires_at: string;
  recipient: {
    id: string;
    name: string;
    category: string;
    portions: number;
    phone: string | null;
    address: string | null;
    kelurahan: string | null;
    kecamatan: string | null;
  } | null;
}

interface AnimalReport {
  id: string;
  type: string;
  breed: string | null;
  weight: number;
  color: string | null;
  estimated_portions: number;
  status: string;
  donor: {
    id: string;
    name: string;
    phone: string | null;
  } | null;
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  sub,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 editorial-shadow">
      <div className="flex items-center gap-3">
        <div className={`flex size-10 items-center justify-center rounded-xl ${color}`}>
          <Icon className="size-5 text-white" />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-[#3f4944]/50">{title}</p>
          <p className="font-headline text-2xl font-extrabold text-[#191c1e]">
            {typeof value === 'number' ? formatNumber(value) : value}
          </p>
          {sub && <p className="text-xs text-[#3f4944]/60">{sub}</p>}
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex justify-center py-12">
      <Loader2 className="size-8 animate-spin text-[#004532]/40" />
    </div>
  );
}

function DistributionTab({ data }: { data: DistributionData }) {
  const { summary, categories, hourly_distribution } = data;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Penerima" value={summary.total_recipients} icon={Users} color="bg-blue-500" />
        <StatCard title="Total Kupon" value={summary.total_coupons} icon={Ticket} color="bg-indigo-500" sub={`${formatNumber(summary.total_portions)} porsi`} />
        <StatCard title="Terdistribusi" value={summary.total_claimed} icon={CheckCircle} color="bg-green-500" />
        <StatCard title="Belum Diambil" value={summary.total_unclaimed} icon={Clock} color="bg-amber-500" />
      </div>

      {/* Overall Progress */}
      <div className="rounded-2xl bg-white p-6 editorial-shadow">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-headline font-bold text-[#191c1e]">Distribution Progress</h3>
          <span className="font-headline text-3xl font-extrabold text-[#004532]">{summary.percentage}%</span>
        </div>
        <div className="progress-sacred">
          <div style={{ width: `${summary.percentage}%` }} />
        </div>
        <p className="mt-3 text-center text-sm text-[#3f4944]">
          {formatNumber(summary.total_claimed)} of {formatNumber(summary.total_coupons)} coupons distributed
        </p>
      </div>

      {/* Per Category Table */}
      <div className="rounded-2xl bg-white editorial-shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-[rgba(190,201,194,0.2)]">
          <h3 className="font-headline font-bold text-[#191c1e]">Distribution per Category</h3>
        </div>
        <div className="p-6">
          {categories.length === 0 ? (
            <p className="py-4 text-center text-sm text-[#3f4944]/60">No category data yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[rgba(190,201,194,0.2)]">
                    {['Category', 'Recipients', 'Portions', 'Coupons', 'Claimed', 'Pending', 'Progress'].map((h) => (
                      <th key={h} className="pb-3 text-left text-[10px] font-black uppercase tracking-widest text-[#3f4944]/50">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(190,201,194,0.15)]">
                  {categories.map((cat) => (
                    <tr key={cat.category} className="hover:bg-[#f2f4f6] transition-colors">
                      <td className="py-3 font-semibold capitalize text-[#191c1e]">{cat.category || 'Umum'}</td>
                      <td className="py-3 text-right text-[#3f4944]">{formatNumber(cat.total_recipients)}</td>
                      <td className="py-3 text-right text-[#3f4944]">{formatNumber(cat.total_portions)}</td>
                      <td className="py-3 text-right text-[#3f4944]">{formatNumber(cat.total_coupons)}</td>
                      <td className="py-3 text-right font-semibold text-[#004532]">{formatNumber(cat.claimed)}</td>
                      <td className="py-3 text-right text-amber-600">{formatNumber(cat.unclaimed)}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="progress-sacred flex-1">
                            <div style={{ width: `${cat.percentage}%` }} />
                          </div>
                          <span className="w-10 text-right text-xs text-[#3f4944]/60">{cat.percentage}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-[#004532]/20 font-bold bg-[#f2f4f6]">
                    <td className="py-3 text-[#191c1e]">Total</td>
                    <td className="py-3 text-right text-[#191c1e]">{formatNumber(summary.total_recipients)}</td>
                    <td className="py-3 text-right text-[#191c1e]">{formatNumber(summary.total_portions)}</td>
                    <td className="py-3 text-right text-[#191c1e]">{formatNumber(summary.total_coupons)}</td>
                    <td className="py-3 text-right text-[#004532]">{formatNumber(summary.total_claimed)}</td>
                    <td className="py-3 text-right text-amber-600">{formatNumber(summary.total_unclaimed)}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="progress-sacred flex-1">
                          <div style={{ width: `${summary.percentage}%` }} />
                        </div>
                        <span className="w-10 text-right text-xs font-semibold text-[#004532]">{summary.percentage}%</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Hourly Distribution */}
      {hourly_distribution.length > 0 && (
        <div className="rounded-2xl bg-white p-6 editorial-shadow">
          <h3 className="font-headline mb-5 font-bold text-[#191c1e]">Hourly Distribution</h3>
          <div className="flex items-end gap-1" style={{ height: 160 }}>
            {hourly_distribution.map((h) => {
              const max = Math.max(...hourly_distribution.map((x) => x.count), 1);
              const pct = (h.count / max) * 100;
              return (
                <div key={h.hour} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-xs font-semibold text-[#004532]">{h.count}</span>
                  <div className="w-full rounded-t bg-[#004532]/80" style={{ height: `${pct}%`, minHeight: 4 }} />
                  <span className="text-[10px] text-[#3f4944]/50">{h.hour}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function UnclaimedTab({ data }: { data: UnclaimedCoupon[] }) {
  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center text-center">
            <CheckCircle className="size-12 text-green-500/50" />
            <h3 className="mt-3 text-lg font-semibold">Semua Kupon Sudah Diambil</h3>
            <p className="mt-1 text-sm text-muted-foreground">Tidak ada kupon yang belum diklaim</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Kupon Belum Diambil</CardTitle>
            <Badge variant="secondary" className="bg-amber-100 text-amber-700">
              {formatNumber(data.length)} kupon
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No. Kupon</TableHead>
                  <TableHead>Penerima</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead className="text-right">Porsi</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>Telepon</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell className="font-mono text-sm font-medium">{coupon.coupon_number}</TableCell>
                    <TableCell className="font-medium">{coupon.recipient?.name || '-'}</TableCell>
                    <TableCell className="capitalize">{coupon.recipient?.category || '-'}</TableCell>
                    <TableCell className="text-right">{coupon.recipient?.portions ?? '-'}</TableCell>
                    <TableCell className="max-w-50 truncate text-sm text-muted-foreground">
                      {[coupon.recipient?.address, coupon.recipient?.kelurahan, coupon.recipient?.kecamatan]
                        .filter(Boolean)
                        .join(', ') || '-'}
                    </TableCell>
                    <TableCell className="text-sm">{coupon.recipient?.phone || '-'}</TableCell>
                    <TableCell>
                      <StatusBadge status={coupon.status} label={COUPON_STATUS_LABELS[coupon.status]} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PerAnimalTab({ data }: { data: AnimalReport[] }) {
  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <EmptyState
            icon={Package}
            title="Belum ada data hewan"
            description="Data hewan kurban belum ditambahkan untuk event ini"
          />
        </CardContent>
      </Card>
    );
  }

  const totalWeight = data.reduce((sum, a) => sum + (a.weight || 0), 0);
  const totalPortions = data.reduce((sum, a) => sum + (a.estimated_portions || 0), 0);

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Hewan" value={data.length} icon={Package} color="bg-purple-500" />
        <StatCard
          title="Total Berat"
          value={`${formatNumber(totalWeight)} kg`}
          icon={TrendingUp}
          color="bg-teal-500"
        />
        <StatCard title="Estimasi Porsi" value={totalPortions} icon={Ticket} color="bg-orange-500" />
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Daftar Hewan Kurban</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Ras</TableHead>
                  <TableHead>Warna</TableHead>
                  <TableHead className="text-right">Berat (kg)</TableHead>
                  <TableHead className="text-right">Est. Porsi</TableHead>
                  <TableHead>Donor</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((animal) => (
                  <TableRow key={animal.id}>
                    <TableCell className="font-medium">
                      {ANIMAL_TYPE_LABELS[animal.type] || animal.type}
                    </TableCell>
                    <TableCell>{animal.breed || '-'}</TableCell>
                    <TableCell>{animal.color || '-'}</TableCell>
                    <TableCell className="text-right">{formatNumber(animal.weight)}</TableCell>
                    <TableCell className="text-right">{formatNumber(animal.estimated_portions)}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{animal.donor?.name || '-'}</p>
                        {animal.donor?.phone && (
                          <p className="text-xs text-muted-foreground">{animal.donor.phone}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={animal.status} label={ANIMAL_STATUS_LABELS[animal.status]} />
                    </TableCell>
                  </TableRow>
                ))}
                {/* Total row */}
                <TableRow className="border-t-2 font-semibold">
                  <TableCell colSpan={3}>Total ({data.length} hewan)</TableCell>
                  <TableCell className="text-right">{formatNumber(totalWeight)}</TableCell>
                  <TableCell className="text-right">{formatNumber(totalPortions)}</TableCell>
                  <TableCell colSpan={2} />
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ReportsPage() {
  const { activeEvent } = useActiveEvent();

  const { data: distribution, isLoading: loadingDist } = useQuery({
    queryKey: ['reports', 'distribution', activeEvent?.id],
    queryFn: () => reportService.getDistribution(activeEvent!.id),
    enabled: !!activeEvent,
  });

  const { data: unclaimed, isLoading: loadingUncl } = useQuery({
    queryKey: ['reports', 'unclaimed', activeEvent?.id],
    queryFn: () => reportService.getUnclaimed(activeEvent!.id),
    enabled: !!activeEvent,
  });

  const { data: perAnimal, isLoading: loadingAnimal } = useQuery({
    queryKey: ['reports', 'per-animal', activeEvent?.id],
    queryFn: () => reportService.getPerAnimal(activeEvent!.id),
    enabled: !!activeEvent,
  });

  const exportPdfMutation = useMutation({
    mutationFn: () => reportService.export(activeEvent!.id, { format: 'pdf' }),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `laporan-distribusi-${activeEvent!.id}-${new Date().toISOString().slice(0, 10)}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('PDF berhasil diunduh');
    },
    onError: () => toast.error('Gagal mengunduh PDF'),
  });

  if (!activeEvent) {
    return (
      <EmptyState
        icon={BarChart3}
        title="Pilih event terlebih dahulu"
        description="Pilih event aktif dari sidebar untuk melihat laporan"
      />
    );
  }

  const distData = distribution?.data as DistributionData | undefined;
  const unclaimedData = (unclaimed?.data || []) as UnclaimedCoupon[];
  const animalData = (perAnimal?.data || []) as AnimalReport[];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-xs font-black uppercase tracking-widest text-[#3f4944]/50">
            Distribution Analytics
          </p>
          <h1 className="font-headline text-3xl font-extrabold text-[#191c1e]">Reports</h1>
          <p className="mt-1 text-sm text-[#3f4944]">{activeEvent.name}</p>
        </div>
        <button
          onClick={() => exportPdfMutation.mutate()}
          disabled={exportPdfMutation.isPending}
          className="flex items-center gap-2 rounded-xl bg-[#004532] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#003526] disabled:opacity-60"
        >
          {exportPdfMutation.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <FileDown className="size-4" />
          )}
          Export PDF
        </button>
      </div>

      <Tabs defaultValue="distribution">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="distribution" className="flex-1 sm:flex-none">
            <BarChart3 className="mr-1.5 size-4 sm:mr-2" />
            <span className="hidden sm:inline">Distribusi</span>
            <span className="sm:hidden">Distribusi</span>
          </TabsTrigger>
          <TabsTrigger value="unclaimed" className="flex-1 sm:flex-none">
            <Clock className="mr-1.5 size-4 sm:mr-2" />
            <span className="hidden sm:inline">Belum Diambil</span>
            <span className="sm:hidden">Belum</span>
            {unclaimedData.length > 0 && (
              <Badge variant="secondary" className="ml-1.5 size-5 justify-center rounded-full p-0 text-[10px] sm:ml-2">
                {unclaimedData.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="per-animal" className="flex-1 sm:flex-none">
            <Package className="mr-1.5 size-4 sm:mr-2" />
            <span className="hidden sm:inline">Per Hewan</span>
            <span className="sm:hidden">Hewan</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="distribution" className="mt-4">
          {loadingDist ? <LoadingState /> : distData ? <DistributionTab data={distData} /> : <LoadingState />}
        </TabsContent>

        <TabsContent value="unclaimed" className="mt-4">
          {loadingUncl ? <LoadingState /> : <UnclaimedTab data={unclaimedData} />}
        </TabsContent>

        <TabsContent value="per-animal" className="mt-4">
          {loadingAnimal ? <LoadingState /> : <PerAnimalTab data={animalData} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
