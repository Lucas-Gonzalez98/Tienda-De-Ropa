USE tienda_ropa;
INSERT INTO `usuario` (`id`, `eliminado`, `email`, `firebase_uid`, `rol`) VALUES
(1, b'0', 'mln204manutup@gmail.com', 'FpoIGLW9l7gSd9C7TPvooVntjjz1', 'ADMINISTRADOR'),
(2, b'0', 'juan@hotmail.com', 'bie51gBEHggP4OhUKKSXEsUnqXJ3', 'CLIENTE');

-- Insertar país Argentina
INSERT INTO pais (eliminado, nombre) VALUES (0, 'Argentina');

-- Obtener el ID del país insertado (Argentina)
SET @pais_id = LAST_INSERT_ID();

-- Insertar provincias (incluyendo CABA)
INSERT INTO provincia (eliminado, nombre, id_pais) VALUES
(0, 'Buenos Aires', @pais_id),
(0, 'Catamarca', @pais_id),
(0, 'Chaco', @pais_id),
(0, 'Chubut', @pais_id),
(0, 'Córdoba', @pais_id),
(0, 'Corrientes', @pais_id),
(0, 'Entre Ríos', @pais_id),
(0, 'Formosa', @pais_id),
(0, 'Jujuy', @pais_id),
(0, 'La Pampa', @pais_id),
(0, 'La Rioja', @pais_id),
(0, 'Mendoza', @pais_id),
(0, 'Misiones', @pais_id),
(0, 'Neuquén', @pais_id),
(0, 'Río Negro', @pais_id),
(0, 'Salta', @pais_id),
(0, 'San Juan', @pais_id),
(0, 'San Luis', @pais_id),
(0, 'Santa Cruz', @pais_id),
(0, 'Santa Fe', @pais_id),
(0, 'Santiago del Estero', @pais_id),
(0, 'Tierra del Fuego', @pais_id),
(0, 'Tucumán', @pais_id),
(0, 'Ciudad Autónoma de Buenos Aires', @pais_id);

-- Obtener ID de la provincia Mendoza
SELECT id INTO @provincia_mendoza_id FROM provincia WHERE nombre = 'Mendoza';

-- Insertar localidades de Mendoza (completo)
INSERT INTO localidad (eliminado, nombre, provincia_id) VALUES
(0, 'Ciudad de Mendoza', @provincia_mendoza_id),
(0, 'Godoy Cruz', @provincia_mendoza_id),
(0, 'Guaymallén', @provincia_mendoza_id),
(0, 'Luján de Cuyo', @provincia_mendoza_id),
(0, 'Maipú', @provincia_mendoza_id),
(0, 'San Martín', @provincia_mendoza_id),
(0, 'Las Heras', @provincia_mendoza_id),
(0, 'San Rafael', @provincia_mendoza_id),
(0, 'General Alvear', @provincia_mendoza_id),
(0, 'Malargüe', @provincia_mendoza_id),
(0, 'Rivadavia', @provincia_mendoza_id),
(0, 'Tunuyán', @provincia_mendoza_id),
(0, 'Tupungato', @provincia_mendoza_id),
(0, 'San Carlos', @provincia_mendoza_id),
(0, 'Lavalle', @provincia_mendoza_id),
(0, 'Santa Rosa', @provincia_mendoza_id),
(0, 'La Paz', @provincia_mendoza_id),
(0, 'Junín', @provincia_mendoza_id);


-- Obtener ID de una localidad para el domicilio
SELECT id INTO @localidad_id FROM localidad WHERE nombre = 'Ciudad de Mendoza';

-- Insertar un domicilio falso
INSERT INTO domicilio (eliminado, calle, codigo_postal, numero, referencia, localidad_id)
VALUES (0, 'Av. San Martín', 5500, '1234', 'Frente a la plaza central', @localidad_id);

-- Insertar un número de teléfono falso
INSERT INTO telefono (eliminado, numero) VALUES (0, '+54 261 555-1234');

insert  into `administrador`(`id`,`eliminado`,`apellido`,`nombre`,`id_domicilio`,`id_telefono`,`id_usuario`) values (1,'\0','Rodriguez','Manuel',1,1,1);


