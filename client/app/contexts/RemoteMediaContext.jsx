import * as React from "react";
import { useContext, useReducer, useEffect } from "react";
import { getRemoteMediaModel } from "../models/remote-media-model.js";

const StateContext = React.createContext();
const DispatchContext = React.createContext();

function reducer(state, action) {
  switch (action?.type) {
    case "update-active-users":
      return { ...state, activeUsers: action.activeUsers };
  }
  return state;
}

export function RemoteMediaContextProvider(props) {
  const remoteMediaModel = getRemoteMediaModel();
  const initialState = {
    activeUsers: remoteMediaModel.activeUsers,
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    return remoteMediaModel.subscribe(dispatch);
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {props.children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
}

export function useRemoteMediaContext() {
  return useContext(StateContext);
}

export function useIsUserMediaActive(userId) {
  const { activeUsers } = useRemoteMediaContext();
  return activeUsers.includes(userId);
}
