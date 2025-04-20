// Écran des paramètres (déconnexion, switch thème)
import { View, Text, TouchableOpacity, Switch } from "react-native";
import { useAuth } from "../_layout";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { storageService } from "@/services/storage/asyncStorage";
import { router } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ManageCategories } from "@/components/categories/ManageCategories";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useNotes } from "@/contexts/NotesContext";
import { useTasks } from "@/contexts/TasksContext";
import { useCategories } from "@/contexts/CategoriesContect";

export default function Settings() {
  const [showManageCategories, setShowManageCategories] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const { signOut } = useAuth();
  const { refreshNotes } = useNotes();
  const { refreshTasks } = useTasks();
  const { refreshCategories } = useCategories();

  const refreshApp = async () => {
    try {
      await storageService.refreshApp();

      await Promise.all([refreshNotes(), refreshTasks(), refreshCategories()]);
    } catch (error) {
      console.error("Failed to refresh app:", error);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white dark:bg-gray-900`}>
      <View style={tw`p-4`}>
        <Text style={tw`text-xl font-bold text-gray-900 dark:text-white mb-6`}>
          Settings
        </Text>

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
  );
}
