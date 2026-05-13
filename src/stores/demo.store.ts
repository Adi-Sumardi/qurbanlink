import { create } from 'zustand';
import {
  DEMO_KUPON,
  DEMO_PENERIMA,
  DEMO_SCAN_LOG,
  DEMO_ZONA,
  type DemoKupon,
  type DemoScanLog,
} from '@/content/demo-seed';

export type ScanResult =
  | { kind: 'success'; kupon: DemoKupon; penerimaNama: string; zona: string }
  | { kind: 'duplicate'; kupon: DemoKupon; penerimaNama: string; scanAt: string; scanBy: string }
  | { kind: 'invalid'; reason: string };

interface DemoState {
  kupon: DemoKupon[];
  scanLog: DemoScanLog[];
  /** Jumlah scan yang dilakukan visitor pada sesi ini — drive conversion modal */
  scanCount: number;

  /** Simulate scan kupon. Tidak otomatis konfirmasi — caller harus panggil confirmScan() */
  previewScan: (kuponId: string) => ScanResult;
  /** Konfirmasi scan: ubah status kupon jadi Terpakai, tambah ke log */
  confirmScan: (kuponId: string) => void;
  /** Reset state ke seed awal */
  resetDemo: () => void;
}

const PETUGAS_DEMO = 'Anda (Demo)';

export const useDemoStore = create<DemoState>()((set, get) => ({
  kupon: structuredClone(DEMO_KUPON),
  scanLog: structuredClone(DEMO_SCAN_LOG),
  scanCount: 0,

  previewScan: (kuponId) => {
    const kupon = get().kupon.find((k) => k.id === kuponId);
    if (!kupon) {
      return { kind: 'invalid', reason: 'Kupon tidak dikenal dalam sistem.' };
    }
    const penerima = DEMO_PENERIMA.find((p) => p.id === kupon.penerimaId);
    if (!penerima) {
      return { kind: 'invalid', reason: 'Data penerima tidak ditemukan.' };
    }
    const zona = DEMO_ZONA.find((z) => z.id === penerima.zonaId);

    if (kupon.status === 'Terpakai') {
      return {
        kind: 'duplicate',
        kupon,
        penerimaNama: penerima.nama,
        scanAt: kupon.scanAt ?? '',
        scanBy: kupon.scanBy ?? '—',
      };
    }
    return {
      kind: 'success',
      kupon,
      penerimaNama: penerima.nama,
      zona: zona?.nama ?? '—',
    };
  },

  confirmScan: (kuponId) =>
    set((state) => {
      const idx = state.kupon.findIndex((k) => k.id === kuponId);
      if (idx === -1) return state;
      const target = state.kupon[idx];
      if (target.status === 'Terpakai') return state;

      const now = new Date().toISOString();
      const penerima = DEMO_PENERIMA.find((p) => p.id === target.penerimaId);
      const zona = penerima
        ? DEMO_ZONA.find((z) => z.id === penerima.zonaId)
        : undefined;

      const updatedKupon: DemoKupon = {
        ...target,
        status: 'Terpakai',
        scanAt: now,
        scanBy: PETUGAS_DEMO,
      };

      const updatedList = [...state.kupon];
      updatedList[idx] = updatedKupon;

      const logEntry: DemoScanLog = {
        kuponId: target.id,
        penerimaNama: penerima?.nama ?? '—',
        zona: zona?.nama ?? '—',
        petugas: PETUGAS_DEMO,
        at: now,
        status: 'success',
      };

      return {
        kupon: updatedList,
        scanLog: [logEntry, ...state.scanLog],
        scanCount: state.scanCount + 1,
      };
    }),

  resetDemo: () =>
    set({
      kupon: structuredClone(DEMO_KUPON),
      scanLog: structuredClone(DEMO_SCAN_LOG),
      scanCount: 0,
    }),
}));
