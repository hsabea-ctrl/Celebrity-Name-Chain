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

const API_URL = "http:localhost:3000";

const Home: React.FC = () => {
	// const [roomCode, setRoomCode] = useState("");
	const [username, setUsername] = useState("");
	const [answer, setAnswer] = useState("");
	const [recentAnswer, setrecentAnswer] = useState("");
	const [error, setError] = useState("");

	//The random room code generator
	const generateRoomCode = () => {
		return Math.random().toString(36).substring(2, 8).toUpperCase();
	};

	//autogenerates on load
	const [roomCode, setRoomCode] = useState(generateRoomCode);

	//creates a new game and submits the first celebrity
	const handleCreateGame = async () => {
		if (!answer.trim() || !username.trim()) return;

		try {
			const res = await fetch(`${API_URL}/games`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					roomCode,
					username,
					celebrity: answer.trim(),
					topic: "general",
				}),
			});

			const data = await res.json();

			if (!res.ok) {
				setError(data.error);
				return;
			}

			setrecentAnswer(answer.trim());
			setAnswer("");
			setError("");
		} catch (err) {
			setError("Failed to create game");
		}
	};

	handleCreateGame();

	const handleSubmit = () => {
		if (!answer.trim()) return; //doesnt allow empty input
		setrecentAnswer(answer);
		setAnswer("");
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
					<IonItem>
						{roomCode && (
							<IonItem>
								<IonText>
									Your Room Code: <strong>{roomCode}</strong>
								</IonText>
							</IonItem>
						)}
					</IonItem>
					<IonItem>
						<IonInput
							label="Username"
							value={username}
							onIonInput={(e: any) => setUsername(e.detail.value!)}
						/>
					</IonItem>
					<IonItem>
						<IonInput
							label="Answer"
							placeholder="Please enter celebrity name guess"
							value={answer}
							onIonInput={(e: any) => setAnswer(e.detail.value!)}
						/>
					</IonItem>

					<IonButton expand="block" onClick={handleSubmit}>
						Sumbit
					</IonButton>

					{recentAnswer && (
						<IonItem>
							<IonText>
								Most recent answer: <strong> {recentAnswer}</strong>
							</IonText>
						</IonItem>
					)}
				</IonList>
			</IonContent>
		</IonPage>
	);
};
export default Home;
