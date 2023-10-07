const jwt = require("jsonwebtoken");

// Middleware d'authentification
module.exports = (req, res, next) => {
  try {
    // Récupère le jeton JWT depuis l'en-tête Authorization
    const token = req.headers.authorization.split(" ")[1];
    // Vérifie et décode le jeton JWT en utilisant la clé secrète
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    // Extrait l'ID de l'utilisateur à partir du jeton décodé
    const userId = decodedToken.userId;
    // Ajoute l'ID de l'utilisateur à l'objet "auth" dans la requête pour être utilisé ultérieurement
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
