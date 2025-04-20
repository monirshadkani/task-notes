import { Tabs } from "expo-router";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import tw from "twrnc";
import { useTheme } from "@/contexts/ThemeContext";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { SettingsModal } from "@/components/SettingsModal";

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
