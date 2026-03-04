'use client';

import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  ScanLine,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Keyboard,
  Camera,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrScanner } from '@/components/scanner/qr-scanner';
import { useActiveEvent } from '@/hooks/use-active-event';
import { scanService } from '@/services/scan.service';
import { SCAN_RESULT_LABELS } from '@/lib/constants';
import { formatDateTime } from '@/lib/format';
import { toast } from 'sonner';
import type { Scan } from '@/types';

const RESULT_CONFIG = {
  success: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  already_claimed: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  invalid: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  expired: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  voided: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
} as const;

function ScanResultCard({ scan }: { scan: Scan }) {
  const config = RESULT_CONFIG[scan.scan_result as keyof typeof RESULT_CONFIG] || RESULT_CONFIG.invalid;
  const Icon = config.icon;

  return (
    <Card className={`${config.bg} ${config.border}`}>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center gap-3">
          <Icon className={`size-16 ${config.color}`} />
          <div>
            <h3 className="text-xl font-bold">
              {SCAN_RESULT_LABELS[scan.scan_result] || scan.scan_result}
            </h3>
            {scan.coupon && (
              <div className="mt-3 space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">Kupon:</span>{' '}
                  <span className="font-mono font-bold">{scan.coupon.coupon_number}</span>
                </p>
                {scan.coupon.recipient && (
                  <p>
                    <span className="text-muted-foreground">Penerima:</span>{' '}
                    <span className="font-semibold">{scan.coupon.recipient.name}</span>
                  </p>
                )}
                {scan.coupon.recipient?.portions && (
                  <p>
                    <span className="text-muted-foreground">Porsi:</span>{' '}
                    {scan.coupon.recipient.portions}
                  </p>
                )}
              </div>
            )}
            <p className="mt-2 text-xs text-muted-foreground">
              {formatDateTime(scan.scanned_at)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ScanPage() {
  const { activeEvent } = useActiveEvent();
  const [activeTab, setActiveTab] = useState('camera');
  const [manualCode, setManualCode] = useState('');
  const [lastScan, setLastScan] = useState<Scan | null>(null);
  const [scanHistory, setScanHistory] = useState<Scan[]>([]);

  const handleScanResult = useCallback((scan: Scan) => {
    setLastScan(scan);
    setScanHistory((prev) => [scan, ...prev].slice(0, 50));
    if (scan.scan_result === 'success') {
      toast.success('Kupon berhasil di-scan!');
    } else {
      toast.warning(SCAN_RESULT_LABELS[scan.scan_result] || 'Scan gagal');
    }
  }, []);

  const scanMutation = useMutation({
    mutationFn: (payload: string) =>
      scanService.scan(activeEvent!.id, {
        qr_payload: payload,
        scan_method: 'qr',
      }),
    onSuccess: (data) => handleScanResult(data.data),
    onError: () => toast.error('Gagal memproses scan'),
  });

  const manualMutation = useMutation({
    mutationFn: (code: string) =>
      scanService.manualScan(activeEvent!.id, { coupon_number: code }),
    onSuccess: (data) => {
      handleScanResult(data.data);
      setManualCode('');
    },
    onError: () => toast.error('Gagal memproses scan manual'),
  });

  const handleQrScan = useCallback(
    (decodedText: string) => {
      if (!activeEvent || scanMutation.isPending) return;
      scanMutation.mutate(decodedText);
    },
    [activeEvent, scanMutation]
  );

  const handleManualSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!manualCode.trim() || !activeEvent) return;
      manualMutation.mutate(manualCode.trim().toUpperCase());
    },
    [manualCode, activeEvent, manualMutation]
  );

  if (!activeEvent) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <ScanLine className="mx-auto size-12 text-muted-foreground/50" />
          <h2 className="mt-4 text-lg font-medium">Pilih event terlebih dahulu</h2>
          <p className="text-sm text-muted-foreground">
            Pilih event aktif dari sidebar untuk mulai scan
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Scan Kupon</h1>
        <p className="text-muted-foreground">{activeEvent.name}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="camera">
            <Camera className="mr-2 size-4" />
            Kamera
          </TabsTrigger>
          <TabsTrigger value="manual">
            <Keyboard className="mr-2 size-4" />
            Manual
          </TabsTrigger>
        </TabsList>

        <TabsContent value="camera" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <QrScanner
                onScan={handleQrScan}
                enabled={activeTab === 'camera'}
              />
              {scanMutation.isPending && (
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  Memproses scan...
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Input Nomor Kupon</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <form onSubmit={handleManualSubmit} className="flex gap-2">
                <Input
                  placeholder="Contoh: QRB-K7M3X9P"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                  className="flex-1 font-mono tracking-wider"
                  autoFocus
                  maxLength={15}
                />
                <Button
                  type="submit"
                  disabled={!manualCode.trim() || manualMutation.isPending}
                >
                  {manualMutation.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <ScanLine className="size-4" />
                  )}
                  Scan
                </Button>
              </form>
              <p className="text-xs text-muted-foreground">
                Masukkan nomor kupon yang tercetak pada kartu kupon penerima
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {lastScan && <ScanResultCard scan={lastScan} />}

      {scanHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Riwayat Scan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {scanHistory.map((scan, i) => (
                <div
                  key={`${scan.id}-${i}`}
                  className="flex items-center justify-between rounded-lg border p-3 text-sm"
                >
                  <div>
                    <span className="font-mono font-medium">
                      {scan.coupon?.coupon_number || '-'}
                    </span>
                    {scan.coupon?.recipient && (
                      <span className="ml-2 text-muted-foreground">
                        {scan.coupon.recipient.name}
                      </span>
                    )}
                  </div>
                  <Badge
                    variant={scan.scan_result === 'success' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {SCAN_RESULT_LABELS[scan.scan_result] || scan.scan_result}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
