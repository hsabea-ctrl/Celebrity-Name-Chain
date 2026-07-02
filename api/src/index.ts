import "dotenv/config";
import express from "express";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.js";

const app = express();
app.use(express.json());

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({
	adapter,
});

const PORT = process.env.PORT ?? 3000;

// Health check — confirms the server is running.
app.get("/health", (req, res) => {
	res.json({ ok: true });
});

// TODO: implement the game routes (see the project spec):
//   POST /games          { roomCode, celebrity }          -> start a game
//   GET  /games/:roomCode                                 -> most recent celebrity name
//   POST /answers        { roomCode, username, answer }   -> submit an answer
//
// To talk to the database, run `yarn prisma:migrate` first (generates the
// client into src/generated/prisma), then wire it up with the pg adapter.
// See this API's README ("Using Prisma in code") for the exact db.ts snippet.

// POST /games — create a new game
app.post("/games", async (req, res) => {
	const { roomCode, celebrity, username, topic } = req.body;

	if (!roomCode || !celebrity) {
		return res
			.status(400)
			.json({ error: "roomCode and celebrity are required" });
	}

	// split "First Last" into first/last name pieces
	const nameParts = celebrity.trim().split(/\s+/);
	const firstName = nameParts[0];
	const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

	try {
		const game = await prisma.rooms.create({
			data: {
				room_code: roomCode,
				username: username ?? "system",
				topic: topic ?? "general",
				turns: {
					create: {
						username: username ?? "system",
						full_name: celebrity.trim(),
						first_name: firstName,
						last_name: lastName,
						prev_turn_id: null,
					},
				},
			},
			include: {
				turns: true,
			},
		});

		res.status(201).json(game);
	} catch (err: any) {
		if (err.code === "P2002") {
			return res.status(409).json({ error: "Room code already exists" });
		}
		console.error(err);
		res.status(500).json({ error: "Failed to create game" });
	}
});

// GET /rooms — list all games with roomCode + most recent celebrity name
app.get("/rooms", async (req, res) => {
	try {
		const rooms = await prisma.rooms.findMany({
			select: {
				room_code: true,
				turns: {
					orderBy: { id: "desc" },
					take: 1,
					select: { full_name: true },
				},
			},
		});

		const games = rooms.map(
			(room: { room_code: string; turns: { full_name: string }[] }) => ({
				roomCode: room.room_code,
				celebrity: room.turns[0]?.full_name ?? null,
			}),
		);

		app.get("/games/:roomCode", async (req, res) => {
			const { roomCode } = req.params;

			try {
				const room = await prisma.rooms.findUnique({
					where: { room_code: roomCode },
					include: {
						turns: {
							orderBy: { id: "desc" },
							take: 1,
						},
					},
				});

				if (!room) {
					return res.status(404).json({ error: "Game not found" });
				}

				res.json({
					roomCode: room.room_code,
					celebrity: room.turns[0]?.full_name ?? null,
				});
			} catch (err) {
				console.error(err);
				res.status(500).json({ error: "Failed to fetch game" });
			}
		});
		//app.post("/answers"
		const { roomCode, username, answer } = req.body;

		app.post("/answers", async (req, res) => {
			const { roomCode, username, answer } = req.body;

			if (!roomCode || !username || !answer) {
				return res
					.status(400)
					.json({ error: "roomCode, username, and answer are required" });
			}

			const fullName = answer.trim();
			const nameParts = fullName.split(/\s+/);
			const firstName = nameParts[0];
			const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

			try {
				const room = await prisma.rooms.findUnique({
					where: { room_code: roomCode },
					include: {
						turns: {
							orderBy: { id: "desc" },
							take: 1,
						},
					},
				});

				if (!room) {
					return res.status(404).json({ error: "Game not found" });
				}

				const prevTurn = room.turns[0] ?? null;

				const newTurn = await prisma.turns.create({
					data: {
						room_id: room.id,
						username,
						full_name: fullName,
						first_name: firstName,
						last_name: lastName,
						prev_turn_id: prevTurn?.id ?? null,
					},
				});

				res.status(201).json({
					roomCode: room.room_code,
					celebrity: newTurn.full_name,
				});
			} catch (err: any) {
				if (err.code === "P2002") {
					return res
						.status(409)
						.json({ error: "That name has already been used in this game" });
				}
				console.error(err);
				res.status(500).json({ error: "Failed to submit answer" });
			}
		});
		res.json(games);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to list games" });
	}
});

app.listen(PORT, () => {
	console.log(`API listening on http://localhost:${PORT}`);
});
