#!/bin/bash
# Setup Cloudflare Tunnel sebagai systemd service di VPS
# Jalankan SETELAH cloudflared login dan tunnel sudah dibuat dari Mac
# Usage: bash scripts/setup-tunnel.sh
set -e

echo "=== Setup Cloudflare Tunnel sebagai systemd service ==="
echo ""
echo "Pastikan kamu sudah copy credentials dari Mac ke VPS:"
echo "  scp ~/.cloudflared/385201ae-9228-4268-a097-771e417b7e79.json root@<VPS_IP>:/root/.cloudflared/"
echo "  scp ~/.cloudflared/4f7426c3-0f02-400e-a692-e4112526288e.json root@<VPS_IP>:/root/.cloudflared/"
echo "  scp ~/.cloudflared/cert.pem root@<VPS_IP>:/root/.cloudflared/"
echo ""
read -p "Sudah copy credentials? (y/n): " confirm
if [ "$confirm" != "y" ]; then
    echo "Jalankan perintah scp di atas dulu, lalu jalankan script ini lagi."
    exit 1
fi

mkdir -p /root/.cloudflared

# Config backend tunnel
cat > /root/.cloudflared/config-backend.yml << 'EOF'
tunnel: 385201ae-9228-4268-a097-771e417b7e79
credentials-file: /root/.cloudflared/385201ae-9228-4268-a097-771e417b7e79.json

ingress:
  - hostname: api.tawzii.id
    service: http://localhost:8000
  - service: http_status:404
EOF

# Config frontend tunnel
cat > /root/.cloudflared/config-frontend.yml << 'EOF'
tunnel: 4f7426c3-0f02-400e-a692-e4112526288e
credentials-file: /root/.cloudflared/4f7426c3-0f02-400e-a692-e4112526288e.json

ingress:
  - hostname: app.tawzii.id
    service: http://localhost:3000
  - service: http_status:404
EOF

# Install sebagai systemd service
cloudflared service install --config /root/.cloudflared/config-backend.yml
cp /etc/systemd/system/cloudflared.service /etc/systemd/system/cloudflared-backend.service
sed -i 's/config-backend.yml/config-backend.yml/' /etc/systemd/system/cloudflared-backend.service

# Frontend service
cat > /etc/systemd/system/cloudflared-frontend.service << 'EOF'
[Unit]
Description=Cloudflare Tunnel - Frontend
After=network.target

[Service]
TimeoutStartSec=0
Type=notify
ExecStart=/usr/bin/cloudflared tunnel --config /root/.cloudflared/config-frontend.yml run
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable cloudflared-backend cloudflared-frontend
systemctl start cloudflared-backend cloudflared-frontend

echo ""
echo "✅ Tunnel berjalan sebagai service!"
echo ""
systemctl status cloudflared-backend --no-pager
systemctl status cloudflared-frontend --no-pager
