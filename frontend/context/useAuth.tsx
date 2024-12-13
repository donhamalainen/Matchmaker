import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useStorageState } from "./useStorageState";
import { useRouter, useSegments } from "expo-router";
import axios from "axios";
import { getStorageItemAsync } from "@/utils/storage";

type AuthType = {
  onLogin: (
    username: string,
    password: string
  ) => Promise<{
    success: boolean;
    message: string;
    error?: boolean;
  }>;
  onRegister: () => void;
  onLogout: () => void;
  session: string | null;
  isLoading: boolean;
};

const API_URL = process.env.API_URL || "http://192.168.76.182:3000/api";
// const API_URL =
//   process.env.NETWORK === "home"
//     ? "http://192.168.76.182:3000/api"
//     : "http://172.20.10.2:3000/api";

const AuthContext = createContext<AuthType>({
  onLogin: async () => ({
    success: false,
    message: "Ei toteutettu",
  }),
  onRegister: () => ({
    success: false,
    message: "Ei rekisteröity",
  }),
  onLogout: () => {},
  session: null,
  isLoading: false,
});

function useProtectedRoute(session: string | null) {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const onboardingStatus = async () => {
      try {
        const onboardedStatus = await getStorageItemAsync("onboarded");
        if (!onboardedStatus) return router.replace("/(auth)/onboarding");
      } catch (error) {
        console.error("Virhe haettaessa onboard-tilaa:", error);
      }
    };

    onboardingStatus();
  }, []);

  useEffect(() => {
    const inAuth = segments[0] === "(auth)";
    if (!session && !inAuth) {
      router.replace("/(auth)/sign");
    } else if (session && inAuth) {
      router.replace("/(tabs)/home");
    }
  }, [session, segments]);
}

export function AuthProvider({ children }: PropsWithChildren<{}>) {
  const [[isLoading, session], setSession] = useStorageState("session");

  useProtectedRoute(session);

  const onLogin = async (
    username: string,
    password: string
  ): Promise<{
    success: boolean;
    message: string;
    error?: boolean;
  }> => {
    try {
      // Lähetä kirjautumispyyntö backendille
      const result = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      });
      const { token, user } = result.data;
      console.log({
        token,
        id: user.id,
        username: user.username,
        created: user.created_at,
        updated: user.updated_at,
      });
      setTimeout;
      await setSession(token);
      // Aseta Axiosin oletuspääotsikko, jotta kaikki pyynnöt ovat autentikoituja
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return { success: true, message: "Kirjautuminen onnistui" };
    } catch (error) {
      // 401 Unauthorized
      if ((error as any).response?.status === 401) {
        return {
          success: false,
          message: "Väärä käyttäjänimi tai salasana",
          error: true,
        };
      }

      // Käsittele muut virheet
      return {
        success: false,
        message:
          (error as any).response?.data?.message ||
          "Jokin meni pieleen. Tarkista yhteytesi ja yritä uudelleen.",
        error: true,
      };
    }
  };
  const onRegister = async () => {};
  const onLogout = async () => {
    await setSession(null);
    delete axios.defaults.headers.common["Authorization"];
  };
  return (
    <AuthContext.Provider
      value={{
        onRegister,
        onLogin,
        onLogout,
        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuth must be used within an AuthProvider");

  return context;
}
