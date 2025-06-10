USE `tienda_ropa`;

/*Data for the table `administrador` */

insert  into `administrador`(`id`,`eliminado`,`apellido`,`nombre`,`id_domicilio`,`id_telefono`,`id_usuario`) values (1,'\0','Rodriguez','Manuel',1,1,1);

/*Data for the table `categoria` */

insert  into `categoria`(`id`,`eliminado`,`denominacion`,`id_categoria_padre`) values (1,'\0','Raiz',NULL);
insert  into `categoria`(`id`,`eliminado`,`denominacion`,`id_categoria_padre`) values (2,'\0','Superior',1);
insert  into `categoria`(`id`,`eliminado`,`denominacion`,`id_categoria_padre`) values (3,'\0','Inferior',1);
insert  into `categoria`(`id`,`eliminado`,`denominacion`,`id_categoria_padre`) values (4,'\0','Abrigos',2);
insert  into `categoria`(`id`,`eliminado`,`denominacion`,`id_categoria_padre`) values (6,'\0','Accesorios',1);
insert  into `categoria`(`id`,`eliminado`,`denominacion`,`id_categoria_padre`) values (7,'\0','Camisas',2);
insert  into `categoria`(`id`,`eliminado`,`denominacion`,`id_categoria_padre`) values (8,'\0','Buzos',2);
insert  into `categoria`(`id`,`eliminado`,`denominacion`,`id_categoria_padre`) values (9,'\0','Pantalones',3);
insert  into `categoria`(`id`,`eliminado`,`denominacion`,`id_categoria_padre`) values (10,'\0','Shorts',3);
insert  into `categoria`(`id`,`eliminado`,`denominacion`,`id_categoria_padre`) values (11,'\0','Camperas',4);
insert  into `categoria`(`id`,`eliminado`,`denominacion`,`id_categoria_padre`) values (12,'\0','Sacos',4);
insert  into `categoria`(`id`,`eliminado`,`denominacion`,`id_categoria_padre`) values (13,'\0','Gorros',6);
insert  into `categoria`(`id`,`eliminado`,`denominacion`,`id_categoria_padre`) values (14,'\0','Remeras',2);

/*Data for the table `categoria_producto` */

insert  into `categoria_producto`(`id_producto`,`id_categoria`) values (1,2);
insert  into `categoria_producto`(`id_producto`,`id_categoria`) values (1,14);
insert  into `categoria_producto`(`id_producto`,`id_categoria`) values (2,3);
insert  into `categoria_producto`(`id_producto`,`id_categoria`) values (2,9);
insert  into `categoria_producto`(`id_producto`,`id_categoria`) values (3,2);
insert  into `categoria_producto`(`id_producto`,`id_categoria`) values (3,4);
insert  into `categoria_producto`(`id_producto`,`id_categoria`) values (5,2);
insert  into `categoria_producto`(`id_producto`,`id_categoria`) values (5,4);
insert  into `categoria_producto`(`id_producto`,`id_categoria`) values (6,3);
insert  into `categoria_producto`(`id_producto`,`id_categoria`) values (6,10);
insert  into `categoria_producto`(`id_producto`,`id_categoria`) values (7,2);
insert  into `categoria_producto`(`id_producto`,`id_categoria`) values (7,7);

/*Data for the table `cliente` */

insert  into `cliente`(`id`,`eliminado`,`apellido`,`fecha_nacimiento`,`nombre`,`id_telefono`,`id_usuario`) values (1,'\0','Gonzalez','1999-09-25','Juan Cruz',2,2);

/*Data for the table `cliente_domicilio` */

insert  into `cliente_domicilio`(`cliente_id`,`domicilio_id`) values (1,2);
insert  into `cliente_domicilio`(`cliente_id`,`domicilio_id`) values (1,3);

/*Data for the table `color` */

insert  into `color`(`id`,`eliminado`,`nombre`) values (1,'\0','Rojo');
insert  into `color`(`id`,`eliminado`,`nombre`) values (2,'\0','Negro');
insert  into `color`(`id`,`eliminado`,`nombre`) values (3,'\0','Amarillo');
insert  into `color`(`id`,`eliminado`,`nombre`) values (4,'\0','Naranja');
insert  into `color`(`id`,`eliminado`,`nombre`) values (5,'\0','Verde');
insert  into `color`(`id`,`eliminado`,`nombre`) values (6,'\0','Violeta');
insert  into `color`(`id`,`eliminado`,`nombre`) values (7,'\0','Azul');

/*Data for the table `domicilio` */

insert  into `domicilio`(`id`,`eliminado`,`calle`,`codigo_postal`,`numero`,`referencia`,`localidad_id`) values (1,'\0','Av. San Martín',5500,'1234','Frente a la plaza central',1);
insert  into `domicilio`(`id`,`eliminado`,`calle`,`codigo_postal`,`numero`,`referencia`,`localidad_id`) values (2,'\0','Bahia Blanca',5500,'3256','casa',1);
insert  into `domicilio`(`id`,`eliminado`,`calle`,`codigo_postal`,`numero`,`referencia`,`localidad_id`) values (3,'\0','Bahia Blanca',5500,'3256','Trabajo',2);

/*Data for the table `historico_precio_compra` */

/*Data for the table `historico_precio_venta` */

insert  into `historico_precio_venta`(`id`,`eliminado`,`fecha`,`precio`,`id_producto`) values (1,'\0','2025-06-10 03:39:58.000000',15000,1);
insert  into `historico_precio_venta`(`id`,`eliminado`,`fecha`,`precio`,`id_producto`) values (2,'\0','2025-06-10 00:44:44.000000',22500,1);
insert  into `historico_precio_venta`(`id`,`eliminado`,`fecha`,`precio`,`id_producto`) values (3,'\0','2025-06-10 03:46:23.000000',1,1);
insert  into `historico_precio_venta`(`id`,`eliminado`,`fecha`,`precio`,`id_producto`) values (4,'\0','2025-06-10 02:03:21.000000',22500,1);
insert  into `historico_precio_venta`(`id`,`eliminado`,`fecha`,`precio`,`id_producto`) values (5,'\0','2025-06-10 16:02:31.000000',10000,1);
insert  into `historico_precio_venta`(`id`,`eliminado`,`fecha`,`precio`,`id_producto`) values (6,'\0','2025-06-10 13:03:01.000000',1.5,1);
insert  into `historico_precio_venta`(`id`,`eliminado`,`fecha`,`precio`,`id_producto`) values (7,'\0','2025-06-10 13:04:42.000000',3,1);
insert  into `historico_precio_venta`(`id`,`eliminado`,`fecha`,`precio`,`id_producto`) values (8,'\0','2025-06-10 16:05:25.000000',9000,1);
insert  into `historico_precio_venta`(`id`,`eliminado`,`fecha`,`precio`,`id_producto`) values (9,'\0','2025-06-10 16:06:19.000000',1,1);
insert  into `historico_precio_venta`(`id`,`eliminado`,`fecha`,`precio`,`id_producto`) values (10,'\0','2025-06-10 18:15:47.000000',15000,2);
insert  into `historico_precio_venta`(`id`,`eliminado`,`fecha`,`precio`,`id_producto`) values (11,'\0','2025-06-10 18:16:08.000000',20000,3);
insert  into `historico_precio_venta`(`id`,`eliminado`,`fecha`,`precio`,`id_producto`) values (12,'\0','2025-06-10 18:17:07.000000',18000,5);
insert  into `historico_precio_venta`(`id`,`eliminado`,`fecha`,`precio`,`id_producto`) values (13,'\0','2025-06-10 18:17:48.000000',9000,6);
insert  into `historico_precio_venta`(`id`,`eliminado`,`fecha`,`precio`,`id_producto`) values (14,'\0','2025-06-10 18:20:29.000000',12000,7);
insert  into `historico_precio_venta`(`id`,`eliminado`,`fecha`,`precio`,`id_producto`) values (15,'\0','2025-06-10 18:21:15.000000',26000,8);
insert  into `historico_precio_venta`(`id`,`eliminado`,`fecha`,`precio`,`id_producto`) values (16,'\0','2025-06-10 18:21:50.000000',7800,9);
insert  into `historico_precio_venta`(`id`,`eliminado`,`fecha`,`precio`,`id_producto`) values (17,'\0','2025-06-10 15:26:47.000000',30000,2);
insert  into `historico_precio_venta`(`id`,`eliminado`,`fecha`,`precio`,`id_producto`) values (18,'\0','2025-06-10 15:27:07.000000',37500,3);
insert  into `historico_precio_venta`(`id`,`eliminado`,`fecha`,`precio`,`id_producto`) values (19,'\0','2025-06-10 15:27:40.000000',27000,5);
insert  into `historico_precio_venta`(`id`,`eliminado`,`fecha`,`precio`,`id_producto`) values (20,'\0','2025-06-10 15:29:03.000000',21000,2);
insert  into `historico_precio_venta`(`id`,`eliminado`,`fecha`,`precio`,`id_producto`) values (21,'\0','2025-06-10 15:29:16.000000',27000,3);
insert  into `historico_precio_venta`(`id`,`eliminado`,`fecha`,`precio`,`id_producto`) values (22,'\0','2025-06-10 15:29:42.000000',13500,6);
insert  into `historico_precio_venta`(`id`,`eliminado`,`fecha`,`precio`,`id_producto`) values (23,'\0','2025-06-10 15:30:30.000000',15000,7);

/*Data for the table `imagen_producto` */

insert  into `imagen_producto`(`id`,`eliminado`,`denominacion`,`id_producto`) values (3,'\0','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749568496/qgjt98yu8po8x9mrm05y.jpg',1);
insert  into `imagen_producto`(`id`,`eliminado`,`denominacion`,`id_producto`) values (4,'\0','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749568546/fmay0rofzhigs0dkkd2r.jpg',2);
insert  into `imagen_producto`(`id`,`eliminado`,`denominacion`,`id_producto`) values (5,'\0','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749568567/kaqqysvxrsh58wnfuclk.jpg',3);
insert  into `imagen_producto`(`id`,`eliminado`,`denominacion`,`id_producto`) values (6,'\0','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749568567/xofj0ukoqi5otxmdadpt.jpg',3);
insert  into `imagen_producto`(`id`,`eliminado`,`denominacion`,`id_producto`) values (7,'\0','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749568626/brcdegxzmvqeti108pwc.jpg',5);
insert  into `imagen_producto`(`id`,`eliminado`,`denominacion`,`id_producto`) values (8,'\0','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749568626/kkli9nn6guryjbhazalp.jpg',5);
insert  into `imagen_producto`(`id`,`eliminado`,`denominacion`,`id_producto`) values (9,'\0','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749568667/vjl5o4dahwhoz9cscrnb.jpg',6);
insert  into `imagen_producto`(`id`,`eliminado`,`denominacion`,`id_producto`) values (10,'\0','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749568828/yazrqt63wiaxtswvfohy.jpg',7);
insert  into `imagen_producto`(`id`,`eliminado`,`denominacion`,`id_producto`) values (11,'\0','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749568874/xi4qr9u0l66kbvlbqsgy.jpg',8);
insert  into `imagen_producto`(`id`,`eliminado`,`denominacion`,`id_producto`) values (12,'\0','https://res.cloudinary.com/dvyjtb1ns/image/upload/v1749568909/pzsalx6unzdzbitgpaml.jpg',9);

/*Data for the table `localidad` */

insert  into `localidad`(`id`,`eliminado`,`nombre`,`provincia_id`) values (1,'\0','Ciudad de Mendoza',12);
insert  into `localidad`(`id`,`eliminado`,`nombre`,`provincia_id`) values (2,'\0','Godoy Cruz',12);
insert  into `localidad`(`id`,`eliminado`,`nombre`,`provincia_id`) values (3,'\0','Guaymallén',12);
insert  into `localidad`(`id`,`eliminado`,`nombre`,`provincia_id`) values (4,'\0','Luján de Cuyo',12);
insert  into `localidad`(`id`,`eliminado`,`nombre`,`provincia_id`) values (5,'\0','Maipú',12);
insert  into `localidad`(`id`,`eliminado`,`nombre`,`provincia_id`) values (6,'\0','San Martín',12);
insert  into `localidad`(`id`,`eliminado`,`nombre`,`provincia_id`) values (7,'\0','Las Heras',12);
insert  into `localidad`(`id`,`eliminado`,`nombre`,`provincia_id`) values (8,'\0','San Rafael',12);
insert  into `localidad`(`id`,`eliminado`,`nombre`,`provincia_id`) values (9,'\0','General Alvear',12);
insert  into `localidad`(`id`,`eliminado`,`nombre`,`provincia_id`) values (10,'\0','Malargüe',12);
insert  into `localidad`(`id`,`eliminado`,`nombre`,`provincia_id`) values (11,'\0','Rivadavia',12);
insert  into `localidad`(`id`,`eliminado`,`nombre`,`provincia_id`) values (12,'\0','Tunuyán',12);
insert  into `localidad`(`id`,`eliminado`,`nombre`,`provincia_id`) values (13,'\0','Tupungato',12);
insert  into `localidad`(`id`,`eliminado`,`nombre`,`provincia_id`) values (14,'\0','San Carlos',12);
insert  into `localidad`(`id`,`eliminado`,`nombre`,`provincia_id`) values (15,'\0','Lavalle',12);
insert  into `localidad`(`id`,`eliminado`,`nombre`,`provincia_id`) values (16,'\0','Santa Rosa',12);
insert  into `localidad`(`id`,`eliminado`,`nombre`,`provincia_id`) values (17,'\0','La Paz',12);
insert  into `localidad`(`id`,`eliminado`,`nombre`,`provincia_id`) values (18,'\0','Junín',12);

/*Data for the table `pais` */

insert  into `pais`(`id`,`eliminado`,`nombre`) values (1,'\0','Argentina');

/*Data for the table `pedido` */

insert  into `pedido`(`id`,`eliminado`,`estado`,`fecha`,`cliente_id`,`domicilio_id`) values (1,'\0','EN_CAMINO','2025-06-09',1,2);
insert  into `pedido`(`id`,`eliminado`,`estado`,`fecha`,`cliente_id`,`domicilio_id`) values (2,'\0','PENDIENTE','2025-06-09',1,2);
insert  into `pedido`(`id`,`eliminado`,`estado`,`fecha`,`cliente_id`,`domicilio_id`) values (3,'\0','PENDIENTE','2025-06-09',1,2);
insert  into `pedido`(`id`,`eliminado`,`estado`,`fecha`,`cliente_id`,`domicilio_id`) values (4,'\0','PROCESANDO','2025-06-09',1,2);
insert  into `pedido`(`id`,`eliminado`,`estado`,`fecha`,`cliente_id`,`domicilio_id`) values (5,'\0','PENDIENTE','2025-06-09',1,2);
insert  into `pedido`(`id`,`eliminado`,`estado`,`fecha`,`cliente_id`,`domicilio_id`) values (6,'\0','PROCESANDO','2025-06-09',1,2);
insert  into `pedido`(`id`,`eliminado`,`estado`,`fecha`,`cliente_id`,`domicilio_id`) values (7,'\0','PROCESANDO','2025-06-09',1,2);
insert  into `pedido`(`id`,`eliminado`,`estado`,`fecha`,`cliente_id`,`domicilio_id`) values (8,'\0','PROCESANDO','2025-06-09',1,2);
insert  into `pedido`(`id`,`eliminado`,`estado`,`fecha`,`cliente_id`,`domicilio_id`) values (9,'\0','PENDIENTE','2025-06-10',1,2);
insert  into `pedido`(`id`,`eliminado`,`estado`,`fecha`,`cliente_id`,`domicilio_id`) values (10,'\0','PENDIENTE','2025-06-10',1,2);
insert  into `pedido`(`id`,`eliminado`,`estado`,`fecha`,`cliente_id`,`domicilio_id`) values (11,'\0','PENDIENTE','2025-06-10',1,2);
insert  into `pedido`(`id`,`eliminado`,`estado`,`fecha`,`cliente_id`,`domicilio_id`) values (12,'\0','PENDIENTE','2025-06-10',1,2);
insert  into `pedido`(`id`,`eliminado`,`estado`,`fecha`,`cliente_id`,`domicilio_id`) values (13,'\0','PENDIENTE','2025-06-10',1,2);
insert  into `pedido`(`id`,`eliminado`,`estado`,`fecha`,`cliente_id`,`domicilio_id`) values (14,'\0','PENDIENTE','2025-06-10',1,2);
insert  into `pedido`(`id`,`eliminado`,`estado`,`fecha`,`cliente_id`,`domicilio_id`) values (15,'\0','PROCESANDO','2025-06-10',1,2);
insert  into `pedido`(`id`,`eliminado`,`estado`,`fecha`,`cliente_id`,`domicilio_id`) values (16,'\0','PROCESANDO','2025-06-10',1,3);
insert  into `pedido`(`id`,`eliminado`,`estado`,`fecha`,`cliente_id`,`domicilio_id`) values (17,'\0','PROCESANDO','2025-06-10',1,2);

/*Data for the table `pedido_detalle` */

insert  into `pedido_detalle`(`id`,`eliminado`,`cantidad`,`precio`,`pedido_id`,`stock_id`) values (1,'\0',1,1,1,1);
insert  into `pedido_detalle`(`id`,`eliminado`,`cantidad`,`precio`,`pedido_id`,`stock_id`) values (2,'\0',1,1,2,1);
insert  into `pedido_detalle`(`id`,`eliminado`,`cantidad`,`precio`,`pedido_id`,`stock_id`) values (3,'\0',1,1,3,1);
insert  into `pedido_detalle`(`id`,`eliminado`,`cantidad`,`precio`,`pedido_id`,`stock_id`) values (4,'\0',1,1,4,1);
insert  into `pedido_detalle`(`id`,`eliminado`,`cantidad`,`precio`,`pedido_id`,`stock_id`) values (5,'\0',1,1,5,1);
insert  into `pedido_detalle`(`id`,`eliminado`,`cantidad`,`precio`,`pedido_id`,`stock_id`) values (6,'\0',1,1,6,1);
insert  into `pedido_detalle`(`id`,`eliminado`,`cantidad`,`precio`,`pedido_id`,`stock_id`) values (7,'\0',1,1,7,2);
insert  into `pedido_detalle`(`id`,`eliminado`,`cantidad`,`precio`,`pedido_id`,`stock_id`) values (8,'\0',1,1,7,1);
insert  into `pedido_detalle`(`id`,`eliminado`,`cantidad`,`precio`,`pedido_id`,`stock_id`) values (9,'\0',1,1,8,1);
insert  into `pedido_detalle`(`id`,`eliminado`,`cantidad`,`precio`,`pedido_id`,`stock_id`) values (10,'\0',1,1,9,1);
insert  into `pedido_detalle`(`id`,`eliminado`,`cantidad`,`precio`,`pedido_id`,`stock_id`) values (11,'\0',1,1,10,1);
insert  into `pedido_detalle`(`id`,`eliminado`,`cantidad`,`precio`,`pedido_id`,`stock_id`) values (12,'\0',1,1,11,1);
insert  into `pedido_detalle`(`id`,`eliminado`,`cantidad`,`precio`,`pedido_id`,`stock_id`) values (13,'\0',1,1,12,1);
insert  into `pedido_detalle`(`id`,`eliminado`,`cantidad`,`precio`,`pedido_id`,`stock_id`) values (14,'\0',1,1,13,1);
insert  into `pedido_detalle`(`id`,`eliminado`,`cantidad`,`precio`,`pedido_id`,`stock_id`) values (15,'\0',2,1,14,1);
insert  into `pedido_detalle`(`id`,`eliminado`,`cantidad`,`precio`,`pedido_id`,`stock_id`) values (16,'\0',1,1,15,1);
insert  into `pedido_detalle`(`id`,`eliminado`,`cantidad`,`precio`,`pedido_id`,`stock_id`) values (17,'\0',1,1,16,1);
insert  into `pedido_detalle`(`id`,`eliminado`,`cantidad`,`precio`,`pedido_id`,`stock_id`) values (18,'\0',1,1,17,1);

/*Data for the table `producto` */

insert  into `producto`(`id`,`eliminado`,`descripcion`,`nombre`) values (1,'\0','Remera de algodón 100% color','Remera Básica');
insert  into `producto`(`id`,`eliminado`,`descripcion`,`nombre`) values (2,'\0','Jean azul corte slim fit','Jean Slim');
insert  into `producto`(`id`,`eliminado`,`descripcion`,`nombre`) values (3,'\0','Campera sintética negra','Campera de Cuero');
insert  into `producto`(`id`,`eliminado`,`descripcion`,`nombre`) values (5,'\0','Buzo con capucha gris','Buzo Hoodie');
insert  into `producto`(`id`,`eliminado`,`descripcion`,`nombre`) values (6,'\0','Short de poliéster para entrenamiento','Short Deportivo');
insert  into `producto`(`id`,`eliminado`,`descripcion`,`nombre`) values (7,'\0','Camisa manga larga a cuadros','Camisa Cuadros');
insert  into `producto`(`id`,`eliminado`,`descripcion`,`nombre`) values (8,'\0','Vestido corto estampado','Vestido Casual');
insert  into `producto`(`id`,`eliminado`,`descripcion`,`nombre`) values (9,'\0','Sweater tejido de lana','Sweater Lana');

/*Data for the table `provincia` */

insert  into `provincia`(`id`,`eliminado`,`nombre`,`id_pais`) values (1,'\0','Buenos Aires',1);
insert  into `provincia`(`id`,`eliminado`,`nombre`,`id_pais`) values (2,'\0','Catamarca',1);
insert  into `provincia`(`id`,`eliminado`,`nombre`,`id_pais`) values (3,'\0','Chaco',1);
insert  into `provincia`(`id`,`eliminado`,`nombre`,`id_pais`) values (4,'\0','Chubut',1);
insert  into `provincia`(`id`,`eliminado`,`nombre`,`id_pais`) values (5,'\0','Córdoba',1);
insert  into `provincia`(`id`,`eliminado`,`nombre`,`id_pais`) values (6,'\0','Corrientes',1);
insert  into `provincia`(`id`,`eliminado`,`nombre`,`id_pais`) values (7,'\0','Entre Ríos',1);
insert  into `provincia`(`id`,`eliminado`,`nombre`,`id_pais`) values (8,'\0','Formosa',1);
insert  into `provincia`(`id`,`eliminado`,`nombre`,`id_pais`) values (9,'\0','Jujuy',1);
insert  into `provincia`(`id`,`eliminado`,`nombre`,`id_pais`) values (10,'\0','La Pampa',1);
insert  into `provincia`(`id`,`eliminado`,`nombre`,`id_pais`) values (11,'\0','La Rioja',1);
insert  into `provincia`(`id`,`eliminado`,`nombre`,`id_pais`) values (12,'\0','Mendoza',1);
insert  into `provincia`(`id`,`eliminado`,`nombre`,`id_pais`) values (13,'\0','Misiones',1);
insert  into `provincia`(`id`,`eliminado`,`nombre`,`id_pais`) values (14,'\0','Neuquén',1);
insert  into `provincia`(`id`,`eliminado`,`nombre`,`id_pais`) values (15,'\0','Río Negro',1);
insert  into `provincia`(`id`,`eliminado`,`nombre`,`id_pais`) values (16,'\0','Salta',1);
insert  into `provincia`(`id`,`eliminado`,`nombre`,`id_pais`) values (17,'\0','San Juan',1);
insert  into `provincia`(`id`,`eliminado`,`nombre`,`id_pais`) values (18,'\0','San Luis',1);
insert  into `provincia`(`id`,`eliminado`,`nombre`,`id_pais`) values (19,'\0','Santa Cruz',1);
insert  into `provincia`(`id`,`eliminado`,`nombre`,`id_pais`) values (20,'\0','Santa Fe',1);
insert  into `provincia`(`id`,`eliminado`,`nombre`,`id_pais`) values (21,'\0','Santiago del Estero',1);
insert  into `provincia`(`id`,`eliminado`,`nombre`,`id_pais`) values (22,'\0','Tierra del Fuego',1);
insert  into `provincia`(`id`,`eliminado`,`nombre`,`id_pais`) values (23,'\0','Tucumán',1);
insert  into `provincia`(`id`,`eliminado`,`nombre`,`id_pais`) values (24,'\0','Ciudad Autónoma de Buenos Aires',1);

/*Data for the table `stock` */

insert  into `stock`(`id`,`eliminado`,`cantidad`,`id_color`,`id_producto`,`id_talle`) values (1,'\0',112,1,1,2);
insert  into `stock`(`id`,`eliminado`,`cantidad`,`id_color`,`id_producto`,`id_talle`) values (2,'\0',99,2,1,1);
insert  into `stock`(`id`,`eliminado`,`cantidad`,`id_color`,`id_producto`,`id_talle`) values (3,'\0',100,1,2,1);
insert  into `stock`(`id`,`eliminado`,`cantidad`,`id_color`,`id_producto`,`id_talle`) values (4,'\0',100,2,3,2);
insert  into `stock`(`id`,`eliminado`,`cantidad`,`id_color`,`id_producto`,`id_talle`) values (5,'\0',100,1,5,2);
insert  into `stock`(`id`,`eliminado`,`cantidad`,`id_color`,`id_producto`,`id_talle`) values (6,'\0',100,1,2,4);
insert  into `stock`(`id`,`eliminado`,`cantidad`,`id_color`,`id_producto`,`id_talle`) values (7,'\0',100,2,3,3);
insert  into `stock`(`id`,`eliminado`,`cantidad`,`id_color`,`id_producto`,`id_talle`) values (8,'\0',80,1,6,3);
insert  into `stock`(`id`,`eliminado`,`cantidad`,`id_color`,`id_producto`,`id_talle`) values (9,'\0',10,7,7,6);

/*Data for the table `talle` */

insert  into `talle`(`id`,`eliminado`,`nombre`) values (1,'\0','XS');
insert  into `talle`(`id`,`eliminado`,`nombre`) values (2,'\0','S');
insert  into `talle`(`id`,`eliminado`,`nombre`) values (3,'\0','M');
insert  into `talle`(`id`,`eliminado`,`nombre`) values (4,'\0','L');
insert  into `talle`(`id`,`eliminado`,`nombre`) values (5,'\0','XL');
insert  into `talle`(`id`,`eliminado`,`nombre`) values (6,'\0','XXL');

/*Data for the table `telefono` */

insert  into `telefono`(`id`,`eliminado`,`numero`) values (1,'\0','2615551234');
insert  into `telefono`(`id`,`eliminado`,`numero`) values (2,'\0','2615355789');

/*Data for the table `usuario` */

insert  into `usuario`(`id`,`eliminado`,`email`,`firebase_uid`,`rol`) values (1,'\0','mln204manutup@gmail.com','9xUDrdSpy3Q4dmIyVeUPWZ06uj52','ADMINISTRADOR');
insert  into `usuario`(`id`,`eliminado`,`email`,`firebase_uid`,`rol`) values (2,'\0','juan@hotmail.com','DbXoAIU7a0UsLiffiodLiI2NF9y2','CLIENTE');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
