-- Reglas para restricciones

-- Evitar duplicación de nombres completos en Alumnos, Maestros y JefesACargo
ALTER TABLE Alumnos ADD CONSTRAINT uniq_Alumnos_nombre_apellidos UNIQUE (Nombres, Apellido1, Apellido2);
ALTER TABLE Maestros ADD CONSTRAINT uniq_Maestros_nombre_apellidos UNIQUE (Nombres, Apellido1, Apellido2);
ALTER TABLE JefesACargo ADD CONSTRAINT uniq_JefesACargo_nombre_apellidos UNIQUE (Nombre, Apellido1, Apellido2);

-- Evitar duplicación de organizaciones
ALTER TABLE Organizaciones ADD CONSTRAINT uniq_Organizaciones_nombre UNIQUE (NombreOrganizacion);

-- Evitar duplicación de teléfonos
ALTER TABLE Alumnos ADD CONSTRAINT uniq_Alumnos_telefono UNIQUE (Telefono);
ALTER TABLE Maestros ADD CONSTRAINT uniq_Maestros_telefono UNIQUE (Telefono);
ALTER TABLE JefesACargo ADD CONSTRAINT uniq_JefesACargo_telefono UNIQUE (Telefono);
ALTER TABLE Encargados ADD CONSTRAINT uniq_Encargados_telefono UNIQUE (Telefono);
ALTER TABLE Organizaciones ADD CONSTRAINT uniq_Organizaciones_telefono UNIQUE (Telefono);

-- Crear función para verificar cantidad de personas
CREATE OR REPLACE FUNCTION verificar_cantidad_personas()
RETURNS TRIGGER AS $$
DECLARE
    total_personas INT;
BEGIN
    -- Contar cuántas personas ya están inscritas en el programa
    SELECT COUNT(*) INTO total_personas
    FROM AlumnosOrganizaciones
    WHERE ProgramaID = NEW.ProgramaID;
    
    -- Verificar si excede la cantidad de personas permitida
    IF (total_personas + NEW.CantidadPersonas) > 50 THEN
        RAISE EXCEPTION 'Se ha superado el límite de personas para este programa';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para evitar superar la cantidad de personas
CREATE TRIGGER trg_verificar_cantidad_personas
BEFORE INSERT ON SolicitudesProgramas
FOR EACH ROW EXECUTE FUNCTION verificar_cantidad_personas();

-- Crear función para verificar cantidad de créditos de un alumno
CREATE OR REPLACE FUNCTION verificar_creditos_alumno()
RETURNS TRIGGER AS $$
DECLARE
    creditos_alumno INT;
BEGIN
    -- Obtener la cantidad de créditos del alumno
    SELECT CantidadCreditos INTO creditos_alumno
    FROM Alumnos
    WHERE ID = NEW.AlumnoID;

    -- Verificar si el alumno tiene suficientes créditos
    IF creditos_alumno < 60 THEN
        RAISE EXCEPTION 'El alumno no tiene suficientes créditos para participar en el programa';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para verificar créditos del alumno
CREATE TRIGGER trg_verificar_creditos_alumno
BEFORE INSERT ON AlumnosOrganizaciones
FOR EACH ROW EXECUTE FUNCTION verificar_creditos_alumno();

-- Crear función para evitar que un alumno sea su propio encargado o maestro
CREATE OR REPLACE FUNCTION evitar_autoservicio()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.AlumnoID = NEW.EncargadoID OR NEW.AlumnoID = NEW.MaestroID THEN
        RAISE EXCEPTION 'Un alumno no puede ser su propio encargado o maestro';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para evitar autoservicio en AlumnosOrganizaciones
CREATE TRIGGER trg_evitar_autoservicio
BEFORE INSERT ON AlumnosOrganizaciones
FOR EACH ROW EXECUTE FUNCTION evitar_autoservicio();

-- Crear función para verificar fechas de inicio y fin
CREATE OR REPLACE FUNCTION verificar_fechas_programa()
RETURNS TRIGGER AS $$
BEGIN
    -- Verificar que la fecha de inicio sea menor a la fecha de fin
    IF NEW.FechaInicio >= NEW.FechaFin THEN
        RAISE EXCEPTION 'La fecha de inicio no puede ser mayor o igual que la fecha de fin';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para verificar fechas en ProgramasServicioSocial
CREATE TRIGGER trg_verificar_fechas_programa
BEFORE INSERT OR UPDATE ON ProgramasServicioSocial
FOR EACH ROW EXECUTE FUNCTION verificar_fechas_programa();
