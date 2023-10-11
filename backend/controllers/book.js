const Book = require("../models/Book");
const average = require("../fonctions/average");
const fs = require("fs"); // Module pour gérer les fichiers du système de fichiers

// Fonction pour créer un nouveau livre
exports.createBook = (req, res, next) => {
  // Analyse les données JSON de la requête
  const bookObject = JSON.parse(req.body.book);
  // Supprime les propriétés "_id" et "_userId" de l'objet du livre
  delete bookObject._id;
  delete bookObject._userId;
  // Crée une nouvelle instance de "Book" avec les données de la requête
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId, // Affecte l'ID de l'utilisateur authentifié au champ "userId"
    imageUrl: `${req.protocol}://${req.get("host")}/images/resized_${
      req.file.filename
    }`, // Construit l'URL de l'image du livre
    averageRating: bookObject.ratings[0].grade, // Calcule la note moyenne à partir de la première évaluation
  });
  // Enregistre le livre dans la base de données
  book
    .save()
    .then(() => {
      res.status(201).json({ message: "Livre enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// Fonction pour modifier un livre existant
exports.modifyBook = (req, res, next) => {
  // Vérifie si la requête contient un fichier (image) à mettre à jour
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/resized_${
          req.file.filename
        }`,
      }
    : { ...req.body };

  // Supprime la propriété "_userId" de l'objet du livre
  delete bookObject._userId;

  // Cherche le livre dans la base de données par son ID
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        // Vérifie si l'utilisateur authentifié n'a pas le droit de modifier ce livre
        res.status(403).json({ message: "403: unauthorized request" });
      } else {
        // Récupère le nom du fichier de l'ancienne image
        const filename = book.imageUrl.split("/images/")[1];

        // Si une nouvelle image est fournie, supprime l'ancienne image du système de fichiers
        req.file &&
          fs.unlink(`images/${filename}`, (err) => {
            if (err) {
              return res.status(500).json({ error });
            } // Gère les erreurs de suppression
          });

        // Met à jour le livre dans la base de données
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Objet modifié !" }))
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
};

// Fonction pour supprimer un livre
exports.deleteBook = (req, res, next) => {
  // Cherche le livre dans la base de données par son ID
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        // Vérifie si l'utilisateur authentifié a le droit de supprimer ce livre
        res.status(401).json({ message: "Non authorisé !" });
      } else {
        // Supprime le fichier image associé au livre
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          // Supprime le livre de la base de données
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Livre supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

// Fonction pour obtenir les détails d'un livre spécifique
exports.getOneBook = (req, res, next) => {
  // Cherche le livre dans la base de données par son ID
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

// Fonction pour obtenir la liste de tous les livres
exports.getAllBooks = (req, res, next) => {
  // Récupère tous les livres de la base de données
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

// Fonction pour créer une nouvelle évaluation pour un livre
exports.createRating = (req, res, next) => {
  // Vérifie si la note est valide (entre 0 et 5)
  if (0 <= req.body.rating <= 5) {
    // Crée un nouvel objet d'évaluation à partir des données de la requête
    const ratingObject = { ...req.body, grade: req.body.rating };
    // Supprime la propriété "_id" de l'objet d'évaluation
    delete ratingObject._id;

    // Cherche le livre dans la base de données par son ID
    Book.findOne({ _id: req.params.id })
      .then((book) => {
        const newRatings = book.ratings;
        const userIdArray = newRatings.map((rating) => rating.userId);

        // Vérifie si l'utilisateur authentifié a déjà évalué ce livre
        if (userIdArray.includes(req.auth.userId)) {
          res.status(403).json({ message: "Non authorisé !" });
        } else {
          // Ajoute la nouvelle évaluation à la liste d'évaluations du livre
          newRatings.push(ratingObject);
          // Calcule la nouvelle note moyenne
          const grades = newRatings.map((rating) => rating.grade);
          const averageGrades = average.average(grades);
          book.averageRating = averageGrades;

          // Met à jour le livre dans la base de données avec les nouvelles évaluations et la nouvelle note moyenne
          Book.updateOne(
            { _id: req.params.id },
            {
              ratings: newRatings,
              averageRating: averageGrades,
              _id: req.params.id,
            }
          )
            .then(() => {
              res.status(201).json();
            })
            .catch((error) => {
              res.status(400).json({ error });
            });
          res.status(200).json(book);
        }
      })
      .catch((error) => {
        res.status(404).json({ error });
      });
  } else {
    res
      .status(400)
      .json({ message: "La note doit être comprise entre 1 et 5" });
  }
};

// Fonction pour obtenir les trois meilleurs livres classés par note moyenne décroissante
exports.getBestRating = (req, res, next) => {
  // Récupère tous les livres, les trie par note moyenne décroissante et limite le résultat à trois livres
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(404).json({ error }));
};
