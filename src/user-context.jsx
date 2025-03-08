import axios from 'axios';
import { createContext, useContext, useState } from 'react';
import { constants, headers } from './constants';

const UserContext = createContext();

export function UserWrapper({ children }) {
  const [selfUser, setSelfUser] = useState();

  const fetchSelfUser = async () => {
    try {
      const { data } = await axios.get(`${constants.urls.users}/me`, {
        headers,
      });

      setSelfUser(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <UserContext.Provider value={{ selfUser, fetchSelfUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}
