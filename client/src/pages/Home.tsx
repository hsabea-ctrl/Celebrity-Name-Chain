import {
	IonContent,
	IonHeader,
	IonPage,
	IonTitle,
	IonButton,
	IonToolbar,
	IonList,
	IonItem,
	IonInput,
	IonText,
} from "@ionic/react";
import { useState } from "react";

const API_URL = "https://unseemly-starch-isolating.ngrok-free.dev";

const HEADERS = {
	"Content-Type": "application/json",
	"ngrok-skip-browser-warning": "true",
};

type View = "home" | "lobby" | "game";

const Home: React.FC = () => {
	const [view, setView] = useState<View>("home");
	const [username, setUsername] = useState("");
	const [answer, setAnswer] = useState("");
	const [roomCode, setRoomCode] = useState("");
	const [joinCode, setJoinCode] = useState("");
	const [mostRecent, setMostRecent] = useState("");
	const [error, setError] = useState("");

	// Step 1 — GET /generate
	const handleGenerate = async () => {
		try {
			const res = await fetch(`${API_URL}/generate`, {
				headers: HEADERS,
			});

			const data = await res.json();

			if (!res.ok) {
				setError(data.error);
				return;
			}

			setRoomCode(data.roomCode);
			setView("lobby");
			setError("");
		} catch (err) {
			setError("Failed to generate room code");
		}
	};

	// Step 2 — POST /games/:roomCode — host starts the game
	const handleStartGame = async () => {
		if (!roomCode.trim() || !username.trim()) return;

		try {
			const res = await fetch(`${API_URL}/games/${roomCode}`, {
				method: "POST",
				headers: HEADERS,
				body: JSON.stringify({ username }),
			});

			const data = await res.json();

			if (!res.ok) {
				setError(data.error);
				return;
			}

			setMostRecent(data.startingCelebrity);
			setView("game");
			setError("");
		} catch (err) {
			setError("Failed to start game");
		}
	};

	// Step 2b — GET /games/:roomCode — player joins with existing room code
	const handleJoinGame = async () => {
		if (!joinCode.trim() || !username.trim()) return;

		try {
			const res = await fetch(`${API_URL}/games/${joinCode}`, {
				headers: HEADERS,
			});

			const data = await res.json();

			if (!res.ok) {
				setError(data.error);
				return;
			}

			setRoomCode(joinCode);
			setMostRecent(data.mostRecent);
			setView("game");
			setError("");
		} catch (err) {
			setError("Failed to join game");
		}
	};

	// Step 3 — POST /games/:roomCode/answers
	const handleSubmitAnswer = async () => {
		if (!answer.trim() || !username.trim()) return;

		try {
			const res = await fetch(`${API_URL}/games/${roomCode}/answers`, {
				method: "POST",
				headers: HEADERS,
				body: JSON.stringify({ username, answer: answer.trim() }),
			});

			const data = await res.json();

			if (!res.ok) {
				setError(data.error);
				return;
			}

			setMostRecent(data.mostRecent);
			setAnswer("");
			setError("");
		} catch (err) {
			setError("Failed to submit answer");
		}
	};

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Celebrity Name Chain</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent fullscreen>
				<IonList>
					{/* ---- HOME VIEW ---- */}
					{view === "home" && (
						<>
							<IonItem>
								<IonInput
									label="Username"
									value={username}
									onIonInput={(e: any) => setUsername(e.detail.value!)}
								/>
							</IonItem>

							<IonButton expand="block" onClick={handleGenerate}>
								Create a New Game
							</IonButton>

							{/* Join an existing game */}
							<IonItem>
								<IonInput
									label="Have a Room Code? Enter it here"
									value={joinCode}
									onIonInput={(e: any) => setJoinCode(e.detail.value!)}
								/>
							</IonItem>

							<IonButton expand="block" fill="outline" onClick={handleJoinGame}>
								Join Game
							</IonButton>
						</>
					)}

					{/* ---- LOBBY VIEW ---- */}
					{view === "lobby" && (
						<>
							<IonItem>
								<IonText>
									Share this code with your friends: <strong>{roomCode}</strong>
								</IonText>
							</IonItem>

							<IonButton expand="block" onClick={handleStartGame}>
								Start Game
							</IonButton>
						</>
					)}

					{/* ---- GAME VIEW ---- */}
					{view === "game" && (
						<>
							<IonItem>
								<IonText>
									Room Code: <strong>{roomCode}</strong>
								</IonText>
							</IonItem>

							<IonItem>
								<IonText>
									Most Recent Celebrity: <strong>{mostRecent}</strong>
								</IonText>
							</IonItem>

							<IonItem>
								<IonInput
									label="Your Answer"
									placeholder="Enter celebrity name"
									value={answer}
									onIonInput={(e: any) => setAnswer(e.detail.value!)}
								/>
							</IonItem>

							<IonButton expand="block" onClick={handleSubmitAnswer}>
								Submit Answer
							</IonButton>
						</>
					)}

					{/* ---- ERRORS ---- */}
					{error && (
						<IonItem>
							<IonText color="danger">
								<p>{error}</p>
							</IonText>
						</IonItem>
					)}
				</IonList>
			</IonContent>
		</IonPage>
	);
};

export default Home;
