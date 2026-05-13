'use client';

import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import type { DemoKupon, DemoPenerima, DemoZona } from '@/content/demo-seed';

interface DemoCouponCardProps {
  kupon: DemoKupon;
  penerima: DemoPenerima;
  zona: DemoZona;
  /** Variant: 'screen' untuk tampilan demo dengan ukuran lebih besar, 'compact' untuk grid kupon */
  variant?: 'screen' | 'compact';
}

/**
 * Komponen kupon demo yang menggunakan CSS class `.coupon-card` yang sama
 * dengan kupon print asli dari globals.css — header hijau, title, event,
 * body (QR + details), footer. Untuk tampilan di screen, ukuran sedikit
 * diperbesar via inline style agar mudah dibaca.
 */
export function DemoCouponCard({
  kupon,
  penerima,
  zona,
  variant = 'screen',
}: DemoCouponCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const qrSize = variant === 'compact' ? 88 : 120;
  const used = kupon.status === 'Terpakai';

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, kupon.id, {
      width: qrSize,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#191c1e',
        light: '#ffffff',
      },
    }).catch(() => {
      // Silently ignore — fallback ke placeholder canvas kosong
    });
  }, [kupon.id, qrSize]);

  const isCompact = variant === 'compact';
  const scale = isCompact ? 1 : 1.25;

  return (
    <div
      className="coupon-card relative"
      style={{
        fontSize: `${scale}em`,
        opacity: used ? 0.6 : 1,
      }}
    >
      {/* Header — uses .coupon-header from globals.css */}
      <div className="coupon-header">
        <span className="coupon-org-name">Masjid Al-Hikmah Demo</span>
        <span className="coupon-org-city">Bekasi</span>
      </div>

      {/* Title — uses .coupon-title from globals.css */}
      <div className="coupon-title">Kupon Distribusi Daging Kurban</div>

      {/* Event — uses .coupon-event from globals.css */}
      <div className="coupon-event">Idul Adha 1447 H</div>

      {/* Body — uses .coupon-body from globals.css */}
      <div className="coupon-body">
        {/* QR side — uses .coupon-qr from globals.css */}
        <div className="coupon-qr">
          <canvas
            ref={canvasRef}
            style={{ width: qrSize, height: qrSize }}
          />
          <span className="coupon-number">{kupon.id}</span>
        </div>

        {/* Detail side — uses .coupon-details from globals.css */}
        <div className="coupon-details">
          <div className="detail-row">
            <span className="detail-label">Nama</span>
            <span className="detail-value">{penerima.nama}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Alamat</span>
            <span className="detail-value">{penerima.alamat}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Zona</span>
            <span className="detail-value">{zona.nama}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Kategori</span>
            <span className="detail-value">{penerima.kategori}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Porsi</span>
            <span className="detail-value">1 paket</span>
          </div>
        </div>
      </div>

      {/* Footer — uses .coupon-footer from globals.css */}
      <div className="coupon-footer">
        <span className="coupon-validity">Berlaku s/d 27 Mei 2026</span>
      </div>

      {/* Status stamp overlay for Terpakai */}
      {used && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%) rotate(-12deg)',
            border: '3px solid rgba(225, 29, 72, 0.7)',
            color: 'rgba(225, 29, 72, 0.8)',
            padding: '4px 12px',
            fontWeight: 800,
            fontSize: isCompact ? '10px' : '14px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            pointerEvents: 'none',
          }}
        >
          Terpakai
        </div>
      )}
    </div>
  );
}
