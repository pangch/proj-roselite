import * as React from "react";
import { useContext, useReducer, useEffect } from "react";
import { subscribeLogger } from "../../../common/logger.js";

const StateContext = React.createContext();
const DispatchContext = React.createContext();

const MAX_ITEMS = 1000;

const initialState = [];

function reducer(state, action) {
  if (action && action.type === "new" && action.item.level !== "debug") {
    return [...state, action.item].slice(-MAX_ITEMS);
  }
  return state;
}

export function ConsoleContextProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    return subscribeLogger(dispatch);
  }, []);

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
