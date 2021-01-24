import React, { useEffect, useContext, useState } from 'react';
import { backendURL } from '../config';
import { UserContext, LOGIN, LOGOUT } from '../GlobalState';
import { IonNote, IonButton, IonPage, IonContent, IonList } from '@ionic/react';
import Input from './Input';

const Login = props => {
  const useMountEffect = (fun) => useEffect(fun, [])
  const userContext = useContext(UserContext);
  const [loginMessage, setloginMessage] = useState({success: '', fail: ''});
  const [formFields, setformFields] = useState({
    username: {fieldValue: '', fieldLabel: 'Username', type: "text"},
    password: {fieldValue: '', fieldLabel: 'Passwort', type: "password", clearOnEdit: false}
  });

  function login(e) {
    if (e) {
      e.preventDefault();
    }

    const token = localStorage.token
    let body;
    if (formFields.username.fieldValue.length === 0 && formFields.password.fieldValue.length === 0 && !e) {
      body = JSON.stringify({token})
    } else if (formFields.username.fieldValue.length === 0 || formFields.password.fieldValue.length === 0) {
      setloginMessage({...loginMessage, fail: 'Falscher Login!'})
      return
    } else {
      body = JSON.stringify({username: formFields.username.fieldValue, password: formFields.password.fieldValue});
    }

    fetch(`${backendURL}/user/login`, 
    {
      headers: {'Content-Type': 'application/json'},
      body: body,
      method: 'POST'
    })
      .then(response => {
        return response.json()
      })
      .then(parsedAnswer => {
        if (parsedAnswer.success === true) {
          let username;
          if (parsedAnswer.result && parsedAnswer.result.user) {
            username = parsedAnswer.result.user;
          } else {
            username = formFields.username.fieldValue;
          }
          const dispatchData = {type: LOGIN, username}
          if (parsedAnswer.token) {
            dispatchData.token = parsedAnswer.token;
            localStorage.token = parsedAnswer.token;
          }
          userContext.dispatch(dispatchData);
          setloginMessage({...loginMessage, success: 'Login erfolgreich!'})
        } else if (formFields.username.fieldValue || formFields.password.fieldValue) {
          setloginMessage({...loginMessage, fail: 'Falscher Login!'})
        }
      })
      .catch(error => {
        console.log(error)
        if (e) {
          setloginMessage({...loginMessage, fail: 'Login nicht möglich.'})
        }
      })
  }

  function logout() {
    userContext.dispatch({type: LOGOUT})
    setloginMessage('')
    localStorage.token = '';
  }

  useMountEffect(login)

  if (userContext.userState.login === true) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <p color="success">{loginMessage.success}</p>
          <IonButton onClick={() => logout()}>Ausloggen</IonButton>
        </IonContent>
      </IonPage>
    )
  } else {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <form noValidate autoComplete="off" onSubmit={login}>
            <IonList>
              <Input fieldName="username" formFields={formFields} setformFields={setformFields} tabChanged={props.tabChanged}/>
              <Input fieldName="password" formFields={formFields} setformFields={setformFields} tabChanged={props.tabChanged}/>
            </IonList>
            <IonButton type="submit">Einloggen</IonButton>
            <IonNote color="danger"><p>{loginMessage.fail}</p></IonNote>
          </form>
        </IonContent>
      </IonPage>
    )
  }

}

export default Login
