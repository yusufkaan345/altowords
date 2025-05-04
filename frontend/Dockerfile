# 1. Build aşaması
FROM node:22.15.0-alpine3.21 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
# 2. Servis aşaması
FROM nginx:1.28-alpine
# Build edilmiş dosyaları nginx'e kopyala
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]