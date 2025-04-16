import { AuthProvider } from "@/contexts/AuthContext";
import { NotesProvider } from "@/contexts/NotesContext";
import { TasksProvider } from "@/contexts/TasksContext";
import { CategoriesProvider } from "@/contexts/CategoriesContect";
import { ThemeProvider } from "@react-navigation/native";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import "react-native-reanimated";
import tw, { useDeviceContext } from "twrnc";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  // Initialiser le contexte du device pour twrnc
  useDeviceContext(tw);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <CategoriesProvider>
        <NotesProvider>
          <TasksProvider>
            <ThemeProvider
              value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="auth" />
                <Stack.Screen name="+not-found" />
              </Stack>
              <StatusBar style="auto" />
            </ThemeProvider>
          </TasksProvider>
        </NotesProvider>
      </CategoriesProvider>
    </AuthProvider>
  );
}

export { useAuth } from "@/contexts/AuthContext";
