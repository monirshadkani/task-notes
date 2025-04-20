import { AuthProvider } from "@/contexts/AuthContext";
import { NotesProvider } from "@/contexts/NotesContext";
import { TasksProvider } from "@/contexts/TasksContext";
import { CategoriesProvider } from "@/contexts/CategoriesContect";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  useColorScheme,
  View,
  TouchableOpacity,
  Modal,
  Text,
  Switch,
} from "react-native";
import "react-native-reanimated";
import tw, { useDeviceContext } from "twrnc";
import { useFonts } from "expo-font";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useAuth } from "@/contexts/AuthContext";
import { ManageCategories } from "@/components/categories/ManageCategories";
import { useNotes } from "@/contexts/NotesContext";
import { useTasks } from "@/contexts/TasksContext";
import { useCategories } from "@/contexts/CategoriesContect";
import { storageService } from "@/services/storage/asyncStorage";
import { SafeAreaView } from "react-native-safe-area-context";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function SettingsModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { isDarkMode, toggleTheme } = useTheme();
  const { signOut } = useAuth();
  const { refreshNotes } = useNotes();
  const { refreshTasks } = useTasks();
  const { refreshCategories } = useCategories();
  const [showManageCategories, setShowManageCategories] = useState(false);

  const refreshApp = async () => {
    try {
      await storageService.refreshApp();
      await Promise.all([refreshNotes(), refreshTasks(), refreshCategories()]);
    } catch (error) {
      console.error("Failed to refresh app:", error);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={tw`flex-1 bg-black/50 justify-end`}>
        <SafeAreaView style={tw`bg-white dark:bg-gray-900 rounded-t-3xl`}>
          <View style={tw`p-4`}>
            <View style={tw`flex-row justify-between items-center mb-6`}>
              <Text style={tw`text-xl font-bold text-gray-900 dark:text-white`}>
                Settings
              </Text>
              <TouchableOpacity onPress={onClose}>
                <IconSymbol
                  name="xmark"
                  size={24}
                  color={isDarkMode ? "white" : "black"}
                />
              </TouchableOpacity>
            </View>

            <View
              style={tw`flex-row items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4`}
            >
              <Text style={tw`text-lg text-gray-900 dark:text-white`}>
                Dark Mode
              </Text>
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
              />
            </View>

            <TouchableOpacity
              onPress={() => setShowManageCategories(true)}
              style={tw`p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4`}
            >
              <Text style={tw`text-lg text-gray-900 dark:text-white`}>
                Manage Categories
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={refreshApp}
              style={tw`p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4`}
            >
              <Text style={tw`text-lg text-gray-900 dark:text-white`}>
                Refresh App
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={signOut}
              style={tw`p-4 bg-red-500 rounded-lg`}
            >
              <Text style={tw`text-lg text-white text-center`}>Sign Out</Text>
            </TouchableOpacity>
          </View>

          <ManageCategories
            visible={showManageCategories}
            onClose={() => setShowManageCategories(false)}
          />
        </SafeAreaView>
      </View>
    </Modal>
  );
}

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
