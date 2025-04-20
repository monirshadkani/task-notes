import { View, Text, TouchableOpacity, RefreshControl } from "react-native";
import { FlashList } from "@shopify/flash-list";
import tw from "twrnc";
import { useState, useEffect } from "react";
import { useCategories } from "@/contexts/CategoriesContect";
import { Category } from "@/types/category.types";
import { categoryService } from "@/services/categories/categoryService";
import { router } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { SafeAreaView } from "react-native-safe-area-context";

export const CategoryList = () => {
  const { categories } = useCategories();

  return (
    <View style={tw`flex-row px-4 py-2 bg-white dark:bg-gray-900`}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          onPress={() => router.push(`/`)}
          style={tw`flex-row items-center mr-4 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800`}
        >
          <Text
            style={tw`text-sm font-medium text-gray-800 dark:text-white mr-2`}
          >
            {category.name}
          </Text>
          <View
            style={[
              tw`w-3 h-3 rounded-full`,
              { backgroundColor: category.color },
            ]}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};
