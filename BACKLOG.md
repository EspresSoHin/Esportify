# Backlog — Split models.py → models/

Tentative de refactorisation du fichier `models.py` monolithique en package
`models/` (un fichier par classe SQLAlchemy).

## Statut : abandonné (pour l'instant)

Le split en lui-même fonctionnait au niveau de l'import, 
mais une fois les classes séparées, impossible de diagnostiquer le 
problème (certaines routes fonctionnent, d'autres non.

Cette branche est conservée pour référence / reprise éventuelle, mais le
travail en cours (architecture en couches controller/service/repository)
repart de `models.py` tel quel pour rester focus sur l'objectif principal
de l'ECF.
