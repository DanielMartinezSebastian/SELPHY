# Utiliza una imagen minima de Node.js en 32/64
# FROM node:14-alpine

# Utiliza una imagen minima de Node.js en arm para raspberry pi
FROM arm32v7/node:14-alpine


# Crea un directorio para la aplicación
WORKDIR /usr/src/app

# Copia los archivos de configuración del proyecto
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Instala PERL necesario para usar Exiftool
RUN apk add perl

# Copia el resto del código fuente del proyecto
COPY . .

# Expone el puerto que utiliza tu aplicación
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD [ "node", "index.js" ]