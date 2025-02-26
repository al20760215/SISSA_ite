-- This script was generated by the ERD tool in pgAdmin 4.
-- Please log an issue at https://github.com/pgadmin-org/pgadmin4/issues/new/choose if you find any bugs, including reproduction steps.
BEGIN;


CREATE TABLE IF NOT EXISTS public.administradoresdb
(
    id serial NOT NULL,
    nombre character varying(100) COLLATE pg_catalog."default",
    apellido1 character varying(100) COLLATE pg_catalog."default",
    apellido2 character varying(100) COLLATE pg_catalog."default",
    rol character varying(50) COLLATE pg_catalog."default",
    usuario character varying(50) COLLATE pg_catalog."default",
    email character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT administradoresdb_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.alumnos
(
    id serial NOT NULL,
    nombres character varying(100) COLLATE pg_catalog."default",
    apellido1 character varying(100) COLLATE pg_catalog."default",
    apellido2 character varying(100) COLLATE pg_catalog."default",
    semestre integer,
    cantidadcreditos integer,
    reprobadas integer,
    grupo character varying(50) COLLATE pg_catalog."default",
    especialidad character varying(100) COLLATE pg_catalog."default",
    telefono character varying(15) COLLATE pg_catalog."default",
    direccion character varying(255) COLLATE pg_catalog."default",
    imagenperfil bytea,
    segurosocial boolean,
    correo character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT alumnos_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.alumnosorganizaciones
(
    alumnoid integer NOT NULL,
    organizacionid integer NOT NULL,
    encargadoid integer NOT NULL,
    programaid integer NOT NULL,
    fechainicio date,
    fechafin date,
    CONSTRAINT alumnosorganizaciones_pkey PRIMARY KEY (alumnoid, organizacionid, encargadoid, programaid)
);

CREATE TABLE IF NOT EXISTS public.bimestres
(
    id serial NOT NULL,
    alumnoid integer,
    programaid integer,
    bimestre1 boolean,
    bimestre2 boolean,
    bimestre3 boolean,
    pdf bytea,
    CONSTRAINT bimestres_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.encargados
(
    id serial NOT NULL,
    nombre character varying(100) COLLATE pg_catalog."default",
    apellido1 character varying(100) COLLATE pg_catalog."default",
    apellido2 character varying(100) COLLATE pg_catalog."default",
    cargo character varying(100) COLLATE pg_catalog."default",
    telefono character varying(15) COLLATE pg_catalog."default",
    correo character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT encargados_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.encargadosserviciosocial
(
    id serial NOT NULL,
    nombre character varying(100) COLLATE pg_catalog."default",
    cargo character varying(100) COLLATE pg_catalog."default",
    permisos character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT encargadosserviciosocial_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.historialasignacionprogramas
(
    id serial NOT NULL,
    alumnoid integer,
    programaid integer,
    fechaasignacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    estadoanterior character varying(50) COLLATE pg_catalog."default",
    estadonuevo character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT historialasignacionprogramas_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.historialcreditos
(
    id serial NOT NULL,
    alumnoid integer,
    fechacambio date DEFAULT CURRENT_TIMESTAMP,
    cantidadcreditosanterior integer,
    cantidadcreditosnuevo integer,
    CONSTRAINT historialcreditos_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.historialprogramasalumnos
(
    id serial NOT NULL,
    alumnoid integer,
    programaid integer,
    fechainicio date,
    fechafin date,
    CONSTRAINT historialprogramasalumnos_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.jefesacargo
(
    id serial NOT NULL,
    nombre character varying(100) COLLATE pg_catalog."default",
    apellido1 character varying(100) COLLATE pg_catalog."default",
    apellido2 character varying(100) COLLATE pg_catalog."default",
    puesto character varying(100) COLLATE pg_catalog."default",
    correo1 character varying(255) COLLATE pg_catalog."default",
    correo2 character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT jefesacargo_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.maestros
(
    id serial NOT NULL,
    nombres character varying(100) COLLATE pg_catalog."default",
    apellido1 character varying(100) COLLATE pg_catalog."default",
    apellido2 character varying(100) COLLATE pg_catalog."default",
    especialidad character varying(100) COLLATE pg_catalog."default",
    telefono character varying(15) COLLATE pg_catalog."default",
    correo character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT maestros_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.organizaciones
(
    id serial NOT NULL,
    nombreorganizacion character varying(255) COLLATE pg_catalog."default",
    nombreencargado character varying(100) COLLATE pg_catalog."default",
    apellido1encargado character varying(100) COLLATE pg_catalog."default",
    apellido2encargado character varying(100) COLLATE pg_catalog."default",
    cargo character varying(100) COLLATE pg_catalog."default",
    telefono character varying(15) COLLATE pg_catalog."default",
    direccion character varying(255) COLLATE pg_catalog."default",
    imagenperfil bytea,
    CONSTRAINT organizaciones_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.programasencargados
(
    id serial NOT NULL,
    encargadoid integer,
    programaid integer,
    CONSTRAINT programasencargados_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.programasserviciosocial
(
    id serial NOT NULL,
    nombreprograma character varying(255) COLLATE pg_catalog."default",
    duracion integer,
    locacion character varying(255) COLLATE pg_catalog."default",
    objetivos character varying(1000) COLLATE pg_catalog."default",
    actividades character varying(1000) COLLATE pg_catalog."default",
    fechainicio date,
    fechavencimiento date,
    CONSTRAINT programasserviciosocial_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.solicitudesprogramas
(
    id serial NOT NULL,
    programaid integer,
    cantidadpersonas integer,
    CONSTRAINT solicitudesprogramas_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.tutores
(
    id serial NOT NULL,
    nombre character varying(100) COLLATE pg_catalog."default",
    apellido1 character varying(100) COLLATE pg_catalog."default",
    apellido2 character varying(100) COLLATE pg_catalog."default",
    nocontrol integer,
    puesto character varying(100) COLLATE pg_catalog."default",
    jefeacargoid integer,
    correo character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT tutores_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.usuarios
(
    id serial NOT NULL,
    usuario character varying(255) COLLATE pg_catalog."default" NOT NULL,
    tipousuario character varying(50) COLLATE pg_catalog."default",
    "contraseña" bytea NOT NULL,
    fechacreacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fechavencimiento timestamp without time zone DEFAULT (CURRENT_TIMESTAMP + '6 mons'::interval),
    alumnoid integer,
    maestroid integer,
    encargadoid integer,
    CONSTRAINT usuarios_pkey PRIMARY KEY (id),
    CONSTRAINT usuarios_usuario_key UNIQUE (usuario)
);

ALTER TABLE IF EXISTS public.alumnosorganizaciones
    ADD CONSTRAINT alumnosorganizaciones_alumnoid_fkey FOREIGN KEY (alumnoid)
    REFERENCES public.alumnos (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.alumnosorganizaciones
    ADD CONSTRAINT alumnosorganizaciones_encargadoid_fkey FOREIGN KEY (encargadoid)
    REFERENCES public.encargadosserviciosocial (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.alumnosorganizaciones
    ADD CONSTRAINT alumnosorganizaciones_organizacionid_fkey FOREIGN KEY (organizacionid)
    REFERENCES public.organizaciones (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.alumnosorganizaciones
    ADD CONSTRAINT alumnosorganizaciones_programaid_fkey FOREIGN KEY (programaid)
    REFERENCES public.programasserviciosocial (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.bimestres
    ADD CONSTRAINT bimestres_alumnoid_fkey FOREIGN KEY (alumnoid)
    REFERENCES public.alumnos (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.bimestres
    ADD CONSTRAINT bimestres_programaid_fkey FOREIGN KEY (programaid)
    REFERENCES public.programasserviciosocial (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.historialasignacionprogramas
    ADD CONSTRAINT historialasignacionprogramas_alumnoid_fkey FOREIGN KEY (alumnoid)
    REFERENCES public.alumnos (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.historialasignacionprogramas
    ADD CONSTRAINT historialasignacionprogramas_programaid_fkey FOREIGN KEY (programaid)
    REFERENCES public.programasserviciosocial (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.historialcreditos
    ADD CONSTRAINT historialcreditos_alumnoid_fkey FOREIGN KEY (alumnoid)
    REFERENCES public.alumnos (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.historialprogramasalumnos
    ADD CONSTRAINT historialprogramasalumnos_alumnoid_fkey FOREIGN KEY (alumnoid)
    REFERENCES public.alumnos (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.historialprogramasalumnos
    ADD CONSTRAINT historialprogramasalumnos_programaid_fkey FOREIGN KEY (programaid)
    REFERENCES public.programasserviciosocial (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.programasencargados
    ADD CONSTRAINT programasencargados_encargadoid_fkey FOREIGN KEY (encargadoid)
    REFERENCES public.encargadosserviciosocial (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.programasencargados
    ADD CONSTRAINT programasencargados_programaid_fkey FOREIGN KEY (programaid)
    REFERENCES public.programasserviciosocial (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.solicitudesprogramas
    ADD CONSTRAINT solicitudesprogramas_programaid_fkey FOREIGN KEY (programaid)
    REFERENCES public.programasserviciosocial (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.tutores
    ADD CONSTRAINT tutores_jefeacargoid_fkey FOREIGN KEY (jefeacargoid)
    REFERENCES public.jefesacargo (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.usuarios
    ADD CONSTRAINT usuarios_alumnoid_fkey FOREIGN KEY (alumnoid)
    REFERENCES public.alumnos (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.usuarios
    ADD CONSTRAINT usuarios_encargadoid_fkey FOREIGN KEY (encargadoid)
    REFERENCES public.encargados (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.usuarios
    ADD CONSTRAINT usuarios_maestroid_fkey FOREIGN KEY (maestroid)
    REFERENCES public.maestros (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

END;