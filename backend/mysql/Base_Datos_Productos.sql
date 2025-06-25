CREATE DATABASE examen2_movil;

USE examen2_movil;

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT TRUE, -- TRUE para Disponible, FALSE para No disponible
    categoria VARCHAR(100),
    url_fotografia VARCHAR(255)
);
