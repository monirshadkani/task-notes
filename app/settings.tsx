import { View, Text, TouchableOpacity, Switch } from "react-native";
import tw from "twrnc";
import { useTheme } from "@/contexts/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  const { theme, toggleTheme, isDarkMode } = useTheme();

  return (
    <SafeAreaView style={tw`flex-1 bg-white dark:bg-gray-900`}>
      <View style={tw`p-4`}>
        <Text style={tw`text-xl font-bold text-black dark:text-white mb-6`}>
          Settings
        </Text>

        <View
          style={tw`flex-row items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg`}
        >
          <Text style={tw`text-lg text-gray-800 dark:text-white`}>
            Dark Mode
          </Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
