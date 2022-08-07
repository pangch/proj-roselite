import * as React from "react";
import { useContext, useReducer, useEffect } from "react";
import { getLocalMediaModel } from "../models/local-media-model.js";

const StateContext = React.createContext();
const DispatchContext = React.createContext();

function reducer(state, action) {
  switch (action?.type) {
    case "update-active":
      return { ...state, isActive: action.isActive };
  }
  return state;
}

export function LocalMediaContextProvider(props) {
  const localMediaModel = getLocalMediaModel();
  const initialState = {
    isActive: localMediaModel.isActive,
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    return localMediaModel.subscribe(dispatch);
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {props.children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
}

export function useLocalMediaContext() {
  return useContext(StateContext);
}
