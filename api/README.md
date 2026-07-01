# API — Celebrity Name Chain

The game server: **Express + Prisma + PostgreSQL**, written in **TypeScript**.

## Setup

1. Install dependencies:
   ```bash
   yarn install
   ```
2. Copy the env file and set your database URL:
   ```bash
   cp .env.example .env
   # edit .env and set DATABASE_URL
   ```
3. Create the database tables and generate the Prisma client:
   ```bash
   yarn prisma:migrate
   ```

## Running

```bash
yarn dev     # start the server in watch mode (restarts on save)
```

The server listens on `http://localhost:3000` (or `PORT` from `.env`).
Check it's up: `GET http://localhost:3000/health` → `{ "ok": true }`.

## Yarn scripts

| Script                 | What it does                                                        |
| ---------------------- | ------------------------------------------------------------------- |
| `yarn dev`             | Run the server with **tsx** in watch mode (fast, no build step)     |
| `yarn build`           | Type-check and compile TypeScript to `dist/` with **tsc**           |
| `yarn start`           | Run the compiled server from `dist/` (use after `yarn build`)       |
| `yarn prisma:generate` | Regenerate the Prisma client from `prisma/schema.prisma`            |
| `yarn prisma:migrate`  | Create/apply a migration, update tables, and regenerate the client  |
| `yarn prisma:studio`   | Open Prisma Studio, a GUI to browse and edit your data              |

## Typical workflow

1. Edit `prisma/schema.prisma` to model your data.
2. Run `yarn prisma:migrate` to apply the change and regenerate the client.
3. Wire up the client (see "Using Prisma in code" below).
4. Add your routes in `src/` and test with `yarn dev`.

See the project spec for the routes and rules you need to implement.

## Using Prisma in code

This project uses **Prisma 7**, which dropped the old Rust engine: the
connection URL lives in `prisma.config.ts` (not `schema.prisma`), the client is
generated into `src/generated/prisma`, and you connect through a **driver
adapter** (`@prisma/adapter-pg`).

This project is **ESM** (`"type": "module"`), so relative imports need a
`.js` extension. After running `yarn prisma:migrate`, create `src/db.ts`:

```ts
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const prisma = new PrismaClient({ adapter });
```

Then use it in your routes:

```ts
import { prisma } from "./db.js";

const games = await prisma.game.findMany();
```
