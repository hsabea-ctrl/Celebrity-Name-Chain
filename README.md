# Celebrity Name Chain — Starter

Boilerplate for the **Celebrity Name Chain** full-stack group project
(CityTech TTP 2026 Summer). See the
[project spec](https://github.com/jonathan-chin/citytech-ttpr-2026-summer/blob/main/project_specs/celebrity-name-chain.md)
for the game rules, routes, and requirements.

```text
├── api/     # Express + Prisma + PostgreSQL game server (TypeScript)
├── client/  # Ionic React app (React Hook Form + TanStack Query)
├── data/    # database dump (dump.sql) to share between teammates
└── README.md
```

## Using this repo

Click **"Use this template"** on GitHub (not Fork). **One** teammate creates
the repo, then **adds the others as collaborators**. One team = one repo.

## Prerequisites

- **Node 22+** and **Yarn 4** (via Corepack: `corepack enable`)
- **PostgreSQL** running locally
- **ngrok** (only needed to play together across machines)

### Node version (nvm)

Make sure you're on Node 22 before installing anything:

```bash
node --version        # check your current version
nvm install 22        # install Node 22 (if you don't have it)
nvm use 22            # use it in this shell
nvm alias default 22  # optional: make Node 22 your default
```

## 1. API (backend)

```bash
cd api
yarn install
cp .env.example .env      # then edit .env (see below)
yarn prisma:migrate       # create tables + generate the Prisma client
yarn dev                  # http://localhost:3000  (GET /health -> { "ok": true })
```

**Edit `.env`** and set `DATABASE_URL` to your local PostgreSQL connection
before running `yarn prisma:migrate`.

More detail (scripts, Prisma 7 workflow) is in [`api/README.md`](api/README.md).

## 2. Client (frontend)

```bash
cd client
yarn install
cp .env.example .env      # then edit .env (see below)
yarn dev                  # open the Ionic app in your browser (or: ionic serve)
```

**Edit `.env`** and set `VITE_API_URL` to point at your API (defaults to
`http://localhost:3000`; use your ngrok URL when playing together).

## 3. Play together

Expose the API with ngrok and share the public URL; each player sets their
client's `VITE_API_URL` to it:

```bash
ngrok http 3000
```

Expose the **API**, never your database directly.
