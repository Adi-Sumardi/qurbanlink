#!/bin/bash
# Start semua service development lokal dengan satu perintah
# Usage: bash scripts/dev.sh

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "=== Tawzii Digital — Dev Mode ==="

# Kill proses lama
pkill -f "php artisan serve" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true
pkill -f "cloudflared tunnel" 2>/dev/null || true
sleep 1

# Start Laravel
echo "▶ Starting Laravel backend..."
cd "$ROOT/backend"
php artisan serve --port=8000 > /tmp/laravel.log 2>&1 &
echo "  PID: $!"

# Start Next.js
echo "▶ Starting Next.js frontend..."
cd "$ROOT/frontend"
npm run dev > /tmp/nextjs.log 2>&1 &
echo "  PID: $!"

# Start Cloudflare Tunnels
echo "▶ Starting Cloudflare Tunnels..."
cloudflared tunnel --config ~/.cloudflared/config.yml run > /tmp/cf-backend.log 2>&1 &
echo "  Backend tunnel PID: $!"
cloudflared tunnel --config ~/.cloudflared/frontend.yml run > /tmp/cf-frontend.log 2>&1 &
echo "  Frontend tunnel PID: $!"

sleep 5
echo ""
echo "✅ Semua service jalan!"
echo ""
echo "  Local:   http://localhost:3000"
echo "  Online:  https://tawzii.id"
echo "  API:     https://api.tawzii.id"
echo ""
echo "Logs:"
echo "  Laravel:  tail -f /tmp/laravel.log"
echo "  Next.js:  tail -f /tmp/nextjs.log"
echo "  Tunnel:   tail -f /tmp/cf-backend.log"
