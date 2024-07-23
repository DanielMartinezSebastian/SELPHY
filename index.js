const sharp = require("sharp");
const { exiftool } = require("exiftool-vendored");
const path = require("path");

const inputPath = path.join(__dirname, "imagen.jpg");
const outputPath = inputPath.replace(".jpg", "_converted.jpg");

async function convertAndModifyImage() {
  try {
    // Convertir la imagen a JPEG con 72 DPI y perfil de color sRGB
    await sharp(inputPath)
      .jpeg({ quality: 100 })
      .withMetadata({
        density: 72,
        icc: "canon.icc",
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
      // Agregar otros campos de metadatos si es necesario
    });

    console.log("Conversión y modificación completadas con éxito");
  } catch (error) {
    console.error("Error durante la conversión y modificación", error);
  }
}

convertAndModifyImage();
