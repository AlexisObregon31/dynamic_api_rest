# Utiliza una imagen base de Node.js
FROM node:18

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto del código de la aplicación
COPY . .

# Expone el puerto que tu aplicación usará
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["node", "src/index.js"]