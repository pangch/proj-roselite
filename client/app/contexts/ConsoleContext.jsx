import * as React from "react";
import { useContext, useReducer, useCallback } from "react";
import { setConsoleContextDispatch } from "../utils/logger";

const StateContext = React.createContext();
const DispatchContext = React.createContext();

const MAX_ITEMS = 1000;
let currentId = 0;

const initialState = [];

function reducer(state, action) {
  if (action && action.type === "append") {
    return [...state, action.item].slice(-MAX_ITEMS);
  }
  return state;
}

export function ConsoleContextProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  setConsoleContextDispatch(dispatch);
  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {props.children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
}

export function useConsoleContext() {
  return useContext(StateContext);
}
