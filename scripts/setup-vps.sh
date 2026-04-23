#!/bin/bash
# Run once on fresh VPS to set up the server
# Usage: bash setup-vps.sh
set -e

echo "=== Setup VPS untuk Distribusi Kurban ==="

# ── System update ────────────────────────────────────────────────────────────
apt update && apt upgrade -y
apt install -y git curl unzip nginx supervisor ufw

# ── PHP 8.2 ──────────────────────────────────────────────────────────────────
apt install -y software-properties-common
add-apt-repository ppa:ondrej/php -y
apt update
apt install -y php8.2 php8.2-fpm php8.2-cli php8.2-pgsql php8.2-redis \
    php8.2-mbstring php8.2-xml php8.2-curl php8.2-zip php8.2-bcmath \
    php8.2-intl php8.2-gd

# ── Composer ─────────────────────────────────────────────────────────────────
curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# ── Node.js 20 ───────────────────────────────────────────────────────────────
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
npm install -g pm2

# ── PostgreSQL ───────────────────────────────────────────────────────────────
apt install -y postgresql postgresql-contrib
sudo -u postgres psql -c "CREATE USER kurban WITH PASSWORD 'GANTI_PASSWORD_DB';"
sudo -u postgres psql -c "CREATE DATABASE distribusi_kurban OWNER kurban;"

# ── Redis ────────────────────────────────────────────────────────────────────
apt install -y redis-server
systemctl enable redis-server

# ── Cloudflare Tunnel ────────────────────────────────────────────────────────
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -o cloudflared.deb
dpkg -i cloudflared.deb
rm cloudflared.deb

# ── Project directory ────────────────────────────────────────────────────────
mkdir -p /var/www/distribusi-kurban
cd /var/www/distribusi-kurban

# ── Nginx config ─────────────────────────────────────────────────────────────
cat > /etc/nginx/sites-available/backend-kurban << 'EOF'
server {
    listen 8000;
    server_name localhost;
    root /var/www/distribusi-kurban/backend/public;
    index index.php;

    client_max_body_size 50M;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
EOF

ln -sf /etc/nginx/sites-available/backend-kurban /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# ── Supervisor untuk Laravel Queue ───────────────────────────────────────────
cat > /etc/supervisor/conf.d/kurban-worker.conf << 'EOF'
[program:kurban-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/distribusi-kurban/backend/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/distribusi-kurban/backend/storage/logs/worker.log
stopwaitsecs=3600
EOF

supervisorctl reread && supervisorctl update

# ── Firewall ─────────────────────────────────────────────────────────────────
ufw allow OpenSSH
ufw allow 8000
ufw allow 3000
ufw --force enable

echo ""
echo "✅ Setup VPS selesai!"
echo ""
echo "Langkah selanjutnya:"
echo "1. Clone repo: git clone <repo-url> /var/www/distribusi-kurban"
echo "2. Setup backend: cd /var/www/distribusi-kurban && bash scripts/init-backend.sh"
echo "3. Setup tunnel: bash scripts/setup-tunnel.sh"
