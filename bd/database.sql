-- Nos cambiamos a la base de datos
\c postgres

-- Borramos la base de datos si existe
DROP DATABASE IF EXISTS examen;

-- Creamos la base de datos si existe
CREATE DATABASE examen;

-- Nos cambiamos a la base de datos
\c examen

-- Creamos las tablas necesaroas
CREATE TABLE usuarios(
    usuario_id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(50) NOT NULL,
    apellido_materno VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Creamos la tabla de productos
CREATE TABLE productos(
    producto_id INT NOT NULL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    price FLOAT NOT NULL,
    brand VARCHAR(50),
    category VARCHAR(100) NOT NULL,
    isactive BOOLEAN DEFAULT true NOT NULL
);

-- Creamos tabla de historico de productos
CREATE TABLE producto_historico(
    producto_historico_id INT NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    price FLOAT NOT NULL,
    brand VARCHAR(50),
    category VARCHAR(100) NOT NULL,
    fecha_ingreso TIMESTAMP NOT NULL,
    producto_id INT NOT NULL,
    isactive BOOLEAN DEFAULT true
);

-- Creamos las restricciones de llaves foraneas
ALTER TABLE producto_historico ADD CONSTRAINT fk_producto_historico 
FOREIGN KEY ( producto_id ) REFERENCES productos( producto_id );

-- Ingresamos un usuario de prueba y hacemos uso de la función nativa MD5 de postgres
INSERT INTO usuarios( username, nombre, apellido_paterno, apellido_materno, password )
VALUES ('s2credit', 'Juan Carlos', 'Salazar', 'Santiago', MD5( 's2credit' || 'Juan' )  );