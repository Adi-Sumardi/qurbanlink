#!/bin/bash
# Run once after cloning repo to initialize backend
# Usage: bash scripts/init-backend.sh
set -e

cd /var/www/distribusi-kurban/backend

echo "=== Init Backend ==="

# Copy env
if [ ! -f .env ]; then
    cp .env.example .env
    echo "⚠️  Edit .env dulu sebelum lanjut:"
    echo "   nano /var/www/distribusi-kurban/backend/.env"
    exit 1
fi

composer install --no-dev --optimize-autoloader --no-interaction
php artisan key:generate
php artisan migrate --force
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set permissions
chown -R www-data:www-data /var/www/distribusi-kurban/backend
chmod -R 755 /var/www/distribusi-kurban/backend/storage
chmod -R 755 /var/www/distribusi-kurban/backend/bootstrap/cache

echo "✅ Backend siap!"
