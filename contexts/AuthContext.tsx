import { useRouter, useSegments } from "expo-router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "@/services/auth/auth.types";
import { storageService } from "@/services/storage/asyncStorage";

type AuthContextType = {
  signIn: (token: string, userData: User) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  userToken: string | null;
  user: User | null;
};

const AuthContext = createContext<AuthContextType>({
  signIn: async () => {},
  signOut: async () => {},
  isLoading: true,
  userToken: null,
  user: null,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserTokenState] = useState<string | null>(null);
  const [user, setUserState] = useState<User | null>(null);
  const router = useRouter();
  const segments = useSegments();

  const checkAndRedirect = useCallback(() => {
    const inAuthGroup = segments[0] === "auth";

    if (!userToken && !inAuthGroup && !isLoading) {
      router.replace("/auth/login");
    } else if (userToken && inAuthGroup) {
      router.replace("/");
    }
  }, [userToken, isLoading, segments, router]);

  useEffect(() => {
    checkAndRedirect();
  }, [checkAndRedirect]);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await storageService.getUserToken();
        const userData = await storageService.getUserData();

        setUserTokenState(token);
        setUserState(userData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadToken();
  }, []);

  const signIn = async (token: string, userData: User) => {
    try {
      await storageService.setUserToken(token);
      await storageService.setUserData(userData);
      setUserTokenState(token);
      setUserState(userData);
    } catch (error) {
      console.error(error);
    }
  };

  const signOut = async () => {
    try {
      await storageService.removeUserData();
      setUserTokenState(null);
      setUserState(null);
    } catch (error) {
      console.error(error);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
