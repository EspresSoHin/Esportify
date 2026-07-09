#  ESPORTIFY - ECF

Plateforme de gestion de tournois esport développée dans le cadre d'un ECF (Épreuve de Certification Finale) — Titre RNCP Développeur Fullstack, option Gaming (Studi).

**Démo en ligne :**
- Frontend : [esportify-fr.onrender.com](https://esportify-fr.onrender.com)
- API : [esportify-qr3z.onrender.com](https://esportify-qr3z.onrender.com)
- Documentation API (Swagger) : [esportify-qr3z.onrender.com/docs](https://esportify-qr3z.onrender.com/docs)

> ⚠️ L'API est hébergée sur le plan gratuit de Render : après 15 minutes d'inactivité, le service se met en veille. Le premier appel peut donc prendre 20-30 secondes le temps que le serveur redémarre.

---
---

## 🛠 Stack technique

---
- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **Backend:** Python avec FastAPI, SQLAlchemy (ORM)
- **Database:** PostgreSQL (Hébergeur: Supabase)
- **Authentication:** OAuth2 with JWT tokens (python-jose) + hash bcrypt (passlib)
- **Déploiement:** Render
---

##  Installation locale

### Prérequis

- Python 3.14+
- PostgreSQL
- Compte Supabase pour gestion de BDD.


### 1. Cloner le dépôt

```bash
git clone https://github.com/EspresSoHin/Esportify.git
cd esportify
```

### 2. Installer les dépendances

```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On Linux/Mac
python3 -m venv venv
source venv/bin/activate

pip install -r requirements.txt
```

- Créez un fichier `.env` à la racine du dossier `Backend/` (voir [Variables d'environnement](#-variables-denvironnement) ci-dessous).

- Lancez le serveur :

```bash
python -m uvicorn main:app --reload
```

L'API est accessible sur `http://127.0.0.1:8000`, la documentation interactive sur `http://127.0.0.1:8000/docs`.

### 3. Frontend

Dans `fetchdata.js`, remplacez l'URL de l'API par l'URL locale :

```js
const API_URL = 'http://127.0.0.1:8000'
```

Ouvrez le dossier `Frontend/` avec Live Server (ou tout serveur statique) sur le port `5500`.

---

## 🔐 Variables d'environnement

Fichier `.env` (Backend), à ne **jamais** committer :

```env
# Base de données PostgreSQL (Supabase)
user=postgres.xxxxxxxxxx
password=ton_mot_de_passe
host=aws-0-xxxxx.pooler.supabase.com
port=5432
dbname=postgres

# JWT
SECRET_KEY=une_clé_secrète_longue_et_aléatoire
```

> Génèrez une `SECRET_KEY` solide, par exemple avec `python -c "import secrets; print(secrets.token_hex(32))"`.

---
---

## Troubleshooting

**Backend ne fonctionne pas:**
- Assurez-vous que PostgreSQL s'est lancé. 
- Vérifiez que le fichier `.env` ai une `DATABASE_URL` correcte.
- Vérifiez les dépendances installées: `pip install -r requirements.txt`

**Frontend ne se connecte pas au backend:**
- Backend devrait se lancer sur `http://127.0.0.1:8000`
- Frontend devrait se lancer sur `http://127.0.0.1:5500`
- Checkez les paramètres CORS sur `Backend/main.py`

**Echec de connexion à la BDD:**
- Vérifiez que PostgreSQL est lancé
- Checkez les credentials sur `.env`
- Assurez-vous que la database `esportifydb` existe.
- Run le schema: `psql -U postgres -d esportifydb -f Database/schema.sql`



## Auteur

Projet réalisé par **Sohin "Lamia"**, dans le cadre du Titre RNCP Développeur Fullstack — option Gaming, chez Studi.