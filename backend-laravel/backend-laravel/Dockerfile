FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    zip \
    unzip \
    git \
    libpq-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql zip mbstring exif pcntl bcmath sockets

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

RUN composer install --no-dev --optimize-autoloader

# Storage + Cache permissions
RUN chmod -R 777 storage bootstrap/cache

# Clear & Cache config (safe)
RUN php artisan config:clear
RUN php artisan route:clear
RUN php artisan view:clear

# 🚀 IMPORTANT: Run migrations automatically then start server
CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=10000
