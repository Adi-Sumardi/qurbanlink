'use client';

import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { formatDate } from '@/lib/format';
import type { CouponPrintItem } from '@/types';

interface CouponCardProps {
  coupon: CouponPrintItem;
  event: { name: string; event_date: string | null; year: number | string };
  tenant: { name: string; city: string; address: string };
  onReady?: () => void;
}

export function CouponCard({ coupon, event, tenant, onReady }: CouponCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, coupon.qr_payload, {
        width: 120,
        margin: 1,
        errorCorrectionLevel: 'M',
      })
        .then(() => onReady?.())
        .catch(() => onReady?.());
    }
  }, [coupon.qr_payload, onReady]);

  return (
    <div className="coupon-card">
      <div className="coupon-header">
        <span className="coupon-org-name">{tenant.name}</span>
        <span className="coupon-org-city">{tenant.city}</span>
      </div>

      <div className="coupon-title">KUPON DISTRIBUSI DAGING KURBAN</div>
      <div className="coupon-event">
        {event.name} {event.year}
      </div>

      <div className="coupon-body">
        <div className="coupon-qr">
          <canvas ref={canvasRef} />
          <span className="coupon-number">{coupon.coupon_number}</span>
        </div>
        <div className="coupon-details">
          <div className="detail-row">
            <span className="detail-label">Nama</span>
            <span className="detail-value">{coupon.recipient.name}</span>
          </div>
          {coupon.recipient.address && (
            <div className="detail-row">
              <span className="detail-label">Alamat</span>
              <span className="detail-value">
                {coupon.recipient.address}
                {coupon.recipient.rt_rw && ` RT/RW ${coupon.recipient.rt_rw}`}
              </span>
            </div>
          )}
          {(coupon.recipient.kelurahan || coupon.recipient.kecamatan) && (
            <div className="detail-row">
              <span className="detail-label">Kel/Kec</span>
              <span className="detail-value">
                {[coupon.recipient.kelurahan, coupon.recipient.kecamatan]
                  .filter(Boolean)
                  .join(', ')}
              </span>
            </div>
          )}
          {coupon.recipient.category && (
            <div className="detail-row">
              <span className="detail-label">Kategori</span>
              <span className="detail-value">{coupon.recipient.category}</span>
            </div>
          )}
          <div className="detail-row">
            <span className="detail-label">Porsi</span>
            <span className="detail-value">{coupon.recipient.portions}</span>
          </div>
          {event.event_date && (
            <div className="detail-row">
              <span className="detail-label">Tanggal</span>
              <span className="detail-value">{formatDate(event.event_date)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="coupon-footer">
        <span className="coupon-validity">
          Berlaku s/d {formatDate(coupon.expires_at)}
        </span>
      </div>
    </div>
  );
}
