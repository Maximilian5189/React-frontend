import React, { useState, useContext } from 'react';
import { UserContext, LOGOUT, USERINPUT } from '../GlobalState';
import { IonButton, IonPage, IonNote, IonList, IonText, IonContent } from '@ionic/react';
import Input from './Input';
import { getFieldErrors } from '../functions/fieldvalidation';

const Register = props => {
  const userContext = useContext(UserContext);
  const [registerError, setRegisterError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [formFields, setformFields] = useState({
    username: {fieldValue: '', minLength: {value: 2, message: 'Zu kurz, mindestens zwei Buchstaben.'}, maxLength: {value: 10, message: 'Zu lang. Maximal 10 Buchstaben.'}, pattern: {value: '^[a-zA-Z]+$', message: 'Nur Buchstaben.'}}, 
    email: {fieldValue: '', pattern: {value: '^[^s@]+@[^s@]+.[^s@]+$', message: 'Gültige Email sieht aber anders aus.'}},
    password: {fieldValue: '', minLength: {value: 2, message: 'Zu kurz, mindestens mindestens zwei Ziffern. '}}
  });

  const register = () => {
    const errorsExist = hasFormErrors()

    if (errorsExist) {
      setRegisterError('Es sind noch Fehler vorhanden. Bitte korrigieren und nochmal klicken.')
      return
    } else {
      setRegisterError('')
    }

    const body = JSON.stringify({username: formFields.username.fieldValue, password: formFields.password.fieldValue, email: formFields.email.fieldValue});
    const url = 'http://3.123.35.137/user/add';
    fetch(url, {
      headers: {'Content-Type': 'application/json'},
      body: body,
      method: 'POST'
    })
    .then(response => {
      return response.json();
    })
    .then(backendAnswer => {
      if (backendAnswer.success === true) {
        setIsRegistered(true);
        setRegisterError('')
        userContext.dispatch({type: USERINPUT, username: formFields.username.fieldValue})
      } else if (backendAnswer.error.duplicate === true) {
        setRegisterError('User oder Email bereits im System vorhanden.')
      } else {
        setRegisterError('Registrierung nicht möglich.')
      }
    })
    .catch(error => {
      setRegisterError('Registrierung nicht möglich.')
    })
  }

  const hasFormErrors = () => {
    let errorsExist = false;
    const updatedFormFields = {}
    for (let [key, fieldObject] of Object.entries(formFields)) {
      const fieldErrors = getFieldErrors(fieldObject)
      updatedFormFields[key] = {...fieldObject, ...{fieldErrors}}
      for (let [key, errorMessage] of Object.entries(fieldErrors)) {
        if (errorMessage.length > 0) {
          errorsExist = true;
        }
      }
    }

    setformFields({...formFields, ...updatedFormFields})
    return errorsExist;
  }

  if (isRegistered) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <p className="ion-text-center">Erfolgreich registriert!</p>
        </IonContent>
      </IonPage>
    )
  } else if (!userContext.userState || !userContext.userState.login || registerError) {
      return (
        <IonPage>
          <IonContent className="ion-padding">
            <IonList>
              <Input fieldName="username" type="text" formFields={formFields} setformFields={setformFields} tabChanged={props.tabChanged}/>
              <Input fieldName="email" type="text" formFields={formFields} setformFields={setformFields} tabChanged={props.tabChanged}/>
              <Input fieldName="password" type="password" clearOnEdit="false" formFields={formFields} setformFields={setformFields} tabChanged={props.tabChanged}/>
            </IonList>
            <IonButton className="ion-margin-bottom" onClick={register}>Register</IonButton>
            <IonNote color="danger"><p>{registerError}</p></IonNote>
          </IonContent>
        </IonPage>
      )
  } else {
      return (
        <IonPage>
          <IonContent className="ion-padding">
            <IonText><p>Neu registrieren?</p></IonText>
            <IonButton onClick={() => userContext.dispatch({type: LOGOUT})}>Ausloggen</IonButton>
          </IonContent>
        </IonPage>
      )
    }
  }

export default Register