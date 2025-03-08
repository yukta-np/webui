import { createContext, useContext } from 'react';
import { getLoggedInUser } from './utils';
const AppContext = createContext({});

export function AppWrapper({ children }) {
  const loggedInUser = getLoggedInUser();

  return (
    <AppContext.Provider value={{ loggedInUser }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
