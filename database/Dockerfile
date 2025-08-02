# Use official MySQL 8.0 image as base
FROM mysql:8.0

# Set environment variables for MySQL
ENV MYSQL_DATABASE=carsDB
ENV MYSQL_USER=appuser
ENV MYSQL_PASSWORD=carsDB
ENV MYSQL_ROOT_PASSWORD=rootpassword

# Copy initialization script to the docker-entrypoint-initdb.d directory
# Scripts in this directory are automatically executed when container starts
COPY init.sql /docker-entrypoint-initdb.d/

# Set the default character set and collation
RUN echo '[mysqld]' > /etc/mysql/conf.d/custom.cnf \
    && echo 'character-set-server=utf8mb4' >> /etc/mysql/conf.d/custom.cnf \
    && echo 'collation-server=utf8mb4_unicode_ci' >> /etc/mysql/conf.d/custom.cnf \
    && echo 'default-authentication-plugin=mysql_native_password' >> /etc/mysql/conf.d/custom.cnf

# Expose MySQL port
EXPOSE 3306

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD mysqladmin ping -h localhost -u root -p$MYSQL_ROOT_PASSWORD || exit 1

# The CMD is inherited from the base mysql:8.0 image
# which runs mysqld as the main process
