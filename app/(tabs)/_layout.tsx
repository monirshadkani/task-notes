import { Tabs } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  TouchableOpacity,
  View,
  Modal,
  Text,
  Switch,
} from "react-native";
import tw from "twrnc";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNotes } from "@/contexts/NotesContext";
import { useTasks } from "@/contexts/TasksContext";
import { useCategories } from "@/contexts/CategoriesContect";
import { storageService } from "@/services/storage/asyncStorage";
import { SafeAreaView } from "react-native-safe-area-context";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { ManageCategories } from "@/components/categories/ManageCategories";

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

export default function TabLayout() {
  const { isDarkMode } = useTheme();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <Tabs
        screenOptions={{
          headerStyle: {
            backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
          },
          headerTintColor: isDarkMode ? "#FFFFFF" : "#000000",
          tabBarStyle: {
            backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF",
            borderTopColor: isDarkMode ? "#374151" : "#E5E7EB",
          },
          tabBarActiveTintColor: isDarkMode ? "#60A5FA" : "#2563EB",
          tabBarInactiveTintColor: isDarkMode ? "#9CA3AF" : "#6B7280",
          tabBarButton: (props) => <HapticTab {...props} />,
          headerShown: true,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => setShowSettings(true)}
              style={tw`mr-4`}
            >
              <IconSymbol
                name="gear"
                size={24}
                color={isDarkMode ? "white" : "black"}
              />
            </TouchableOpacity>
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Notes",
            tabBarIcon: ({ color, size }) => (
              <IconSymbol name="note.text" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="tasks"
          options={{
            title: "Tasks",
            tabBarIcon: ({ color, size }) => (
              <IconSymbol name="checklist" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
      <SettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </>
  );
}
