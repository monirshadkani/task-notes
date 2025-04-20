import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  Modal,
} from "react-native";
import tw from "twrnc";
import { useCategories } from "@/contexts/CategoriesContect";
import { categoryService } from "@/services/categories/categoryService";
import { router } from "expo-router";
import ColorPicker from "react-native-wheel-color-picker";

export const CreateCategory = () => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#000000");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const { refreshCategories } = useCategories();

  const handleSubmit = async () => {
    try {
      const newCategory = {
        name,
        color,
        is_system: false,
      };

      await categoryService.setCategories(newCategory);
      await refreshCategories();
      router.replace("/");
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  return (
    <View style={tw`flex-1 bg-white dark:bg-gray-900`}>
      <View
        style={tw`flex-row items-center p-4 border-b border-gray-200 dark:border-gray-700`}
      >
        <Text style={tw`text-xl font-bold text-black dark:text-white`}>
          Create a Category
        </Text>
      </View>
      <ScrollView style={tw`flex-1 p-4`}>
        <View style={tw`mb-4`}>
          <Text
            style={tw`text-sm font-medium mb-2 text-gray-700 dark:text-gray-300`}
          >
            Name
          </Text>
          <TextInput
            style={tw`w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white`}
            onChangeText={setName}
            value={name}
            placeholder="Enter category name"
            placeholderTextColor="#666"
          />
        </View>

        <View style={tw`mb-6`}>
          <Text
            style={tw`text-sm font-medium mb-2 text-gray-700 dark:text-gray-300`}
          >
            Color
          </Text>
          <TouchableOpacity
            onPress={() => setShowColorPicker(true)}
            style={tw`flex-row items-center p-3 rounded-lg border border-gray-300 dark:border-gray-700`}
          >
            <View
              style={[
                tw`w-8 h-8 rounded-full mr-2`,
                { backgroundColor: color },
              ]}
            />
            <Text style={tw`text-gray-700 dark:text-gray-300`}>
              Tap to choose color
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={tw`bg-blue-500 p-4 rounded-lg items-center`}
          onPress={handleSubmit}
        >
          <Text style={tw`text-white font-bold`}>Create Category</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={showColorPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowColorPicker(false)}
      >
        <View style={tw`flex-1 bg-white dark:bg-gray-900 p-4`}>
          <View style={tw`flex-row justify-between items-center mb-4`}>
            <Text style={tw`text-xl font-bold text-black dark:text-white`}>
              Choose Color
            </Text>
            <TouchableOpacity
              onPress={() => setShowColorPicker(false)}
              style={tw`p-2`}
            >
              <Text style={tw`text-blue-500 text-lg`}>Done</Text>
            </TouchableOpacity>
          </View>
          <View style={tw`flex-1`}>
            <ColorPicker
              color={color}
              onColorChange={setColor}
              thumbSize={30}
              sliderSize={30}
              noSnap={true}
              row={false}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};
