import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../GlobalState';
import { IonContent, IonPage, IonList, IonItem } from '@ionic/react';

const Memberarea = props => {
  const userContext = useContext(UserContext);
  const [userData, setUserData] = useState([]);

  const getUserData = props => {
    const token = localStorage.token
    const url = 'http://mybackend.hopto.org:8000/user';

    fetch(url, {
      headers: {'Content-Type': 'application/json',
      Authorization: 'bearer ' + token},
      method: 'GET'
    })
    .then(response => {
      return response.json();
    })
    .then(backendAnswer => {
      if (backendAnswer.success === true && backendAnswer.userData) {
        setUserData(backendAnswer.userData.data)
      }
    })
    .catch(error => {
      console.log(error)
    })
  }

  useEffect(() => {
    getUserData()
  }, 
  [props.tabChanged, userContext.userState.login])

    if (userContext.userState.login === true) {
      return (
        <IonPage>
          <IonContent className="ion-padding">
            <h1>Hallo Mitglied {userContext.userState.username}! Ihre gekauften Sachen:</h1>
            <IonList>
              {userData.map((item, index) => {
                return (
                  <IonItem key={index}>
                    <p>{item.identifier}</p>
                  </IonItem>
                )
              })}
          </IonList>
          </IonContent>
        </IonPage>
      )
    } else {
      return (
        <IonPage>
          <IonContent className="ion-padding">
            <p>Bitte einloggen für tolle Funktionalitäten des Mitgliederbereichs.</p>
          </IonContent>
        </IonPage>
      )
    }
}

export default Memberarea