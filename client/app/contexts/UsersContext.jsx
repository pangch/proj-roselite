import * as React from "react";
import { useContext, useReducer } from "react";

const StateContext = React.createContext();
const DispatchContext = React.createContext();

const initialState = {
  current: {},
};

function reducer(state, action) {}

export function UserContextProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {props.children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
}

export function useUsersContext() {
  return useContext(StateContext);
}

export function useUsersReducer() {
  return useContext(DispatchContext);
}
