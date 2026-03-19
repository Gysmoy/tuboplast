#!/bin/bash
set -e

echo "========================================="
echo "Starting Application"
echo "========================================="

# 👉 MUY IMPORTANTE
cd /var/www/html

# 0. Ensure storage folders exist (por si volúmenes)
mkdir -p storage/framework/{sessions,views,cache}
mkdir -p bootstrap/cache
mkdir -p public/reports
touch storage/logs/laravel.log

chown -R www-data:www-data storage bootstrap/cache public/reports
chmod -R 775 storage bootstrap/cache public/reports

# 1. Run Migrations
echo "Running migrations..."
php artisan migrate --force || echo "WARNING: Migrations failed, continuing anyway..."

# 2. Clear Caches
echo "Clearing caches..."
php artisan optimize:clear || true

# 3. Storage Link
if [ ! -L public/storage ]; then
    echo "Creating storage link..."
    php artisan storage:link || true
fi

# 4. Start Apache
echo "Starting Apache..."
exec apache2-foreground
