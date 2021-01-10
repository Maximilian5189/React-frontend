import React from 'react';
import { IonPage, IonContent } from '@ionic/react';

const Home = props => {

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h1 className="ion-text-center">Willkommen zu meiner ersten React App.</h1>
        <p className="ion-text-center">Viel Spaß bei der Nutzung. Es handelt sich nur um eine Test-App, zum Testen von Funktionalitäten wie etwa "Registrieren" sollten nur Dummy-Daten verwendet werden.</p>
      </IonContent>
    </IonPage>
  )
}

export default Home