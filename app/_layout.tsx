import { AuthProvider } from "@/contexts/AuthContext";
import { NotesProvider } from "@/contexts/NotesContext";
import { TasksProvider } from "@/contexts/TasksContext";
import { CategoriesProvider } from "@/contexts/CategoriesContect";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";

import "react-native-reanimated";

import { useFonts } from "expo-font";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { isDarkMode } = useTheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: isDarkMode ? "#000" : "#fff",
          },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            contentStyle: {
              backgroundColor: isDarkMode ? "#000" : "#fff",
            },
          }}
        />
        <Stack.Screen
          name="notes"
          options={{
            contentStyle: {
              backgroundColor: isDarkMode ? "#000" : "#fff",
            },
          }}
        />
        <Stack.Screen
          name="tasks"
          options={{
            contentStyle: {
              backgroundColor: isDarkMode ? "#000" : "#fff",
            },
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <AuthProvider>
      <NotesProvider>
        <TasksProvider>
          <CategoriesProvider>
            <ThemeProvider>
              <AppContent />
            </ThemeProvider>
          </CategoriesProvider>
        </TasksProvider>
      </NotesProvider>
    </AuthProvider>
  );
}

export { useAuth } from "@/contexts/AuthContext";
