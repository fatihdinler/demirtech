# server/Dockerfile
FROM node:18-alpine

# Çalışma dizini
WORKDIR /app

# Bağımlılıkların kurulabilmesi için package.json dosyalarını kopyala
COPY package*.json ./
RUN npm install

# Tüm proje dosyalarını kopyala
COPY . .

# Config'de kullandığımız ortam değişkenlerini Dockerfile içerisine sabit yazıyoruz.
ENV DEMIRTECH_DATABASE_NAME=demirtech
ENV DEMIRTECH_DATABASE_CONNECTION_URL=mongodb://mongodb:27017/demirtech
ENV DEMIRTECH_APPLICATION_PORT=3000

# Uygulamanın dinlediği port
EXPOSE 3000

# Uygulamayı başlat
CMD ["npm", "start"]
