-- Crear la tabla de Alumnos
CREATE TABLE Alumnos (
    ID SERIAL PRIMARY KEY,
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
    ImagenPerfil BYTEA,
    SeguroSocial BOOLEAN,
    Correo VARCHAR(255)
);

-- Crear la tabla de Maestros
CREATE TABLE Maestros (
    ID SERIAL PRIMARY KEY,
    Nombres VARCHAR(100),
    Apellido1 VARCHAR(100),
    Apellido2 VARCHAR(100),
    Especialidad VARCHAR(100),
    Telefono VARCHAR(15),
    Correo VARCHAR(255)
);
-- Crear la tabla de Jefes a Cargo
CREATE TABLE JefesACargo (
    ID SERIAL PRIMARY KEY,
    Nombre VARCHAR(100),
    Apellido1 VARCHAR(100),
    Apellido2 VARCHAR(100),
    Puesto VARCHAR(100),
    Correo1 VARCHAR(255),
    Correo2 VARCHAR(255)
);



-- Crear la tabla de Encargados
CREATE TABLE Encargados (
    ID SERIAL PRIMARY KEY,
    Nombre VARCHAR(100),
    Apellido1 VARCHAR(100),
    Apellido2 VARCHAR(100),
    Cargo VARCHAR(100),
    Telefono VARCHAR(15),
    Correo VARCHAR(255)
);


-- Crear la tabla de Administradores de Base de Datos
CREATE TABLE AdministradoresDB (
    ID SERIAL PRIMARY KEY,
    Nombre VARCHAR(100),
    Apellido1 VARCHAR(100),
    Apellido2 VARCHAR(100),
    Rol VARCHAR(50),
    Usuario VARCHAR(50),
    Email VARCHAR(255)
);

-- Crear la tabla de Usuarios
CREATE TABLE Usuarios (
    ID SERIAL PRIMARY KEY,
    Usuario VARCHAR(255) UNIQUE NOT NULL,
    TipoUsuario VARCHAR(50) CHECK (TipoUsuario IN ('alumno', 'maestro', 'encargado', 'sys')),
    Contraseña BYTEA NOT NULL,
    FechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FechaVencimiento TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '6 months'),
    AlumnoID INT NULL,
    MaestroID INT NULL,
    EncargadoID INT NULL,
    FOREIGN KEY (AlumnoID) REFERENCES Alumnos(ID),
    FOREIGN KEY (MaestroID) REFERENCES Maestros(ID),
    FOREIGN KEY (EncargadoID) REFERENCES Encargados(ID)
);

-- Crear la tabla de Organizaciones
CREATE TABLE Organizaciones (
    ID SERIAL PRIMARY KEY,
    NombreOrganizacion VARCHAR(255),
    NombreEncargado VARCHAR(100),
    Apellido1Encargado VARCHAR(100),
    Apellido2Encargado VARCHAR(100),
    Cargo VARCHAR(100),
    Telefono VARCHAR(15),
    Direccion VARCHAR(255),
    ImagenPerfil BYTEA
);

-- Crear la tabla de Encargados de Servicio Social
CREATE TABLE EncargadosServicioSocial (
    ID SERIAL PRIMARY KEY,
    Nombre VARCHAR(100),
    Cargo VARCHAR(100),
    Permisos VARCHAR(255)
);

-- Crear la tabla de Programas de Servicio Social
CREATE TABLE ProgramasServicioSocial (
    ID SERIAL PRIMARY KEY,
    NombrePrograma VARCHAR(255),
    Duracion INT, -- Duración en meses
    Locacion VARCHAR(255),
    Objetivos VARCHAR(1000),
    Actividades VARCHAR(1000),
    FechaInicio DATE,
    FechaVencimiento DATE,
    CONSTRAINT chk_Fechas CHECK (FechaInicio < FechaVencimiento)
);

-- Crear la tabla de Relaciones entre Alumnos y Organizaciones
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
);

-- Crear la tabla de Historial de Programas de Alumnos
CREATE TABLE HistorialProgramasAlumnos (
    ID SERIAL PRIMARY KEY,
    AlumnoID INT,
    ProgramaID INT,
    FechaInicio DATE,
    FechaFin DATE,
    FOREIGN KEY (AlumnoID) REFERENCES Alumnos(ID),
    FOREIGN KEY (ProgramaID) REFERENCES ProgramasServicioSocial(ID)
);

-- Crear la tabla de Programas Encargados
CREATE TABLE ProgramasEncargados (
    ID SERIAL PRIMARY KEY,
    EncargadoID INT,
    ProgramaID INT,
    FOREIGN KEY (EncargadoID) REFERENCES EncargadosServicioSocial(ID),
    FOREIGN KEY (ProgramaID) REFERENCES ProgramasServicioSocial(ID)
);

-- Crear la tabla de Solicitudes de Programas
CREATE TABLE SolicitudesProgramas (
    ID SERIAL PRIMARY KEY,
    ProgramaID INT,
    CantidadPersonas INT,
    FOREIGN KEY (ProgramaID) REFERENCES ProgramasServicioSocial(ID)
);

-- Crear la tabla de Bimestres
CREATE TABLE Bimestres (
    ID SERIAL PRIMARY KEY,
    AlumnoID INT,
    ProgramaID INT,
    Bimestre1 BOOLEAN,
    Bimestre2 BOOLEAN,
    Bimestre3 BOOLEAN,
    PDF BYTEA,
    FOREIGN KEY (AlumnoID) REFERENCES Alumnos(ID),
    FOREIGN KEY (ProgramaID) REFERENCES ProgramasServicioSocial(ID)
);

-- Crear la tabla de Tutores
CREATE TABLE Tutores (
    ID SERIAL PRIMARY KEY,
    Nombre VARCHAR(100),
    Apellido1 VARCHAR(100),
    Apellido2 VARCHAR(100),
    NoControl INT,
    Puesto VARCHAR(100),
    JefeACargoID INT,
    Correo VARCHAR(255),
    FOREIGN KEY (JefeACargoID) REFERENCES JefesACargo(ID)
);



-- Crear la tabla de Historial de Créditos de Alumnos
CREATE TABLE HistorialCreditos (
    ID SERIAL PRIMARY KEY,
    AlumnoID INT,
    FechaCambio DATE DEFAULT CURRENT_TIMESTAMP,
    CantidadCreditosAnterior INT,
    CantidadCreditosNuevo INT,
    FOREIGN KEY (AlumnoID) REFERENCES Alumnos(ID)
);

-- Crear la tabla de Historial de Asignación de Programas
CREATE TABLE HistorialAsignacionProgramas (
    ID SERIAL PRIMARY KEY,
    AlumnoID INT,
    ProgramaID INT,
    FechaAsignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    EstadoAnterior VARCHAR(50),
    EstadoNuevo VARCHAR(50),
    FOREIGN KEY (AlumnoID) REFERENCES Alumnos(ID),
    FOREIGN KEY (ProgramaID) REFERENCES ProgramasServicioSocial(ID)
);



-- Alteraciones
-- Mejoras en la tabla de Alumnos
ALTER TABLE Alumnos
ADD CONSTRAINT chk_CantidadCreditos CHECK (CantidadCreditos BETWEEN 0 AND 100);
