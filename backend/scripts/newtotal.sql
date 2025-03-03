--Funtions
/*-- primera version con errores 15/02/2025
CREATE FUNCTION public.prevent_self_service() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.StudentID = NEW.SupervisorID OR NEW.StudentID = NEW.TeacherID THEN
        RAISE EXCEPTION 'Un estudiante no puede ser su propio maestro o supervisor';
    END IF;

    RETURN NEW;
END;
$$;
 --*/

CREATE OR REPLACE FUNCTION public.prevent_self_service() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Solo verificamos que el StudentID no sea igual al SupervisorID
    IF NEW.StudentID = NEW.SupervisorID THEN
        RAISE EXCEPTION 'Un estudiante no puede ser su propio supervisor';
    END IF;

    RETURN NEW;
END;
$$;

CREATE FUNCTION public.check_person_count() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    total_people INT;
BEGIN
    -- Cuenta cuantas personas se han inscrito
    SELECT COUNT(*) INTO total_people
    FROM StudentOrganizations
    WHERE ProgramID = NEW.ProgramID;
    
    -- Checa si el numero de persona se excede
    IF (total_people + NEW.PersonCount) > 50 THEN
        RAISE EXCEPTION 'El maximo de personas para el programa se ha excedido';
    END IF;

    RETURN NEW;
END;
$$;

CREATE FUNCTION public.check_student_credits() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    student_credits INT;
BEGIN
    -- Cuenta los creditos
    SELECT CreditCount INTO student_credits
    FROM Students
    WHERE ID = NEW.StudentID;

    -- checa si tiene los suficientes
    IF student_credits < 60 THEN
        RAISE EXCEPTION 'El estudiante no tiene lo suficientes creditos';
    END IF;

    RETURN NEW;
END;
$$;

CREATE FUNCTION public.check_program_dates() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Nos aseguramos que las fechas sean corretas
    IF NEW.StartDate >= NEW.EndDate THEN
        RAISE EXCEPTION 'La fecha de inicio no puede ser mayor a la fecha de termino';
    END IF;

    RETURN NEW;
END;
$$;

--Tables
CREATE TABLE public.dbadmins (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname1 VARCHAR(100) NOT NULL,
    lastname2 VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE public.students (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    controlnumber INT NOT NULL UNIQUE,
    lastname1 VARCHAR(100) NOT NULL,
    lastname2 VARCHAR(100),
    semester INT NOT NULL,
    creditcount INT NOT NULL CHECK (creditcount >= 0 AND creditcount <= 100),
    failedcourses INT CHECK (failedcourses >= 0),
    groupname VARCHAR(50),
    specialty VARCHAR(100) NOT NULL,
    phone VARCHAR(15) CHECK (phone ~ '^[0-9]{10}$'),
    address VARCHAR(255),
    profileimage BYTEA,
    socialsecuritynumber INT,
    isinsuranceactive BOOLEAN,
    isenrolled BOOLEAN,
    email VARCHAR(255) NOT NULL UNIQUE,
    CONSTRAINT unique_student_name UNIQUE (firstname, lastname1, lastname2)
);

CREATE TABLE public.organizations (
    id SERIAL PRIMARY KEY,
    organizationname VARCHAR(255) NOT NULL UNIQUE,
    supervisorfirstname VARCHAR(100) NOT NULL,
    supervisorlastname1 VARCHAR(100) NOT NULL,
    supervisorlastname2 VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL CHECK (phone ~ '^[0-9]{10}$') UNIQUE,
    address VARCHAR(255),
    profileimage BYTEA
);

CREATE TABLE public.socialserviceprograms (
    id SERIAL PRIMARY KEY,
    programname VARCHAR(255) NOT NULL,
    duration INT NOT NULL,
    location VARCHAR(255) NOT NULL,
    objectives VARCHAR(1000) NOT NULL,
    activities VARCHAR(1000) NOT NULL,
    startdate DATE NOT NULL,
    enddate TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '6 months'),
    CHECK (startdate < enddate)
);

CREATE TABLE public.managers (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname1 VARCHAR(100) NOT NULL,
    lastname2 VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    email1 VARCHAR(255) NOT NULL UNIQUE,
    email2 VARCHAR(255),
    phone VARCHAR(15) UNIQUE
);

CREATE TABLE public.teachers (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname1 VARCHAR(100) NOT NULL,
    lastname2 VARCHAR(100) NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL CHECK (phone ~ '^[0-9]{10}$'),
    email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE public.supervisors (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname1 VARCHAR(100) NOT NULL,
    lastname2 VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL CHECK (phone ~ '^[0-9]{10}$'),
    email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE public.socialservicesupervisors (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    permissions VARCHAR(255)
);

CREATE TABLE public.credithistory (
    id SERIAL PRIMARY KEY,
    studentid INT REFERENCES students(id),
    changedate DATE DEFAULT CURRENT_TIMESTAMP,
    previouscreditcount INT NOT NULL,
    newcreditcount INT NOT NULL
);

CREATE TABLE public.studentprogramhistory (
    id SERIAL PRIMARY KEY,
    studentid INT REFERENCES students(id),
    programid INT REFERENCES socialserviceprograms(id),
    startdate DATE NOT NULL,
    enddate DATE NOT NULL
);

CREATE TABLE public.supervisorprograms (
    id SERIAL PRIMARY KEY,
    supervisorid INT REFERENCES socialservicesupervisors(id),
    programid INT REFERENCES socialserviceprograms(id)
);

CREATE TABLE public.programassignmenthistory (
    id SERIAL PRIMARY KEY,
    studentid INT REFERENCES students(id),
    programid INT REFERENCES socialserviceprograms(id),
    assignmentdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    previousstatus VARCHAR(50) NOT NULL,
    newstatus VARCHAR(50) NOT NULL
);

-- Tabla principal de seguimiento de bimestres
CREATE TABLE public.bimesters (
    id SERIAL PRIMARY KEY,
    studentid INT NOT NULL REFERENCES students(id),
    programid INT NOT NULL REFERENCES socialserviceprograms(id),
    compromised_card BOOLEAN NOT NULL DEFAULT FALSE,
    accepted_card BOOLEAN NOT NULL DEFAULT FALSE,
    chronogram BOOLEAN NOT NULL DEFAULT FALSE,
    presentation_card BOOLEAN NOT NULL DEFAULT FALSE,
    bimester1 BOOLEAN NOT NULL DEFAULT FALSE,
    bimester2 BOOLEAN NOT NULL DEFAULT FALSE,
    bimester3 BOOLEAN NOT NULL DEFAULT FALSE,
    final_report BOOLEAN NOT NULL DEFAULT FALSE,
    termination_card BOOLEAN NOT NULL DEFAULT FALSE,
    bimester1_completed BOOLEAN NOT NULL DEFAULT FALSE,
    bimester2_completed BOOLEAN NOT NULL DEFAULT FALSE,
    bimester3_completed BOOLEAN NOT NULL DEFAULT FALSE,
    finalreport_completed BOOLEAN NOT NULL DEFAULT FALSE,
    pdf BYTEA,
    CONSTRAINT unique_bimester_entry UNIQUE (studentid, programid)
);

CREATE TABLE public.studentorganizations (
    studentid INT REFERENCES students(id),
    organizationid INT REFERENCES organizations(id),
    supervisorid INT REFERENCES socialservicesupervisors(id),
    programid INT REFERENCES socialserviceprograms(id),
    startdate DATE NOT NULL,
    enddate DATE NOT NULL,
    PRIMARY KEY (studentid, organizationid, supervisorid, programid)
);

CREATE TABLE public.programrequests (
    id SERIAL PRIMARY KEY,
    programid INT REFERENCES socialserviceprograms(id),
    personcount INT NOT NULL
);

CREATE TABLE public.tutors (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname1 VARCHAR(100) NOT NULL,
    lastname2 VARCHAR(100) NOT NULL,
    controlnumber INT NOT NULL,
    position VARCHAR(100) NOT NULL,
    managerid INT REFERENCES managers(id),
    email VARCHAR(255)
);

CREATE TABLE public.users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    usertype VARCHAR(50) NOT NULL CHECK (usertype IN ('student', 'teacher', 'supervisor', 'sys')),
    password BYTEA NOT NULL,
    creationdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expirationdate TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '6 months')
);

-- Tabla para respuestas bimestrales (15 preguntas)
CREATE TABLE public.bimesterresponses (
    id SERIAL PRIMARY KEY,
    bimesterid INT NOT NULL REFERENCES bimesters(id),
    studentid INT NOT NULL REFERENCES students(id),
    programid INT NOT NULL REFERENCES socialserviceprograms(id),
    bimesternumber INT NOT NULL CHECK (bimesternumber BETWEEN 1 AND 3),
    responsedate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    q1 VARCHAR(20) NOT NULL CHECK (q1 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    q2 VARCHAR(20) NOT NULL CHECK (q2 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    q3 VARCHAR(20) NOT NULL CHECK (q3 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    q4 VARCHAR(20) NOT NULL CHECK (q4 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    q5 VARCHAR(20) NOT NULL CHECK (q5 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    q6 VARCHAR(20) NOT NULL CHECK (q6 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    q7 VARCHAR(20) NOT NULL CHECK (q7 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    q8 VARCHAR(20) NOT NULL CHECK (q8 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    q9 VARCHAR(20) NOT NULL CHECK (q9 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    q10 VARCHAR(20) NOT NULL CHECK (q10 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    q11 VARCHAR(20) NOT NULL CHECK (q11 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    q12 VARCHAR(20) NOT NULL CHECK (q12 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    q13 VARCHAR(20) NOT NULL CHECK (q13 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    q14 VARCHAR(20) NOT NULL CHECK (q14 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    q15 VARCHAR(20) NOT NULL CHECK (q15 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    conclusion VARCHAR(1000),
    results VARCHAR(1000),
    CONSTRAINT unique_bimester_response UNIQUE (studentid, programid, bimesternumber)
);

-- Tabla para reporte final (7 preguntas)
CREATE TABLE public.finalreportresponses (
    id SERIAL PRIMARY KEY,
    bimesterid INT NOT NULL REFERENCES bimesters(id),
    studentid INT NOT NULL REFERENCES students(id),
    programid INT NOT NULL REFERENCES socialserviceprograms(id),
    responsedate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    q1 VARCHAR(20) NOT NULL CHECK (q1 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    q2 VARCHAR(20) NOT NULL CHECK (q2 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    q3 VARCHAR(20) NOT NULL CHECK (q3 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    q4 VARCHAR(20) NOT NULL CHECK (q4 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    q5 VARCHAR(20) NOT NULL CHECK (q5 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    q6 VARCHAR(20) NOT NULL CHECK (q6 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    q7 VARCHAR(20) NOT NULL CHECK (q7 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    conclusion VARCHAR(1000),
    results VARCHAR(1000),
    CONSTRAINT unique_final_report UNIQUE (studentid, programid)
);

--Triggers

CREATE TRIGGER trg_prevent_self_service
BEFORE INSERT ON public.StudentOrganizations
FOR EACH ROW EXECUTE FUNCTION public.prevent_self_service();

CREATE TRIGGER trg_check_person_count
BEFORE INSERT ON public.ProgramRequests
FOR EACH ROW EXECUTE FUNCTION public.check_person_count();

CREATE TRIGGER trg_check_student_credits
BEFORE INSERT ON public.StudentOrganizations
FOR EACH ROW EXECUTE FUNCTION public.check_student_credits();

CREATE TRIGGER trg_check_program_dates
BEFORE INSERT OR UPDATE ON public.SocialServicePrograms
FOR EACH ROW EXECUTE FUNCTION public.check_program_dates();

--Foreign Keys
ALTER TABLE public.StudentOrganizations
    ADD CONSTRAINT fk_student FOREIGN KEY (StudentID) REFERENCES Students(ID),
    ADD CONSTRAINT fk_supervisor FOREIGN KEY (SupervisorID) REFERENCES SocialServiceSupervisors(ID),
    ADD CONSTRAINT fk_organization FOREIGN KEY (OrganizationID) REFERENCES Organizations(ID),
    ADD CONSTRAINT fk_program FOREIGN KEY (ProgramID) REFERENCES SocialServicePrograms(ID);

ALTER TABLE public.Bimesters
    ADD CONSTRAINT fk_student FOREIGN KEY (StudentID) REFERENCES Students(ID),
    ADD CONSTRAINT fk_program FOREIGN KEY (ProgramID) REFERENCES SocialServicePrograms(ID);

ALTER TABLE public.ProgramAssignmentHistory
    ADD CONSTRAINT fk_student FOREIGN KEY (StudentID) REFERENCES Students(ID),
    ADD CONSTRAINT fk_program FOREIGN KEY (ProgramID) REFERENCES SocialServicePrograms(ID);

ALTER TABLE public.CreditHistory
    ADD CONSTRAINT fk_student FOREIGN KEY (StudentID) REFERENCES Students(ID);

ALTER TABLE public.StudentProgramHistory
    ADD CONSTRAINT fk_student FOREIGN KEY (StudentID) REFERENCES Students(ID),
    ADD CONSTRAINT fk_program FOREIGN KEY (ProgramID) REFERENCES SocialServicePrograms(ID);

ALTER TABLE public.SupervisorPrograms
    ADD CONSTRAINT fk_supervisor FOREIGN KEY (SupervisorID) REFERENCES SocialServiceSupervisors(ID),
    ADD CONSTRAINT fk_program FOREIGN KEY (ProgramID) REFERENCES SocialServicePrograms(ID);

ALTER TABLE public.ProgramRequests
    ADD CONSTRAINT fk_program FOREIGN KEY (ProgramID) REFERENCES SocialServicePrograms(ID);

ALTER TABLE public.Tutors
    ADD CONSTRAINT fk_manager FOREIGN KEY (ManagerID) REFERENCES Managers(ID);


    -- Insertar datos en la tabla dbadmins
INSERT INTO public.dbadmins (firstname, lastname1, lastname2, role, username, email)
VALUES 
('Carlos', 'García', 'López', 'Administrador del Sistema', 'carlos_admin', 'carlos@example.com'),
('Ana', 'Martínez', 'Gómez', 'Gerente de Base de Datos', 'ana_admin', 'ana@example.com'),
('Luis', 'Fernández', 'Ruiz', 'Administrador de Seguridad', 'luis_admin', 'luis@example.com'),
('María', 'Sánchez', 'Díaz', 'Administrador de Redes', 'maria_admin', 'maria@example.com');

-- Insertar datos en la tabla students
INSERT INTO public.students (firstname, controlnumber, lastname1, lastname2, semester, creditcount, failedcourses, groupname, specialty, phone, address, isinsuranceactive, isenrolled, email)
VALUES 
('Juan', 123456, 'Pérez', 'García', 5, 75, 2, 'Grupo A', 'Ingeniería en Sistemas', '5551234567', 'Calle Principal 123', TRUE, TRUE, 'juan@example.com'),
('Ana', 654321, 'López', 'Martínez', 6, 80, 1, 'Grupo B', 'Ingeniería Eléctrica', '5557654321', 'Avenida Secundaria 456', TRUE, TRUE, 'ana@example.com'),
('Pedro', 112233, 'Gómez', 'Hernández', 4, 65, 3, 'Grupo C', 'Medicina', '5551122334', 'Boulevard Central 789', TRUE, TRUE, 'pedro@example.com'),
('Laura', 445566, 'Díaz', 'Sánchez', 7, 90, 0, 'Grupo D', 'Derecho', '5554455667', 'Calle Juárez 101', TRUE, TRUE, 'laura@example.com');

-- Insertar datos en la tabla socialservicesupervisors
INSERT INTO public.socialservicesupervisors (firstname, position, permissions)
VALUES 
('Roberto', 'Supervisor', 'Acceso Completo'),
('Sofía', 'Supervisora Asistente', 'Acceso Limitado'),
('Miguel', 'Coordinador', 'Acceso Completo'),
('Lucía', 'Asistente', 'Acceso Limitado');

-- Insertar datos en la tabla organizations
INSERT INTO public.organizations (organizationname, supervisorfirstname, supervisorlastname1, supervisorlastname2, position, phone, address)
VALUES 
('Innovadores Tecnológicos', 'Roberto', 'Gómez', 'Fernández', 'Director', '5559876543', 'Boulevard Innovación 789'),
('Tierra Verde', 'Sofía', 'Hernández', 'Díaz', 'Coordinadora', '5556543210', 'Calle Verde 101'),
('Salud para Todos', 'Miguel', 'Ortega', 'Navarro', 'Director', '5551112233', 'Avenida Salud 202'),
('Educación Futura', 'Lucía', 'Vázquez', 'Iglesias', 'Coordinadora', '5552223344', 'Calle Educación 303');

-- Insertar datos en la tabla socialserviceprograms
INSERT INTO public.socialserviceprograms (programname, duration, location, objectives, activities, startdate, enddate)
VALUES 
('Apoyo Tecnológico Comunitario', 6, 'Centro Comunitario Local', 'Brindar soporte técnico', 'Capacitaciones, Sesiones de Soporte', '2023-09-01', '2024-02-28'),
('Conciencia Ambiental', 4, 'Parque de la Ciudad', 'Promover la conciencia ambiental', 'Talleres, Campañas de Limpieza', '2023-10-01', '2024-01-31'),
('Salud en tu Comunidad', 5, 'Clínica Local', 'Mejorar el acceso a la salud', 'Consultas Médicas, Campañas de Vacunación', '2023-11-01', '2024-03-31'),
('Educación para el Futuro', 6, 'Escuela Primaria', 'Fomentar la educación', 'Talleres Educativos, Tutorías', '2023-12-01', '2024-05-31');

-- Insertar datos en la tabla studentorganizations
INSERT INTO public.studentorganizations (studentid, organizationid, supervisorid, programid, startdate, enddate)
VALUES 
(1, 1, 2, 1, '2023-09-01', '2024-02-28'),
(2, 2, 3, 2, '2023-10-01', '2024-01-31'),
(3, 3, 4, 3, '2023-11-01', '2024-03-31'),
(4, 4, 1, 4, '2023-12-01', '2024-05-31');

-- Insertar datos en la tabla programassignmenthistory
INSERT INTO public.programassignmenthistory (studentid, programid, previousstatus, newstatus)
VALUES 
(1, 1, 'Pendiente', 'Activo'),
(2, 2, 'Pendiente', 'Activo'),
(3, 3, 'Pendiente', 'Activo'),
(4, 4, 'Pendiente', 'Activo');

-- Insertar datos en la tabla credithistory
INSERT INTO public.credithistory (studentid, previouscreditcount, newcreditcount)
VALUES 
(1, 70, 75),
(2, 75, 80),
(3, 60, 65),
(4, 85, 90);

-- Insertar datos en la tabla studentprogramhistory
INSERT INTO public.studentprogramhistory (studentid, programid, startdate, enddate)
VALUES 
(1, 1, '2023-09-01', '2024-02-28'),
(2, 2, '2023-10-01', '2024-01-31'),
(3, 3, '2023-11-01', '2024-03-31'),
(4, 4, '2023-12-01', '2024-05-31');

-- Insertar datos en la tabla managers
INSERT INTO public.managers (firstname, lastname1, lastname2, position, email1, phone)
VALUES 
('Luis', 'Fernández', 'Ruiz', 'Gerente Senior', 'luis@example.com', '5551112233'),
('Elena', 'Morales', 'Vega', 'Gerente de Proyectos', 'elena@example.com', '5552223344'),
('Jorge', 'Díaz', 'Moreno', 'Gerente de Operaciones', 'jorge@example.com', '5553334455'),
('Carmen', 'Santos', 'Luna', 'Gerente de Recursos Humanos', 'carmen@example.com', '5554445566');

-- Insertar datos en la tabla teachers
INSERT INTO public.teachers (firstname, lastname1, lastname2, specialty, phone, email)
VALUES 
('Jorge', 'Díaz', 'Moreno', 'Matemáticas', '5553334455', 'jorge@example.com'),
('Carmen', 'Santos', 'Luna', 'Física', '5554445566', 'carmen@example.com'),
('Miguel', 'Ortega', 'Navarro', 'Química', '5555556677', 'miguel@example.com'),
('Lucía', 'Vázquez', 'Iglesias', 'Biología', '5556667788', 'lucia@example.com');

-- Insertar datos en la tabla tutors
INSERT INTO public.tutors (firstname, lastname1, lastname2, controlnumber, position, managerid, email)
VALUES 
('Miguel', 'Ortega', 'Navarro', 112233, 'Tutor Académico', 1, 'miguel@example.com'),
('Lucía', 'Vázquez', 'Iglesias', 223344, 'Asesora de Carrera', 2, 'lucia@example.com'),
('Roberto', 'Gómez', 'Fernández', 334455, 'Tutor de Investigación', 3, 'roberto@example.com'),
('Sofía', 'Hernández', 'Díaz', 445566, 'Asesora de Proyectos', 4, 'sofia@example.com');

-- Insertar datos en la tabla users
INSERT INTO public.users (username, usertype, password)
VALUES 
('juan_estudiante', 'student', 'hashedpassword1'),
('ana_estudiante', 'student', 'hashedpassword2'),
('carlos_supervisor', 'supervisor', 'hashedpassword3'),
('laura_supervisor', 'supervisor', 'hashedpassword4'),
('pedro_estudiante', 'student', 'hashedpassword5'),
('laura_estudiante', 'student', 'hashedpassword6'),
('miguel_supervisor', 'supervisor', 'hashedpassword7'),
('lucia_supervisor', 'supervisor', 'hashedpassword8');

-- Insertar datos en bimesters (actualizado con todas las columnas)
INSERT INTO public.bimesters (
    studentid, 
    programid,
    compromised_card,
    accepted_card,
    chronogram,
    presentation_card,
    bimester1,
    bimester2,
    bimester3,
    final_report,
    termination_card,
    bimester1_completed,
    bimester2_completed,
    bimester3_completed,
    finalreport_completed
) VALUES 
-- Estudiante 1 en Programa 1
(1, 1, TRUE, TRUE, TRUE, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, TRUE, FALSE, FALSE, FALSE),
-- Estudiante 2 en Programa 2
(2, 2, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, FALSE, FALSE, FALSE, TRUE, TRUE, FALSE, FALSE),
-- Estudiante 3 en Programa 3
(3, 3, TRUE, TRUE, TRUE, TRUE, TRUE, FALSE, TRUE, FALSE, FALSE, TRUE, FALSE, TRUE, FALSE),
-- Estudiante 4 en Programa 4
(4, 4, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE);

-- Insertar respuestas de bimestres
INSERT INTO public.bimesterresponses (
    bimesterid,
    studentid,
    programid,
    bimesternumber,
    q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15, conclusion, results
) VALUES
-- Bimestre 1 para Estudiante 1
(1, 1, 1, 1, 
 'bueno', 'excelente', 'suficiente', 'notable', 'bueno',
 'excelente', 'suficiente', 'notable', 'bueno', 'excelente',
 'suficiente', 'notable', 'bueno', 'excelente', 'suficiente', 'Buena conducta', 'Excelentes resultados'),

-- Bimestre 2 para Estudiante 2
(2, 2, 2, 2, 
 'notable', 'bueno', 'excelente', 'suficiente', 'notable',
 'bueno', 'excelente', 'suficiente', 'notable', 'bueno',
 'excelente', 'suficiente', 'notable', 'bueno', 'excelente', 'Buena conducta', 'Excelentes resultados'),

-- Bimestre 3 para Estudiante 3
(3, 3, 3, 3, 
 'excelente', 'suficiente', 'notable', 'bueno', 'excelente',
 'suficiente', 'notable', 'bueno', 'excelente', 'suficiente',
 'notable', 'bueno', 'excelente', 'suficiente', 'notable', 'Buena conducta', 'Excelentes resultados'),

-- Bimestre 1 para Estudiante 4
(4, 4, 4, 1, 
 'excelente', 'excelente', 'excelente', 'excelente', 'excelente',
 'excelente', 'excelente', 'excelente', 'excelente', 'excelente',
 'excelente', 'excelente', 'excelente', 'excelente', 'excelente', 'Buena conducta', 'Excelentes resultados');

-- Insertar reportes finales
INSERT INTO public.finalreportresponses (
    bimesterid,
    studentid,
    programid,
    q1, q2, q3, q4, q5, q6, q7, conclusion, results
) VALUES
-- Reporte final para Estudiante 4
(4, 4, 4, 
 'excelente', 'excelente', 'excelente', 'excelente', 
 'excelente', 'excelente', 'excelente', 'Excelente', 'Excelentes resultados');

-- Actualizar inserts existentes de studentorganizations para coincidir con bimesters
UPDATE public.studentorganizations SET
    startdate = '2023-09-01',
    enddate = '2024-02-28'
WHERE studentid = 1;

UPDATE public.studentorganizations SET
    startdate = '2023-10-01',
    enddate = '2024-01-31'
WHERE studentid = 2;

UPDATE public.studentorganizations SET
    startdate = '2023-11-01',
    enddate = '2024-03-31'
WHERE studentid = 3;

UPDATE public.studentorganizations SET
    startdate = '2023-12-01',
    enddate = '2024-05-31'
WHERE studentid = 4;

-- Actualizar credithistory para reflejar créditos actuales
UPDATE public.credithistory SET
    newcreditcount = 75
WHERE studentid = 1;

UPDATE public.credithistory SET
    newcreditcount = 80
WHERE studentid = 2;

UPDATE public.credithistory SET
    newcreditcount = 65
WHERE studentid = 3;

UPDATE public.credithistory SET
    newcreditcount = 90
WHERE studentid = 4;

-- Insertar más respuestas bimestrales
INSERT INTO public.bimesterresponses (
    bimesterid,
    studentid,
    programid,
    bimesternumber,
    q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15, 
    conclusion, 
    results
) VALUES
    (1, 1, 1, 2,
     'notable', 'bueno', 'suficiente', 'excelente', 'notable',
     'bueno', 'suficiente', 'excelente', 'notable', 'bueno',
     'suficiente', 'excelente', 'notable', 'bueno', 'suficiente', 
     'Buena conducta', 'Excelentes resultados'),

    (1, 1, 1, 3,
     'excelente', 'notable', 'bueno', 'suficiente', 'excelente',
     'notable', 'bueno', 'suficiente', 'excelente', 'notable',
     'bueno', 'suficiente', 'excelente', 'notable', 'bueno', -- Se agregó 'bueno' para q15
     'Buena conducta', 'Excelentes resultados');