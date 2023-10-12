# OC_projet-7_vieux-grimoire

Ceci est le projet 7 du parcours developpeur web d'OpenClassrooms. Voici comment vous pouvez le configurer et le faire fonctionner sur votre propre machine.

## Installation

1. Clonez ce référentiel sur votre machine :

    ```bash
    git clone https://github.com/Nyttho/OC_projet-7_vieux-grimoire.git
    ```

2. Installez les dépendances du front-end :

    ```bash
    cd frontend
    npm install
    ```

3. Installez les dépendances du back-end :

    ```bash
    cd backend
    npm install
    ```

## Configuration de la base de données MongoDB Atlas

1. Assurez-vous d'avoir un compte MongoDB Atlas. Si vous n'en avez pas, créez-en un sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

2. Créez un cluster MongoDB Atlas, suivez les instructions pour configurer votre cluster.

3. Autorisez les connexions à partir de tous les appareils en configurant MongoDB Atlas. Pour ce faire, suivez les étapes suivantes :

    - Connectez-vous à votre compte MongoDB Atlas.
    - Accédez à votre cluster.
    - Dans le tableau de bord, cliquez sur "Database Access" dans le volet de gauche.
    - Modifiez ou ajoutez un utilisateur et assurez-vous que l'option "Allow access from anywhere" est activée.

4. Obtenez le lien de connexion à votre base de données MongoDB Atlas.

5. Dans le dossier `backend`, ouvrez le fichier `app.js` et remplacez la ligne suivante par le lien de connexion à votre cluster MongoDB Atlas :

    ```javascript
    mongoose.connect('MONGODB_ATLAS_CONNECTION_STRING', { useNewUrlParser: true, useUnifiedTopology: true });
    ```

    Remplacez `'MONGODB_ATLAS_CONNECTION_STRING'` par votre propre lien de connexion.

## Exécution de l'application

1. Dans le dossier `frontend`, lancez l'application front-end en utilisant la commande :

    ```bash
    npm start
    ```

   L'application front-end sera accessible dans votre navigateur à l'adresse `http://localhost:3000`.

2. Dans le dossier `backend`, lancez le serveur back-end avec nodemon en utilisant la commande :

    ```bash
    nodemon server
    ```

   Le serveur back-end sera accessible à l'adresse `http://localhost:4000`.

L'application est maintenant configurée et en cours d'exécution sur votre machine. Profitez de votre exploration !

Si vous avez des questions ou des problèmes, n'hésitez pas à ouvrir une issue sur ce référentiel.

**Remarque :** Assurez-vous d'avoir Node.js et npm installés sur votre machine avant de suivre ces instructions.

