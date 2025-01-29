--Funtions

CREATE FUNCTION public.prevent_self_service() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.StudentID = NEW.SupervisorID OR NEW.StudentID = NEW.TeacherID THEN
        RAISE EXCEPTION 'A student cannot be their own supervisor or teacher';
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
    -- Count how many people are already enrolled in the program
    SELECT COUNT(*) INTO total_people
    FROM StudentOrganizations
    WHERE ProgramID = NEW.ProgramID;
    
    -- Check if the limit of people is exceeded
    IF (total_people + NEW.PersonCount) > 50 THEN
        RAISE EXCEPTION 'The maximum number of people for this program has been exceeded';
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
    -- Get the student's credit count
    SELECT CreditCount INTO student_credits
    FROM Students
    WHERE ID = NEW.StudentID;

    -- Check if the student has enough credits
    IF student_credits < 60 THEN
        RAISE EXCEPTION 'The student does not have enough credits to participate in the program';
    END IF;

    RETURN NEW;
END;
$$;

CREATE FUNCTION public.check_program_dates() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Ensure the start date is before the end date
    IF NEW.StartDate >= NEW.EndDate THEN
        RAISE EXCEPTION 'The start date cannot be greater than or equal to the end date';
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

CREATE TABLE public.StudentOrganizations (
    StudentID INT REFERENCES Students(ID),
    OrganizationID INT REFERENCES Organizations(ID),
    SupervisorID INT REFERENCES SocialServiceSupervisors(ID),
    ProgramID INT REFERENCES SocialServicePrograms(ID),
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    PRIMARY KEY (StudentID, OrganizationID, SupervisorID, ProgramID)
);

CREATE TABLE public.Bimesters (
    ID SERIAL PRIMARY KEY,
    StudentID INT REFERENCES Students(ID),
    ProgramID INT REFERENCES SocialServicePrograms(ID),
    Bimester1 BOOLEAN NOT NULL,
    Bimester2 BOOLEAN NOT NULL,
    Bimester3 BOOLEAN NOT NULL,
    PDF BYTEA
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

CREATE TABLE public.ProgramAssignmentHistory (
    ID SERIAL PRIMARY KEY,
    StudentID INT REFERENCES Students(ID),
    ProgramID INT REFERENCES SocialServicePrograms(ID),
    AssignmentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PreviousStatus VARCHAR(50) NOT NULL,
    NewStatus VARCHAR(50) NOT NULL
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

CREATE TABLE public.SupervisorPrograms (
    ID SERIAL PRIMARY KEY,
    SupervisorID INT REFERENCES SocialServiceSupervisors(ID),
    ProgramID INT REFERENCES SocialServicePrograms(ID)
);

CREATE TABLE public.SocialServicePrograms (
    ID SERIAL PRIMARY KEY,
    ProgramName VARCHAR(255) NOT NULL,
    Duration INT NOT NULL,
    Location VARCHAR(255) NOT NULL,
    Objectives VARCHAR(1000) NOT NULL,
    Activities VARCHAR(1000) NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    CHECK (StartDate < EndDate)
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