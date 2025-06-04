USE tienda_ropa;

-- =========================
-- Tabla: pais
-- =========================
INSERT INTO `pais` (`id`, `eliminado`, `nombre`) VALUES
(1, b'0', 'Argentina');

-- =========================
-- Tabla: provincia
-- =========================
INSERT INTO `provincia` (`id`, `eliminado`, `nombre`, `id_pais`) VALUES
(1, b'0', 'Buenos Aires', 1),
(2, b'0', 'Catamarca', 1),
(3, b'0', 'Chaco', 1),
(4, b'0', 'Chubut', 1),
(5, b'0', 'Córdoba', 1),
(6, b'0', 'Corrientes', 1),
(7, b'0', 'Entre Ríos', 1),
(8, b'0', 'Formosa', 1),
(9, b'0', 'Jujuy', 1),
(10, b'0', 'La Pampa', 1),
(11, b'0', 'La Rioja', 1),
(12, b'0', 'Mendoza', 1),
(13, b'0', 'Misiones', 1),
(14, b'0', 'Neuquén', 1),
(15, b'0', 'Río Negro', 1),
(16, b'0', 'Salta', 1),
(17, b'0', 'San Juan', 1),
(18, b'0', 'San Luis', 1),
(19, b'0', 'Santa Cruz', 1),
(20, b'0', 'Santa Fe', 1),
(21, b'0', 'Santiago del Estero', 1),
(22, b'0', 'Tierra del Fuego', 1),
(23, b'0', 'Tucumán', 1),
(24, b'0', 'Ciudad Autónoma de Buenos Aires', 1);

-- =========================
-- Tabla: localidad
-- =========================
INSERT INTO `localidad` (`id`, `eliminado`, `nombre`, `provincia_id`) VALUES
(1, b'0', 'Ciudad de Mendoza', 12),
(2, b'0', 'Godoy Cruz', 12),
(3, b'0', 'Guaymallén', 12),
(4, b'0', 'Luján de Cuyo', 12),
(5, b'0', 'Maipú', 12),
(6, b'0', 'San Martín', 12),
(7, b'0', 'Las Heras', 12),
(8, b'0', 'San Rafael', 12),
(9, b'0', 'General Alvear', 12),
(10, b'0', 'Malargüe', 12),
(11, b'0', 'Rivadavia', 12),
(12, b'0', 'Tunuyán', 12),
(13, b'0', 'Tupungato', 12),
(14, b'0', 'San Carlos', 12),
(15, b'0', 'Lavalle', 12),
(16, b'0', 'Santa Rosa', 12),
(17, b'0', 'La Paz', 12),
(18, b'0', 'Junín', 12);

-- =========================
-- Tabla: domicilio
-- =========================
INSERT INTO `domicilio` (`id`, `eliminado`, `calle`, `codigo_postal`, `numero`, `referencia`, `localidad_id`) VALUES
(1, b'0', 'Av. San Martín', 5500, '1234', 'Frente a la plaza central', 1),
(2, b'0', 'Bahia Blanca', 5500, '3256', 'casa', 1);

-- =========================
-- Tabla: categoria
-- =========================
INSERT INTO `categoria` (`id`, `eliminado`, `denominacion`, `id_categoria_padre`) VALUES
(1, b'0', 'Raiz', NULL); -- Esta categoría no tiene padre

INSERT INTO `categoria` (`id`, `eliminado`, `denominacion`, `id_categoria_padre`) VALUES                                                                                  (2, b'0', 'Superior', 1), -- El padre es 'Raiz' (ID 1)
(3, b'0', 'Inferior', 1),  -- El padre es 'Raiz' (ID 1)
(4, b'0', 'Abrigos', 1),   -- El padre es 'Raiz' (ID 1)
(5, b'0', 'Calzado', 1),   -- El padre es 'Raiz' (ID 1)
(6, b'0', 'Accesorios', 1); -- El padre es 'Raiz' (ID 1)
INSERT INTO `categoria` (`id`, `eliminado`, `denominacion`, `id_categoria_padre`) VALUES
(6, b'0', 'Remeras', 1),
(7, b'0', 'Camisas', 1),
(8, b'0', 'Buzos', 1),
(9, b'0', 'Pantalones', 2),
(10, b'0', 'Shorts', 2),
(11, b'0', 'Camperas', 3),
(12, b'0', 'Sacos', 3),
(13, b'0', 'Zapatillas', 4),
(14, b'0', 'Botas', 4),
(15, b'0', 'Gorros', 5),
(16, b'0', 'Cinturones', 5);

-- =========================
-- Tabla: producto
-- =========================
INSERT INTO `producto` (`id`, `eliminado`, `descripcion`, `nombre`, `precio`) VALUES
(1, b'0', 'Remera de algodón 100% color blanco', 'Remera Básica', 6000),
(2, b'0', 'Jean azul corte slim fit', 'Jean Slim', 13000),
(3, b'0', 'Campera sintética negra', 'Campera de Cuero', 24999),
(4, b'1', 'Zapatillas deportivas urbanas', 'Zapatillas Urbanas', 17999.99),
(5, b'0', 'Buzo con capucha gris', 'Buzo Hoodie', 8999),
(6, b'0', 'Short de poliéster para entrenamiento', 'Short Deportivo', 4999.99),
(7, b'0', 'Camisa manga larga a cuadros', 'Camisa Cuadros', 10999),
(8, b'0', 'Vestido corto estampado', 'Vestido Casual', 13999.99),
(9, b'0', 'Sweater tejido de lana', 'Sweater Lana', 11999),
(10, b'0', 'Jogger de algodón negro', 'Pantalón Jogger', 7999.99),
(11, b'1', '654', 'Hamburguesa nueva', 654);

-- =========================
-- Tabla: telefono
-- =========================
INSERT INTO `telefono` (`id`, `eliminado`, `numero`) VALUES
(1, b'0', '+54 2615551234'),
(2, b'0', '+54 2615355789');

-- =========================
-- Tabla: usuario
-- =========================
INSERT INTO `usuario` (`id`, `eliminado`, `email`, `firebase_uid`, `rol`) VALUES
(1, b'0', 'mln204manutup@gmail.com', '9xUDrdSpy3Q4dmIyVeUPWZ06uj52', 'ADMINISTRADOR'),
(2, b'0', 'juan@hotmail.com', 'DbXoAIU7a0UsLiffiodLiI2NF9y2', 'CLIENTE');

-- =========================
-- Tabla: cliente
-- =========================
INSERT INTO `cliente` (`id`, `eliminado`, `apellido`, `fecha_nacimiento`, `nombre`, `id_telefono`, `id_usuario`) VALUES
(1, b'0', 'Gonzalez', '1999-09-25', 'Juan Cruz', 2, 2);

-- =========================
-- Tabla: cliente_domicilio
-- =========================
INSERT INTO `cliente_domicilio` (`cliente_id`, `domicilio_id`) VALUES
(1, 2);

-- =========================
-- Tabla: administrador
-- =========================
INSERT INTO `administrador` (`id`, `eliminado`, `apellido`, `nombre`, `id_domicilio`, `id_telefono`, `id_usuario`) VALUES
(1, b'0', 'Rodriguez', 'Manuel', 1, 1, 1);