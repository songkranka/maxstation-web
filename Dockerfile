# Stage 0: compile angular frontend
FROM node:12-alpine as builder

WORKDIR /app

COPY package*.json /app/
RUN npm install

COPY ./ /app/
ARG configuration=production
RUN npm run build -- --output-path=./dist/out --configuration $configuration

# Stage 1: serve app with nginx server
FROM nginx:1.13.3-alpine
COPY nginx/default.conf /etc/nginx/conf.d/
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist/out /usr/share/nginx/html

RUN mkdir -p /usr/share/nginx/html/upload
RUN chmod 777 /usr/share/nginx/html/upload
RUN mkdir -p /usr/share/nginx/html/configs
#RUN chown -R www-data:www-data /usr/share/nginx/html/*

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
