import React, { useState, useContext, useEffect } from 'react';
import { IonCard, IonPage, IonText, IonItemDivider, IonButton, IonItem, IonList, IonLabel, IonNote, IonChip, IonBadge, IonContent, IonCardContent } from '@ionic/react';
import { UserContext } from '../GlobalState';

const Shop = props => {
  const userContext = useContext(UserContext);
  const [shopItems, setShopItems] = useState([]);
  const [cart, setCart] = useState([])
  const [shopMessage, setShopMessage] = useState();
  const [cartMessage, setCartMessage] = useState();
  const [shopContentToDisplay, setShopContentToDisplay] = useState('offers');

  const addItemToCart = (item) => {
    let itemAlreadyInCart = false;
    cart.forEach(cartItem => {
      if (cartItem.identifier === item.identifier) {
        itemAlreadyInCart = true;
      }
    })
    if (itemAlreadyInCart) {
      setCartMessage(<IonNote color="danger">Item schon in Wagen</IonNote>)
    } else {
    setCartMessage(<IonNote color="success">Item {item.identifier} erfolgreich zum Wagen hinzugefügt</IonNote>)
      setCart([...cart, item])
    }
  }

  const removeItemFromCart = (item) => {
    const newCartState = [];
    cart.forEach(cartItem => {
      if (cartItem.identifier !== item.identifier) {
        newCartState.push(cartItem)
      }
    })
    setCart(newCartState)
  }

  const buyItems = () => {
    if (!userContext.userState.login) {
      setShopMessage(<IonText color="danger"><p>Bitte einloggen!</p></IonText>)
      return
    } else if (cart.length === 0) {
      setShopMessage(<IonText color="danger"><p>Nix im Korb!</p></IonText>)
      return
    }

    const token = localStorage.token
    let body = { data: cart };
    body = JSON.stringify(body);
    const url = 'http://http://mybackend.hopto.org:8000//user';
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
        setShopMessage(<IonText color="success"><p>Kauf erfolgreich!</p></IonText>)
        setCart([])
        setCartMessage('')
      } else if (backendAnswer.duplicate === true) {
        setShopMessage(<IonText color="danger"><p>Kauf nicht erfolgreich. Ware besitzen Sie schon.</p></IonText>)
      } else {
        setShopMessage(<IonText color="danger"><p>Kauf nicht erfolgreich.</p></IonText>)
      }
    })
    .catch(error => {
      console.log(error)
    })
  }

  useEffect(() => {
    setShopMessage('')
    setCartMessage('')
  }, [userContext.userState.login, props.tabChanged, shopContentToDisplay])

  useEffect(() => {
    fetch('http://http://mybackend.hopto.org:8000//data', 
    {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'GET'
    })
    .then(response => {
      return response.json();
    })
    .then(backendAnswer => {
      if (backendAnswer.success === true) {
        console.log(backendAnswer)
        setShopItems(backendAnswer.data)
      }
    })
    .catch(error => {
      console.log(error)
    })
  }, [])

  if (shopContentToDisplay ==='offers') {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <IonChip onClick={() => setShopContentToDisplay('offers')} class="ion-margin">Angebot</IonChip>
          <IonChip onClick={() => setShopContentToDisplay('cart')} class="ion-margin">
            Einkaufswagen
            <IonBadge class="ion-margin-start">{cart.length}</IonBadge>
          </IonChip>
          <IonItemDivider>Angebot:</IonItemDivider>
          <IonList>
            {shopItems.map((item, index) => {
              return (
                <IonItem key={index}>
                  <IonLabel>{item.identifier}</IonLabel>
                  <IonButton slot="end" onClick={() => addItemToCart(item)}>In den Einkaufswagen</IonButton>
                </IonItem>
              )
            })}
          </IonList>
          {cartMessage}
        </IonContent>
      </IonPage>
    )
  } else {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <IonChip onClick={() => setShopContentToDisplay('offers')} class="ion-margin">Angebot</IonChip>
          <IonChip onClick={() => setShopContentToDisplay('cart')} class="ion-margin">
            Einkaufswagen
            <IonBadge class="ion-margin-start">{cart.length}</IonBadge>
            </IonChip>
            <IonCard>
              <IonCardContent>
              <IonItemDivider>Einkaufswagen:</IonItemDivider>
              <IonList>
                {cart.map((item, index) => {
                  return (
                    <IonItem key={index}>
                      <IonLabel>{item.identifier}</IonLabel>
                      <IonButton slot="end" onClick={() => removeItemFromCart(item)}>Entfernen</IonButton>
                    </IonItem>
                  )
                })}
              </IonList>
              <IonButton class="ion-margin-bottom" onClick={() => buyItems()}>Den Bums kaufen</IonButton>
              {shopMessage}
              </IonCardContent>
            </IonCard>
        </IonContent>
      </IonPage>
    )
  }
  
}

export default Shop