import * as React from "react";
import { useContext, useReducer, useEffect } from "react";
import { getVideos, subscribeVideos } from "../models/videos";

const StateContext = React.createContext();
const DispatchContext = React.createContext();

const initialState = [];

function reducer(state, action) {
  return state;
}

export function VideosContextProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    return subscribeVideos(dispatch);
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {props.children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
}

export function useVideosContext() {
  return useContext(StateContext);
}
