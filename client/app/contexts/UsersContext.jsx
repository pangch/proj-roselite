import * as React from "react";
import { sortBy, partition } from "lodash";
import { useContext, useReducer, useEffect } from "react";
import { getUsers, subscribeUsers } from "../utils/users";
import { getSessionId } from "../utils/session";

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
  if (action && action.type === "update") {
    return sortUsers(action.users);
  }
  return state;
}

export function UsersContextProvider(props) {
  const initialState = sortUsers(getUsers());
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
