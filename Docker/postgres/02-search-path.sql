-- Les modèles SQLAlchemy n'indiquent pas de schéma : on fait pointer la base sur esportifydb
ALTER DATABASE esportify SET search_path TO esportifydb, public;
