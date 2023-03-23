FROM node:latest AS node
COPY package.json /srv/package.json
WORKDIR /srv
RUN npm install

COPY files/ /srv/files/
WORKDIR /srv/files
RUN npm install

FROM composer:latest AS composer
COPY api/composer.json /srv/api/composer.json
WORKDIR /srv/api
RUN composer install

COPY mail/composer.json /srv/mail/composer.json
WORKDIR /srv/mail
RUN composer install

COPY rsc/api/composer.json /srv/rsc/api/composer.json
WORKDIR /srv/rsc/api
RUN composer install

FROM php:8.2-fpm
#ENV DEBIAN_FRONTEND noninteractive
RUN set -eux; \
    apt-get update; \
    apt-get upgrade -y; \
    apt-get install -y --no-install-recommends \
            curl \
            libmemcached-dev \
            libz-dev \
            libpq-dev \
            libjpeg-dev \
            libpng-dev \
            libfreetype6-dev \
            libssl-dev \
            libwebp-dev \
            libxpm-dev \
            libmcrypt-dev \
            libonig-dev; \
    rm -rf /var/lib/apt/lists/*

RUN set -eux; \
    docker-php-ext-install pdo_mysql; \
    docker-php-ext-install pdo_pgsql; \
    docker-php-ext-configure gd \
            --prefix=/usr \
            --with-jpeg \
            --with-webp \
            --with-xpm \
            --with-freetype; \
    docker-php-ext-install gd; \
    php -r 'var_dump(gd_info());'

COPY --from=node /srv/node_modules /srv/node_modules
COPY --from=node /srv/files /srv/files
COPY --from=composer /srv/api/vendor /srv/api/vendor
COPY --from=composer /srv/mail/vendor /srv/mail/vendor
COPY --from=composer /srv/rsc/api/vendor /srv/rsc/api/vendor

