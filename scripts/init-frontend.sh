#!/bin/bash
# Run once after cloning repo to initialize frontend
# Usage: bash scripts/init-frontend.sh
set -e

cd /var/www/distribusi-kurban/frontend

echo "=== Init Frontend ==="

if [ ! -f .env.local ]; then
    cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=https://api.tawzii.id/api/v1
NEXT_PUBLIC_APP_NAME=Tawzii Digital
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=GANTI_DENGAN_KEY_PRODUCTION
NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=true
EOF
    echo "⚠️  Cek .env.local dan sesuaikan nilai-nilainya"
fi

npm ci
npm run build

# Start dengan PM2
pm2 start npm --name frontend-kurban -- start
pm2 save
pm2 startup | tail -1 | bash

echo "✅ Frontend siap di port 3000!"
