const bcrypt = require("bcrypt"); // Module pour le hachage de mots de passe
const jwt = require("jsonwebtoken"); // Module pour la gestion des jetons JWT (JSON Web Tokens)
const User = require("../models/User"); // Importe le modèle de données "User" depuis un fichier local

// Fonction pour l'inscription d'un nouvel utilisateur
exports.signup = (req, res, next) => {
  // Hache le mot de passe fourni dans la requête (avec un coût de hachage de 10)
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      // Crée un nouvel utilisateur avec l'email fourni et le mot de passe haché
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      // Enregistre l'utilisateur dans la base de données
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé" }))
        .catch((error) => {
          res.status(400).json({ error });
        });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

// Fonction pour la connexion d'un utilisateur existant
exports.login = (req, res, next) => {
  // Cherche l'utilisateur dans la base de données par son email
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user === null) {
        // Si l'utilisateur n'est pas trouvé, répond avec un message d'erreur d'authentification
        res
          .status(401)
          .json({ message: "Paire identifiant/mot de passe incorrecte" });
      } else {
        // Si l'utilisateur est trouvé, compare le mot de passe fourni avec le mot de passe haché dans la base de données
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              // Si les mots de passe ne correspondent pas, répond avec un message d'erreur d'authentification
              res
                .status(401)
                .json({ message: "Paire identifiant/mot de passe incorrecte" });
            } else {
              // Si les mots de passe correspondent, génère un jeton JWT
              res.status(200).json({
                userId: user._id, // Inclut l'ID de l'utilisateur dans la réponse
                token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
                  expiresIn: "24h", // Configure l'expiration du jeton à 24 heures
                }),
              });
            }
          })
          .catch((error) => {
            res.status(500).json({ error }); // Cas d'erreur lors de la comparaison des mots de passe
          });
      }
    })
    .catch((error) => {
      res.status(500).json({ error }); // Cas d'erreur lors de la recherche de l'utilisateur
    });
};
