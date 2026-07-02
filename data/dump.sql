--
-- PostgreSQL database dump
--

\restrict ueK9UhqYDYquD7YTaju9lsLm4YTue604mvB3o10ipusiRVLDdr77002SmOFUI6l

-- Dumped from database version 16.14 (Ubuntu 16.14-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 18.4

-- Started on 2026-07-01 15:54:33 EDT

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 216 (class 1259 OID 32811)
-- Name: rooms; Type: TABLE; Schema: public; Owner: test
--

CREATE TABLE public.rooms (
    id integer NOT NULL,
    room_code text NOT NULL,
    username text NOT NULL,
    topic text NOT NULL
);


ALTER TABLE public.rooms OWNER TO test;

--
-- TOC entry 215 (class 1259 OID 32810)
-- Name: rooms_id_seq; Type: SEQUENCE; Schema: public; Owner: test
--

CREATE SEQUENCE public.rooms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rooms_id_seq OWNER TO test;

--
-- TOC entry 3452 (class 0 OID 0)
-- Dependencies: 215
-- Name: rooms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: test
--

ALTER SEQUENCE public.rooms_id_seq OWNED BY public.rooms.id;


--
-- TOC entry 218 (class 1259 OID 32823)
-- Name: turns; Type: TABLE; Schema: public; Owner: test
--

CREATE TABLE public.turns (
    id integer NOT NULL,
    room_id integer NOT NULL,
    username text NOT NULL,
    full_name text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    prev_turn_id integer
);


ALTER TABLE public.turns OWNER TO test;

--
-- TOC entry 217 (class 1259 OID 32822)
-- Name: turns_id_seq; Type: SEQUENCE; Schema: public; Owner: test
--

CREATE SEQUENCE public.turns_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.turns_id_seq OWNER TO test;

--
-- TOC entry 3453 (class 0 OID 0)
-- Dependencies: 217
-- Name: turns_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: test
--

ALTER SEQUENCE public.turns_id_seq OWNED BY public.turns.id;


--
-- TOC entry 3288 (class 2604 OID 32814)
-- Name: rooms id; Type: DEFAULT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.rooms ALTER COLUMN id SET DEFAULT nextval('public.rooms_id_seq'::regclass);


--
-- TOC entry 3289 (class 2604 OID 32826)
-- Name: turns id; Type: DEFAULT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.turns ALTER COLUMN id SET DEFAULT nextval('public.turns_id_seq'::regclass);


--
-- TOC entry 3444 (class 0 OID 32811)
-- Dependencies: 216
-- Data for Name: rooms; Type: TABLE DATA; Schema: public; Owner: test
--

COPY public.rooms (id, room_code, username, topic) FROM stdin;
\.


--
-- TOC entry 3446 (class 0 OID 32823)
-- Dependencies: 218
-- Data for Name: turns; Type: TABLE DATA; Schema: public; Owner: test
--

COPY public.turns (id, room_id, username, full_name, first_name, last_name, prev_turn_id) FROM stdin;
\.


--
-- TOC entry 3454 (class 0 OID 0)
-- Dependencies: 215
-- Name: rooms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: test
--

SELECT pg_catalog.setval('public.rooms_id_seq', 1, false);


--
-- TOC entry 3455 (class 0 OID 0)
-- Dependencies: 217
-- Name: turns_id_seq; Type: SEQUENCE SET; Schema: public; Owner: test
--

SELECT pg_catalog.setval('public.turns_id_seq', 1, false);


--
-- TOC entry 3295 (class 2606 OID 32833)
-- Name: turns room_turn_unique; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.turns
    ADD CONSTRAINT room_turn_unique UNIQUE (room_id, full_name);


--
-- TOC entry 3291 (class 2606 OID 32819)
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);


--
-- TOC entry 3293 (class 2606 OID 32821)
-- Name: rooms rooms_room_code_key; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_room_code_key UNIQUE (room_code);


--
-- TOC entry 3297 (class 2606 OID 32831)
-- Name: turns turns_pkey; Type: CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.turns
    ADD CONSTRAINT turns_pkey PRIMARY KEY (id);


--
-- TOC entry 3298 (class 2606 OID 32839)
-- Name: turns fk_prev_turn; Type: FK CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.turns
    ADD CONSTRAINT fk_prev_turn FOREIGN KEY (prev_turn_id) REFERENCES public.turns(id) ON DELETE SET NULL;


--
-- TOC entry 3299 (class 2606 OID 32834)
-- Name: turns fk_turns_room; Type: FK CONSTRAINT; Schema: public; Owner: test
--

ALTER TABLE ONLY public.turns
    ADD CONSTRAINT fk_turns_room FOREIGN KEY (room_id) REFERENCES public.rooms(id) ON DELETE CASCADE;


-- Completed on 2026-07-01 15:54:33 EDT

--
-- PostgreSQL database dump complete
--

\unrestrict ueK9UhqYDYquD7YTaju9lsLm4YTue604mvB3o10ipusiRVLDdr77002SmOFUI6l

