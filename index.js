const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const exiftool = require("exiftool-vendored").exiftool;
const multer = require("multer");
const expressZip = require("express-zip");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

// Función para validar el tipo de archivo
const fileFilter = (req, file, cb) => {
  const validTypes = ["image/jpeg", "image/png", "image/gif"];
  if (validTypes.includes(file.mimetype)) {
    cb(null, true); // Aceptar el archivo
  } else {
    cb(new Error("Solo se permiten imágenes"), false); // Rechazar el archivo
  }
};

// Configuración de `multer`
const upload = multer({
  dest: "uploads/",
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limitar el tamaño del archivo a 10 MB
});

// Middleware para servir archivos estáticos desde la carpeta 'public'
app.use(express.static("public"));

const validateImage = async (filePath) => {
  try {
    await sharp(filePath).metadata();
    return true;
  } catch (err) {
    return false;
  }
};

app.post("/convertAndModifyImage", upload.array("image"), async (req, res) => {
  const filesToSend = [];
  try {
    for (const file of req.files) {
      const isValidImage = await validateImage(file.path);
      if (!isValidImage) {
        return res
          .status(400)
          .send("Uno o más archivos no son imágenes válidas");
      }

      const inputPath = path.resolve(file.path);
      const outputDir = path.dirname(inputPath);
      const outputFilename =
        path.basename(inputPath, path.extname(inputPath)) + "_converted.jpg";
      const outputPath = path.join(outputDir, outputFilename);

      // Convertir la imagen a JPEG con 72 DPI y perfil de color sRGB
      await sharp(inputPath)
        .jpeg({ quality: 100 })
        .withMetadata({
          density: 72,
          icc: "sRGB.icc",
        })
        .toFile(outputPath);

      // Modificar metadatos con exiftool
      await exiftool.write(outputPath, {
        "JFIF:Version": "1.01",
        ResolutionUnit: "inches",
        XResolution: 72,
        YResolution: 72,
        ProfileDescription: "sRGB",
        ColorComponents: 3,
        YCbCrSubSampling: "YCbCr4:2:0 (2 2)",
      });

      filesToSend.push({ path: outputPath, name: path.basename(outputPath) });
    }

    // Enviar todas las imágenes procesadas en un archivo .zip
    res.zip(filesToSend, "imagenes_procesadas.zip", async function (err) {
      if (err) {
        console.log("Error al enviar el archivo zip", err);
        return res.status(500).send("Error al enviar las imágenes");
      }

      // Esperar un corto período de tiempo antes de eliminar archivos
      setTimeout(async () => {
        // Eliminar archivos convertidos
        for (const file of filesToSend) {
          try {
            await unlinkAsync(file.path);
            console.log(`Archivo ${file.name} eliminado`);
          } catch (unlinkError) {
            console.error(`Error al eliminar ${file.path}:`, unlinkError);
          }
        }

        // Eliminar archivos subidos originales
        for (const file of req.files) {
          try {
            await unlinkAsync(file.path);
            console.log(`Archivo original ${file.filename} eliminado`);
          } catch (unlinkError) {
            console.error(`Error al eliminar ${file.path}:`, unlinkError);
          }
        }
      }, 1000);
    });
  } catch (error) {
    console.error("Error durante la conversión y modificación", error);
    res.status(500).send("Error al procesar las imágenes");
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
