
-- -----------------------------------------------------
-- Schema esportifydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS esportifydb;
SET search_path TO esportifydb;

-- -----------------------------------------------------
-- Table `esportifydb`.`ROLES`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS esportifydb.ROLES (
  ID SERIAL PRIMARY KEY,
  Nom VARCHAR(45) NOT NULL UNIQUE
);

INSERT INTO esportifydb.ROLES (Nom) 
VALUES ('Joueur'), ('Admin'), ('Organisateur');


-- -----------------------------------------------------
-- Table esportifydb.USERS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS esportifydb.USERS (
  ID SERIAL PRIMARY KEY,
  pseudo VARCHAR(45) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL, --hashed
  email VARCHAR(255) NOT NULL UNIQUE,
  ID_role INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL,
  CONSTRAINT fk_USERS_ROLES FOREIGN KEY (ID_role) REFERENCES ROLES(ID)
);


-- -----------------------------------------------------
-- Table esportifydb.STATUTS_INSCRIPTION
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS esportifydb.STATUTS_INSCRIPTION (
  ID SERIAL PRIMARY KEY,
  nom VARCHAR(45) NOT NULL UNIQUE
);

INSERT INTO esportifydb.STATUTS_INSCRIPTION (nom)
VALUES ('en_attente'), ('validé'), ('refusé');



-- -----------------------------------------------------
-- Table esportifydb.STATUTS_EVENEMENT
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS esportifydb.STATUTS_EVENEMENT (
  ID SERIAL PRIMARY KEY,
  nom VARCHAR(45) NOT NULL UNIQUE
);

INSERT INTO esportifydb.STATUTS_EVENEMENT (nom)
VALUES ('en cours'), ('validé'), ('en attente'), ('suspendu'), ('refusé');



-- -----------------------------------------------------
-- Table esportifydb.EVENTS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS esportifydb.EVENTS (
  ID SERIAL PRIMARY KEY,
  titre VARCHAR(45) NOT NULL,
  description VARCHAR(200) NOT NULL,
  nb_joueurs_max INT NOT NULL CHECK (nb_joueurs_max > 1),
  date_debut TIMESTAMP NOT NULL,
  date_fin TIMESTAMP NOT NULL,
  visible BOOLEAN NOT NULL DEFAULT FALSE,
  discussion_active BOOLEAN NOT NULL DEFAULT TRUE,
  image_url VARCHAR(100) NULL,
  ID_organisateur INT NOT NULL,
  ID_statut INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL,
  CONSTRAINT check_dates CHECK (date_fin > date_debut),
  CONSTRAINT fk_EVENTS_organisateur
    FOREIGN KEY (ID_organisateur) REFERENCES USERS (ID),
  CONSTRAINT fk_EVENTS_statut
    FOREIGN KEY (ID_statut) REFERENCES STATUTS_EVENEMENT (ID)
);



-- -----------------------------------------------------
-- Table esportifydb.INSCRIPTIONS_EV
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS esportifydb.INSCRIPTIONS_EV (
  ID SERIAL PRIMARY KEY,
  ID_utilisateur INT NOT NULL,
  ID_evenement INT NOT NULL,
  date_inscription TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ID_statut_inscription INT NOT NULL DEFAULT 1,
  UNIQUE (ID_utilisateur, ID_evenement),  -- un user ne peut s'inscrire qu'une fois au même event
  CONSTRAINT fk_INSCRIPTIONS_EV_USERS
    FOREIGN KEY (ID_utilisateur) REFERENCES USERS (ID),
  CONSTRAINT fk_INSCRIPTIONS_EV_EVENTS
    FOREIGN KEY (ID_evenement) REFERENCES EVENTS (ID),
  CONSTRAINT fk_STATUTS_INSCRIPTION
    FOREIGN KEY (ID_statut_inscription) REFERENCES STATUTS_INSCRIPTION (ID)
); 


-- -----------------------------------------------------
-- Table esportifydb.FAVORIS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS esportifydb.FAVORIS (
  ID SERIAL PRIMARY KEY,
  ID_evenement INT NOT NULL,
  ID_utilisateur INT NOT NULL,
  UNIQUE (ID_evenement, ID_utilisateur), -- un user ne peut ajouter qu'une fois le même event à ses favoris
  CONSTRAINT fk_FAVORIS_EVENTS
    FOREIGN KEY (ID_evenement) REFERENCES EVENTS (ID),
  CONSTRAINT fk_FAVORIS_USERS
    FOREIGN KEY (ID_utilisateur) REFERENCES USERS (ID)
);


-- -----------------------------------------------------
-- Table esportifydb.SCORES
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS esportifydb.SCORES (
  ID SERIAL PRIMARY KEY,
  ID_utilisateur INT NOT NULL,
  ID_evenement INT NOT NULL,
  position INT NOT NULL CHECK (position > 0),
  points INT NOT NULL DEFAULT 0,
  resultat VARCHAR(45) NULL,
  date_score DATE NOT NULL DEFAULT CURRENT_DATE,
  CONSTRAINT fk_SCORES_USERS
    FOREIGN KEY (ID_utilisateur) REFERENCES USERS (ID),
  CONSTRAINT fk_SCORES_EVENTS
    FOREIGN KEY (ID_evenement) REFERENCES EVENTS (ID)
);



