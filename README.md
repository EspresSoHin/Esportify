# ESPORTIFY - ECF

Plateforme de gestion de tournois esport développée dans le cadre d'un ECF (Épreuve de Certification Finale) — Titre RNCP Développeur Fullstack, option Gaming (Studi).

**Démo en ligne :**
- Frontend : [esportify-fr.onrender.com](https://esportify-fr.onrender.com)
- API : [esportify-qr3z.onrender.com](https://esportify-qr3z.onrender.com)
- Documentation API (Swagger) : [esportify-qr3z.onrender.com/docs](https://esportify-qr3z.onrender.com/docs)

> ⚠️ L'API est hébergée sur le plan gratuit de Render : après 15 minutes d'inactivité, le service se met en veille. Le premier appel peut donc prendre 20-30 secondes le temps que le serveur redémarre.

---

## 🎮 Fonctionnalités

- **Visiteur** : consulter les événements, filtrer et rechercher, voir le détail d'un tournoi.
- **Joueur** : s'inscrire à un tournoi, gérer ses favoris, suivre ses scores, proposer un événement (soumis à validation), participer au chat d'un événement.
- **Organisateur** : créer et modifier ses événements, accepter ou refuser les inscriptions, consulter ses statistiques.
- **Administrateur** : valider, refuser ou suspendre les événements, gérer les rôles des utilisateurs, modérer le chat.

---

## 🛠 Stack technique

| Couche | Technologie |
|---|---|
| Frontend | HTML, CSS, JavaScript (Vanilla) |
| Backend | Python, FastAPI, SQLAlchemy (ORM), Pydantic |
| Base relationnelle | PostgreSQL (hébergeur : Supabase) |
| Base NoSQL | MongoDB (hébergeur : Atlas), pour le chat des événements |
| Authentification | OAuth2 avec tokens JWT (python-jose), mots de passe hachés avec Argon2 (passlib) |
| Conteneurs | Docker, Docker Compose, Nginx (frontend) |
| Déploiement | Render |

---

## 🏗 Architecture

Le backend suit une architecture en couches :

**routes** (HTTP, contrôle des droits) → **services** (logique métier, erreurs) → **repositories** (accès aux données)

- **PostgreSQL** stocke les données relationnelles : utilisateurs, rôles, événements, inscriptions, favoris et scores.
- **MongoDB** stocke les messages du chat (collection `ChatMessages`) : des documents nombreux, simples et sans relations complexes, adaptés à du NoSQL.
- **Frontend** : `fetchdata.js` récupère toutes les données de l'API puis déclenche l'événement `dataReady`, qui lance l'affichage de chaque page. Le JavaScript est découpé en fichiers par responsabilité (dossier `js/`), chargés dans le bon ordre par `js/loader.js`.

---

## 🔒 Sécurité

- **Mots de passe** : hachés avec **Argon2id**, l'algorithme recommandé par l'OWASP.
- **Authentification** : JWT transmis par cookie HttpOnly et par en-tête `Authorization`.
- **Rôles** : joueur, organisateur et administrateur, vérifiés côté backend sur les routes sensibles.
- **XSS** : toutes les données affichées dans le frontend sont échappées (`escapeHTML`).
- **Chat** : liens externes et mots interdits filtrés côté serveur.
- **CORS** : liste blanche des origines autorisées.
- **Secrets** : clé JWT et identifiants des bases dans des fichiers `.env`, jamais versionnés.

---

## 📁 Structure du projet

<details>
<summary>Structure du projet</summary>

```
---Esportify/
├── .gitignore
├── Backend/
│   ├── Oauth2.py
│   ├── database.py
│   ├── main.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── events.py
│   │   ├── favoris.py
│   │   ├── inscriptions_ev.py
│   │   ├── roles.py
│   │   ├── scores.py
│   │   ├── statuts_evenement.py
│   │   ├── statuts_inscription.py
│   │   └── users.py
│   ├── mongodb.py
│   ├── repositories/
│   │   ├── __init__.py
│   │   ├── events_repository.py
│   │   ├── favoris_repository.py
│   │   ├── inscriptions_repository.py
│   │   ├── messages_repository.py
│   │   ├── roles_repository.py
│   │   ├── scores_repository.py
│   │   ├── statuts_ev_repository.py
│   │   └── users_repository.py
│   ├── requirements.txt
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── events.py
│   │   ├── favoris.py
│   │   ├── inscriptions.py
│   │   ├── messages.py
│   │   ├── roles.py
│   │   ├── scores.py
│   │   ├── statuts_evenement.py
│   │   └── users.py
│   ├── schemas.py
│   └── services/
│       ├── __init__.py
│       ├── auth_service.py
│       ├── events_service.py
│       ├── favoris_service.py
│       ├── inscriptions_service.py
│       ├── messages_service.py
│       ├── roles_service.py
│       ├── scores_service.py
│       ├── statuts_ev_service.py
│       └── users_service.py
├── Database/
│   └── schema.sql
├── Docker/
│   ├── backend/
│   │   └── Dockerfile
│   ├── docker-compose.yml
│   └── postgres/
│       └── 02-search-path.sql
├── Frontend/
│   ├── Assets/
│   ├── connexion.html
│   ├── css/
│   │   ├── connexion.css
│   │   ├── dashboards.css
│   │   ├── events.css
│   │   ├── global.css
│   │   ├── home.css
│   │   ├── joueur.css
│   │   └── main.css
│   ├── dashboard-admin.html
│   ├── dashboard-organisateur.html
│   ├── espace-joueur.html
│   ├── event-detail.html
│   ├── events.html
│   ├── index.html
│   ├── js/
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── data.js
│   │   ├── events.js
│   │   ├── fetchdata.js
│   │   ├── joueur.js
│   │   ├── main.js
│   │   ├── orga.js
│   │   ├── profile.js
│   │   ├── ui.js
│   │   └── utils.js
│   ├── script.js
│   └── style.css
└── README.md

```

</details>

## 🐳 Lancer le projet avec Docker

### Prérequis

- Docker Desktop

### Démarrage

1. Créez le fichier `Docker/.env` (à ne **jamais** committer) :

```env
SECRET_KEY=une_clé_secrète_longue_et_aléatoire
POSTGRES_USER=postgres
POSTGRES_PASSWORD=ton_mot_de_passe
```

2. Lancez la stack depuis le dossier `Infrastructure/` :

```bash
cd Docker
docker compose up --build
```

| Service | Adresse |
|---|---|
| Frontend (Nginx) | http://localhost:5500 |
| API (FastAPI) | http://localhost:8000 |
| Documentation API | http://localhost:8000/docs |

La stack contient PostgreSQL, MongoDB, le backend et le frontend.

- Le fichier `schema.sql` n'est exécuté qu'au **premier démarrage** de PostgreSQL.
- Arrêter la stack : `docker compose down` (ajoutez `-v` pour supprimer aussi les données).
- Après une modification du code backend ou de `requirements.txt` : `docker compose up --build`.

---

## 💻 Installation locale (sans Docker)

### Prérequis

- Python 3.13+
- Un compte Supabase (PostgreSQL) et un cluster MongoDB Atlas, ou des instances locales

### 1. Cloner le dépôt

```bash
git clone https://github.com/EspresSoHin/Esportify.git
cd Esportify
```

### 2. Installer les dépendances

```bash
cd Backend

# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt
```

Créez un fichier `.env` dans `Backend/` (voir [Variables d'environnement](#-variables-denvironnement)), puis lancez le serveur :

```bash
python -m uvicorn main:app --reload
```

L'API est accessible sur `http://127.0.0.1:8000`, la documentation interactive sur `http://127.0.0.1:8000/docs`.

### 3. Frontend

Dans `fetchdata.js`, remplacez l'URL de l'API par l'URL locale :

```js
const API_URL = 'http://127.0.0.1:8000'
```

Ouvrez le dossier du frontend avec Live Server (ou tout serveur statique) sur le port `5500`.

---

## 🔐 Variables d'environnement

Fichier `Backend/.env`, à ne **jamais** committer :

```env
# Base de données PostgreSQL (Supabase)
user=postgres.xxxxxxxxxx
password=ton_mot_de_passe
host=aws-0-xxxxx.pooler.supabase.com
port=5432
dbname=postgres

# MongoDB Atlas (chat)
MONGO_USER=ton_utilisateur
MONGO_PASSWORD=ton_mot_de_passe
MONGO_HOST=ton_cluster.mongodb.net
MONGO_DB=EsportifyChat   # optionnel, valeur par défaut : EsportifyChat

# JWT
SECRET_KEY=une_clé_secrète_longue_et_aléatoire
```

> Générez une `SECRET_KEY` solide, par exemple avec `python -c "import secrets; print(secrets.token_hex(32))"`.

---

## 🩹 Troubleshooting

**Le backend ne démarre pas :**
- Vérifiez que le fichier `.env` contient toutes les variables (PostgreSQL, MongoDB, `SECRET_KEY`).
- Vérifiez les dépendances : `pip install -r requirements.txt`

**Le frontend ne se connecte pas au backend :**
- Le backend doit tourner sur `http://127.0.0.1:8000` et le frontend sur le port `5500`.
- Vérifiez `API_URL` dans `fetchdata.js`.
- Vérifiez les origines autorisées (CORS) dans `Backend/main.py`, sans slash final.

**Échec de connexion à la base PostgreSQL :**
- Vérifiez les identifiants dans le `.env`.
- Assurez-vous que le schéma `esportifydb` existe. Pour le créer : `psql -U postgres -d postgres -f Database/schema.sql`

**Erreur à la connexion (`hash could not be identified`) :**
- Les mots de passe doivent être hachés en Argon2 (valeur commençant par `$argon2id$`). Un ancien hash bcrypt n'est plus accepté.

**Le chat ne charge pas :**
- Vérifiez les identifiants MongoDB et l'accès réseau (liste d'adresses IP autorisées) dans Atlas.

---

## 👤 Auteur

Projet réalisé par **Sohin "Lamia"**, dans le cadre du Titre RNCP Développeur Fullstack — option Gaming, chez Studi.