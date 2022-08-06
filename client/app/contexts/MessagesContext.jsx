import * as React from "react";
import { useContext, useReducer, useEffect } from "react";
import { getMessagesModel } from "../models/messages-model.js";

const StateContext = React.createContext();
const DispatchContext = React.createContext();

const initialState = [];

function reducer(state, action) {
  if (action && action.type === "new") {
    return [...state, action.item];
  }
  return state;
}

export function MessagesContextProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const messagesModel = getMessagesModel();

  useEffect(() => {
    return messagesModel.subscribe(dispatch);
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {props.children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
}

export function useMessagesContext() {
  return useContext(StateContext);
}
