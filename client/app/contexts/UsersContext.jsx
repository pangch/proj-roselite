import * as React from "react";
import { sortBy, partition } from "lodash";
import { useContext, useReducer, useEffect } from "react";
import { getUsers, subscribeUsers } from "../models/users";
import { getSessionId } from "../models/session";

const StateContext = React.createContext();
const DispatchContext = React.createContext();

function sortUsers(users) {
  const id = getSessionId();
  const [self, others] = partition(
    users,
    (user) => id != null && id === user.id
  );
  return [...self, ...sortBy(others, (user) => user.username)];
}

function reducer(state, action) {
  switch (action?.type) {
    case "update-users":
      return { ...state, users: sortUsers(action.users) };
    case "update-usernames":
      return { ...state, usernames: action.usernames };
    default:
      return state;
  }
}

export function UsersContextProvider(props) {
  const initialState = { users: sortUsers(getUsers()) };
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    return subscribeUsers(dispatch);
  }, []);

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

export function useUserNameFromId(userId) {
  const { usernames } = useUsersContext();
  if (usernames == null) {
    return null;
  }
  return usernames.get(userId);
}
