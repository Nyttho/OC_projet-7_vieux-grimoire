// Importation du module HTTP
const http = require("http");

// Importation du module "app" depuis un fichier local
const app = require("./app");

// Fonction pour normaliser le port sur lequel le serveur écoutera
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

// Récupération du port à partir de la variable d'environnement "process.env.PORT" ou utilisation du port 4000 par défaut
const port = normalizePort(process.env.PORT || "4000");

// Configuration de l'application pour utiliser le port défini
app.set("port", port);

// Gestionnaire d'erreurs pour le serveur
const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Création du serveur HTTP en utilisant l'application
const server = http.createServer(app);

// Gestionnaire d'erreur pour le serveur
server.on("error", errorHandler);

// Événement déclenché lorsque le serveur écoute sur un port
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

// Écoute du serveur sur le port spécifié
server.listen(port);
