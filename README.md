# Mon Journal d'Actualités

Bienvenue sur votre nouveau blog ! Ce projet est un journal d'actualités simple et statique qui utilise [jsonbin.io](https://jsonbin.io) pour stocker les articles de blog.

## Comment configurer le blog

Pour que le blog fonctionne, vous devez suivre ces étapes :

1.  **Créez un compte sur jsonbin.io**
    *   Allez sur [jsonbin.io](https://jsonbin.io) et créez un compte gratuit.

2.  **Obtenez votre clé API (API Key)**
    *   Une fois connecté, allez dans la section "API Keys" de votre tableau de bord.
    *   Créez une nouvelle clé API secrète (`X-Master-Key`). Copiez cette clé.

3.  **Créez un "Bin" pour stocker vos articles**
    *   Allez dans la section "JSON Store" et créez un nouveau "bin" JSON.
    *   Donnez-lui un nom (par exemple, "blog-posts").
    *   Assurez-vous qu'il est "Private" (privé).
    *   Une fois créé, copiez l'ID du bin depuis l'URL (par exemple, `https://jsonbin.io/b/VOTRE_BIN_ID`).

4.  **Configurez le fichier `app.js`**
    *   Ouvrez le fichier `app.js` dans un éditeur de texte.
    *   Trouvez la section `--- CONFIGURATION ---` au début du fichier.
    *   Remplacez `'METTRE_VOTRE_CLE_API_SECRETE_JSONBIN_ICI'` par votre clé API secrète.
    *   Remplacez `'METTRE_VOTRE_ID_DE_BIN_ICI'` par l'ID de votre bin.

5.  **Changez votre mot de passe administrateur**
    *   Dans le même fichier `app.js`, changez la valeur de `ADMIN_PASSWORD` (qui est `'admin'` par défaut) par un mot de passe de votre choix.

## Comment utiliser le blog

*   **Pour lire les articles :** Ouvrez le fichier `index.html` dans votre navigateur.
*   **Pour écrire un nouvel article :** Ouvrez le fichier `admin.html`, entrez votre mot de passe, et utilisez le formulaire pour créer et enregistrer un nouvel article.
