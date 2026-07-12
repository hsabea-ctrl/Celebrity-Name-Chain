import "dotenv/config";
import cors from "cors";
import express from "express";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.js";

// App setup
const app = express();
const PORT = process.env.PORT ?? 3000;

// Prisma setup
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Middleware
app.use(
	cors({
		origin: [
			"http://localhost:5173",
			"https://unseemly-starch-isolating.ngrok-free.dev",
		],
	}),
);
app.use(express.json());

// ngrok header bypass
app.use((req, res, next) => {
	res.setHeader("ngrok-skip-browser-warning", "true");
	next();
});

// Starting celebrities array
const STARTING_CELEBRITIES = [
	"Elvis Presley",
	"Marilyn Monroe",
	"Michael Jackson",
	"Audrey Hepburn",
	"Frank Sinatra",
	"Madonna Ciccone",
	"Bruce Lee",
	"Whitney Houston",
	"James Dean",
	"Tina Turner",
];

const getRandomCelebrity = () => {
	return STARTING_CELEBRITIES[
		Math.floor(Math.random() * STARTING_CELEBRITIES.length)
	];
};

// Health check
app.get("/health", (req, res) => {
	res.json({ ok: true });
});

// GET /generate — generate a unique room code only
app.get("/generate", async (req, res) => {
	const generateCode = () =>
		Math.random().toString(36).substring(2, 8).toUpperCase();

	let code = generateCode();
	let attempts = 0;

	while (attempts < 10) {
		const room = await prisma.rooms.findUnique({
			where: { room_code: code },
		});

		if (!room) break;

		code = generateCode();
		attempts++;
	}

	if (attempts === 10) {
		return res
			.status(500)
			.json({ error: "Could not generate a unique room code" });
	}

	res.json({ roomCode: code });
});

// POST /games/:roomCode — create a game and assign a starting celebrity
app.post("/games/:roomCode", async (req, res) => {
	const { roomCode } = req.params;
	const { username } = req.body;

	const celebrity = getRandomCelebrity();
	const nameParts = celebrity.trim().split(/\s+/);
	const firstName = nameParts[0];
	const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

	try {
		await prisma.rooms.create({
			data: {
				room_code: roomCode,
				username: username ?? "system",
				topic: "celebrities",
				turns: {
					create: {
						username: "system",
						full_name: celebrity,
						first_name: firstName,
						last_name: lastName,
						prev_turn_id: null,
					},
				},
			},
		});

		res.status(201).json({
			roomCode,
			startingCelebrity: celebrity,
		});
	} catch (err: any) {
		if (err.code === "P2002") {
			return res.status(409).json({ error: "Room code already in use" });
		}
		console.error(err);
		res.status(500).json({ error: "Failed to create game" });
	}
});

// GET /games/:roomCode — view a room and see the most recent celebrity
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
			mostRecent: room.turns[0]?.full_name ?? null,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to fetch game" });
	}
});

// POST /games/:roomCode/answers — submit an answer in a specific room
app.post("/games/:roomCode/answers", async (req, res) => {
	const { roomCode } = req.params;
	const { username, answer } = req.body;

	if (!username || !answer) {
		return res.status(400).json({ error: "username and answer are required" });
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

		// Rule 2 — first name must start with first letter of previous last name
		if (prevTurn) {
			const requiredLetter = prevTurn.last_name.charAt(0).toLowerCase();
			const submittedLetter = firstName.charAt(0).toLowerCase();

			if (requiredLetter !== submittedLetter) {
				return res.status(400).json({
					error: `Name must start with ${requiredLetter.toUpperCase()}`,
				});
			}
		}

		// Rule 3 — same player cannot go twice in a row
		if (prevTurn && prevTurn.username === username) {
			return res.status(409).json({
				error: "You answered most recently; wait for someone else",
			});
		}

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
			accepted: true,
			mostRecent: newTurn.full_name,
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

app.listen(PORT, () => {
	console.log(`API listening on http://localhost:${PORT}`);
});
