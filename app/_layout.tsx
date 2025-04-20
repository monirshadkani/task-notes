import { AuthProvider } from "@/contexts/AuthContext";
import { NotesProvider } from "@/contexts/NotesContext";
import { TasksProvider } from "@/contexts/TasksContext";
import { CategoriesProvider } from "@/contexts/CategoriesContect";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import "react-native-reanimated";
import tw, { useDeviceContext } from "twrnc";
import { useFonts } from "expo-font";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { isDarkMode } = useTheme();
  const colorScheme = useColorScheme();
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
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: isDarkMode
            ? tw.color("gray-900")
            : tw.color("white"),
        },
        navigationBarColor: isDarkMode
          ? tw.color("gray-900")
          : tw.color("white"),
        statusBarStyle: isDarkMode ? "light" : "dark",
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          contentStyle: {
            backgroundColor: isDarkMode
              ? tw.color("gray-900")
              : tw.color("white"),
          },
        }}
      />
      <Stack.Screen
        name="auth"
        options={{
          contentStyle: {
            backgroundColor: isDarkMode
              ? tw.color("gray-900")
              : tw.color("white"),
          },
        }}
      />
      <Stack.Screen
        name="+not-found"
        options={{
          contentStyle: {
            backgroundColor: isDarkMode
              ? tw.color("gray-900")
              : tw.color("white"),
          },
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          contentStyle: {
            backgroundColor: isDarkMode
              ? tw.color("gray-900")
              : tw.color("white"),
          },
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <TasksProvider>
          <NotesProvider>
            <CategoriesProvider>
              <AppContent />
              <StatusBar style="auto" />
            </CategoriesProvider>
          </NotesProvider>
        </TasksProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export { useAuth } from "@/contexts/AuthContext";
