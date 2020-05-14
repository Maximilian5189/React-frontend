import React from 'react';
import { IonPage, IonContent } from '@ionic/react';

const Home = props => {

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h1 className="ion-text-center">Willkommen zu meiner ersten React App.</h1>
        <p className="ion-text-center">Viel Spaß bei der Nutzung.</p>
      </IonContent>
    </IonPage>
  )
}

export default Home