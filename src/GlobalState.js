import React, { useReducer } from 'react';

export const UserContext = React.createContext();

export const LOGIN = 'login';
export const LOGOUT = 'logout';
export const USERINPUT = 'userinput'

const GlobalState = props => {
    const [userState, dispatch] = useReducer(loginReducer, {login: false, token: localStorage.token, falseregister: false, username: '', password: '', passwordrepeat: ''});

    function loginReducer(state, action) {
      switch (action.type) {
        case LOGIN:
          return updateUserStatus(state, action);
        case LOGOUT:
          return updateUserStatus(state, action);
        case USERINPUT:
          return updateUserStatus(state, action);
        default:
          return state;
      }
    }

    function updateUserStatus(state, action) {
      if (action.type === LOGIN) {
        return { ...state, login: true, token: action.token, username: action.username } 
      } else if (action.type === LOGOUT) {
        return { ...state, login: false, token: '' } 
      } else  if (action.type === USERINPUT) {
        if (typeof action.username !== 'undefined') {
          return { ...state, username: action.username }
        }
      }
    }

    return (
        <UserContext.Provider value={{userState, dispatch}}>
          {props.children}
        </UserContext.Provider>
    )
}

export default GlobalState