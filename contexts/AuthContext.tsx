import { useRouter, useSegments } from "expo-router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "@/services/auth/auth.types";
import { secureStorage } from "@/services/storage/secureStorage";

type AuthContextType = {
  signIn: (token: string, userData: User) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  userToken: string | null;
  user: User | null;
  isReady: boolean;
};

const AuthContext = createContext<AuthContextType>({
  signIn: async () => {},
  signOut: async () => {},
  isLoading: true,
  userToken: null,
  user: null,
  isReady: false,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserTokenState] = useState<string | null>(null);
  const [user, setUserState] = useState<User | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const checkAndRedirect = useCallback(() => {
    if (!isMounted || !isReady) return;

    const inAuthGroup = segments[0] === "auth";

    if (!userToken && !inAuthGroup && !isLoading) {
      router.replace("/auth/login");
    } else if (userToken && inAuthGroup) {
      router.replace("/");
    }
  }, [userToken, isLoading, segments, router, isMounted, isReady]);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await secureStorage.getAuthToken();
        const userData = await secureStorage.getUserData();

        setUserTokenState(token);
        setUserState(userData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
        setIsReady(true);
      }
    };

    loadToken();
  }, []);

  useEffect(() => {
    if (!isLoading && isMounted && isReady) {
      checkAndRedirect();
    }
  }, [isLoading, isMounted, isReady, checkAndRedirect]);

  const signIn = async (token: string, userData: User) => {
    try {
      await secureStorage.setAuthToken(token);
      await secureStorage.setUserData(userData);
      setUserTokenState(token);
      setUserState(userData);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await secureStorage.clearAll();
      setUserTokenState(null);
      setUserState(null);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        isLoading,
        userToken,
        user,
        isReady,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
