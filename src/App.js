import '@ionic/react/css/core.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import React, { useState } from 'react';
import './App.css'
import GlobalState from './GlobalState'
import {
  Route,
  Redirect
} from "react-router-dom";
import Login from './components/Login';
import Home from './components/Home';
import Register from './components/Register'
import Memberarea from './components/Memberarea';
import ChangeUserdata from './components/ChangeUserdata';
import Shop from './components/Shop';
import { IonApp, IonTabBar, IonRouterOutlet, IonLabel, IonTabs, IonTabButton } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

function App() {

  const [tabChanged, setTabChanged] = useState(0);

  return (
    <GlobalState>
      <IonApp>
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
              <Redirect exact from="/" to="/home" />
              <Route path="/home" exact component={Home} />
              <Route path="/shop" exact render={props => <Shop {...props} tabChanged={tabChanged}/>} />
              <Route path="/login" exact component={Login} />
              <Route path="/register" exact component={Register} />
              <Route path="/changeuserdata" exact render={props => <ChangeUserdata {...props} tabChanged={tabChanged}/>} />
              <Route path="/memberarea" exact render={props => <Memberarea {...props} tabChanged={tabChanged}/>} />
            </IonRouterOutlet>
            <IonTabBar slot="top">
              <IonTabButton onClick={() => setTabChanged(prevState => prevState + 1)} href="/home" tab="home">
                <IonLabel>Home</IonLabel>
              </IonTabButton>
              <IonTabButton onClick={() => setTabChanged(prevState => prevState + 1)} href="/shop" tab="shop">
                <IonLabel>Shop</IonLabel>
              </IonTabButton>
              <IonTabButton onClick={() => setTabChanged(prevState => prevState + 1)} href="/login" tab="login">
                <IonLabel>Login</IonLabel>
              </IonTabButton>
              <IonTabButton onClick={() => setTabChanged(prevState => prevState + 1)} href="/register" tab="register">
                <IonLabel>Registrieren</IonLabel>
              </IonTabButton>
              <IonTabButton onClick={() => setTabChanged(prevState => prevState + 1)} href="/changeuserdata" tab="changeuserdata">
                <IonLabel>Userdaten</IonLabel>
              </IonTabButton>
              <IonTabButton onClick={() => setTabChanged(prevState => prevState + 1)} href="/memberarea" tab="memberarea">
                <IonLabel>Memberarea</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>
      </IonApp>
    </GlobalState>
  )
}

export default App;
