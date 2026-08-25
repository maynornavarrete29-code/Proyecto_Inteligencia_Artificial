USE DB20242000639
GO

CREATE OR ALTER PROCEDURE sp_listar_clientes
AS
BEGIN
	SELECT * 
	FROM Clientes
END
GO

CREATE OR ALTER PROCEDURE sp_listar_comentarios
AS
BEGIN
	SELECT * 
	FROM Comentarios
END
GO

CREATE OR ALTER PROCEDURE sp_listar_facturas
AS
BEGIN
	SELECT f.factura_id, f.numero_factura, f.pago_id, pc.monto, f.fecha_creacion
	FROM Facturas f
	INNER JOIN PagoCascada pc ON pc.pago_id = f.pago_id
END
GO


CREATE OR ALTER PROCEDURE sp_listar_pagos
AS
BEGIN
	SELECT pc.pago_id, p.proyecto_id, p.nombre, pc.monto, pc.fecha_pago
	FROM PagoCascada pc
	INNER JOIN Proyectos p ON p.proyecto_id = pc.proyecto_id
END
GO

CREATE OR ALTER PROCEDURE sp_listar_stack_proyectos
AS
BEGIN
	SELECT s.stack_proyecto_id, p.proyecto_id, s.tecnologia_id
	FROM Stack_Proyectos s
	INNER JOIN Proyectos p ON p.proyecto_id = s.proyecto_id
END
GO