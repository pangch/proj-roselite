import * as React from "react";
import { useContext, useReducer, useEffect } from "react";
import { getSessionInfo, subscribeSession } from "../utils/session.js";

const StateContext = React.createContext();
const DispatchContext = React.createContext();

function reducer(state, action) {
  if (action) {
    switch (action.type) {
      case "update-id":
        return { ...state, id: action.id };
    }
  }
  return state;
}

export function SessionContextProvider(props) {
  const initialState = getSessionInfo();
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    return subscribeSession(dispatch);
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {props.children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
}

export function useSessionContext() {
  return useContext(StateContext);
}
