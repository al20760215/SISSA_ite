--Crear Login
--Crear usuario ligado a ese login
--Editar usuario y darle permisos en Membership

-- Tabla de Alumnos (modificada)
CREATE TABLE Alumnos (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Nombres VARCHAR(100),
    Apellido1 VARCHAR(100),
    Apellido2 VARCHAR(100),
    Semestre INT,
    CantidadCreditos INT,
    Reprobadas INT,
    Grupo VARCHAR(50),
    Especialidad VARCHAR(100),
    Telefono VARCHAR(15),
    Direccion VARCHAR(255),
    ImagenPerfil VARBINARY(MAX),
    SeguroSocial BIT,
)


-- Mejoras en la tabla de Alumnos
ALTER TABLE Alumnos
ADD Correo VARCHAR(255),
    CONSTRAINT chk_CantidadCreditos CHECK (CantidadCreditos BETWEEN 0 AND 100)




-- Tabla de Organizaciones
CREATE TABLE Organizaciones (
    ID INT PRIMARY KEY IDENTITY(1,1),
    NombreOrganizacion VARCHAR(255),
    NombreEncargado VARCHAR(100),
    Apellido1Encargado VARCHAR(100),
    Apellido2Encargado VARCHAR(100),
    Cargo VARCHAR(100),
    Telefono VARCHAR(15),
    Direccion VARCHAR(255),
    ImagenPerfil VARBINARY(MAX)
)

-- Tabla de Encargados del Servicio Social
CREATE TABLE EncargadosServicioSocial (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(100),
    Cargo VARCHAR(100),
    Permisos VARCHAR(255)
)

-- Tabla de Programas de Servicio Social
CREATE TABLE ProgramasServicioSocial (
    ID INT PRIMARY KEY IDENTITY(1,1),
    NombrePrograma VARCHAR(255),
    Duracion INT, -- Duración en meses
    Locacion VARCHAR(255),
    Objetivos VARCHAR(1000),
    Actividades VARCHAR(1000),
    FechaInicio DATE,
    FechaVencimiento DATE
)
-- Mejoras en la tabla de Programas de Servicio Social
ALTER TABLE ProgramasServicioSocial
ADD CONSTRAINT chk_Fechas CHECK (FechaInicio < FechaVencimiento)


-- Tabla de Relaciones entre Alumnos y Organizaciones
CREATE TABLE AlumnosOrganizaciones (
    AlumnoID INT,
    OrganizacionID INT,
    EncargadoID INT,
    ProgramaID INT,
    FechaInicio DATE,
    FechaFin DATE,
    PRIMARY KEY (AlumnoID, OrganizacionID, EncargadoID, ProgramaID),
    FOREIGN KEY (AlumnoID) REFERENCES Alumnos(ID),
    FOREIGN KEY (OrganizacionID) REFERENCES Organizaciones(ID),
    FOREIGN KEY (EncargadoID) REFERENCES EncargadosServicioSocial(ID),
    FOREIGN KEY (ProgramaID) REFERENCES ProgramasServicioSocial(ID)
)

-- Tabla para registrar los programas que un alumno ha tenido
CREATE TABLE HistorialProgramasAlumnos (
    ID INT PRIMARY KEY IDENTITY(1,1),
    AlumnoID INT,
    ProgramaID INT,
    FechaInicio DATE,
    FechaFin DATE,
    FOREIGN KEY (AlumnoID) REFERENCES Alumnos(ID),
    FOREIGN KEY (ProgramaID) REFERENCES ProgramasServicioSocial(ID)
)

-- Tabla para registrar los programas que un encargado de dependencia tiene a su cargo
CREATE TABLE ProgramasEncargados (
    ID INT PRIMARY KEY IDENTITY(1,1),
    EncargadoID INT,
    ProgramaID INT,
    FOREIGN KEY (EncargadoID) REFERENCES EncargadosServicioSocial(ID),
    FOREIGN KEY (ProgramaID) REFERENCES ProgramasServicioSocial(ID)
)

-- Tabla de Solicitudes de Programas y Cantidades
CREATE TABLE SolicitudesProgramas (
    ID INT PRIMARY KEY IDENTITY(1,1),
    ProgramaID INT,
    CantidadPersonas INT,
    FOREIGN KEY (ProgramaID) REFERENCES ProgramasServicioSocial(ID)
)

-- Tabla de Bimestres
CREATE TABLE Bimestres (
    ID INT PRIMARY KEY IDENTITY(1,1),
    AlumnoID INT,
    ProgramaID INT,
    Bimestre1 BIT,
    Bimestre2 BIT,
    Bimestre3 BIT,
    PDF VARBINARY(MAX),
    FOREIGN KEY (AlumnoID) REFERENCES Alumnos(ID),
    FOREIGN KEY (ProgramaID) REFERENCES ProgramasServicioSocial(ID)
)

-- Tabla de Tutores
CREATE TABLE Tutores (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(100),
    Apellido1 VARCHAR(100),
    Apellido2 VARCHAR(100),
    NoControl INT,
    Puesto VARCHAR(100),
    JefeACargoID INT,
    Correo VARCHAR(255),
    FOREIGN KEY (JefeACargoID) REFERENCES JefesACargo(ID)
)

-- Tabla de Jefes a Cargo
CREATE TABLE JefesACargo (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(100),
    Apellido1 VARCHAR(100),
    Apellido2 VARCHAR(100),
    Puesto VARCHAR(100),
    Correo1 VARCHAR(255),
    Correo2 VARCHAR(255)
)

-- Vista de Alumnos que les faltan puntos pero próximos a cumplir
CREATE VIEW AlumnosProximosACumplir AS
SELECT * FROM Alumnos
WHERE CantidadCreditos >= 80 AND CantidadCreditos < 100

-- Vista de Alumnos que acaban de conseguir la cantidad de puntos
CREATE VIEW AlumnosCumplieronCreditos AS
SELECT * FROM Alumnos
WHERE CantidadCreditos = 100

-- Vista de Programas Activos
CREATE VIEW ProgramasActivos AS
SELECT * FROM ProgramasServicioSocial
WHERE FechaInicio <= GETDATE() AND FechaVencimiento >= GETDATE()

-- Vista de Programas Inactivos
CREATE VIEW ProgramasInactivos AS
SELECT * FROM ProgramasServicioSocial
WHERE FechaVencimiento < GETDATE()

-- Vista de Alumnos con Documentos Pendientes
CREATE VIEW AlumnosDocumentosPendientes AS
SELECT a.ID, a.Nombres, a.Apellido1, a.Apellido2, b.Bimestre1, b.Bimestre2, b.Bimestre3
FROM Alumnos a
LEFT JOIN Bimestres b ON a.ID = b.AlumnoID
WHERE b.Bimestre1 = 0 OR b.Bimestre2 = 0 OR b.Bimestre3 = 0

-- Vista de Cantidad de Alumnos por Programa
CREATE VIEW CantidadAlumnosPorPrograma AS
SELECT p.NombrePrograma, COUNT(a.ID) AS CantidadAlumnos
FROM ProgramasServicioSocial p
JOIN AlumnosOrganizaciones ao ON p.ID = ao.ProgramaID
JOIN Alumnos a ON ao.AlumnoID = a.ID
GROUP BY p.NombrePrograma

-- Procedimiento para agregar alumnos
CREATE PROCEDURE InsertarAlumno
    @Nombres VARCHAR(100),
    @Apellido1 VARCHAR(100),
    @Apellido2 VARCHAR(100),
    @Semestre INT,
    @CantidadCreditos INT,
    @Reprobadas INT,
    @Grupo VARCHAR(50),
    @Especialidad VARCHAR(100),
    @Telefono VARCHAR(15),
    @Direccion VARCHAR(255),
    @ImagenPerfil VARBINARY(MAX),
    @SeguroSocial BIT
AS
BEGIN
    INSERT INTO Alumnos (Nombres, Apellido1, Apellido2, Semestre, CantidadCreditos, Reprobadas, Grupo, Especialidad, Telefono, Direccion, ImagenPerfil, SeguroSocial)
    VALUES (@Nombres, @Apellido1, @Apellido2, @Semestre, @CantidadCreditos, @Reprobadas, @Grupo, @Especialidad, @Telefono, @Direccion, @ImagenPerfil, @SeguroSocial)
END

-- Procedimiento para agregar organizaciones
CREATE PROCEDURE InsertarOrganizacion
    @NombreOrganizacion VARCHAR(255),
    @NombreEncargado VARCHAR(100),
    @Apellido1Encargado VARCHAR(100),
    @Apellido2Encargado VARCHAR(100),
    @Cargo VARCHAR(100),
    @Telefono VARCHAR(15),
    @Direccion VARCHAR(255),
    @ImagenPerfil VARBINARY(MAX)
AS
BEGIN
    INSERT INTO Organizaciones (NombreOrganizacion, NombreEncargado, Apellido1Encargado, Apellido2Encargado, Cargo, Telefono, Direccion, ImagenPerfil)
    VALUES (@NombreOrganizacion, @NombreEncargado, @Apellido1Encargado, @Apellido2Encargado, @Cargo, @Telefono, @Direccion, @ImagenPerfil)
END

-- Procedimiento para agregar encargados de servicio social
CREATE PROCEDURE InsertarEncargadoServicioSocial
    @Nombre VARCHAR(100),
    @Cargo VARCHAR(100),
    @Permisos VARCHAR(255)
AS
BEGIN
    INSERT INTO EncargadosServicioSocial (Nombre, Cargo, Permisos)
    VALUES (@Nombre, @Cargo, @Permisos)
END

-- Procedimiento para agregar programas de servicio social
CREATE PROCEDURE InsertarProgramaServicioSocial
    @NombrePrograma VARCHAR(255),
    @Duracion INT,
    @Locacion VARCHAR(255)
AS
BEGIN
    INSERT INTO ProgramasServicioSocial (NombrePrograma, Duracion, Locacion)
    VALUES (@NombrePrograma, @Duracion, @Locacion)
END

-- Procedimiento para asociar alumnos con organizaciones y programas
CREATE PROCEDURE AsociarAlumnoConOrganizacion
    @AlumnoID INT,
    @OrganizacionID INT,
    @EncargadoID INT,
    @ProgramaID INT,
    @FechaInicio DATE,
    @FechaFin DATE
AS
BEGIN
    INSERT INTO AlumnosOrganizaciones (AlumnoID, OrganizacionID, EncargadoID, ProgramaID, FechaInicio, FechaFin)
    VALUES (@AlumnoID, @OrganizacionID, @EncargadoID, @ProgramaID, @FechaInicio, @FechaFin)
    
    INSERT INTO HistorialProgramasAlumnos (AlumnoID, ProgramaID, FechaInicio, FechaFin)
    VALUES (@AlumnoID, @ProgramaID, @FechaInicio, @FechaFin)
    
    INSERT INTO ProgramasEncargados (EncargadoID, ProgramaID)
    VALUES (@EncargadoID, @ProgramaID)
END

-- Trigger para enviar correos
CREATE TRIGGER trg_NotificarCumplimientoCreditos
ON Alumnos
AFTER UPDATE
AS
BEGIN
    DECLARE @id INT, @correo VARCHAR(255)
    
    SELECT @id = inserted.ID, @correo = inserted.Correo
    FROM inserted
    WHERE inserted.CantidadCreditos >= 100

    IF @id IS NOT NULL
    BEGIN
        EXEC msdb.dbo.sp_send_dbmail
            @profile_name = 'PerfilDeCorreo',
            @recipients = @correo,
            @subject = 'Cumplimiento de Créditos',
            @body = 'Has cumplido con los créditos requeridos para el servicio social.'
    END
END

-- Procedimiento para la solicitud de datos específicos
CREATE PROCEDURE SolicitarDatosAlumno
    @AlumnoID INT
AS
BEGIN
    SELECT a.Nombres, a.Apellido1, a.Apellido2, p.NombrePrograma, e.Nombre AS EncargadoNombre, e.Apellido1 AS EncargadoApellido1, e.Apellido2 AS EncargadoApellido2,
           o.NombreOrganizacion, t.Nombre AS TutorNombre, t.Apellido1 AS TutorApellido1, t.Apellido2 AS TutorApellido2
    FROM Alumnos a
    JOIN AlumnosOrganizaciones ao ON a.ID = ao.AlumnoID
    JOIN ProgramasServicioSocial p ON ao.ProgramaID = p.ID
    JOIN EncargadosServicioSocial e ON ao.EncargadoID = e.ID
    JOIN Organizaciones o ON ao.OrganizacionID = o.ID
    JOIN Tutores t ON ao.TutorID = t.ID
    WHERE a.ID = @AlumnoID
END




-- Tabla de Historial de Créditos de Alumnos
CREATE TABLE HistorialCreditos (
    ID INT PRIMARY KEY IDENTITY(1,1),
    AlumnoID INT,
    FechaCambio DATE DEFAULT GETDATE(),
    CantidadCreditosAnterior INT,
    CantidadCreditosNuevo INT,
    FOREIGN KEY (AlumnoID) REFERENCES Alumnos(ID)
)

-- Trigger para registrar cambios en los créditos de los alumnos
CREATE TRIGGER trg_RegistrarCambioCreditos
ON Alumnos
AFTER UPDATE
AS
BEGIN
    DECLARE @id INT, @creditos_anterior INT, @creditos_nuevo INT
    
    SELECT @id = inserted.ID, @creditos_anterior = deleted.CantidadCreditos, @creditos_nuevo = inserted.CantidadCreditos
    FROM inserted
    JOIN deleted ON inserted.ID = deleted.ID
    WHERE inserted.CantidadCreditos != deleted.CantidadCreditos

    IF @id IS NOT NULL
    BEGIN
        INSERT INTO HistorialCreditos (AlumnoID, CantidadCreditosAnterior, CantidadCreditosNuevo)
        VALUES (@id, @creditos_anterior, @creditos_nuevo)
    END
END

-- Índices para optimizar consultas
CREATE INDEX idx_Alumnos_CantidadCreditos ON Alumnos (CantidadCreditos)
CREATE INDEX idx_ProgramasServicioSocial_Fechas ON ProgramasServicioSocial (FechaInicio, FechaVencimiento)

-- Vistas mejoradas y optimizadas
CREATE VIEW AlumnosProximosACumplir AS
SELECT * FROM Alumnos
WHERE CantidadCreditos >= 80 AND CantidadCreditos < 100

CREATE VIEW AlumnosCumplieronCreditos AS
SELECT * FROM Alumnos
WHERE CantidadCreditos = 100

CREATE VIEW ProgramasActivos AS
SELECT * FROM ProgramasServicioSocial
WHERE FechaInicio <= GETDATE() AND FechaVencimiento >= GETDATE()

CREATE VIEW ProgramasInactivos AS
SELECT * FROM ProgramasServicioSocial
WHERE FechaVencimiento < GETDATE()

CREATE VIEW AlumnosDocumentosPendientes AS
SELECT a.ID, a.Nombres, a.Apellido1, a.Apellido2, b.Bimestre1, b.Bimestre2, b.Bimestre3
FROM Alumnos a
LEFT JOIN Bimestres b ON a.ID = b.AlumnoID
WHERE b.Bimestre1 = 0 OR b.Bimestre2 = 0 OR b.Bimestre3 = 0

CREATE VIEW CantidadAlumnosPorPrograma AS
SELECT p.NombrePrograma, COUNT(a.ID) AS CantidadAlumnos
FROM ProgramasServicioSocial p
JOIN AlumnosOrganizaciones ao ON p.ID = ao.ProgramaID
JOIN Alumnos a ON ao.AlumnoID = a.ID
GROUP BY p.NombrePrograma

-- Trigger para enviar correos de notificación
CREATE TRIGGER trg_NotificarCumplimientoCreditos
ON Alumnos
AFTER UPDATE
AS
BEGIN
    DECLARE @id INT, @correo VARCHAR(255)
    
    SELECT @id = inserted.ID, @correo = inserted.Correo
    FROM inserted
    WHERE inserted.CantidadCreditos >= 100

    IF @id IS NOT NULL
    BEGIN
        EXEC msdb.dbo.sp_send_dbmail
            @profile_name = 'PerfilDeCorreo',
            @recipients = @correo,
            @subject = 'Cumplimiento de Créditos',
            @body = 'Has cumplido con los créditos requeridos para el servicio social.'
    END
END

-- Procedimiento para solicitar datos específicos
CREATE PROCEDURE SolicitarDatosAlumno
    @AlumnoID INT
AS
BEGIN
    SELECT a.Nombres, a.Apellido1, a.Apellido2, p.NombrePrograma, e.Nombre AS EncargadoNombre, e.Apellido1 AS EncargadoApellido1, e.Apellido2 AS EncargadoApellido2,
           o.NombreOrganizacion, t.Nombre AS TutorNombre, t.Apellido1 AS TutorApellido1, t.Apellido2 AS TutorApellido2
    FROM Alumnos a
    JOIN AlumnosOrganizaciones ao ON a.ID = ao.AlumnoID
    JOIN ProgramasServicioSocial p ON ao.ProgramaID = p.ID
    JOIN EncargadosServicioSocial e ON ao.EncargadoID = e.ID
    JOIN Organizaciones o ON ao.OrganizacionID = o.ID
    JOIN Tutores t ON ao.TutorID = t.ID
    WHERE a.ID = @AlumnoID
END

-- Crear la tabla de usuarios
CREATE TABLE Usuarios (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Usuario VARCHAR(255) UNIQUE NOT NULL,
    TipoUsuario VARCHAR(50) CHECK (TipoUsuario IN ('alumno', 'maestro', 'encargado', 'sys')) NOT NULL,
    Contraseña VARBINARY(MAX) NOT NULL,
    FechaCreacion DATETIME DEFAULT GETDATE(),
    FechaVencimiento DATETIME DEFAULT DATEADD(MONTH, 6, GETDATE()),
    AlumnoID INT NULL,
    MaestroID INT NULL,
    EncargadoID INT NULL,
    FOREIGN KEY (AlumnoID) REFERENCES Alumnos(ID),
    FOREIGN KEY (MaestroID) REFERENCES Maestros(ID),
    FOREIGN KEY (EncargadoID) REFERENCES Encargados(ID)
)

-- Procedimiento para actualizar la fecha de vencimiento de la contraseña cada 6 meses
CREATE PROCEDURE ActualizarFechaVencimientoContraseña
    @UsuarioID INT
AS
BEGIN
    UPDATE Usuarios
    SET FechaVencimiento = DATEADD(MONTH, 6, GETDATE())
    WHERE ID = @UsuarioID
END

-- Trigger para actualizar la fecha de vencimiento al insertar un nuevo usuario
CREATE TRIGGER trg_InsertarUsuario
ON Usuarios
AFTER INSERT
AS
BEGIN
    UPDATE Usuarios
    SET FechaVencimiento = DATEADD(MONTH, 6, GETDATE())
    WHERE ID IN (SELECT ID FROM inserted)
END

-- Trigger para actualizar la fecha de vencimiento al actualizar la contraseña
CREATE TRIGGER trg_ActualizarContraseña
ON Usuarios
AFTER UPDATE
AS
BEGIN
    IF UPDATE(Contraseña)
    BEGIN
        UPDATE Usuarios
        SET FechaVencimiento = DATEADD(MONTH, 6, GETDATE())
        WHERE ID IN (SELECT ID FROM inserted)
    END
END

-- Procedimiento para cambiar la contraseña
CREATE PROCEDURE CambiarContraseña
    @UsuarioID INT,
    @NuevaContraseña VARBINARY(MAX)
AS
BEGIN
    UPDATE Usuarios
    SET Contraseña = @NuevaContraseña,
        FechaVencimiento = DATEADD(MONTH, 6, GETDATE())
    WHERE ID = @UsuarioID
END

-- Tabla de historial para cambios en los créditos de los alumnos
CREATE TABLE HistorialCreditos (
    ID INT PRIMARY KEY IDENTITY(1,1),
    AlumnoID INT,
    FechaCambio DATETIME DEFAULT GETDATE(),
    CantidadCreditosAnterior INT,
    CantidadCreditosNuevo INT,
    FOREIGN KEY (AlumnoID) REFERENCES Alumnos(ID)
)

-- Trigger para registrar cambios en los créditos de los alumnos
CREATE TRIGGER trg_CambioCreditos
ON Alumnos
AFTER UPDATE
AS
BEGIN
    DECLARE @AlumnoID INT, @CreditosAnteriores INT, @CreditosNuevos INT
    
    SELECT @AlumnoID = inserted.ID, @CreditosAnteriores = deleted.CantidadCreditos, @CreditosNuevos = inserted.CantidadCreditos
    FROM inserted
    JOIN deleted ON inserted.ID = deleted.ID
    WHERE inserted.CantidadCreditos != deleted.CantidadCreditos
    
    IF @AlumnoID IS NOT NULL
    BEGIN
        INSERT INTO HistorialCreditos (AlumnoID, CantidadCreditosAnterior, CantidadCreditosNuevo)
        VALUES (@AlumnoID, @CreditosAnteriores, @CreditosNuevos)
    END
END

-- Tabla de historial para cambios en la asignación de programas
CREATE TABLE HistorialAsignacionProgramas (
    ID INT PRIMARY KEY IDENTITY(1,1),
    AlumnoID INT,
    ProgramaID INT,
    FechaAsignacion DATETIME DEFAULT GETDATE(),
    EstadoAnterior VARCHAR(50),
    EstadoNuevo VARCHAR(50),
    FOREIGN KEY (AlumnoID) REFERENCES Alumnos(ID),
    FOREIGN KEY (ProgramaID) REFERENCES ProgramasServicioSocial(ID)
)

-- Trigger para registrar cambios en la asignación de programas
CREATE TRIGGER trg_CambioAsignacionProgramas
ON AlumnosOrganizaciones
AFTER UPDATE
AS
BEGIN
    DECLARE @AlumnoID INT, @ProgramaID INT, @EstadoAnterior VARCHAR(50), @EstadoNuevo VARCHAR(50)
    
    SELECT @AlumnoID = inserted.AlumnoID, @ProgramaID = inserted.ProgramaID, @EstadoAnterior = deleted.Estado, @EstadoNuevo = inserted.Estado
    FROM inserted
    JOIN deleted ON inserted.AlumnoID = deleted.AlumnoID AND inserted.ProgramaID = deleted.ProgramaID
    WHERE inserted.Estado != deleted.Estado
    
    IF @AlumnoID IS NOT NULL AND @ProgramaID IS NOT NULL
    BEGIN
        INSERT INTO HistorialAsignacionProgramas (AlumnoID, ProgramaID, EstadoAnterior, EstadoNuevo)
        VALUES (@AlumnoID, @ProgramaID, @EstadoAnterior, @EstadoNuevo)
    END
END

-- Crear roles
CREATE ROLE DBAdmin
CREATE ROLE SSAdmin
CREATE ROLE Tsadb

-- Asignar permisos a los roles

-- Permisos para DBAdmin
GRANT CONTROL ON DATABASE::[NombreBaseDatos] TO DBAdmin

-- Permisos para SSAdmin
GRANT ALTER ANY LOGIN TO SSAdmin
GRANT ALTER ANY USER TO SSAdmin
GRANT ALTER ANY ROLE TO SSAdmin
GRANT VIEW SERVER STATE TO SSAdmin
GRANT ALTER, EXECUTE ON SCHEMA::dbo TO SSAdmin
GRANT INSERT, UPDATE, DELETE, SELECT ON SCHEMA::dbo TO SSAdmin

-- Permisos para Tsadb (Permisos específicos a definir más tarde)
GRANT SELECT ON SCHEMA::dbo TO Tsadb
-- Aquí se pueden añadir otros permisos específicos según se requiera.

-- Crear usuarios y asignarles roles
CREATE USER dbadmin_user FOR LOGIN dbadmin_login
CREATE USER ssadmin_user FOR LOGIN ssadmin_login
CREATE USER tsadb_user FOR LOGIN tsadb_login

ALTER ROLE DBAdmin ADD MEMBER dbadmin_user
ALTER ROLE SSAdmin ADD MEMBER ssadmin_user
ALTER ROLE Tsadb ADD MEMBER tsadb_user

-- Tabla de Administradores de Base de Datos
CREATE TABLE AdministradoresDB (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(100),
    Apellido1 VARCHAR(100),
    Apellido2 VARCHAR(100),
    Rol VARCHAR(50),
    Usuario VARCHAR(50),
    Email VARCHAR(255)
)

-- Insertar administradores en la tabla
INSERT INTO AdministradoresDB (Nombre, Apellido1, Apellido2, Rol, Usuario, Email)
VALUES 
('NombreDBAdmin', 'Apellido1_DBAdmin', 'Apellido2_DBAdmin', 'DBAdmin', 'dbadmin_user', 'email_dbadmin@universidad.com'),
('NombreSSAdmin', 'Apellido1_SSAdmin', 'Apellido2_SSAdmin', 'SSAdmin', 'ssadmin_user', 'email_ssadmin@universidad.com'),
('NombreTsadb', 'Apellido1_Tsadb', 'Apellido2_Tsadb', 'Tsadb', 'tsadb_user', 'email_tsadb@universidad.com')


------

-- Crear roles
CREATE ROLE DBAdmin
CREATE ROLE SSAdmin
CREATE ROLE Tsadb

-- Asignar permisos a los roles

-- Permisos para DBAdmin
GRANT CONTROL ON DATABASE::[NombreBaseDatos] TO DBAdmin

-- Permisos para SSAdmin
GRANT ALTER ANY LOGIN TO SSAdmin
GRANT ALTER ANY USER TO SSAdmin
GRANT ALTER ANY ROLE TO SSAdmin
GRANT VIEW SERVER STATE TO SSAdmin
GRANT ALTER, EXECUTE ON SCHEMA::dbo TO SSAdmin
GRANT INSERT, UPDATE, DELETE, SELECT ON SCHEMA::dbo TO SSAdmin

-- Permisos para Tsadb (Permisos específicos a definir más tarde)
GRANT SELECT ON SCHEMA::dbo TO Tsadb
-- Aquí se pueden añadir otros permisos específicos según se requiera.

-- Crear usuarios y asignarles roles
CREATE USER dbadmin_user FOR LOGIN dbadmin_login
CREATE USER ssadmin_user FOR LOGIN ssadmin_login
CREATE USER tsadb_user FOR LOGIN tsadb_login

ALTER ROLE DBAdmin ADD MEMBER dbadmin_user
ALTER ROLE SSAdmin ADD MEMBER ssadmin_user
ALTER ROLE Tsadb ADD MEMBER tsadb_user

-- Tabla de Administradores de Base de Datos
CREATE TABLE AdministradoresDB (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Nombre VARCHAR(100),
    Apellido1 VARCHAR(100),
    Apellido2 VARCHAR(100),
    Rol VARCHAR(50),
    Usuario VARCHAR(50),
    Email VARCHAR(255)
)

-- Insertar administradores en la tabla
INSERT INTO AdministradoresDB (Nombre, Apellido1, Apellido2, Rol, Usuario, Email)
VALUES 
('NombreDBAdmin', 'Apellido1_DBAdmin', 'Apellido2_DBAdmin', 'DBAdmin', 'dbadmin_user', 'email_dbadmin@universidad.com'),
('NombreSSAdmin', 'Apellido1_SSAdmin', 'Apellido2_SSAdmin', 'SSAdmin', 'ssadmin_user', 'email_ssadmin@universidad.com'),
('NombreTsadb', 'Apellido1_Tsadb', 'Apellido2_Tsadb', 'Tsadb', 'tsadb_user', 'email_tsadb@universidad.com')
