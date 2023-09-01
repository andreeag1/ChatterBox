import React, {
  useContext,
  useEffect,
  useRef,
  createContext,
  useState,
} from "react";
import { getCurrentUser } from "../../modules/users/userRepository";

export const UserContext = createContext({});

export const UserContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await getCurrentUser();
      setCurrentUser(user);
    };
    fetchCurrentUser();
  }, []);

  return (
    <UserContext.Provider value={{ currentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
