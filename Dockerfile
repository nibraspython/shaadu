# Use the official PHP + Apache image
FROM php:8.1-apache

# Enable required PHP extensions
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Set working directory
WORKDIR /var/www/html

# Copy all files into the container
COPY . .

# Set permissions for uploads
RUN chmod -R 777 /var/www/html/uploads

# Expose port 80
EXPOSE 80

# Start Apache server
CMD ["apache2-foreground"]
