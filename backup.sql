--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

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

--
-- Name: InterfaceStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."InterfaceStatus" AS ENUM (
    'Available',
    'InUse',
    'UnderMaintenance',
    'Retired',
    'Disposed'
);


ALTER TYPE public."InterfaceStatus" OWNER TO postgres;

--
-- Name: MaintenanceStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."MaintenanceStatus" AS ENUM (
    'Open',
    'InProgress',
    'Resolved',
    'Closed',
    'OnHold'
);


ALTER TYPE public."MaintenanceStatus" OWNER TO postgres;

--
-- Name: MaintenanceType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."MaintenanceType" AS ENUM (
    'Corrective',
    'Preventive',
    'Calibration',
    'Upgrade',
    'Inspection'
);


ALTER TYPE public."MaintenanceType" OWNER TO postgres;

--
-- Name: MovementReason; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."MovementReason" AS ENUM (
    'Deployment',
    'Retrieval',
    'Maintenance',
    'Disposal',
    'Calibration',
    'TemporaryUse'
);


ALTER TYPE public."MovementReason" OWNER TO postgres;

--
-- Name: PriorityStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PriorityStatus" AS ENUM (
    'Low',
    'Medium',
    'High',
    'Critical'
);


ALTER TYPE public."PriorityStatus" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: interface_movement_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.interface_movement_logs (
    id text NOT NULL,
    "interfaceId" text NOT NULL,
    "fromLocationId" text NOT NULL,
    "toLocationId" text NOT NULL,
    "movedById" text NOT NULL,
    "movementDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    reason public."MovementReason",
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.interface_movement_logs OWNER TO postgres;

--
-- Name: interfaces; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.interfaces (
    id text NOT NULL,
    "interfaceName" text,
    "serialNumber" integer,
    description text,
    type text NOT NULL,
    status public."InterfaceStatus" DEFAULT 'Available'::public."InterfaceStatus" NOT NULL,
    "currentLocationId" text,
    "qrCodeData" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.interfaces OWNER TO postgres;

--
-- Name: locations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.locations (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    address text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.locations OWNER TO postgres;

--
-- Name: maintenance_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.maintenance_logs (
    id text NOT NULL,
    "ticketId" text NOT NULL,
    "userId" text NOT NULL,
    description text NOT NULL,
    "actionTaken" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.maintenance_logs OWNER TO postgres;

--
-- Name: maintenance_tickets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.maintenance_tickets (
    id text NOT NULL,
    "interfaceId" text NOT NULL,
    type public."MaintenanceType" DEFAULT 'Corrective'::public."MaintenanceType" NOT NULL,
    status public."MaintenanceStatus" DEFAULT 'Open'::public."MaintenanceStatus" NOT NULL,
    description text NOT NULL,
    priority public."PriorityStatus" DEFAULT 'Medium'::public."PriorityStatus" NOT NULL,
    "reportedById" text NOT NULL,
    "assignedToId" text,
    "scheduledDate" timestamp(3) without time zone,
    "completedDate" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.maintenance_tickets OWNER TO postgres;

--
-- Name: permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permissions (
    id text NOT NULL,
    name text NOT NULL,
    description text
);


ALTER TABLE public.permissions OWNER TO postgres;

--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role_permissions (
    id text NOT NULL,
    "roleId" text NOT NULL,
    "permissionId" text NOT NULL
);


ALTER TABLE public.role_permissions OWNER TO postgres;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: usage_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usage_logs (
    id text NOT NULL,
    "interfaceId" text NOT NULL,
    "userId" text NOT NULL,
    "startTime" timestamp(3) without time zone NOT NULL,
    "endTime" timestamp(3) without time zone,
    "testDetails" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.usage_logs OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text NOT NULL,
    matricule text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    "phoneNumber" text NOT NULL,
    "roleId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
6fd8f18c-bc90-490e-942e-c0ac6c7f522d	b920acbbcd2a159ae85afe8cb31e9ddfdf385d2a90be4d5afc551a81f8c7383b	2025-07-26 20:49:06.998304+01	20250726194906_init	\N	\N	2025-07-26 20:49:06.915061+01	1
\.


--
-- Data for Name: interface_movement_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.interface_movement_logs (id, "interfaceId", "fromLocationId", "toLocationId", "movedById", "movementDate", reason, notes, "createdAt") FROM stdin;
\.


--
-- Data for Name: interfaces; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.interfaces (id, "interfaceName", "serialNumber", description, type, status, "currentLocationId", "qrCodeData", "createdAt", "updatedAt") FROM stdin;
a78559bc-0011-49a6-ba1f-3000724edb49	ssss	445	s	ddd	InUse	\N	\N	2025-08-05 20:14:10.92	2025-08-05 20:14:18.722
0dfe1e76-33d5-499e-b7ad-396f398a770f	Pressure Gauge PG-002	1002	Industrial pressure measurement device	Gauge	UnderMaintenance	5c95f292-1044-4ece-90fb-1323caf9a709	PG002-PRESSURE-GAUGE	2025-07-26 19:58:58.137	2025-08-05 20:14:20.42
e6bba1d9-71af-4ba7-beef-1656b6b3a551	Temperature Sensor TS-001	1001	High precision temperature sensor	Sensor	Retired	5c95f292-1044-4ece-90fb-1323caf9a709	TS001-TEMP-SENSOR	2025-07-26 19:58:58.131	2025-08-05 20:14:22.557
b941bc2e-ad52-43eb-9087-783665f172eb	d444444	44555555	44555555	Output	UnderMaintenance	59fd9fd7-1e3a-4364-be16-4f7338d60392	\N	2025-08-21 03:59:54.837	2025-08-21 03:59:54.837
d2c26e39-4332-48aa-a334-b4c958b9bb5a	dd	4444	55	ddd	Available	\N	\N	2025-08-13 10:34:13.45	2025-08-13 10:34:13.45
cc8a52a5-6fe5-49d1-af43-33f285b0609d	gfff	4444444	s	ddd	Available	\N	\N	2025-08-13 10:43:29.969	2025-08-13 10:43:29.969
e10c8f36-fdba-4c08-a407-4eb45ff6b00f	ddddddd	4	55	ddd	Available	\N	\N	2025-08-13 10:46:13.986	2025-08-13 10:46:13.986
99f70efa-3045-412f-81a8-aae36e5794b0	dfdf	44545	ghghg	Input	Available	5c95f292-1044-4ece-90fb-1323caf9a709	\N	2025-08-13 13:31:01.962	2025-08-13 13:31:01.962
96e729f4-603e-4845-8910-9d1a8b558cca	fdfsd	44444	fdf	Input	Available	59fd9fd7-1e3a-4364-be16-4f7338d60392	\N	2025-08-13 14:53:55.498	2025-08-13 14:53:55.498
e8654f8f-d15e-4dca-b37c-8ef99d75d817	ss	444488	44444	Input	Available	83dd236f-cf77-48dd-9c76-32c2f194ad13	\N	2025-08-18 22:16:14.842	2025-08-18 22:16:14.842
40edbd4c-ee20-4cdd-ba52-65834f7cad06	odud	7894	df	Processing	Available	5c95f292-1044-4ece-90fb-1323caf9a709	\N	2025-08-18 22:19:52.02	2025-08-18 22:19:52.02
fb32685f-d693-434c-a510-417c2a69a59c	fff	9541	fdf	Processing	Available	8a049200-afe5-43dd-bc59-50f02b649bc2	\N	2025-08-18 22:24:30.023	2025-08-18 22:24:30.023
73e2a36e-8f36-40df-9af8-4ab68bcc73c3	ss	7	4	Input	Available	83dd236f-cf77-48dd-9c76-32c2f194ad13	\N	2025-08-18 22:26:45.981	2025-08-18 22:26:45.981
f709a5af-390a-4a66-a221-fe319d1727d3	ss	2	2	Output	Available	8a049200-afe5-43dd-bc59-50f02b649bc2	\N	2025-08-18 22:36:29.123	2025-08-18 22:36:29.123
82dcd902-6781-429e-b24a-6220849edfef	s	9987	111	Processing	Available	5c95f292-1044-4ece-90fb-1323caf9a709	\N	2025-08-18 22:40:14.121	2025-08-18 22:40:14.121
c64312a5-16e4-4c30-8837-ff18b912fae1	963	55547	44	Input	Available	5c95f292-1044-4ece-90fb-1323caf9a709	\N	2025-08-18 22:45:43.242	2025-08-18 22:45:43.242
c013a245-570a-49b4-b918-38b6818d0ac1	dd	54454	5	Storage	Available	83dd236f-cf77-48dd-9c76-32c2f194ad13	\N	2025-08-18 22:46:38.183	2025-08-18 22:46:38.183
5a964e42-e871-452d-9111-c3a48c60c8b2	g	33	2	Input	InUse	5c95f292-1044-4ece-90fb-1323caf9a709	\N	2025-08-18 22:30:35.3	2025-08-18 22:30:35.3
6aea4807-6e0f-4f90-8f94-03cd3bbc7999	fff	5	ff	Processing	InUse	83dd236f-cf77-48dd-9c76-32c2f194ad13	\N	2025-08-18 22:26:09.693	2025-08-18 22:26:09.693
60d67b45-d187-449c-ac97-7b4e4dc5f67b	f	3	2	Storage	Available	83dd236f-cf77-48dd-9c76-32c2f194ad13	\N	2025-08-18 23:19:06.074	2025-08-18 23:19:06.074
d9f28f1a-16fb-437a-a942-6dfcc22f3f68	dddd	6	6	Output	Available	59fd9fd7-1e3a-4364-be16-4f7338d60392	\N	2025-08-21 02:06:22.564	2025-08-21 02:06:22.564
3a87b9d1-0b73-487b-89a6-67a780039be5	555	545496	44	Output	Available	59fd9fd7-1e3a-4364-be16-4f7338d60392	\N	2025-08-21 02:11:34.932	2025-08-21 02:11:34.932
b75b9772-a65d-4cde-931f-bfc09405e107	fdd	9658	5454	Input	Available	59fd9fd7-1e3a-4364-be16-4f7338d60392	\N	2025-08-21 02:14:23.34	2025-08-21 02:14:23.34
1cacb1e6-6abc-42ed-87f6-e26d2b21e6a5	dsdsd	889	555	Output	Available	59fd9fd7-1e3a-4364-be16-4f7338d60392	\N	2025-08-21 02:26:03.931	2025-08-21 02:26:03.931
1c491aee-38d5-4303-9db3-a2cae5deba0f	444	5555	555	Output	Available	8a049200-afe5-43dd-bc59-50f02b649bc2	\N	2025-08-21 02:36:09.104	2025-08-21 02:36:09.104
d1e8a07b-9db2-423f-9fa0-a91ed52ef2b0	14	222	dd	Processing	UnderMaintenance	83dd236f-cf77-48dd-9c76-32c2f194ad13	\N	2025-08-21 03:43:30.77	2025-08-21 03:43:30.77
0d196fc7-4584-4b29-8962-bcd1f2be9056	f	55	\N	Storage	Available	83dd236f-cf77-48dd-9c76-32c2f194ad13	\N	2025-08-21 03:56:51.988	2025-08-21 03:56:51.988
b4d322f7-10cd-480e-a0d1-31be44744a59	t	\N	\N	Storage	Available	83dd236f-cf77-48dd-9c76-32c2f194ad13	\N	2025-08-21 03:57:00.934	2025-08-21 03:57:00.934
97514672-3433-4523-b88f-4366a45c3c85	dddg	5454545	\N	Storage	UnderMaintenance	5c95f292-1044-4ece-90fb-1323caf9a709	\N	2025-08-21 04:00:49.022	2025-08-28 04:23:12.1
a4c42d56-3504-484b-b215-5feecf6187d6	fgdg	2525	52	Input	InUse	83dd236f-cf77-48dd-9c76-32c2f194ad13	\N	2025-09-03 10:00:32.152	2025-09-03 10:00:32.152
4c1e1303-d045-4ae2-b98e-e2d30f8a3838	qqqsq	24242	\N	Output	Available	d668b5ae-bbc1-4672-bfea-f02a01b2679c	\N	2025-09-21 20:50:11.582	2025-09-21 20:50:11.582
\.


--
-- Data for Name: locations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.locations (id, name, description, address, "createdAt", "updatedAt") FROM stdin;
5c95f292-1044-4ece-90fb-1323caf9a709	Main Storage	Primary storage facility	Building A, Floor 1	2025-07-26 19:58:58.114	2025-07-26 19:58:58.114
83dd236f-cf77-48dd-9c76-32c2f194ad13	Lab 1	Testing laboratory 1	Building B, Floor 2	2025-07-26 19:58:58.119	2025-07-26 19:58:58.119
b06a577e-217f-4d8f-8a53-3aa50f45c916	Lab 2	Testing laboratory 2	Building B, Floor 3	2025-07-26 19:58:58.121	2025-07-26 19:58:58.121
59fd9fd7-1e3a-4364-be16-4f7338d60392	Maintenance Shop	Equipment maintenance facility	Building C, Floor 1	2025-07-26 19:58:58.124	2025-07-26 19:58:58.124
8a049200-afe5-43dd-bc59-50f02b649bc2	Quality Control	Quality control department	Building A, Floor 3	2025-07-26 19:58:58.126	2025-07-26 19:58:58.126
c5613f82-d886-43ab-91f6-b01b6af94a33	basea	sdsd	hjghh	2025-09-21 19:21:56.499	2025-09-21 19:21:56.499
d29ef9d8-57e2-4e58-abc9-3c8f5820529a	zaz	tft	hjghh	2025-09-21 20:20:56.351	2025-09-21 20:20:56.351
d668b5ae-bbc1-4672-bfea-f02a01b2679c	qsq	4545	454	2025-09-21 20:21:08.318	2025-09-21 20:21:08.318
\.


--
-- Data for Name: maintenance_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.maintenance_logs (id, "ticketId", "userId", description, "actionTaken", "createdAt") FROM stdin;
\.


--
-- Data for Name: maintenance_tickets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.maintenance_tickets (id, "interfaceId", type, status, description, priority, "reportedById", "assignedToId", "scheduledDate", "completedDate", "createdAt", "updatedAt") FROM stdin;
24e0fc3f-7d45-4ed7-8c06-d23a5d8370e5	a4c42d56-3504-484b-b215-5feecf6187d6	Preventive	Open	sss	Low	84adfd38-2efb-4d2d-864a-ded7e1afc798	4c80aeb0-6831-4684-969a-f78b7a5a8924	2025-09-18 22:59:59.999	\N	2025-09-15 22:59:40.099	2025-09-15 22:59:40.099
b59aca66-4991-453a-be65-f81d0b2761ec	b75b9772-a65d-4cde-931f-bfc09405e107	Calibration	Open	azazazazaazaz	Low	84adfd38-2efb-4d2d-864a-ded7e1afc798	84adfd38-2efb-4d2d-864a-ded7e1afc798	2025-09-21 22:59:59.999	\N	2025-09-21 18:05:13.616	2025-09-21 18:05:13.616
0ae45d25-8ae4-4825-a417-e9a01972ffd6	b4d322f7-10cd-480e-a0d1-31be44744a59	Preventive	Open	dfgfdgfgfdg	Low	84adfd38-2efb-4d2d-864a-ded7e1afc798	84adfd38-2efb-4d2d-864a-ded7e1afc798	2025-10-09 22:59:59.999	\N	2025-10-07 20:58:52	2025-10-07 20:58:52
9e36dbe7-1fbe-46f2-ad5f-f1e767b41f10	b4d322f7-10cd-480e-a0d1-31be44744a59	Preventive	Open	qsdqsd	Low	84adfd38-2efb-4d2d-864a-ded7e1afc798	84adfd38-2efb-4d2d-864a-ded7e1afc798	2025-10-17 22:59:59.999	\N	2025-10-07 21:40:11.05	2025-10-07 21:40:11.05
94b0757d-4602-4597-ba5a-5c5c427651ba	b4d322f7-10cd-480e-a0d1-31be44744a59	Preventive	Open	qsdqds	Low	84adfd38-2efb-4d2d-864a-ded7e1afc798	84adfd38-2efb-4d2d-864a-ded7e1afc798	2025-10-11 22:59:59.999	\N	2025-10-07 21:44:27.41	2025-10-07 21:44:27.41
12a2eeb9-ce73-4b90-a2ab-df2ad28920b2	a4c42d56-3504-484b-b215-5feecf6187d6	Preventive	Open	azaz	Low	84adfd38-2efb-4d2d-864a-ded7e1afc798	4c80aeb0-6831-4684-969a-f78b7a5a8924	2025-11-01 23:59:59.999	\N	2025-10-07 21:46:35.437	2025-10-07 21:46:35.437
04faa1a8-c5ad-4918-bc7a-de6cd3ef87b1	b4d322f7-10cd-480e-a0d1-31be44744a59	Preventive	Open	qsdqs	Low	84adfd38-2efb-4d2d-864a-ded7e1afc798	4c80aeb0-6831-4684-969a-f78b7a5a8924	2025-10-08 22:59:59.999	\N	2025-10-07 21:48:37.351	2025-10-07 21:48:37.351
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permissions (id, name, description) FROM stdin;
7cd305a5-853f-4ebf-89d8-9618af7bb917	user:read	Read user information
716100cc-ec7c-437d-ba2d-649db51dc097	user:write	Create and update users
8e6d04ca-17ed-44c5-96c5-fbe59ab08607	user:delete	Delete users
9751e578-7004-4220-8fa1-afb603ec6a7c	interface:read	Read interface information
4df72835-143e-4a4f-b314-48b3cc3f6cbc	interface:write	Create and update interfaces
13e5bcfc-11c2-467f-853c-cb48fa49b709	interface:delete	Delete interfaces
d58b2181-7636-4aa7-bc16-1cb71edf6008	location:read	Read location information
68e0387f-f555-43ef-8a6e-37e9f1bc7a5a	location:write	Create and update locations
7c44820c-5ac5-4f4e-badd-8e6402c2ee69	location:delete	Delete locations
cafecd0e-301e-4efb-9e44-45a94129db40	maintenance:read	Read maintenance tickets
bd9b3fa8-c8e9-4e15-b2a6-1eff88d0d22d	maintenance:write	Create and update maintenance tickets
d6e4f7d0-f5a3-4194-9ade-cf7ace2c6ee0	maintenance:delete	Delete maintenance tickets
81f3a712-58ac-4b94-a6ba-0bd0b5e4d018	reports:read	Read reports and analytics
43f82fb6-f5cf-4500-a77a-e378c586b874	admin:all	Full administrative access
\.


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role_permissions (id, "roleId", "permissionId") FROM stdin;
2837b3f3-78b8-424c-b7c4-54cd97fb4afb	42679380-a23e-4334-8fb3-dcc227d29b85	7cd305a5-853f-4ebf-89d8-9618af7bb917
1099cdeb-f75a-4817-aafe-9657fbbdfc64	42679380-a23e-4334-8fb3-dcc227d29b85	716100cc-ec7c-437d-ba2d-649db51dc097
c7a3750b-c01f-4d09-b504-de36a7c550df	42679380-a23e-4334-8fb3-dcc227d29b85	8e6d04ca-17ed-44c5-96c5-fbe59ab08607
3beca38a-77c2-4157-a42e-63dc1fd200af	42679380-a23e-4334-8fb3-dcc227d29b85	9751e578-7004-4220-8fa1-afb603ec6a7c
fd105a36-c115-49f0-83ba-f387f7e5b0d8	42679380-a23e-4334-8fb3-dcc227d29b85	4df72835-143e-4a4f-b314-48b3cc3f6cbc
f45e52fd-1db4-4b97-a675-8f2c92e8112b	42679380-a23e-4334-8fb3-dcc227d29b85	13e5bcfc-11c2-467f-853c-cb48fa49b709
ec06beff-d6eb-4c25-8fb8-48fd80d6dee4	42679380-a23e-4334-8fb3-dcc227d29b85	d58b2181-7636-4aa7-bc16-1cb71edf6008
af8f669a-5265-40f1-9055-8d99d7293ba2	42679380-a23e-4334-8fb3-dcc227d29b85	68e0387f-f555-43ef-8a6e-37e9f1bc7a5a
2afaccbb-bd6e-4a6e-be54-9490cbedf468	42679380-a23e-4334-8fb3-dcc227d29b85	7c44820c-5ac5-4f4e-badd-8e6402c2ee69
17b0fed2-910f-48db-b964-c61d579f8a4a	42679380-a23e-4334-8fb3-dcc227d29b85	cafecd0e-301e-4efb-9e44-45a94129db40
ad3316dc-f6cd-42c3-870c-a8538812f7ae	42679380-a23e-4334-8fb3-dcc227d29b85	bd9b3fa8-c8e9-4e15-b2a6-1eff88d0d22d
b7cde59e-99de-4016-b742-8c478c36a032	42679380-a23e-4334-8fb3-dcc227d29b85	d6e4f7d0-f5a3-4194-9ade-cf7ace2c6ee0
ba7ea27f-47a2-4ac9-b252-c6717b7d35f9	42679380-a23e-4334-8fb3-dcc227d29b85	81f3a712-58ac-4b94-a6ba-0bd0b5e4d018
86ed1339-3bbb-438b-b996-23ccac0e9e01	42679380-a23e-4334-8fb3-dcc227d29b85	43f82fb6-f5cf-4500-a77a-e378c586b874
a3a906e6-cd89-4de2-bb68-8f0a0e7b1179	47e60ff3-88d6-4cc2-81dc-0fd2e7cb6369	7cd305a5-853f-4ebf-89d8-9618af7bb917
63746156-0c34-4f71-a13b-cfa669b30089	47e60ff3-88d6-4cc2-81dc-0fd2e7cb6369	716100cc-ec7c-437d-ba2d-649db51dc097
50ac6357-b5c0-499d-a7e1-ff9653ae4487	47e60ff3-88d6-4cc2-81dc-0fd2e7cb6369	9751e578-7004-4220-8fa1-afb603ec6a7c
de191e30-8aa3-468f-855c-8d52dcc0cd35	47e60ff3-88d6-4cc2-81dc-0fd2e7cb6369	4df72835-143e-4a4f-b314-48b3cc3f6cbc
8fcc8ba1-279b-413d-8408-bd76b0666688	47e60ff3-88d6-4cc2-81dc-0fd2e7cb6369	d58b2181-7636-4aa7-bc16-1cb71edf6008
07360974-fde3-42ec-92a9-ff88eb16763c	47e60ff3-88d6-4cc2-81dc-0fd2e7cb6369	68e0387f-f555-43ef-8a6e-37e9f1bc7a5a
147067f7-79ec-4778-9ddb-dc657538c567	47e60ff3-88d6-4cc2-81dc-0fd2e7cb6369	cafecd0e-301e-4efb-9e44-45a94129db40
506d523b-8f53-4834-838e-266626f91409	47e60ff3-88d6-4cc2-81dc-0fd2e7cb6369	bd9b3fa8-c8e9-4e15-b2a6-1eff88d0d22d
913695d8-9520-4cad-8c43-148bf5aff180	47e60ff3-88d6-4cc2-81dc-0fd2e7cb6369	81f3a712-58ac-4b94-a6ba-0bd0b5e4d018
8f335849-e2ef-48ae-8291-a7f292d24c41	7e7fc476-6c1e-43ac-ae8e-a8c3b63c4952	9751e578-7004-4220-8fa1-afb603ec6a7c
8ae9212a-1eea-4fb7-9fb3-926f939537fa	7e7fc476-6c1e-43ac-ae8e-a8c3b63c4952	4df72835-143e-4a4f-b314-48b3cc3f6cbc
33c2b687-45b6-4c18-88cd-1c0819f4e9dd	7e7fc476-6c1e-43ac-ae8e-a8c3b63c4952	d58b2181-7636-4aa7-bc16-1cb71edf6008
a4734a63-fbb8-451a-a4a2-75099a38c3b5	7e7fc476-6c1e-43ac-ae8e-a8c3b63c4952	cafecd0e-301e-4efb-9e44-45a94129db40
b0c8d9c7-1d7c-455c-b0dc-299559ff4c3c	7e7fc476-6c1e-43ac-ae8e-a8c3b63c4952	bd9b3fa8-c8e9-4e15-b2a6-1eff88d0d22d
540f0f0d-5217-47c6-b620-ba12f89ae369	64bc9530-db2f-4083-b137-852f925d6f86	9751e578-7004-4220-8fa1-afb603ec6a7c
abdfad67-c469-48a3-a73e-250320774a5f	64bc9530-db2f-4083-b137-852f925d6f86	d58b2181-7636-4aa7-bc16-1cb71edf6008
dc10f244-cf41-4874-9ccf-4fe7f67c9d24	64bc9530-db2f-4083-b137-852f925d6f86	cafecd0e-301e-4efb-9e44-45a94129db40
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name, description, "createdAt", "updatedAt") FROM stdin;
42679380-a23e-4334-8fb3-dcc227d29b85	Administrator	Full system access	2025-07-26 19:58:57.534	2025-07-26 19:58:57.534
47e60ff3-88d6-4cc2-81dc-0fd2e7cb6369	Manager	Management level access	2025-07-26 19:58:57.539	2025-07-26 19:58:57.539
7e7fc476-6c1e-43ac-ae8e-a8c3b63c4952	Technician	Technical operations access	2025-07-26 19:58:57.542	2025-07-26 19:58:57.542
64bc9530-db2f-4083-b137-852f925d6f86	Operator	Basic operational access	2025-07-26 19:58:57.544	2025-07-26 19:58:57.544
\.


--
-- Data for Name: usage_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usage_logs (id, "interfaceId", "userId", "startTime", "endTime", "testDetails", "createdAt") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, matricule, email, password, "firstName", "lastName", "phoneNumber", "roleId", "createdAt", "updatedAt") FROM stdin;
84adfd38-2efb-4d2d-864a-ded7e1afc798	ADM001	admin@factory.com	$2a$12$rzmgGX.pYsTehj4mkf0JMODLb1l23OhTCvm5701IiP6CxmMkyVk2m	System	Administrator	+1234567890	42679380-a23e-4334-8fb3-dcc227d29b85	2025-07-26 19:58:58.099	2025-07-26 19:58:58.099
4c80aeb0-6831-4684-969a-f78b7a5a8924	EMP005	jane.doe@example.com	$2a$12$.sDLgs.qTNtZj5x.x9Wg3OzWh9JiW3rgvV3tTxpFCXghvH/w4Rs6a	Jane	Doe	21698765432	7e7fc476-6c1e-43ac-ae8e-a8c3b63c4952	2025-09-01 18:46:09.467	2025-09-01 18:46:09.467
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: interface_movement_logs interface_movement_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.interface_movement_logs
    ADD CONSTRAINT interface_movement_logs_pkey PRIMARY KEY (id);


--
-- Name: interfaces interfaces_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.interfaces
    ADD CONSTRAINT interfaces_pkey PRIMARY KEY (id);


--
-- Name: locations locations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (id);


--
-- Name: maintenance_logs maintenance_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_logs
    ADD CONSTRAINT maintenance_logs_pkey PRIMARY KEY (id);


--
-- Name: maintenance_tickets maintenance_tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_tickets
    ADD CONSTRAINT maintenance_tickets_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: usage_logs usage_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usage_logs
    ADD CONSTRAINT usage_logs_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: interfaces_serialNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "interfaces_serialNumber_key" ON public.interfaces USING btree ("serialNumber");


--
-- Name: locations_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX locations_name_key ON public.locations USING btree (name);


--
-- Name: permissions_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX permissions_name_key ON public.permissions USING btree (name);


--
-- Name: role_permissions_roleId_permissionId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "role_permissions_roleId_permissionId_key" ON public.role_permissions USING btree ("roleId", "permissionId");


--
-- Name: roles_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX roles_name_key ON public.roles USING btree (name);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: users_matricule_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_matricule_key ON public.users USING btree (matricule);


--
-- Name: interface_movement_logs interface_movement_logs_fromLocationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.interface_movement_logs
    ADD CONSTRAINT "interface_movement_logs_fromLocationId_fkey" FOREIGN KEY ("fromLocationId") REFERENCES public.locations(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: interface_movement_logs interface_movement_logs_interfaceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.interface_movement_logs
    ADD CONSTRAINT "interface_movement_logs_interfaceId_fkey" FOREIGN KEY ("interfaceId") REFERENCES public.interfaces(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: interface_movement_logs interface_movement_logs_movedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.interface_movement_logs
    ADD CONSTRAINT "interface_movement_logs_movedById_fkey" FOREIGN KEY ("movedById") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: interface_movement_logs interface_movement_logs_toLocationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.interface_movement_logs
    ADD CONSTRAINT "interface_movement_logs_toLocationId_fkey" FOREIGN KEY ("toLocationId") REFERENCES public.locations(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: interfaces interfaces_currentLocationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.interfaces
    ADD CONSTRAINT "interfaces_currentLocationId_fkey" FOREIGN KEY ("currentLocationId") REFERENCES public.locations(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: maintenance_logs maintenance_logs_ticketId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_logs
    ADD CONSTRAINT "maintenance_logs_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES public.maintenance_tickets(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: maintenance_logs maintenance_logs_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_logs
    ADD CONSTRAINT "maintenance_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: maintenance_tickets maintenance_tickets_assignedToId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_tickets
    ADD CONSTRAINT "maintenance_tickets_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: maintenance_tickets maintenance_tickets_interfaceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_tickets
    ADD CONSTRAINT "maintenance_tickets_interfaceId_fkey" FOREIGN KEY ("interfaceId") REFERENCES public.interfaces(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: maintenance_tickets maintenance_tickets_reportedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_tickets
    ADD CONSTRAINT "maintenance_tickets_reportedById_fkey" FOREIGN KEY ("reportedById") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: role_permissions role_permissions_permissionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES public.permissions(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: role_permissions role_permissions_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: usage_logs usage_logs_interfaceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usage_logs
    ADD CONSTRAINT "usage_logs_interfaceId_fkey" FOREIGN KEY ("interfaceId") REFERENCES public.interfaces(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: usage_logs usage_logs_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usage_logs
    ADD CONSTRAINT "usage_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: users users_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

