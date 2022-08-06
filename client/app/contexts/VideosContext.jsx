import * as React from "react";
import { partition } from "lodash";
import { useContext, useReducer, useEffect } from "react";
import { getVideos, subscribeVideos } from "../models/videos";
import { getSessionId } from "../models/session";

const StateContext = React.createContext();
const DispatchContext = React.createContext();

function sortVideos(videos) {
  const id = getSessionId();
  const [self, others] = partition(
    videos,
    (video) => id != null && id === video.id
  );
  return [...self, ...others];
}

function reducer(state, action) {
  switch (action?.type) {
    case "update-videos":
      const videos = sortVideos(getVideos());
      return { ...state, videos };
    default:
      return state;
  }
}

export function VideosContextProvider(props) {
  const initialState = { videos: sortVideos(getVideos()) };
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

export function useVideoInfoForUserId(userId) {
  const { videos } = useVideosContext();
  return videos.find((video) => video.userId === userId);
}
