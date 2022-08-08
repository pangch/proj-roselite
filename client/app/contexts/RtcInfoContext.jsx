import * as React from "react";
import { useContext, useReducer, useEffect } from "react";
import { omit, merge } from "lodash";
import { getRemoteMediaModel } from "../models/remote-media-model.js";

const StateContext = React.createContext();
const DispatchContext = React.createContext();

const initialState = {};

function reducerForUserRtcInfo(userId, state, action) {
  let info = state[userId];

  switch (action?.type) {
    case "set-local-description":
      info = { ...info, localDescription: action.description };
      break;
    case "set-remote-description":
      info = { ...info, remoteDescription: action.description };
      break;
    case "add-local-candidate":
      info = {
        ...info,
        localCandidates: [...info.localCandidates, action.candidate],
      };
      break;
    case "add-remote-candidate":
      info = {
        ...info,
        remoteCandidates: [...info.remoteCandidates, action.candidate],
      };
      break;
  }

  return { ...state, [userId]: info };
}

function reducer(state, action) {
  switch (action?.type) {
    case "create-peer-connection":
      return {
        ...state,
        [action.userId]: {
          localCandidates: [],
          remoteCandidates: [],
        },
      };
    case "remove-peer-connection":
      return omit(state, action.userId);
    case "set-local-description":
    case "set-remote-description":
    case "add-local-candidate":
    case "add-remote-candidate":
      return reducerForUserRtcInfo(action.userId, state, action);
  }
  return state;
}

export function RtcInfoContextProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const remoteMediaModel = getRemoteMediaModel();

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

export function useRtcInfoContext() {
  return useContext(StateContext);
}
