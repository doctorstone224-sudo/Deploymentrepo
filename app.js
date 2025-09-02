document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    // REMPLACEZ CES VALEURS PAR LES VÔTRES
    const JSONBIN_API_KEY = 'METTRE_VOTRE_CLE_API_SECRETE_JSONBIN_ICI'; // Votre clé API secrète de jsonbin.io
    const JSONBIN_BIN_ID = 'METTRE_VOTRE_ID_DE_BIN_ICI'; // L'ID de votre "bin" sur jsonbin.io
    const ADMIN_PASSWORD = 'admin'; // Choisissez un mot de passe plus sécurisé

    // --- ROUTEUR SIMPLE ---
    // Exécute le code approprié en fonction de la page actuelle
    const page = window.location.pathname.split('/').pop();

    if (page === 'index.html' || page === '') {
        initBlogPage();
    } else if (page === 'admin.html') {
        initAdminPage();
    }

    // --- LOGIQUE POUR LA PAGE DU BLOG (index.html) ---
    function initBlogPage() {
        const postsContainer = document.getElementById('posts-container');
        if (postsContainer) {
            fetchPosts();
        }
    }

    async function fetchPosts() {
        if (JSONBIN_API_KEY === 'METTRE_VOTRE_CLE_API_SECRETE_JSONBIN_ICI' || JSONBIN_BIN_ID === 'METTRE_VOTRE_ID_DE_BIN_ICI') {
            displaySetupMessage();
            return;
        }

        try {
            const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
                headers: { 'X-Master-Key': JSONBIN_API_KEY }
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            const posts = data.record || [];
            displayPosts(posts);
        } catch (error) {
            console.error("Erreur lors de la récupération des articles :", error);
            displayErrorMessage("Impossible de charger les articles. Vérifiez la console pour plus de détails.");
        }
    }

    function displayPosts(posts) {
        const postsContainer = document.getElementById('posts-container');
        postsContainer.innerHTML = ''; // Vider le conteneur

        if (posts.length === 0) {
            postsContainer.innerHTML = '<p>Aucun article pour le moment. Revenez plus tard !</p>';
            return;
        }

        // Afficher les articles du plus récent au plus ancien
        posts.slice().reverse().forEach(post => {
            const postElement = document.createElement('article');
            postElement.className = 'post';
            postElement.innerHTML = `
                <h2>${escapeHTML(post.title)}</h2>
                <p class="post-meta">Publié le ${new Date(post.date).toLocaleDateString('fr-FR')}</p>
                <div>${escapeHTML(post.content).substring(0, 200)}...</div>
            `;
            postsContainer.appendChild(postElement);
        });
    }

    function displaySetupMessage() {
        const postsContainer = document.getElementById('posts-container');
        postsContainer.innerHTML = `
            <div class="post">
                <h2>Configuration requise</h2>
                <p>Bienvenue sur votre nouveau blog !</p>
                <p>Pour que le blog fonctionne, vous devez configurer quelques éléments :</p>
                <ol>
                    <li>Créez un compte gratuit sur <a href="https://jsonbin.io/" target="_blank">jsonbin.io</a>.</li>
                    <li>Créez une nouvelle "API Key" secrète.</li>
                    <li>Créez un nouveau "bin" JSON privé.</li>
                    <li>Ouvrez le fichier <code>app.js</code> et remplacez les valeurs de <code>JSONBIN_API_KEY</code> et <code>JSONBIN_BIN_ID</code> par les vôtres.</li>
                </ol>
            </div>
        `;
    }

    function displayErrorMessage(message) {
        const postsContainer = document.getElementById('posts-container');
        postsContainer.innerHTML = `<p style="color: red;">${message}</p>`;
    }


    // --- LOGIQUE POUR LA PAGE ADMIN (admin.html) ---
    function initAdminPage() {
        const loginForm = document.getElementById('login-form');
        const postForm = document.getElementById('post-form');

        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }
        if (postForm) {
            postForm.addEventListener('submit', handlePostCreation);
        }
    }

    function handleLogin(event) {
        event.preventDefault();
        const passwordInput = document.getElementById('password');
        if (passwordInput.value === ADMIN_PASSWORD) {
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('admin-content').style.display = 'block';
        } else {
            alert('Mot de passe incorrect !');
        }
    }

    async function handlePostCreation(event) {
        event.preventDefault();

        if (JSONBIN_API_KEY === 'METTRE_VOTRE_CLE_API_SECRETE_JSONBIN_ICI' || JSONBIN_BIN_ID === 'METTRE_VOTRE_ID_DE_BIN_ICI') {
            alert("Erreur : Veuillez configurer votre clé API et votre Bin ID dans app.js avant de poster.");
            return;
        }

        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;

        const newPost = {
            title,
            content,
            date: new Date().toISOString()
        };

        try {
            // 1. Récupérer les articles existants
            const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`, {
                headers: { 'X-Master-Key': JSONBIN_API_KEY }
            });
            // Si le bin est vide, jsonbin peut retourner une 404, ce qui est normal.
            let posts = [];
            if (response.ok) {
                 const data = await response.json();
                 posts = data.record || [];
            }

            // 2. Ajouter le nouvel article
            posts.push(newPost);

            // 3. Mettre à jour le bin avec la nouvelle liste d'articles
            const updateResponse = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': JSONBIN_API_KEY
                },
                body: JSON.stringify(posts)
            });

            if (!updateResponse.ok) throw new Error(`HTTP error! status: ${updateResponse.status}`);

            alert('Article enregistré avec succès !');
            document.getElementById('post-form').reset();

        } catch (error) {
            console.error("Erreur lors de l'enregistrement de l'article :", error);
            alert("Une erreur est survenue. Vérifiez la console pour les détails.");
        }
    }

    // --- UTILITAIRES ---
    function escapeHTML(str) {
        const p = document.createElement('p');
        p.appendChild(document.createTextNode(str));
        return p.innerHTML;
    }
});
