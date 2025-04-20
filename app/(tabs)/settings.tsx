// Écran des paramètres (déconnexion, switch thème)
import { View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../_layout";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { storageService } from "@/services/storage/asyncStorage";
import { router } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ManageCategories } from "@/components/categories/ManageCategories";
import { useState } from "react";

export default function Settings() {
  const [showManageCategories, setShowManageCategories] = useState(false);
  const refreshApp = async () => {
    await storageService.refreshApp();
    router.replace("/");
  };
  const { user, userToken, signOut } = useAuth();
  return (
    <SafeAreaView style={tw`flex-1 bg-white dark:bg-gray-900`}>
      <View style={tw`p-4`}>
        <Text style={tw`text-2xl font-bold text-gray-800 dark:text-white mb-6`}>
          Settings
        </Text>

        <View style={tw`mb-8`}>
          <Text
            style={tw`text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4`}
          >
            Account
          </Text>
          <Text style={tw`text-base text-gray-600 dark:text-gray-400 mb-2`}>
            {user ? `Welcome, ${user.name}!` : "Welcome to your new app!"}
          </Text>
          <Text style={tw`text-base text-gray-600 dark:text-gray-400 mb-4`}>
            {userToken
              ? "You are authenticated."
              : "You are not authenticated."}
          </Text>
        </View>

        <View style={tw`mb-8`}>
          <Text
            style={tw`text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4`}
          >
            Categories
          </Text>
          <TouchableOpacity
            onPress={() => setShowManageCategories(true)}
            style={tw`flex-row items-center bg-blue-500 p-4 rounded-lg`}
          >
            <IconSymbol name="pencil" size={24} color="white" />
            <Text style={tw`text-white text-lg font-bold ml-2`}>
              Manage Categories
            </Text>
          </TouchableOpacity>
        </View>

        <View style={tw`mb-8`}>
          <Text
            style={tw`text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4`}
          >
            App Management
          </Text>
          <TouchableOpacity
            onPress={refreshApp}
            style={tw`bg-yellow-500 p-4 rounded-lg mb-4`}
          >
            <Text style={tw`text-white text-lg font-bold text-center`}>
              Refresh App
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={signOut}
          style={tw`bg-red-500 p-4 rounded-lg items-center`}
        >
          <Text style={tw`text-white font-bold`}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <ManageCategories
        visible={showManageCategories}
        onClose={() => setShowManageCategories(false)}
      />
    </SafeAreaView>
  );
}
