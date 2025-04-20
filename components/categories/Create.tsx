import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  Modal,
  Dimensions,
} from "react-native";
import tw from "twrnc";
import { useCategories } from "@/contexts/CategoriesContect";
import { categoryService } from "@/services/categories/categoryService";
import { router } from "expo-router";
import ColorPicker from "react-native-wheel-color-picker";
import { useDebounce } from "@/hooks/useDebounce";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export const CreateCategory = () => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#FFFFFF");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const { refreshCategories } = useCategories();

  const debouncedSubmit = useDebounce(async () => {
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
  }, 500);

  const handleSubmit = () => {
    debouncedSubmit();
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white dark:bg-gray-900`}>
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
        <SafeAreaView style={tw`flex-1 bg-white dark:bg-gray-900`}>
          <View style={tw`p-4`}>
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
          </View>
          <View style={tw`flex-1 items-center justify-center px-4`}>
            <View style={[tw`w-full`, { height: width * 0.8 }]}>
              <ColorPicker
                color={color}
                onColorChange={setColor}
                thumbSize={50}
                sliderSize={50}
                noSnap={false}
                row={false}
                swatches={false}
                discrete={false}
                gapSize={0}
                sliderHidden={false}
                shadeSliderThumb={true}
                shadeWheelThumb={true}
                autoResetSlider={true}
                swatchesLast={false}
                swatchesOnly={false}
                swatchesHitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                palette={[
                  "#FFFFFF",
                  "#00FF00",
                  "#0000FF",
                  "#FFFF00",
                  "#FF00FF",
                  "#00FFFF",
                  "#FFA500",
                  "#800080",
                  "#008000",
                  "#000080",
                  "#808000",
                  "#800000",
                ]}
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};
