import React, { useState, useContext, useEffect } from 'react';
import { backendURL } from '../config';
import { UserContext } from '../GlobalState';
import { IonButton, IonPage, IonText, IonList, IonContent, IonItem } from '@ionic/react';
import Input from './Input';
import { getFieldErrors } from '../functions/fieldvalidation';

const ChangeUserdata = props => {
  const useMountEffect = (fun) => useEffect(fun, [])
  const userContext = useContext(UserContext);
  const [changeDataError, setchangeDataError] = useState('');
  const [formFields, setformFields] = useState({
    email: {fieldValue: '', fieldLabel: 'Neue Email', type: 'text', pattern: {value: '^[^s@]+@[^s@]+.[^s@]+$', message: 'Gültige Email sieht aber anders aus.'}},
    password: {fieldValue: '', fieldLabel: 'Neues Passwort', type: 'password', clearOnEdit: false, minLength: {value: 2, message: 'Zu kurz, mindestens 2. '}},
    passwordrepeat: {fieldValue: '', fieldLabel: 'Passwort wiederholen', type: 'password', clearOnEdit: false}
  });
  const [fieldToChange, setFieldToChange] = useState();
  const [passwordError, setPasswordError] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const getInitialUserdata = () => {
    const token = localStorage.token

    const url = `${backendURL}/user`;
    fetch(url, {
      headers: {'Content-Type': 'application/json',
      Authorization: 'bearer ' + token},
      method: 'GET'
    })
    .then(response => {
      return response.json();
    })
    .then(backendAnswer => {
      setUserEmail(backendAnswer.userData.email)
    })
    .catch(error => {
      console.log(error)
    })
  }

  const changeUserdata = (fieldName) => {
    const errorsExist = hasFormErrors(fieldName)
    let invalidPassword;

    if (fieldName === 'password' && formFields.password.fieldValue !== formFields.passwordrepeat.fieldValue) {
      invalidPassword = true;
      setPasswordError('Passwörter müssen übereinstimmen.')
    } else {
      invalidPassword = false;
      setPasswordError('')
    }

    if (errorsExist || invalidPassword) {
      setchangeDataError(<IonText color="danger"><p>Es sind noch Fehler vorhanden. Bitte korrigieren und nochmal klicken.</p></IonText>)
      return
    } else {
      setchangeDataError('')
    }

    const token = localStorage.token
    let body = {};
    body[fieldName] = formFields[fieldName].fieldValue;

    body = JSON.stringify(body);
    const url = `${backendURL}/user`;
    fetch(url, {
      headers: {'Content-Type': 'application/json',
      Authorization: 'bearer ' + token},
      body: body,
      method: 'PATCH'
    })
    .then(response => {
      return response.json();
    })
    .then(backendAnswer => {
      if (backendAnswer.success === true) {
        setchangeDataError(<IonText color="success"><p>Datenänderung erfolgreich.</p></IonText>)
        if (fieldName === 'email') {
          setUserEmail(formFields[fieldName].fieldValue)
        }
       } else {
        setchangeDataError(<IonText color="danger"><p>Datenänderung nicht möglich.</p></IonText>)
      }
    })
    .catch(error => {
      console.log(error)
      setchangeDataError(<IonText color="danger"><p>Datenänderung nicht möglich.</p></IonText>)
    })
  }

  const hasFormErrors = (fieldName) => {
    let errorsExist = false;
    const updatedFormFields = {}
    for (let [key, fieldObject] of Object.entries(formFields)) {
      if (fieldName === key) {
        const fieldErrors = getFieldErrors(fieldObject)
        updatedFormFields[key] = {...fieldObject, ...{fieldErrors}}
        for (let errorMessage of Object.values(fieldErrors)) {
          if (errorMessage.length > 0) {
            errorsExist = true;
          }
        }
      }
    }

    setformFields({...formFields, ...updatedFormFields})
    return errorsExist;
  }

  const navigateBack = () => {
    setFieldToChange('')
    setchangeDataError('')
    setPasswordError('')
  }

  useMountEffect(getInitialUserdata)

  useEffect(() => {
    setchangeDataError('')
    setPasswordError('')
  }, 
  [props.tabChanged])

    if (userContext.userState && userContext.userState.login && !fieldToChange) {
        return (
          <IonPage>
            <IonContent className="ion-padding">
              <p className="ion-text-center">Was möchten Sie ändern?</p>
                <IonButton onClick={() => setFieldToChange('email')}>Email</IonButton>
                <IonButton onClick={() => setFieldToChange('password')}>Passwort</IonButton>
            </IonContent>
          </IonPage>
        )
      } else if (userContext.userState && userContext.userState.login && fieldToChange === 'email') {
        return (
          <IonPage>
            <IonContent className="ion-padding">
              <IonList>
                <IonItem>
                  <IonText>Aktuelle Email: {userEmail}</IonText>
                </IonItem>
                <Input fieldName="email" type="text" formFields={formFields} setformFields={setformFields} tabChanged={props.tabChanged}/>
              </IonList>
              <IonButton onClick={() => navigateBack()}>Zurück</IonButton>
              <IonButton onClick={() => changeUserdata('email')}>Abschicken</IonButton>
              {changeDataError}
            </IonContent>
          </IonPage>
        )
      } else if (userContext.userState && userContext.userState.login && fieldToChange === 'password') {
        return (
        <IonPage>
          <IonContent className="ion-padding">
            <IonList>
              <Input fieldName="password" formFields={formFields} setformFields={setformFields} tabChanged={props.tabChanged}/>
              <Input fieldName="passwordrepeat" formFields={formFields} setformFields={setformFields} tabChanged={props.tabChanged}/>
            </IonList>
            <IonButton onClick={() => navigateBack()}>Zurück</IonButton>
            <IonButton onClick={() => changeUserdata('password')}>Abschicken</IonButton>
            <IonText color="danger"><p>{passwordError}</p></IonText>
            {changeDataError}
          </IonContent>
        </IonPage>
        )
      } else {
        return (
          <IonPage>
            <IonContent className="ion-padding">
              <p className="ion-text-center">Bitte einloggen.</p >
            </IonContent>
          </IonPage>
        )
    }
  }

export default ChangeUserdata