FROM node:12.21.0-alpine AS build
RUN npm install -g expo-cli

COPY ./package.json ./package-lock.json ./ 
RUN npm install 

COPY . .

ARG ITREX_CHANNEL
ENV ITREX_CHANNEL $ITREX_CHANNEL
RUN expo build:web

FROM httpd:2.4 AS server
COPY --from=build ./web-build /usr/local/apache2/htdocs/
COPY ./httpd/my-httpd.conf /usr/local/apache2/conf/httpd.conf
COPY ./httpd/.htaccess ./web-build /usr/local/apache2/htdocs/