-- Borrar un restring
ALTER TABLE Alumnos DROP CONSTRAINT chk_cantidadcreditos;

-- Alterar la tabla de Alumnos
ALTER TABLE Alumnos
ALTER COLUMN Nombres SET NOT NULL,
ALTER COLUMN Apellido1 SET NOT NULL,
ALTER COLUMN Apellido2 SET NOT NULL,
ALTER COLUMN Semestre SET NOT NULL,
ALTER COLUMN CantidadCreditos SET NOT NULL,
ALTER COLUMN Especialidad SET NOT NULL,
ALTER COLUMN Correo SET NOT NULL,
ADD CONSTRAINT chk_CantidadCreditos CHECK (CantidadCreditos BETWEEN 0 AND 100),
ADD CONSTRAINT chk_Reprobadas CHECK (Reprobadas >= 0),
ADD CONSTRAINT chk_TelefonoAlumnos CHECK (Telefono ~ '^[0-9]{10}$');

-- Alterar la tabla de Maestros
ALTER TABLE Maestros
ALTER COLUMN Nombres SET NOT NULL,
ALTER COLUMN Apellido1 SET NOT NULL,
ALTER COLUMN Apellido2 SET NOT NULL,
ALTER COLUMN Especialidad SET NOT NULL,
ALTER COLUMN Telefono SET NOT NULL,
ALTER COLUMN Correo SET NOT NULL,
ADD CONSTRAINT chk_TelefonoMaestros CHECK (Telefono ~ '^[0-9]{10}$');

-- Alterar la tabla de Jefes a Cargo
ALTER TABLE JefesACargo
ALTER COLUMN Nombre SET NOT NULL,
ALTER COLUMN Apellido1 SET NOT NULL,
ALTER COLUMN Apellido2 SET NOT NULL,
ALTER COLUMN Puesto SET NOT NULL,
ALTER COLUMN Correo1 SET NOT NULL;

-- Alterar la tabla de Encargados
ALTER TABLE Encargados
ALTER COLUMN Nombre SET NOT NULL,
ALTER COLUMN Apellido1 SET NOT NULL,
ALTER COLUMN Apellido2 SET NOT NULL,
ALTER COLUMN Cargo SET NOT NULL,
ALTER COLUMN Telefono SET NOT NULL,
ALTER COLUMN Correo SET NOT NULL,
ADD CONSTRAINT chk_TelefonoEncargados CHECK (Telefono ~ '^[0-9]{10}$');

-- Alterar la tabla de AdministradoresDB
ALTER TABLE AdministradoresDB
ALTER COLUMN Nombre SET NOT NULL,
ALTER COLUMN Apellido1 SET NOT NULL,
ALTER COLUMN Apellido2 SET NOT NULL,
ALTER COLUMN Rol SET NOT NULL,
ALTER COLUMN Usuario SET NOT NULL,
ALTER COLUMN Email SET NOT NULL;

-- Alterar la tabla de Usuarios
ALTER TABLE Usuarios
ALTER COLUMN Usuario SET NOT NULL,
ALTER COLUMN TipoUsuario SET NOT NULL,
ALTER COLUMN Contraseña SET NOT NULL;

-- Alterar la tabla de Organizaciones
ALTER TABLE Organizaciones
ALTER COLUMN NombreOrganizacion SET NOT NULL,
ALTER COLUMN NombreEncargado SET NOT NULL,
ALTER COLUMN Apellido1Encargado SET NOT NULL,
ALTER COLUMN Apellido2Encargado SET NOT NULL,
ALTER COLUMN Cargo SET NOT NULL,
ALTER COLUMN Telefono SET NOT NULL,
ADD CONSTRAINT chk_TelefonoOrganizaciones CHECK (Telefono ~ '^[0-9]{10}$');

-- Alterar la tabla de Encargados de Servicio Social
ALTER TABLE EncargadosServicioSocial
ALTER COLUMN Nombre SET NOT NULL,
ALTER COLUMN Cargo SET NOT NULL;

-- Alterar la tabla de Programas de Servicio Social
ALTER TABLE ProgramasServicioSocial
ALTER COLUMN NombrePrograma SET NOT NULL,
ALTER COLUMN Duracion SET NOT NULL,
ALTER COLUMN Locacion SET NOT NULL,
ALTER COLUMN Objetivos SET NOT NULL,
ALTER COLUMN Actividades SET NOT NULL,
ALTER COLUMN FechaInicio SET NOT NULL,
ALTER COLUMN FechaVencimiento SET NOT NULL;

-- Alterar la tabla de AlumnosOrganizaciones
ALTER TABLE AlumnosOrganizaciones
ALTER COLUMN FechaInicio SET NOT NULL,
ALTER COLUMN FechaFin SET NOT NULL;

-- Alterar la tabla de HistorialProgramasAlumnos
ALTER TABLE HistorialProgramasAlumnos
ALTER COLUMN FechaInicio SET NOT NULL,
ALTER COLUMN FechaFin SET NOT NULL;

-- Alterar la tabla de ProgramasEncargados
ALTER TABLE ProgramasEncargados
ALTER COLUMN EncargadoID SET NOT NULL,
ALTER COLUMN ProgramaID SET NOT NULL;

-- Alterar la tabla de Solicitudes de Programas
ALTER TABLE SolicitudesProgramas
ALTER COLUMN CantidadPersonas SET NOT NULL;

-- Alterar la tabla de Bimestres
ALTER TABLE Bimestres
ALTER COLUMN Bimestre1 SET NOT NULL,
ALTER COLUMN Bimestre2 SET NOT NULL,
ALTER COLUMN Bimestre3 SET NOT NULL;

-- Alterar la tabla de Tutores
ALTER TABLE Tutores
ALTER COLUMN Nombre SET NOT NULL,
ALTER COLUMN Apellido1 SET NOT NULL,
ALTER COLUMN Apellido2 SET NOT NULL,
ALTER COLUMN NoControl SET NOT NULL,
ALTER COLUMN Puesto SET NOT NULL;

-- Alterar la tabla de HistorialCreditos
ALTER TABLE HistorialCreditos
ALTER COLUMN CantidadCreditosAnterior SET NOT NULL,
ALTER COLUMN CantidadCreditosNuevo SET NOT NULL;

-- Alterar la tabla de HistorialAsignacionProgramas
ALTER TABLE HistorialAsignacionProgramas
ALTER COLUMN EstadoAnterior SET NOT NULL,
ALTER COLUMN EstadoNuevo SET NOT NULL;

-- Alterar la de JefesACargo
ALTER TABLE JefesACargo
ADD COLUMN Telefono VARCHAR(15);