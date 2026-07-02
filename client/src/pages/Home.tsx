import { IonContent, IonHeader, IonPage, IonTitle, IonButton, IonToolbar, IonList, IonItem, IonInput, IonText } from '@ionic/react';
import {useState} from 'react'; 


const Home: React.FC = () => {
  const[roomCode, setRoomCode]=useState('');
  const[username, setUsername]=useState(''); 
  const[answer, setAnswer]=useState('');
  const[recentAnswer, setrecentAnswer]= useState(''); 
  
    
    const handleSubmit=() => {
      if (!answer.trim())return;  //doesnt allow empty input
      setrecentAnswer(answer);
      setAnswer('');
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
                 <IonInput 
                 label="Room Code"
                 value={roomCode}
                 onIonInput={(e:any)=> setRoomCode(e.detail.value!)}
                 /> 

               </IonItem>
                <IonItem>
                  <IonInput label="Username"
                  value={username}
                  onIonInput={(e:any)=> setUsername(e.detail.value!)}
                 />

               </IonItem>
               <IonItem>
               <IonInput
                 label="Answer" 
                 placeholder="Please enter celebrity name guess"
                 value={answer}
                 onIonInput={(e:any)=> setAnswer(e.detail.value!)}
                />
                 </IonItem>

               <IonButton expand="block" onClick={handleSubmit}>
                Sumbit</IonButton>

                {recentAnswer &&(
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


