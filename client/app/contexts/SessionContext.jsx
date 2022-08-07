import * as React from "react";
import { useContext, useReducer, useEffect } from "react";
import { partition, sortBy } from "lodash";
import { getSessionModel } from "../models/session-model.js";

const StateContext = React.createContext();
const DispatchContext = React.createContext();

function sortUsers(sessionId, users) {
  const [self, others] = partition(
    users,
    (user) => sessionId != null && sessionId === user.id
  );
  return [...self, ...sortBy(others, (user) => user.username)];
}

function reducer(state, action) {
  if (action) {
    switch (action.type) {
      case "update-session-info":
        return { ...state, sessionInfo: action.sessionInfo };
      case "update-users":
        return {
          ...state,
          users: sortUsers(state.sessionInfo?.id, action.users),
        };
      case "update-usernames":
        return { ...state, usernames: action.usernames };
    }
  }
  return state;
}

export function SessionContextProvider(props) {
  const sessionModel = getSessionModel();
  const initialState = {
    sessionInfo: sessionModel.sessionInfo,
    users: sortUsers(sessionModel.sessionInfo?.id, sessionModel.users),
    usernames: sessionModel.usernames,
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    return sessionModel.subscribe(dispatch);
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {props.children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
}

export function useSessionContext() {
  return useContext(StateContext);
}

export function useUserNameFromId(userId) {
  const { usernames } = useSessionContext();
  if (usernames == null) {
    return null;
  }
  return usernames.get(userId);
}

export function useSessionId() {
  const { sessionInfo } = useSessionContext();
  return sessionInfo?.id;
}

export function useOtherUsers() {
  const id = useSessionId();
  const { users } = useSessionContext();
  return users.filter((user) => user.id !== id);
}
