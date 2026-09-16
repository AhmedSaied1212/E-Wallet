/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/set-state-in-effect */
import { createContext, useState, useEffect, useCallback } from "react";
import authServices from "../services/authServices";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUser = useCallback(async () => {
    setIsLoading(true);

    try {
        const data = await authServices.profile();
        
        if (data?.success) {
            setUser(data.data);
            console.log(data)
            setError("");
        } else {
            setUser(null);
            setError(data.error);
        }
    } catch (err) {
        setError(err.message);
        setUser(null);
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const value = {
    user,
    setUser,
    isLoading,
    setError,
    error,
    fetchUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
