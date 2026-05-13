import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: 'linear-gradient(135deg, #002e22 0%, #004532 40%, #065f46 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Dot pattern overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle, rgba(166,242,209,0.08) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Glow behind cards */}
        <div
          style={{
            position: 'absolute',
            right: 180,
            top: 100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(111,251,190,0.15) 0%, transparent 70%)',
          }}
        />

        {/* ═══ LEFT SIDE ═══ */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '48px 0 48px 64px',
            width: '55%',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Logo + brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://tawzii.id/logo-compress.png"
              alt=""
              width={72}
              height={72}
              style={{ borderRadius: '50%', border: '3px solid rgba(255,255,255,0.15)' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: 'rgba(255,255,255,0.5)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                by adilabs.id
              </span>
            </div>
          </div>

          {/* Headline */}
          <div
            style={{
              fontSize: 56,
              fontWeight: 900,
              color: 'white',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              marginBottom: 12,
            }}
          >
            Tawzii Digital
          </div>

          {/* Subheadline */}
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: '#6ffbbe',
              lineHeight: 1.3,
              marginBottom: 6,
            }}
          >
            Platform Distribusi Kurban Digital #1
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 500,
              color: 'rgba(255,255,255,0.6)',
              marginBottom: 32,
            }}
          >
            untuk Masjid Indonesia
          </div>

          {/* Feature pills */}
          <div style={{ display: 'flex', gap: 12 }}>
            {['QR Anti-Palsu', 'Scan Offline', 'Gratis untuk Masjid'].map((f) => (
              <div
                key={f}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 100,
                  padding: '8px 16px',
                  fontSize: 14,
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.85)',
                }}
              >
                <span style={{ color: '#6ffbbe', fontSize: 14, fontWeight: 900 }}>&#10003;</span>
                {f}
              </div>
            ))}
          </div>

          {/* URL */}
          <div
            style={{
              marginTop: 32,
              fontSize: 16,
              fontWeight: 600,
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.04em',
            }}
          >
            tawzii.id
          </div>
        </div>

        {/* ═══ RIGHT SIDE — Dashboard + Coupon mockup ═══ */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            right: 40,
            top: 40,
            bottom: 40,
            width: '44%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Dashboard card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: 360,
              background: 'white',
              borderRadius: 20,
              padding: 28,
              boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
              transform: 'rotate(-2deg)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: '#888', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Live Distribusi</span>
                <span style={{ fontSize: 18, fontWeight: 900, color: '#191c1e' }}>Idul Adha 1447 H</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  background: '#ecfdf5',
                  borderRadius: 100,
                  padding: '4px 10px',
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#059669',
                }}
              >
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
                AKTIF
              </div>
            </div>

            {/* Progress */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 4 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 28, fontWeight: 900, color: '#191c1e' }}>
                  847
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#999' }}> / 1.200</span>
                </span>
                <span style={{ fontSize: 11, color: '#888' }}>Kupon ter-scan</span>
              </div>
              <span style={{ fontSize: 24, fontWeight: 900, color: '#004532' }}>70.5%</span>
            </div>
            <div style={{ display: 'flex', height: 8, borderRadius: 8, background: '#f2f4f6', overflow: 'hidden', marginBottom: 20 }}>
              <div style={{ width: '70.5%', height: '100%', borderRadius: 8, background: 'linear-gradient(90deg, #004532, #6ffbbe)' }} />
            </div>

            {/* Zone bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { zone: 'RT 01 / RW 05', pct: 90, color: '#10b981' },
                { zone: 'RT 03 / RW 05', pct: 80, color: '#10b981' },
                { zone: 'RT 02 / RW 06', pct: 61, color: '#f59e0b' },
                { zone: 'RT 04 / RW 06', pct: 22, color: '#ef4444' },
              ].map((z) => (
                <div key={z.zone} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 100, fontSize: 11, fontWeight: 600, color: '#555' }}>{z.zone}</span>
                  <div style={{ display: 'flex', flex: 1, height: 6, borderRadius: 6, background: '#f2f4f6', overflow: 'hidden' }}>
                    <div style={{ width: `${z.pct}%`, height: '100%', borderRadius: 6, background: z.color }} />
                  </div>
                  <span style={{ width: 32, fontSize: 11, fontWeight: 800, color: '#191c1e', textAlign: 'right' }}>{z.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Floating QR Coupon card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              position: 'absolute',
              right: -10,
              bottom: 20,
              width: 180,
              background: 'white',
              borderRadius: 14,
              overflow: 'hidden',
              boxShadow: '0 16px 48px rgba(0,0,0,0.3)',
              transform: 'rotate(4deg)',
            }}
          >
            {/* Green header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#004532',
                padding: '8px 12px',
              }}
            >
              <span style={{ fontSize: 9, fontWeight: 800, color: 'white', letterSpacing: '0.05em' }}>KUPON KURBAN</span>
              <span style={{ fontSize: 8, fontWeight: 700, color: '#6ffbbe' }}>#A-0142</span>
            </div>
            {/* QR area */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 12px 8px' }}>
              {/* QR placeholder grid */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  width: 80,
                  height: 80,
                  gap: 2,
                }}
              >
                {Array.from({ length: 49 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width: 9,
                      height: 9,
                      background: [0,1,2,6,7,8,14,20,28,34,35,36,40,41,42,43,44,45,46,47,48,3,10,15,21,27,33,5,11,16,22,26,32,4,12,13,17,18,19,23,24,25,29,30,31,37,38,39,9].includes(i)
                        ? '#191c1e'
                        : '#f2f4f6',
                      borderRadius: 1,
                    }}
                  />
                ))}
              </div>
              <span style={{ fontSize: 8, color: '#888', marginTop: 6, fontWeight: 600 }}>Bp. Suparman · RT 03</span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
