# Procesador de Imágenes para CANON SELPHY

Esta aplicación es un servidor web diseñado para procesar imágenes y hacerlas compatibles con impresoras CANON SELPHY. Permite a los usuarios subir imágenes, las cuales son automáticamente convertidas y modificadas para cumplir con los requisitos específicos de impresión de estas impresoras.

## Características

- **Conversión a JPEG**: Todas las imágenes subidas son convertidas al formato JPEG.
- **Ajuste de DPI**: Las imágenes son ajustadas a 72 DPI para asegurar compatibilidad con la impresora.
- **Perfil de Color sRGB**: Se aplica el perfil de color sRGB a las imágenes para mantener la consistencia del color.
- **Modificación de Metadatos**: Se ajustan los metadatos de las imágenes para cumplir con los estándares de impresión.
- **Descarga en Zip**: Las imágenes procesadas se envían al usuario en un archivo `.zip` para su fácil descarga.

## Tecnologías Utilizadas

- **Node.js y Express**: Para el servidor web y manejo de rutas.
- **Multer**: Para la carga y manejo de archivos.
- **Sharp**: Para la conversión de imágenes y ajuste de DPI.
- **exiftool-vendored**: Para la modificación de metadatos de las imágenes.
- **express-zip**: Para enviar múltiples archivos en un archivo `.zip`.

## Cómo Usar

1. **Inicio del Servidor**: Ejecute el servidor utilizando el comando `npm start`.
2. **Acceso a la Interfaz**: Abra su navegador y vaya a `http://localhost:3000`.
3. **Subida de Imágenes**: Utilice el formulario para seleccionar y subir las imágenes que desea procesar.
4. **Descarga de Imágenes**: Una vez procesadas, se le proporcionará un enlace para descargar las imágenes en un archivo `.zip`.

## Requisitos

Para ejecutar esta aplicación, necesitará tener Node.js instalado en su sistema. Además, asegúrese de instalar todas las dependencias ejecutando `npm install` en el directorio del proyecto.

## Licencia

Este proyecto está licenciado bajo la Licencia ISC.