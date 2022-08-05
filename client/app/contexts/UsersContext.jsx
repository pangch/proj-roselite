import * as React from "react";
import { useContext, useReducer } from "react";
import { getUserState, setUsersContextDispatch } from "../utils/users";

const StateContext = React.createContext();
const DispatchContext = React.createContext();

function reducer(state, action) {
  if (action && action.type === "update") {
    return getUserState();
  }
  return state;
}

export function UsersContextProvider(props) {
  const initialState = getUserState();
  const [state, dispatch] = useReducer(reducer, initialState);
  setUsersContextDispatch(dispatch);

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
