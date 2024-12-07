--
-- PostgreSQL database dump
--

-- Dumped from database version 17.1
-- Dumped by pg_dump version 17.1

-- Started on 2024-11-26 20:11:26

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
-- SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 252 (class 1255 OID 17185)
-- Name: evitar_autoservicio(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.evitar_autoservicio() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.AlumnoID = NEW.EncargadoID OR NEW.AlumnoID = NEW.MaestroID THEN
        RAISE EXCEPTION 'Un alumno no puede ser su propio encargado o maestro';
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.evitar_autoservicio() OWNER TO postgres;

--
-- TOC entry 250 (class 1255 OID 17181)
-- Name: verificar_cantidad_personas(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.verificar_cantidad_personas() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.verificar_cantidad_personas() OWNER TO postgres;

--
-- TOC entry 251 (class 1255 OID 17183)
-- Name: verificar_creditos_alumno(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.verificar_creditos_alumno() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.verificar_creditos_alumno() OWNER TO postgres;

--
-- TOC entry 253 (class 1255 OID 17187)
-- Name: verificar_fechas_programa(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.verificar_fechas_programa() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Verificar que la fecha de inicio sea menor a la fecha de fin
    IF NEW.FechaInicio >= NEW.FechaFin THEN
        RAISE EXCEPTION 'La fecha de inicio no puede ser mayor o igual que la fecha de fin';
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.verificar_fechas_programa() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 226 (class 1259 OID 16945)
-- Name: administradoresdb; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.administradoresdb (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    apellido1 character varying(100) NOT NULL,
    apellido2 character varying(100) NOT NULL,
    rol character varying(50) NOT NULL,
    usuario character varying(50) NOT NULL,
    email character varying(255) NOT NULL
);


ALTER TABLE public.administradoresdb OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16944)
-- Name: administradoresdb_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.administradoresdb_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.administradoresdb_id_seq OWNER TO postgres;

--
-- TOC entry 5011 (class 0 OID 0)
-- Dependencies: 225
-- Name: administradoresdb_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.administradoresdb_id_seq OWNED BY public.administradoresdb.id;


--
-- TOC entry 218 (class 1259 OID 16909)
-- Name: alumnos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alumnos (
    id integer NOT NULL,
    nombres character varying(100) NOT NULL,
    apellido1 character varying(100) NOT NULL,
    apellido2 character varying(100) NOT NULL,
    semestre integer NOT NULL,
    cantidadcreditos integer NOT NULL,
    reprobadas integer,
    grupo character varying(50),
    especialidad character varying(100) NOT NULL,
    telefono character varying(15),
    direccion character varying(255),
    imagenperfil bytea,
    segurosocial boolean,
    correo character varying(255) NOT NULL,
    CONSTRAINT chk_cantidadcreditos CHECK (((cantidadcreditos >= 0) AND (cantidadcreditos <= 100))),
    CONSTRAINT chk_reprobadas CHECK ((reprobadas >= 0)),
    CONSTRAINT chk_telefonoalumnos CHECK (((telefono)::text ~ '^[0-9]{10}$'::text))
);


ALTER TABLE public.alumnos OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16908)
-- Name: alumnos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.alumnos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.alumnos_id_seq OWNER TO postgres;

--
-- TOC entry 5012 (class 0 OID 0)
-- Dependencies: 217
-- Name: alumnos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.alumnos_id_seq OWNED BY public.alumnos.id;


--
-- TOC entry 235 (class 1259 OID 17008)
-- Name: alumnosorganizaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alumnosorganizaciones (
    alumnoid integer NOT NULL,
    organizacionid integer NOT NULL,
    encargadoid integer NOT NULL,
    programaid integer NOT NULL,
    fechainicio date NOT NULL,
    fechafin date NOT NULL
);


ALTER TABLE public.alumnosorganizaciones OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 17080)
-- Name: bimestres; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bimestres (
    id integer NOT NULL,
    alumnoid integer,
    programaid integer,
    bimestre1 boolean NOT NULL,
    bimestre2 boolean NOT NULL,
    bimestre3 boolean NOT NULL,
    pdf bytea
);


ALTER TABLE public.bimestres OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 17079)
-- Name: bimestres_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bimestres_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bimestres_id_seq OWNER TO postgres;

--
-- TOC entry 5013 (class 0 OID 0)
-- Dependencies: 242
-- Name: bimestres_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bimestres_id_seq OWNED BY public.bimestres.id;


--
-- TOC entry 224 (class 1259 OID 16936)
-- Name: encargados; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.encargados (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    apellido1 character varying(100) NOT NULL,
    apellido2 character varying(100) NOT NULL,
    cargo character varying(100) NOT NULL,
    telefono character varying(15) NOT NULL,
    correo character varying(255) NOT NULL,
    CONSTRAINT chk_telefonoencargados CHECK (((telefono)::text ~ '^[0-9]{10}$'::text))
);


ALTER TABLE public.encargados OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16935)
-- Name: encargados_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.encargados_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.encargados_id_seq OWNER TO postgres;

--
-- TOC entry 5014 (class 0 OID 0)
-- Dependencies: 223
-- Name: encargados_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.encargados_id_seq OWNED BY public.encargados.id;


--
-- TOC entry 232 (class 1259 OID 16992)
-- Name: encargadosserviciosocial; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.encargadosserviciosocial (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    cargo character varying(100) NOT NULL,
    permisos character varying(255)
);


ALTER TABLE public.encargadosserviciosocial OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16991)
-- Name: encargadosserviciosocial_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.encargadosserviciosocial_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.encargadosserviciosocial_id_seq OWNER TO postgres;

--
-- TOC entry 5015 (class 0 OID 0)
-- Dependencies: 231
-- Name: encargadosserviciosocial_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.encargadosserviciosocial_id_seq OWNED BY public.encargadosserviciosocial.id;


--
-- TOC entry 249 (class 1259 OID 17126)
-- Name: historialasignacionprogramas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historialasignacionprogramas (
    id integer NOT NULL,
    alumnoid integer,
    programaid integer,
    fechaasignacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    estadoanterior character varying(50) NOT NULL,
    estadonuevo character varying(50) NOT NULL
);


ALTER TABLE public.historialasignacionprogramas OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 17125)
-- Name: historialasignacionprogramas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.historialasignacionprogramas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.historialasignacionprogramas_id_seq OWNER TO postgres;

--
-- TOC entry 5016 (class 0 OID 0)
-- Dependencies: 248
-- Name: historialasignacionprogramas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.historialasignacionprogramas_id_seq OWNED BY public.historialasignacionprogramas.id;


--
-- TOC entry 247 (class 1259 OID 17113)
-- Name: historialcreditos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historialcreditos (
    id integer NOT NULL,
    alumnoid integer,
    fechacambio date DEFAULT CURRENT_TIMESTAMP,
    cantidadcreditosanterior integer NOT NULL,
    cantidadcreditosnuevo integer NOT NULL
);


ALTER TABLE public.historialcreditos OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 17112)
-- Name: historialcreditos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.historialcreditos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.historialcreditos_id_seq OWNER TO postgres;

--
-- TOC entry 5017 (class 0 OID 0)
-- Dependencies: 246
-- Name: historialcreditos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.historialcreditos_id_seq OWNED BY public.historialcreditos.id;


--
-- TOC entry 237 (class 1259 OID 17034)
-- Name: historialprogramasalumnos; Type: TABLE; Schema: public; Owner: postgres
--
-- validado

CREATE TABLE public.historialprogramasalumnos (
    id integer NOT NULL,
    alumnoid integer,
    programaid integer,
    fechainicio date NOT NULL,
    fechafin date NOT NULL
);


ALTER TABLE public.historialprogramasalumnos OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 17033)
-- Name: historialprogramasalumnos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.historialprogramasalumnos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.historialprogramasalumnos_id_seq OWNER TO postgres;

--
-- TOC entry 5018 (class 0 OID 0)
-- Dependencies: 236
-- Name: historialprogramasalumnos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.historialprogramasalumnos_id_seq OWNED BY public.historialprogramasalumnos.id;


--
-- TOC entry 222 (class 1259 OID 16927)
-- Name: jefesacargo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jefesacargo (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    apellido1 character varying(100) NOT NULL,
    apellido2 character varying(100) NOT NULL,
    puesto character varying(100) NOT NULL,
    correo1 character varying(255) NOT NULL,
    correo2 character varying(255),
    telefono character varying(15)
);


ALTER TABLE public.jefesacargo OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16926)
-- Name: jefesacargo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.jefesacargo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.jefesacargo_id_seq OWNER TO postgres;

--
-- TOC entry 5019 (class 0 OID 0)
-- Dependencies: 221
-- Name: jefesacargo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jefesacargo_id_seq OWNED BY public.jefesacargo.id;


--
-- TOC entry 220 (class 1259 OID 16918)
-- Name: maestros; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.maestros (
    id integer NOT NULL,
    nombres character varying(100) NOT NULL,
    apellido1 character varying(100) NOT NULL,
    apellido2 character varying(100) NOT NULL,
    especialidad character varying(100) NOT NULL,
    telefono character varying(15) NOT NULL,
    correo character varying(255) NOT NULL,
    CONSTRAINT chk_telefonomaestros CHECK (((telefono)::text ~ '^[0-9]{10}$'::text))
);


ALTER TABLE public.maestros OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16917)
-- Name: maestros_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.maestros_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.maestros_id_seq OWNER TO postgres;

--
-- TOC entry 5020 (class 0 OID 0)
-- Dependencies: 219
-- Name: maestros_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.maestros_id_seq OWNED BY public.maestros.id;


--
-- TOC entry 230 (class 1259 OID 16983)
-- Name: organizaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.organizaciones (
    id integer NOT NULL,
    nombreorganizacion character varying(255) NOT NULL,
    nombreencargado character varying(100) NOT NULL,
    apellido1encargado character varying(100) NOT NULL,
    apellido2encargado character varying(100) NOT NULL,
    cargo character varying(100) NOT NULL,
    telefono character varying(15) NOT NULL,
    direccion character varying(255),
    imagenperfil bytea,
    CONSTRAINT chk_telefonoorganizaciones CHECK (((telefono)::text ~ '^[0-9]{10}$'::text))
);


ALTER TABLE public.organizaciones OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16982)
-- Name: organizaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.organizaciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.organizaciones_id_seq OWNER TO postgres;

--
-- TOC entry 5021 (class 0 OID 0)
-- Dependencies: 229
-- Name: organizaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.organizaciones_id_seq OWNED BY public.organizaciones.id;


--
-- TOC entry 239 (class 1259 OID 17051)
-- Name: programasencargados; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.programasencargados (
    id integer NOT NULL,
    encargadoid integer NOT NULL,
    programaid integer NOT NULL
);


ALTER TABLE public.programasencargados OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 17050)
-- Name: programasencargados_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.programasencargados_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.programasencargados_id_seq OWNER TO postgres;

--
-- TOC entry 5022 (class 0 OID 0)
-- Dependencies: 238
-- Name: programasencargados_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.programasencargados_id_seq OWNED BY public.programasencargados.id;


--
-- TOC entry 234 (class 1259 OID 16999)
-- Name: programasserviciosocial; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.programasserviciosocial (
    id integer NOT NULL,
    nombreprograma character varying(255) NOT NULL,
    duracion integer NOT NULL,
    locacion character varying(255) NOT NULL,
    objetivos character varying(1000) NOT NULL,
    actividades character varying(1000) NOT NULL,
    fechainicio date NOT NULL,
    fechavencimiento date NOT NULL,
    CONSTRAINT chk_fechas CHECK ((fechainicio < fechavencimiento))
);


ALTER TABLE public.programasserviciosocial OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16998)
-- Name: programasserviciosocial_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.programasserviciosocial_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.programasserviciosocial_id_seq OWNER TO postgres;

--
-- TOC entry 5023 (class 0 OID 0)
-- Dependencies: 233
-- Name: programasserviciosocial_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.programasserviciosocial_id_seq OWNED BY public.programasserviciosocial.id;


--
-- TOC entry 241 (class 1259 OID 17068)
-- Name: solicitudesprogramas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.solicitudesprogramas (
    id integer NOT NULL,
    programaid integer,
    cantidadpersonas integer NOT NULL
);


ALTER TABLE public.solicitudesprogramas OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 17067)
-- Name: solicitudesprogramas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.solicitudesprogramas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.solicitudesprogramas_id_seq OWNER TO postgres;

--
-- TOC entry 5024 (class 0 OID 0)
-- Dependencies: 240
-- Name: solicitudesprogramas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.solicitudesprogramas_id_seq OWNED BY public.solicitudesprogramas.id;


--
-- TOC entry 245 (class 1259 OID 17099)
-- Name: tutores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tutores (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    apellido1 character varying(100) NOT NULL,
    apellido2 character varying(100) NOT NULL,
    nocontrol integer NOT NULL,
    puesto character varying(100) NOT NULL,
    jefeacargoid integer,
    correo character varying(255)
);


ALTER TABLE public.tutores OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 17098)
-- Name: tutores_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tutores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tutores_id_seq OWNER TO postgres;

--
-- TOC entry 5025 (class 0 OID 0)
-- Dependencies: 244
-- Name: tutores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tutores_id_seq OWNED BY public.tutores.id;


--
-- TOC entry 228 (class 1259 OID 16954)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    usuario character varying(255) NOT NULL,
    tipousuario character varying(50) NOT NULL,
    "contraseña" bytea NOT NULL,
    fechacreacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fechavencimiento timestamp without time zone DEFAULT (CURRENT_TIMESTAMP + '6 mons'::interval),
    CONSTRAINT usuarios_tipousuario_check CHECK (((tipousuario)::text = ANY ((ARRAY['alumno'::character varying, 'maestro'::character varying, 'encargado'::character varying, 'sys'::character varying])::text[])))
);


--
-- TOC entry 227 (class 1259 OID 16953)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- TOC entry 5026 (class 0 OID 0)
-- Dependencies: 227
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 4728 (class 2604 OID 16948)
-- Name: administradoresdb id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administradoresdb ALTER COLUMN id SET DEFAULT nextval('public.administradoresdb_id_seq'::regclass);


--
-- TOC entry 4724 (class 2604 OID 16912)
-- Name: alumnos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumnos ALTER COLUMN id SET DEFAULT nextval('public.alumnos_id_seq'::regclass);


--
-- TOC entry 4738 (class 2604 OID 17083)
-- Name: bimestres id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bimestres ALTER COLUMN id SET DEFAULT nextval('public.bimestres_id_seq'::regclass);


--
-- TOC entry 4727 (class 2604 OID 16939)
-- Name: encargados id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encargados ALTER COLUMN id SET DEFAULT nextval('public.encargados_id_seq'::regclass);


--
-- TOC entry 4733 (class 2604 OID 16995)
-- Name: encargadosserviciosocial id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encargadosserviciosocial ALTER COLUMN id SET DEFAULT nextval('public.encargadosserviciosocial_id_seq'::regclass);


--
-- TOC entry 4742 (class 2604 OID 17129)
-- Name: historialasignacionprogramas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historialasignacionprogramas ALTER COLUMN id SET DEFAULT nextval('public.historialasignacionprogramas_id_seq'::regclass);


--
-- TOC entry 4740 (class 2604 OID 17116)
-- Name: historialcreditos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historialcreditos ALTER COLUMN id SET DEFAULT nextval('public.historialcreditos_id_seq'::regclass);


--
-- TOC entry 4735 (class 2604 OID 17037)
-- Name: historialprogramasalumnos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historialprogramasalumnos ALTER COLUMN id SET DEFAULT nextval('public.historialprogramasalumnos_id_seq'::regclass);


--
-- TOC entry 4726 (class 2604 OID 16930)
-- Name: jefesacargo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jefesacargo ALTER COLUMN id SET DEFAULT nextval('public.jefesacargo_id_seq'::regclass);


--
-- TOC entry 4725 (class 2604 OID 16921)
-- Name: maestros id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maestros ALTER COLUMN id SET DEFAULT nextval('public.maestros_id_seq'::regclass);


--
-- TOC entry 4732 (class 2604 OID 16986)
-- Name: organizaciones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organizaciones ALTER COLUMN id SET DEFAULT nextval('public.organizaciones_id_seq'::regclass);


--
-- TOC entry 4736 (class 2604 OID 17054)
-- Name: programasencargados id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.programasencargados ALTER COLUMN id SET DEFAULT nextval('public.programasencargados_id_seq'::regclass);


--
-- TOC entry 4734 (class 2604 OID 17002)
-- Name: programasserviciosocial id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.programasserviciosocial ALTER COLUMN id SET DEFAULT nextval('public.programasserviciosocial_id_seq'::regclass);


--
-- TOC entry 4737 (class 2604 OID 17071)
-- Name: solicitudesprogramas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitudesprogramas ALTER COLUMN id SET DEFAULT nextval('public.solicitudesprogramas_id_seq'::regclass);


--
-- TOC entry 4739 (class 2604 OID 17102)
-- Name: tutores id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tutores ALTER COLUMN id SET DEFAULT nextval('public.tutores_id_seq'::regclass);


--
-- TOC entry 4729 (class 2604 OID 16957)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 4982 (class 0 OID 16945)
-- Dependencies: 226
-- Data for Name: administradoresdb; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.administradoresdb (id, nombre, apellido1, apellido2, rol, usuario, email) FROM stdin;
\.


--
-- TOC entry 4974 (class 0 OID 16909)
-- Dependencies: 218
-- Data for Name: alumnos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alumnos (id, nombres, apellido1, apellido2, semestre, cantidadcreditos, reprobadas, grupo, especialidad, telefono, direccion, imagenperfil, segurosocial, correo) FROM stdin;
\.


--
-- TOC entry 4991 (class 0 OID 17008)
-- Dependencies: 235
-- Data for Name: alumnosorganizaciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alumnosorganizaciones (alumnoid, organizacionid, encargadoid, programaid, fechainicio, fechafin) FROM stdin;
\.


--
-- TOC entry 4999 (class 0 OID 17080)
-- Dependencies: 243
-- Data for Name: bimestres; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bimestres (id, alumnoid, programaid, bimestre1, bimestre2, bimestre3, pdf) FROM stdin;
\.


--
-- TOC entry 4980 (class 0 OID 16936)
-- Dependencies: 224
-- Data for Name: encargados; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.encargados (id, nombre, apellido1, apellido2, cargo, telefono, correo) FROM stdin;
\.


--
-- TOC entry 4988 (class 0 OID 16992)
-- Dependencies: 232
-- Data for Name: encargadosserviciosocial; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.encargadosserviciosocial (id, nombre, cargo, permisos) FROM stdin;
\.


--
-- TOC entry 5005 (class 0 OID 17126)
-- Dependencies: 249
-- Data for Name: historialasignacionprogramas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historialasignacionprogramas (id, alumnoid, programaid, fechaasignacion, estadoanterior, estadonuevo) FROM stdin;
\.


--
-- TOC entry 5003 (class 0 OID 17113)
-- Dependencies: 247
-- Data for Name: historialcreditos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historialcreditos (id, alumnoid, fechacambio, cantidadcreditosanterior, cantidadcreditosnuevo) FROM stdin;
\.


--
-- TOC entry 4993 (class 0 OID 17034)
-- Dependencies: 237
-- Data for Name: historialprogramasalumnos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historialprogramasalumnos (id, alumnoid, programaid, fechainicio, fechafin) FROM stdin;
\.


--
-- TOC entry 4978 (class 0 OID 16927)
-- Dependencies: 222
-- Data for Name: jefesacargo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.jefesacargo (id, nombre, apellido1, apellido2, puesto, correo1, correo2, telefono) FROM stdin;
\.


--
-- TOC entry 4976 (class 0 OID 16918)
-- Dependencies: 220
-- Data for Name: maestros; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.maestros (id, nombres, apellido1, apellido2, especialidad, telefono, correo) FROM stdin;
\.


--
-- TOC entry 4986 (class 0 OID 16983)
-- Dependencies: 230
-- Data for Name: organizaciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.organizaciones (id, nombreorganizacion, nombreencargado, apellido1encargado, apellido2encargado, cargo, telefono, direccion, imagenperfil) FROM stdin;
\.


--
-- TOC entry 4995 (class 0 OID 17051)
-- Dependencies: 239
-- Data for Name: programasencargados; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.programasencargados (id, encargadoid, programaid) FROM stdin;
\.


--
-- TOC entry 4990 (class 0 OID 16999)
-- Dependencies: 234
-- Data for Name: programasserviciosocial; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.programasserviciosocial (id, nombreprograma, duracion, locacion, objetivos, actividades, fechainicio, fechavencimiento) FROM stdin;
\.


--
-- TOC entry 4997 (class 0 OID 17068)
-- Dependencies: 241
-- Data for Name: solicitudesprogramas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.solicitudesprogramas (id, programaid, cantidadpersonas) FROM stdin;
\.


--
-- TOC entry 5001 (class 0 OID 17099)
-- Dependencies: 245
-- Data for Name: tutores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tutores (id, nombre, apellido1, apellido2, nocontrol, puesto, jefeacargoid, correo) FROM stdin;
\.


--
-- TOC entry 4984 (class 0 OID 16954)
-- Dependencies: 228
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, usuario, tipousuario, "contraseña", fechacreacion, fechavencimiento) FROM stdin;
\.


--
-- TOC entry 5027 (class 0 OID 0)
-- Dependencies: 225
-- Name: administradoresdb_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.administradoresdb_id_seq', 1, false);


--
-- TOC entry 5028 (class 0 OID 0)
-- Dependencies: 217
-- Name: alumnos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.alumnos_id_seq', 1, false);


--
-- TOC entry 5029 (class 0 OID 0)
-- Dependencies: 242
-- Name: bimestres_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bimestres_id_seq', 1, false);


--
-- TOC entry 5030 (class 0 OID 0)
-- Dependencies: 223
-- Name: encargados_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.encargados_id_seq', 1, false);


--
-- TOC entry 5031 (class 0 OID 0)
-- Dependencies: 231
-- Name: encargadosserviciosocial_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.encargadosserviciosocial_id_seq', 1, false);


--
-- TOC entry 5032 (class 0 OID 0)
-- Dependencies: 248
-- Name: historialasignacionprogramas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historialasignacionprogramas_id_seq', 1, false);


--
-- TOC entry 5033 (class 0 OID 0)
-- Dependencies: 246
-- Name: historialcreditos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historialcreditos_id_seq', 1, false);


--
-- TOC entry 5034 (class 0 OID 0)
-- Dependencies: 236
-- Name: historialprogramasalumnos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historialprogramasalumnos_id_seq', 1, false);


--
-- TOC entry 5035 (class 0 OID 0)
-- Dependencies: 221
-- Name: jefesacargo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jefesacargo_id_seq', 1, false);


--
-- TOC entry 5036 (class 0 OID 0)
-- Dependencies: 219
-- Name: maestros_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.maestros_id_seq', 1, false);


--
-- TOC entry 5037 (class 0 OID 0)
-- Dependencies: 229
-- Name: organizaciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.organizaciones_id_seq', 1, false);


--
-- TOC entry 5038 (class 0 OID 0)
-- Dependencies: 238
-- Name: programasencargados_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.programasencargados_id_seq', 1, false);


--
-- TOC entry 5039 (class 0 OID 0)
-- Dependencies: 233
-- Name: programasserviciosocial_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.programasserviciosocial_id_seq', 1, false);


--
-- TOC entry 5040 (class 0 OID 0)
-- Dependencies: 240
-- Name: solicitudesprogramas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.solicitudesprogramas_id_seq', 1, false);


--
-- TOC entry 5041 (class 0 OID 0)
-- Dependencies: 244
-- Name: tutores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tutores_id_seq', 1, false);


--
-- TOC entry 5042 (class 0 OID 0)
-- Dependencies: 227
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 1, false);


--
-- TOC entry 4775 (class 2606 OID 16952)
-- Name: administradoresdb administradoresdb_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administradoresdb
    ADD CONSTRAINT administradoresdb_pkey PRIMARY KEY (id);


--
-- TOC entry 4753 (class 2606 OID 16916)
-- Name: alumnos alumnos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumnos
    ADD CONSTRAINT alumnos_pkey PRIMARY KEY (id);


--
-- TOC entry 4791 (class 2606 OID 17012)
-- Name: alumnosorganizaciones alumnosorganizaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumnosorganizaciones
    ADD CONSTRAINT alumnosorganizaciones_pkey PRIMARY KEY (alumnoid, organizacionid, encargadoid, programaid);


--
-- TOC entry 4799 (class 2606 OID 17087)
-- Name: bimestres bimestres_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bimestres
    ADD CONSTRAINT bimestres_pkey PRIMARY KEY (id);


--
-- TOC entry 4771 (class 2606 OID 16943)
-- Name: encargados encargados_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encargados
    ADD CONSTRAINT encargados_pkey PRIMARY KEY (id);


--
-- TOC entry 4787 (class 2606 OID 16997)
-- Name: encargadosserviciosocial encargadosserviciosocial_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encargadosserviciosocial
    ADD CONSTRAINT encargadosserviciosocial_pkey PRIMARY KEY (id);


--
-- TOC entry 4805 (class 2606 OID 17132)
-- Name: historialasignacionprogramas historialasignacionprogramas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historialasignacionprogramas
    ADD CONSTRAINT historialasignacionprogramas_pkey PRIMARY KEY (id);


--
-- TOC entry 4803 (class 2606 OID 17119)
-- Name: historialcreditos historialcreditos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historialcreditos
    ADD CONSTRAINT historialcreditos_pkey PRIMARY KEY (id);


--
-- TOC entry 4793 (class 2606 OID 17039)
-- Name: historialprogramasalumnos historialprogramasalumnos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historialprogramasalumnos
    ADD CONSTRAINT historialprogramasalumnos_pkey PRIMARY KEY (id);


--
-- TOC entry 4765 (class 2606 OID 16934)
-- Name: jefesacargo jefesacargo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jefesacargo
    ADD CONSTRAINT jefesacargo_pkey PRIMARY KEY (id);


--
-- TOC entry 4759 (class 2606 OID 16925)
-- Name: maestros maestros_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maestros
    ADD CONSTRAINT maestros_pkey PRIMARY KEY (id);


--
-- TOC entry 4781 (class 2606 OID 16990)
-- Name: organizaciones organizaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organizaciones
    ADD CONSTRAINT organizaciones_pkey PRIMARY KEY (id);


--
-- TOC entry 4795 (class 2606 OID 17056)
-- Name: programasencargados programasencargados_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.programasencargados
    ADD CONSTRAINT programasencargados_pkey PRIMARY KEY (id);


--
-- TOC entry 4789 (class 2606 OID 17007)
-- Name: programasserviciosocial programasserviciosocial_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.programasserviciosocial
    ADD CONSTRAINT programasserviciosocial_pkey PRIMARY KEY (id);


--
-- TOC entry 4797 (class 2606 OID 17073)
-- Name: solicitudesprogramas solicitudesprogramas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitudesprogramas
    ADD CONSTRAINT solicitudesprogramas_pkey PRIMARY KEY (id);


--
-- TOC entry 4801 (class 2606 OID 17106)
-- Name: tutores tutores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tutores
    ADD CONSTRAINT tutores_pkey PRIMARY KEY (id);


--
-- TOC entry 4755 (class 2606 OID 17164)
-- Name: alumnos uniq_alumnos_nombre_apellidos; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumnos
    ADD CONSTRAINT uniq_alumnos_nombre_apellidos UNIQUE (nombres, apellido1, apellido2);


--
-- TOC entry 4757 (class 2606 OID 17172)
-- Name: alumnos uniq_alumnos_telefono; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumnos
    ADD CONSTRAINT uniq_alumnos_telefono UNIQUE (telefono);


--
-- TOC entry 4773 (class 2606 OID 17178)
-- Name: encargados uniq_encargados_telefono; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encargados
    ADD CONSTRAINT uniq_encargados_telefono UNIQUE (telefono);


--
-- TOC entry 4767 (class 2606 OID 17168)
-- Name: jefesacargo uniq_jefesacargo_nombre_apellidos; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jefesacargo
    ADD CONSTRAINT uniq_jefesacargo_nombre_apellidos UNIQUE (nombre, apellido1, apellido2);


--
-- TOC entry 4769 (class 2606 OID 17176)
-- Name: jefesacargo uniq_jefesacargo_telefono; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jefesacargo
    ADD CONSTRAINT uniq_jefesacargo_telefono UNIQUE (telefono);


--
-- TOC entry 4761 (class 2606 OID 17166)
-- Name: maestros uniq_maestros_nombre_apellidos; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maestros
    ADD CONSTRAINT uniq_maestros_nombre_apellidos UNIQUE (nombres, apellido1, apellido2);


--
-- TOC entry 4763 (class 2606 OID 17174)
-- Name: maestros uniq_maestros_telefono; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maestros
    ADD CONSTRAINT uniq_maestros_telefono UNIQUE (telefono);


--
-- TOC entry 4783 (class 2606 OID 17170)
-- Name: organizaciones uniq_organizaciones_nombre; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organizaciones
    ADD CONSTRAINT uniq_organizaciones_nombre UNIQUE (nombreorganizacion);


--
-- TOC entry 4785 (class 2606 OID 17180)
-- Name: organizaciones uniq_organizaciones_telefono; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organizaciones
    ADD CONSTRAINT uniq_organizaciones_telefono UNIQUE (telefono);


--
-- TOC entry 4777 (class 2606 OID 16964)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 4779 (class 2606 OID 16966)
-- Name: usuarios usuarios_usuario_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_usuario_key UNIQUE (usuario);


--
-- TOC entry 4825 (class 2620 OID 17186)
-- Name: alumnosorganizaciones trg_evitar_autoservicio; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_evitar_autoservicio BEFORE INSERT ON public.alumnosorganizaciones FOR EACH ROW EXECUTE FUNCTION public.evitar_autoservicio();


--
-- TOC entry 4827 (class 2620 OID 17182)
-- Name: solicitudesprogramas trg_verificar_cantidad_personas; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_verificar_cantidad_personas BEFORE INSERT ON public.solicitudesprogramas FOR EACH ROW EXECUTE FUNCTION public.verificar_cantidad_personas();


--
-- TOC entry 4826 (class 2620 OID 17184)
-- Name: alumnosorganizaciones trg_verificar_creditos_alumno; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_verificar_creditos_alumno BEFORE INSERT ON public.alumnosorganizaciones FOR EACH ROW EXECUTE FUNCTION public.verificar_creditos_alumno();


--
-- TOC entry 4824 (class 2620 OID 17188)
-- Name: programasserviciosocial trg_verificar_fechas_programa; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_verificar_fechas_programa BEFORE INSERT OR UPDATE ON public.programasserviciosocial FOR EACH ROW EXECUTE FUNCTION public.verificar_fechas_programa();


--
-- TOC entry 4809 (class 2606 OID 17013)
-- Name: alumnosorganizaciones alumnosorganizaciones_alumnoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumnosorganizaciones
    ADD CONSTRAINT alumnosorganizaciones_alumnoid_fkey FOREIGN KEY (alumnoid) REFERENCES public.alumnos(id);


--
-- TOC entry 4810 (class 2606 OID 17023)
-- Name: alumnosorganizaciones alumnosorganizaciones_encargadoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumnosorganizaciones
    ADD CONSTRAINT alumnosorganizaciones_encargadoid_fkey FOREIGN KEY (encargadoid) REFERENCES public.encargadosserviciosocial(id);


--
-- TOC entry 4811 (class 2606 OID 17018)
-- Name: alumnosorganizaciones alumnosorganizaciones_organizacionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumnosorganizaciones
    ADD CONSTRAINT alumnosorganizaciones_organizacionid_fkey FOREIGN KEY (organizacionid) REFERENCES public.organizaciones(id);


--
-- TOC entry 4812 (class 2606 OID 17028)
-- Name: alumnosorganizaciones alumnosorganizaciones_programaid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alumnosorganizaciones
    ADD CONSTRAINT alumnosorganizaciones_programaid_fkey FOREIGN KEY (programaid) REFERENCES public.programasserviciosocial(id);


--
-- TOC entry 4818 (class 2606 OID 17088)
-- Name: bimestres bimestres_alumnoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bimestres
    ADD CONSTRAINT bimestres_alumnoid_fkey FOREIGN KEY (alumnoid) REFERENCES public.alumnos(id);


--
-- TOC entry 4819 (class 2606 OID 17093)
-- Name: bimestres bimestres_programaid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bimestres
    ADD CONSTRAINT bimestres_programaid_fkey FOREIGN KEY (programaid) REFERENCES public.programasserviciosocial(id);


--
-- TOC entry 4822 (class 2606 OID 17133)
-- Name: historialasignacionprogramas historialasignacionprogramas_alumnoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historialasignacionprogramas
    ADD CONSTRAINT historialasignacionprogramas_alumnoid_fkey FOREIGN KEY (alumnoid) REFERENCES public.alumnos(id);


--
-- TOC entry 4823 (class 2606 OID 17138)
-- Name: historialasignacionprogramas historialasignacionprogramas_programaid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historialasignacionprogramas
    ADD CONSTRAINT historialasignacionprogramas_programaid_fkey FOREIGN KEY (programaid) REFERENCES public.programasserviciosocial(id);


--
-- TOC entry 4821 (class 2606 OID 17120)
-- Name: historialcreditos historialcreditos_alumnoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historialcreditos
    ADD CONSTRAINT historialcreditos_alumnoid_fkey FOREIGN KEY (alumnoid) REFERENCES public.alumnos(id);


--
-- TOC entry 4813 (class 2606 OID 17040)
-- Name: historialprogramasalumnos historialprogramasalumnos_alumnoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historialprogramasalumnos
    ADD CONSTRAINT historialprogramasalumnos_alumnoid_fkey FOREIGN KEY (alumnoid) REFERENCES public.alumnos(id);


--
-- TOC entry 4814 (class 2606 OID 17045)
-- Name: historialprogramasalumnos historialprogramasalumnos_programaid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historialprogramasalumnos
    ADD CONSTRAINT historialprogramasalumnos_programaid_fkey FOREIGN KEY (programaid) REFERENCES public.programasserviciosocial(id);


--
-- TOC entry 4815 (class 2606 OID 17057)
-- Name: programasencargados programasencargados_encargadoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.programasencargados
    ADD CONSTRAINT programasencargados_encargadoid_fkey FOREIGN KEY (encargadoid) REFERENCES public.encargadosserviciosocial(id);


--
-- TOC entry 4816 (class 2606 OID 17062)
-- Name: programasencargados programasencargados_programaid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.programasencargados
    ADD CONSTRAINT programasencargados_programaid_fkey FOREIGN KEY (programaid) REFERENCES public.programasserviciosocial(id);


--
-- TOC entry 4817 (class 2606 OID 17074)
-- Name: solicitudesprogramas solicitudesprogramas_programaid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitudesprogramas
    ADD CONSTRAINT solicitudesprogramas_programaid_fkey FOREIGN KEY (programaid) REFERENCES public.programasserviciosocial(id);


--
-- TOC entry 4820 (class 2606 OID 17107)
-- Name: tutores tutores_jefeacargoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tutores
    ADD CONSTRAINT tutores_jefeacargoid_fkey FOREIGN KEY (jefeacargoid) REFERENCES public.jefesacargo(id);


--
-- TOC entry 4806 (class 2606 OID 16967)
-- Name: usuarios usuarios_alumnoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--


--
-- TOC entry 4807 (class 2606 OID 16977)
-- Name: usuarios usuarios_encargadoid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--


--
-- TOC entry 4808 (class 2606 OID 16972)
-- Name: usuarios usuarios_maestroid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--


-- Completed on 2024-11-26 20:11:27

--
-- PostgreSQL database dump complete
--

