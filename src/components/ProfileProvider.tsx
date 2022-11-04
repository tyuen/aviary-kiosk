import { useState, createContext, useContext } from "react";

type Json = Record<string, any>;

const data = {
  setState(obj: Json) {
    //overridden
  },
  refreshProfile() {},
};

type Wrapper = { data: Json & typeof data };

export const ProfileContext = createContext<Wrapper>({ data });

export function useProfile() {
  const { data } = useContext(ProfileContext);
  return data;
}

export function ProfileProvider({ children }) {
  const [state, setState] = useState<Wrapper>({ data });

  state.data.setState = (obj: Json) => {
    setState({ data: { ...data, ...obj } });
  };

  return (
    <ProfileContext.Provider value={state}>{children}</ProfileContext.Provider>
  );
}
