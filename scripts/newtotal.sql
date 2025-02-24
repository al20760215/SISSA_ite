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
CREATE TABLE public.DBAdmins (
    ID SERIAL PRIMARY KEY,
    FirstName VARCHAR(100) NOT NULL,
    LastName1 VARCHAR(100) NOT NULL,
    LastName2 VARCHAR(100) NOT NULL,
    Role VARCHAR(50) NOT NULL,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE public.Students (
    ID SERIAL PRIMARY KEY,
    FirstName VARCHAR(100) NOT NULL,
    ControlNumber INT NOT NULL UNIQUE,
    LastName1 VARCHAR(100) NOT NULL,
    LastName2 VARCHAR(100),
    Semester INT NOT NULL,
    CreditCount INT NOT NULL CHECK (CreditCount >= 0 AND CreditCount <= 100),
    FailedCourses INT CHECK (FailedCourses >= 0),
    GroupName VARCHAR(50),
    Specialty VARCHAR(100) NOT NULL,
    Phone VARCHAR(15) CHECK (Phone ~ '^[0-9]{10}$'),
    Address VARCHAR(255),
    ProfileImage BYTEA,
    SocialSecurityNumber INT,
    IsInsuranceActive BOOLEAN,
    IsEnrolled BOOLEAN,
    Email VARCHAR(255) NOT NULL UNIQUE,
    CONSTRAINT Unique_Student_Name UNIQUE (FirstName, LastName1, LastName2)
);

CREATE TABLE public.Organizations (
    ID SERIAL PRIMARY KEY,
    OrganizationName VARCHAR(255) NOT NULL UNIQUE,
    SupervisorFirstName VARCHAR(100) NOT NULL,
    SupervisorLastName1 VARCHAR(100) NOT NULL,
    SupervisorLastName2 VARCHAR(100) NOT NULL,
    Position VARCHAR(100) NOT NULL,
    Phone VARCHAR(15) NOT NULL CHECK (Phone ~ '^[0-9]{10}$') UNIQUE,
    Address VARCHAR(255),
    ProfileImage BYTEA
);

CREATE TABLE public.SocialServicePrograms (
    ID SERIAL PRIMARY KEY,
    ProgramName VARCHAR(255) NOT NULL,
    Duration INT NOT NULL,
    Location VARCHAR(255) NOT NULL,
    Objectives VARCHAR(1000) NOT NULL,
    Activities VARCHAR(1000) NOT NULL,
    StartDate DATE NOT NULL,
    EndDate TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '6 months'),
    --cambio de fecha a 6 meses
    CHECK (StartDate < EndDate)
);

CREATE TABLE public.Managers (
    ID SERIAL PRIMARY KEY,
    FirstName VARCHAR(100) NOT NULL,
    LastName1 VARCHAR(100) NOT NULL,
    LastName2 VARCHAR(100) NOT NULL,
    Position VARCHAR(100) NOT NULL,
    Email1 VARCHAR(255) NOT NULL UNIQUE,
    Email2 VARCHAR(255),
    Phone VARCHAR(15) UNIQUE
);

CREATE TABLE public.Teachers (
    ID SERIAL PRIMARY KEY,
    FirstName VARCHAR(100) NOT NULL,
    LastName1 VARCHAR(100) NOT NULL,
    LastName2 VARCHAR(100) NOT NULL,
    Specialty VARCHAR(100) NOT NULL,
    Phone VARCHAR(15) NOT NULL CHECK (Phone ~ '^[0-9]{10}$'),
    Email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE public.Supervisors (
    ID SERIAL PRIMARY KEY,
    FirstName VARCHAR(100) NOT NULL,
    LastName1 VARCHAR(100) NOT NULL,
    LastName2 VARCHAR(100) NOT NULL,
    Position VARCHAR(100) NOT NULL,
    Phone VARCHAR(15) NOT NULL CHECK (Phone ~ '^[0-9]{10}$'),
    Email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE public.SocialServiceSupervisors (
    ID SERIAL PRIMARY KEY,
    FirstName VARCHAR(100) NOT NULL,
    Position VARCHAR(100) NOT NULL,
    Permissions VARCHAR(255)
);

CREATE TABLE public.CreditHistory (
    ID SERIAL PRIMARY KEY,
    StudentID INT REFERENCES Students(ID),
    ChangeDate DATE DEFAULT CURRENT_TIMESTAMP,
    PreviousCreditCount INT NOT NULL,
    NewCreditCount INT NOT NULL
);

CREATE TABLE public.StudentProgramHistory (
    ID SERIAL PRIMARY KEY,
    StudentID INT REFERENCES Students(ID),
    ProgramID INT REFERENCES SocialServicePrograms(ID),
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL
);

CREATE TABLE public.SupervisorPrograms (
    ID SERIAL PRIMARY KEY,
    SupervisorID INT REFERENCES SocialServiceSupervisors(ID),
    ProgramID INT REFERENCES SocialServicePrograms(ID)
);


CREATE TABLE public.ProgramAssignmentHistory (
    ID SERIAL PRIMARY KEY,
    StudentID INT REFERENCES Students(ID),
    ProgramID INT REFERENCES SocialServicePrograms(ID),
    AssignmentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PreviousStatus VARCHAR(50) NOT NULL,
    NewStatus VARCHAR(50) NOT NULL
);


-- Tabla principal de seguimiento de bimestres
CREATE TABLE public.Bimesters (
    ID SERIAL PRIMARY KEY,
    StudentID INT NOT NULL REFERENCES Students(ID),
    ProgramID INT NOT NULL REFERENCES SocialServicePrograms(ID),
    Compromised_card BOOLEAN NOT NULL DEFAULT FALSE,
    Accepted_card BOOLEAN NOT NULL DEFAULT FALSE,
    Chronogram BOOLEAN NOT NULL DEFAULT FALSE,
    Presentation_card BOOLEAN NOT NULL DEFAULT FALSE,
    Bimester1 BOOLEAN NOT NULL DEFAULT FALSE,
    Bimester2 BOOLEAN NOT NULL DEFAULT FALSE,
    Bimester3 BOOLEAN NOT NULL DEFAULT FALSE,
    Final_report BOOLEAN NOT NULL DEFAULT FALSE,
    Termination_card BOOLEAN NOT NULL DEFAULT FALSE,
    Bimester1_Completed BOOLEAN NOT NULL DEFAULT FALSE,
    Bimester2_Completed BOOLEAN NOT NULL DEFAULT FALSE,
    Bimester3_Completed BOOLEAN NOT NULL DEFAULT FALSE,
    FinalReport_Completed BOOLEAN NOT NULL DEFAULT FALSE,
    PDF BYTEA,
    CONSTRAINT unique_bimester_entry UNIQUE (StudentID, ProgramID)
);


CREATE TABLE public.StudentOrganizations (
    StudentID INT REFERENCES Students(ID),
    OrganizationID INT REFERENCES Organizations(ID),
    SupervisorID INT REFERENCES SocialServiceSupervisors(ID),
    ProgramID INT REFERENCES SocialServicePrograms(ID),
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    PRIMARY KEY (StudentID, OrganizationID, SupervisorID, ProgramID)
);


CREATE TABLE public.ProgramRequests (
    ID SERIAL PRIMARY KEY,
    ProgramID INT REFERENCES SocialServicePrograms(ID),
    PersonCount INT NOT NULL
);

CREATE TABLE public.Tutors (
    ID SERIAL PRIMARY KEY,
    FirstName VARCHAR(100) NOT NULL,
    LastName1 VARCHAR(100) NOT NULL,
    LastName2 VARCHAR(100) NOT NULL,
    ControlNumber INT NOT NULL,
    Position VARCHAR(100) NOT NULL,
    ManagerID INT REFERENCES Managers(ID),
    Email VARCHAR(255)
);

CREATE TABLE public.Users (
    ID SERIAL PRIMARY KEY,
    Username VARCHAR(255) NOT NULL UNIQUE,
    UserType VARCHAR(50) NOT NULL CHECK (UserType IN ('student', 'teacher', 'supervisor', 'sys')),
    Password BYTEA NOT NULL,
    CreationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ExpirationDate TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '6 months')
);



-- Tabla para respuestas bimestrales (15 preguntas)
CREATE TABLE public.BimesterResponses (
    ID SERIAL PRIMARY KEY,
    BimesterID INT NOT NULL REFERENCES Bimesters(ID),
    StudentID INT NOT NULL REFERENCES Students(ID),
    ProgramID INT NOT NULL REFERENCES SocialServicePrograms(ID),
    BimesterNumber INT NOT NULL CHECK (BimesterNumber BETWEEN 1 AND 3),
    ResponseDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Q1 VARCHAR(20) NOT NULL CHECK (Q1 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    Q2 VARCHAR(20) NOT NULL CHECK (Q2 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    Q3 VARCHAR(20) NOT NULL CHECK (Q3 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    Q4 VARCHAR(20) NOT NULL CHECK (Q4 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    Q5 VARCHAR(20) NOT NULL CHECK (Q5 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    Q6 VARCHAR(20) NOT NULL CHECK (Q6 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    Q7 VARCHAR(20) NOT NULL CHECK (Q7 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    Q8 VARCHAR(20) NOT NULL CHECK (Q8 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    Q9 VARCHAR(20) NOT NULL CHECK (Q9 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    Q10 VARCHAR(20) NOT NULL CHECK (Q10 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    Q11 VARCHAR(20) NOT NULL CHECK (Q11 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    Q12 VARCHAR(20) NOT NULL CHECK (Q12 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    Q13 VARCHAR(20) NOT NULL CHECK (Q13 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    Q14 VARCHAR(20) NOT NULL CHECK (Q14 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    Q15 VARCHAR(20) NOT NULL CHECK (Q15 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    Conclusion VARCHAR(1000),
    Results VARCHAR(1000),
    CONSTRAINT unique_bimester_response UNIQUE (StudentID, ProgramID, BimesterNumber)
);

-- Tabla para reporte final (7 preguntas)
CREATE TABLE public.FinalReportResponses (
    ID SERIAL PRIMARY KEY,
    BimesterID INT NOT NULL REFERENCES Bimesters(ID),
    StudentID INT NOT NULL REFERENCES Students(ID),
    ProgramID INT NOT NULL REFERENCES SocialServicePrograms(ID),
    ResponseDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Q1 VARCHAR(20) NOT NULL CHECK (Q1 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    Q2 VARCHAR(20) NOT NULL CHECK (Q2 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    Q3 VARCHAR(20) NOT NULL CHECK (Q3 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    Q4 VARCHAR(20) NOT NULL CHECK (Q4 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    Q5 VARCHAR(20) NOT NULL CHECK (Q5 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    Q6 VARCHAR(20) NOT NULL CHECK (Q6 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    Q7 VARCHAR(20) NOT NULL CHECK (Q7 IN ('insuficiente', 'suficiente', 'bueno', 'notable', 'excelente')),
    Conclusion VARCHAR(1000),
    Results VARCHAR(1000),
    CONSTRAINT unique_final_report UNIQUE (StudentID, ProgramID)
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


    -- Insertar datos en la tabla DBAdmins
INSERT INTO public.DBAdmins (FirstName, LastName1, LastName2, Role, Username, Email)
VALUES 
('Carlos', 'García', 'López', 'Administrador del Sistema', 'carlos_admin', 'carlos@example.com'),
('Ana', 'Martínez', 'Gómez', 'Gerente de Base de Datos', 'ana_admin', 'ana@example.com'),
('Luis', 'Fernández', 'Ruiz', 'Administrador de Seguridad', 'luis_admin', 'luis@example.com'),
('María', 'Sánchez', 'Díaz', 'Administrador de Redes', 'maria_admin', 'maria@example.com');

-- Insertar datos en la tabla Students
INSERT INTO public.Students (FirstName, ControlNumber, LastName1, LastName2, Semester, CreditCount, FailedCourses, GroupName, Specialty, Phone, Address, IsInsuranceActive, IsEnrolled, Email)
VALUES 
('Juan', 123456, 'Pérez', 'García', 5, 75, 2, 'Grupo A', 'Ingeniería en Sistemas', '5551234567', 'Calle Principal 123', TRUE, TRUE, 'juan@example.com'),
('Ana', 654321, 'López', 'Martínez', 6, 80, 1, 'Grupo B', 'Ingeniería Eléctrica', '5557654321', 'Avenida Secundaria 456', TRUE, TRUE, 'ana@example.com'),
('Pedro', 112233, 'Gómez', 'Hernández', 4, 65, 3, 'Grupo C', 'Medicina', '5551122334', 'Boulevard Central 789', TRUE, TRUE, 'pedro@example.com'),
('Laura', 445566, 'Díaz', 'Sánchez', 7, 90, 0, 'Grupo D', 'Derecho', '5554455667', 'Calle Juárez 101', TRUE, TRUE, 'laura@example.com');

-- Insertar datos en la tabla SocialServiceSupervisors
INSERT INTO public.SocialServiceSupervisors (FirstName, Position, Permissions)
VALUES 
('Roberto', 'Supervisor', 'Acceso Completo'),
('Sofía', 'Supervisora Asistente', 'Acceso Limitado'),
('Miguel', 'Coordinador', 'Acceso Completo'),
('Lucía', 'Asistente', 'Acceso Limitado');

-- Insertar datos en la tabla Organizations
INSERT INTO public.Organizations (OrganizationName, SupervisorFirstName, SupervisorLastName1, SupervisorLastName2, Position, Phone, Address)
VALUES 
('Innovadores Tecnológicos', 'Roberto', 'Gómez', 'Fernández', 'Director', '5559876543', 'Boulevard Innovación 789'),
('Tierra Verde', 'Sofía', 'Hernández', 'Díaz', 'Coordinadora', '5556543210', 'Calle Verde 101'),
('Salud para Todos', 'Miguel', 'Ortega', 'Navarro', 'Director', '5551112233', 'Avenida Salud 202'),
('Educación Futura', 'Lucía', 'Vázquez', 'Iglesias', 'Coordinadora', '5552223344', 'Calle Educación 303');

-- Insertar datos en la tabla SocialServicePrograms
INSERT INTO public.SocialServicePrograms (ProgramName, Duration, Location, Objectives, Activities, StartDate, EndDate)
VALUES 
('Apoyo Tecnológico Comunitario', 6, 'Centro Comunitario Local', 'Brindar soporte técnico', 'Capacitaciones, Sesiones de Soporte', '2023-09-01', '2024-02-28'),
('Conciencia Ambiental', 4, 'Parque de la Ciudad', 'Promover la conciencia ambiental', 'Talleres, Campañas de Limpieza', '2023-10-01', '2024-01-31'),
('Salud en tu Comunidad', 5, 'Clínica Local', 'Mejorar el acceso a la salud', 'Consultas Médicas, Campañas de Vacunación', '2023-11-01', '2024-03-31'),
('Educación para el Futuro', 6, 'Escuela Primaria', 'Fomentar la educación', 'Talleres Educativos, Tutorías', '2023-12-01', '2024-05-31');

-- Insertar datos en la tabla StudentOrganizations
INSERT INTO public.StudentOrganizations (StudentID, OrganizationID, SupervisorID, ProgramID, StartDate, EndDate)
VALUES 
(1, 1, 2, 1, '2023-09-01', '2024-02-28'),
(2, 2, 3, 2, '2023-10-01', '2024-01-31'),
(3, 3, 4, 3, '2023-11-01', '2024-03-31'),
(4, 4, 1, 4, '2023-12-01', '2024-05-31');
/*
-- Insertar datos en la tabla Bimesters (versión corregida)
INSERT INTO public.Bimesters (
    StudentID, 
    ProgramID, 
    Compromised_card, 
    Accepted_card, 
    Chronogram, 
    Presentation_card, 
    Bimester1, 
    Bimester2, 
    Bimester3, 
    Final_report, 
    Termination_card
)
VALUES 
(1, 1, TRUE, TRUE, TRUE, TRUE, TRUE, FALSE, FALSE, TRUE, FALSE),
(2, 2, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, FALSE, TRUE, FALSE),
(3, 3, TRUE, TRUE, TRUE, TRUE, TRUE, FALSE, TRUE, TRUE, FALSE),
(4, 4, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE);*/

-- Insertar datos en la tabla ProgramAssignmentHistory
INSERT INTO public.ProgramAssignmentHistory (StudentID, ProgramID, PreviousStatus, NewStatus)
VALUES 
(1, 1, 'Pendiente', 'Activo'),
(2, 2, 'Pendiente', 'Activo'),
(3, 3, 'Pendiente', 'Activo'),
(4, 4, 'Pendiente', 'Activo');

-- Insertar datos en la tabla CreditHistory
INSERT INTO public.CreditHistory (StudentID, PreviousCreditCount, NewCreditCount)
VALUES 
(1, 70, 75),
(2, 75, 80),
(3, 60, 65),
(4, 85, 90);

-- Insertar datos en la tabla StudentProgramHistory
INSERT INTO public.StudentProgramHistory (StudentID, ProgramID, StartDate, EndDate)
VALUES 
(1, 1, '2023-09-01', '2024-02-28'),
(2, 2, '2023-10-01', '2024-01-31'),
(3, 3, '2023-11-01', '2024-03-31'),
(4, 4, '2023-12-01', '2024-05-31');

-- Insertar datos en la tabla Managers
INSERT INTO public.Managers (FirstName, LastName1, LastName2, Position, Email1, Phone)
VALUES 
('Luis', 'Fernández', 'Ruiz', 'Gerente Senior', 'luis@example.com', '5551112233'),
('Elena', 'Morales', 'Vega', 'Gerente de Proyectos', 'elena@example.com', '5552223344'),
('Jorge', 'Díaz', 'Moreno', 'Gerente de Operaciones', 'jorge@example.com', '5553334455'),
('Carmen', 'Santos', 'Luna', 'Gerente de Recursos Humanos', 'carmen@example.com', '5554445566');

-- Insertar datos en la tabla Teachers
INSERT INTO public.Teachers (FirstName, LastName1, LastName2, Specialty, Phone, Email)
VALUES 
('Jorge', 'Díaz', 'Moreno', 'Matemáticas', '5553334455', 'jorge@example.com'),
('Carmen', 'Santos', 'Luna', 'Física', '5554445566', 'carmen@example.com'),
('Miguel', 'Ortega', 'Navarro', 'Química', '5555556677', 'miguel@example.com'),
('Lucía', 'Vázquez', 'Iglesias', 'Biología', '5556667788', 'lucia@example.com');

-- Insertar datos en la tabla Tutors
INSERT INTO public.Tutors (FirstName, LastName1, LastName2, ControlNumber, Position, ManagerID, Email)
VALUES 
('Miguel', 'Ortega', 'Navarro', 112233, 'Tutor Académico', 1, 'miguel@example.com'),
('Lucía', 'Vázquez', 'Iglesias', 223344, 'Asesora de Carrera', 2, 'lucia@example.com'),
('Roberto', 'Gómez', 'Fernández', 334455, 'Tutor de Investigación', 3, 'roberto@example.com'),
('Sofía', 'Hernández', 'Díaz', 445566, 'Asesora de Proyectos', 4, 'sofia@example.com');

-- Insertar datos en la tabla Users
INSERT INTO public.Users (Username, UserType, Password)
VALUES 
('juan_estudiante', 'student', 'hashedpassword1'),
('ana_estudiante', 'student', 'hashedpassword2'),
('carlos_supervisor', 'supervisor', 'hashedpassword3'),
('laura_supervisor', 'supervisor', 'hashedpassword4'),
('pedro_estudiante', 'student', 'hashedpassword5'),
('laura_estudiante', 'student', 'hashedpassword6'),
('miguel_supervisor', 'supervisor', 'hashedpassword7'),
('lucia_supervisor', 'supervisor', 'hashedpassword8');

-- Insertar datos en Bimesters (actualizado con todas las columnas)
INSERT INTO public.Bimesters (
    StudentID, 
    ProgramID,
    Compromised_card,
    Accepted_card,
    Chronogram,
    Presentation_card,
    Bimester1,
    Bimester2,
    Bimester3,
    Final_report,
    Termination_card,
    Bimester1_Completed,
    Bimester2_Completed,
    Bimester3_Completed,
    FinalReport_Completed
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
INSERT INTO public.BimesterResponses (
    BimesterID,
    StudentID,
    ProgramID,
    BimesterNumber,
    Q1, Q2, Q3, Q4, Q5, Q6, Q7, Q8, Q9, Q10, Q11, Q12, Q13, Q14, Q15
) VALUES
-- Bimestre 1 para Estudiante 1
(1, 1, 1, 1, 
 'bueno', 'excelente', 'suficiente', 'notable', 'bueno',
 'excelente', 'suficiente', 'notable', 'bueno', 'excelente',
 'suficiente', 'notable', 'bueno', 'excelente', 'suficiente'),

-- Bimestre 2 para Estudiante 2
(2, 2, 2, 2, 
 'notable', 'bueno', 'excelente', 'suficiente', 'notable',
 'bueno', 'excelente', 'suficiente', 'notable', 'bueno',
 'excelente', 'suficiente', 'notable', 'bueno', 'excelente'),

-- Bimestre 3 para Estudiante 3
(3, 3, 3, 3, 
 'excelente', 'suficiente', 'notable', 'bueno', 'excelente',
 'suficiente', 'notable', 'bueno', 'excelente', 'suficiente',
 'notable', 'bueno', 'excelente', 'suficiente', 'notable'),

-- Bimestre 1 para Estudiante 4
(4, 4, 4, 1, 
 'excelente', 'excelente', 'excelente', 'excelente', 'excelente',
 'excelente', 'excelente', 'excelente', 'excelente', 'excelente',
 'excelente', 'excelente', 'excelente', 'excelente', 'excelente');

-- Insertar reportes finales
INSERT INTO public.FinalReportResponses (
    BimesterID,
    StudentID,
    ProgramID,
    Q1, Q2, Q3, Q4, Q5, Q6, Q7, Conclusion, Results
) VALUES
-- Reporte final para Estudiante 4
(4, 4, 4, 
 'excelente', 'excelente', 'excelente', 'excelente', 
 'excelente', 'excelente', 'excelente', 'Excelente', 'Excelentes resultados');

-- Actualizar inserts existentes de StudentOrganizations para coincidir con Bimesters
UPDATE public.StudentOrganizations SET
    StartDate = '2023-09-01',
    EndDate = '2024-02-28'
WHERE StudentID = 1;

UPDATE public.StudentOrganizations SET
    StartDate = '2023-10-01',
    EndDate = '2024-01-31'
WHERE StudentID = 2;

UPDATE public.StudentOrganizations SET
    StartDate = '2023-11-01',
    EndDate = '2024-03-31'
WHERE StudentID = 3;

UPDATE public.StudentOrganizations SET
    StartDate = '2023-12-01',
    EndDate = '2024-05-31'
WHERE StudentID = 4;

-- Actualizar CreditHistory para reflejar créditos actuales
UPDATE public.CreditHistory SET
    NewCreditCount = 75
WHERE StudentID = 1;

UPDATE public.CreditHistory SET
    NewCreditCount = 80
WHERE StudentID = 2;

UPDATE public.CreditHistory SET
    NewCreditCount = 65
WHERE StudentID = 3;

UPDATE public.CreditHistory SET
    NewCreditCount = 90
WHERE StudentID = 4;

-- Insertar más respuestas bimestrales
INSERT INTO public.BimesterResponses (
    BimesterID,
    StudentID,
    ProgramID,
    BimesterNumber,
    Q1, Q2, Q3, Q4, Q5, Q6, Q7, Q8, Q9, Q10, Q11, Q12, Q13, Q14, Q15, Conclusion, Results
) VALUES
(1, 1, 1, 2, 
 'notable', 'bueno', 'suficiente', 'excelente', 'notable',
 'bueno', 'suficiente', 'excelente', 'notable', 'bueno',
 'suficiente', 'excelente', 'notable', 'bueno', 'suficiente', 'Buena conducta', 'Excelentes resultados'),

(1, 1, 1, 3, 
 'excelente', 'notable', 'bueno', 'suficiente', 'excelente',
 'notable', 'bueno', 'suficiente', 'excelente', 'notable',
 'bueno', 'suficiente', 'excelente', 'notable', 'Buena conducta', 'Excelentes resultados');