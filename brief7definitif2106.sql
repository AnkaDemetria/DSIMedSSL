CREATE DATABASE IF NOT EXISTS dsimed;
USE dsimed;
CREATE TABLE IF NOT EXISTS `medias` (
	id_medias INT AUTO_INCREMENT NOT NULL,
	reference_media VARCHAR(25) NOT NULL,
	url VARCHAR(255),
	PRIMARY KEY (`id_medias`)
	);
     
CREATE TABLE IF NOT EXISTS `users` (
	id_users INT AUTO_INCREMENT NOT NULL,
    nom varchar(50) NOT NULL,
    prenom varchar(50) NOT NULL,
    mot_de_passe varchar(255) NOT NULL,
    mail varchar(255) UNIQUE NOT NULL,
    roles  BOOLEAN NOT NULL,
    PRIMARY KEY (`id_users`)
	);
CREATE TABLE IF NOT EXISTS `articles`  (
	id_articles INT AUTO_INCREMENT NOT NULL,
    titre varchar(25),
    content text,
    date_publication timestamp not null,
    id_users INT not null,
    id_medias INT not null,
    CONSTRAINT fk_id_users FOREIGN KEY (id_users) REFERENCES users(id_users),
    CONSTRAINT fk_id_medias FOREIGN KEY (id_medias) REFERENCES medias(id_medias),
    PRIMARY KEY (`id_articles`)
	);    




