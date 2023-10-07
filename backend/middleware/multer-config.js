const multer = require("multer"); // Module pour la gestion des fichiers téléchargés
const sharp = require("sharp"); // Module pour le redimensionnement d'images
const path = require("path"); // Module pour la gestion des chemins de fichiers
const fs = require("fs"); // Module pour la gestion des fichiers du système de fichiers

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// Configuration de la gestion des fichiers téléchargés
const storage = multer.diskStorage({
  // Destination de sauvegarde des fichiers dans le dossier "images"
  destination: (req, file, callback) => {
    callback(null, "images");
  },

  // Nom des fichiers téléchargés : nom d'origine + remplacement des espaces et des points par des underscores + ajout d'un timestamp + extension correcte
  filename: (req, file, callback) => {
    const name = file.originalname.replace(/[\s.]+/g, "_"); // Remplace les espaces et les points par des underscores
    const extension = MIME_TYPES[file.mimetype]; // Récupère l'extension de fichier appropriée en fonction du type MIME
    callback(null, name + Date.now() + "." + extension); // Nom final du fichier
  },
});

// Middleware pour la gestion des téléchargements de fichiers image uniques
module.exports = multer({ storage: storage }).single("image");

// Middleware pour le redimensionnement de l'image
module.exports.resizeImage = (req, res, next) => {
  // Vérifie si un fichier a été téléchargé dans la requête
  if (!req.file) {
    return next(); // Si aucun fichier, passe au middleware suivant
  }

  const filePath = req.file.path; // Chemin du fichier d'origine
  const fileName = req.file.filename; // Nom du fichier d'origine
  const outputFilePath = path.join("images", `resized_${fileName}`); // Chemin de sortie pour le fichier redimensionné

  sharp(filePath) // Utilise le module "sharp" pour le redimensionnement
    .resize({ width: 310, height: 445 }) // Redimensionne l'image
    .toFile(outputFilePath) // Enregistre l'image redimensionnée
    .then(() => {
      // Après le redimensionnement réussi
      // Supprime le fichier d'origine
      fs.unlink(filePath, () => {
        // Remplace le chemin du fichier original par le chemin du fichier redimensionné dans la requête
        req.file.path = outputFilePath;
        next();
      });
    })
    .catch((err) => {
      console.log(err);
      return next();
    });
};
