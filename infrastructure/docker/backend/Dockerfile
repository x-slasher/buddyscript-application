FROM php:8.3-fpm AS base

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# ─────────────────────────────────────────────
# Development stage
# ─────────────────────────────────────────────
FROM base AS development

RUN pecl install xdebug \
    && docker-php-ext-enable xdebug

COPY infrastructure/docker/backend/php/xdebug.ini /usr/local/etc/php/conf.d/xdebug.ini
COPY infrastructure/docker/backend/php/php-dev.ini /usr/local/etc/php/conf.d/custom.ini

COPY backend/ .

RUN composer install --no-scripts --no-autoloader \
    && composer dump-autoload --optimize

RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 9000
CMD ["php-fpm"]

# ─────────────────────────────────────────────
# Production stage
# ─────────────────────────────────────────────
FROM base AS production

COPY infrastructure/docker/backend/php/php-prod.ini /usr/local/etc/php/conf.d/custom.ini

COPY backend/ .

RUN composer install --no-dev --optimize-autoloader --no-scripts \
    && composer dump-autoload --optimize --no-dev

RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 755 /var/www/html/storage

EXPOSE 9000
CMD ["php-fpm"]