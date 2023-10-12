const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); // Middleware pour analyser les données JSON dans les requêtes
const path = require("path"); // Module pour gérer les chemins de fichiers

const config = require("./utils/config");

// Création d'une instance de l'application Express
const app = express();

// Utilisation du middleware body-parser pour analyser les données JSON dans les requêtes
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Importation des routes pour les livres et les utilisateurs
const bookRoutes = require("./routes/books");
const userRoutes = require("./routes/user");

// Connexion à la base de données MongoDB en utilisant Mongoose
mongoose
  .connect(
    `mongodb+srv://${config.user}:${config.password}@cluster0.4psofar.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Middleware pour gérer les en-têtes CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Permet l'accès depuis n'importe quelle origine
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  ); // Définit les en-têtes HTTP autorisés dans les requêtes
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  ); // Définit les méthodes HTTP autorisées dans les requêtes
  next();
});

// Utilisation des routes pour les livres et les utilisateurs
app.use("/api/books", bookRoutes);
app.use("/api/auth", userRoutes);

// Définition d'un répertoire statique pour servir des fichiers d'images
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
