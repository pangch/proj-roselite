import * as React from "react";
import { useContext, useReducer, useCallback } from "react";

const StateContext = React.createContext();
const DispatchContext = React.createContext();

const MAX_ITEMS = 1000;
let currentId = 0;

const initialState = [
  {
    id: currentId++,
    level: "info",
    time: new Date(),
    message: "Loading...",
  },
];

function reducer(state, action) {
  if (action && action.type === "append") {
    const newState = [...state, action.item].slice(-MAX_ITEMS);
    console.log("appending", action, newState);

    return newState;
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
