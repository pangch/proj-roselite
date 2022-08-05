import * as React from "react";
import { useContext, useReducer, useCallback } from "react";

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

export function useLogger() {
  const dispatch = useContext(DispatchContext);
  return useCallback((message, level) => {
    const id = currentId++;
    dispatch({
      type: "append",
      item: {
        id,
        level: level ?? "debug",
        time: new Date(),
        message,
      },
    });
    return id;
  });
}
