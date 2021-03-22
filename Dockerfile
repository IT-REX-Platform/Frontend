FROM httpd:2.4
COPY ./httpd/my-httpd.conf /usr/local/apache2/conf/httpd.conf
COPY ./httpd/.htaccess ./web-build /usr/local/apache2/htdocs/