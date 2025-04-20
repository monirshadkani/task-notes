import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  SafeAreaView,
} from "react-native";
import tw from "twrnc";
import { useCategories } from "@/contexts/CategoriesContect";
import { Category } from "@/types/category.types";
import { categoryService } from "@/services/categories/categoryService";
import ColorPicker from "react-native-wheel-color-picker";
import { IconSymbol } from "@/components/ui/IconSymbol";

type ManageCategoriesProps = {
  visible: boolean;
  onClose: () => void;
};

export const ManageCategories = ({
  visible,
  onClose,
}: ManageCategoriesProps) => {
  const { categories, setCategories, getCategories, refreshCategories } =
    useCategories();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    color: "#000000",
    is_system: false,
  });

  const handleCreate = async () => {
    try {
      await categoryService.setCategories(newCategory);
      const updatedCategories = await getCategories();
      await setCategories(updatedCategories);
      setIsCreating(false);
      setNewCategory({ name: "", color: "#000000", is_system: false });
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  const handleDelete = async (category: Category) => {
    try {
      await categoryService.deleteCategory(category.id.toString());
      await refreshCategories();
    } catch (error: any) {
      console.error("Failed to delete category:", error);
    }
  };

  const handleEdit = (category: Category) => {
    if (category.is_system) {
      console.log("Cannot Edit", "System categories cannot be edited.");
      return;
    }
    setEditingCategory(category);
  };

  const handleSaveEdit = async () => {
    if (!editingCategory) return;

    try {
      await categoryService.updateCategory(editingCategory.id.toString(), {
        name: editingCategory.name,
        color: editingCategory.color,
        is_system: editingCategory.is_system,
      });
      const updatedCategories = await getCategories();
      await setCategories(updatedCategories);
      setEditingCategory(null);
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1`}>
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={tw`flex-1 bg-white dark:bg-gray-900`}>
          <View
            style={tw`pt-12 pb-4 px-4 border-b border-gray-200 dark:border-gray-700`}
          >
            <View style={tw`flex-row justify-between items-center`}>
              <Text style={tw`text-xl font-bold text-black dark:text-white`}>
                Manage Categories
              </Text>
              <TouchableOpacity onPress={onClose} style={tw`p-2`}>
                <Text style={tw`text-blue-500 text-lg`}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={tw`flex-1 p-4`}>
            {!isCreating && (
              <TouchableOpacity
                onPress={() => setIsCreating(true)}
                style={tw`flex-row items-center bg-blue-500 p-4 rounded-lg mb-4`}
              >
                <IconSymbol name="plus" size={24} color="white" />
                <Text style={tw`text-white text-lg font-bold ml-2`}>
                  Create New Category
                </Text>
              </TouchableOpacity>
            )}

            {isCreating && (
              <View
                style={tw`mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg`}
              >
                <TextInput
                  style={tw`p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white mb-2`}
                  placeholder="Category name"
                  value={newCategory.name}
                  onChangeText={(text) =>
                    setNewCategory({ ...newCategory, name: text })
                  }
                />
                <TouchableOpacity
                  onPress={() => setShowColorPicker(true)}
                  style={tw`flex-row items-center p-2 rounded-lg border border-gray-300 dark:border-gray-700 mb-2`}
                >
                  <View
                    style={[
                      tw`w-6 h-6 rounded-full mr-2`,
                      { backgroundColor: newCategory.color },
                    ]}
                  />
                  <Text style={tw`text-gray-700 dark:text-gray-300`}>
                    Choose Color
                  </Text>
                </TouchableOpacity>
                <View style={tw`flex-row justify-end`}>
                  <TouchableOpacity
                    onPress={() => setIsCreating(false)}
                    style={tw`mr-2`}
                  >
                    <Text style={tw`text-gray-500`}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleCreate}>
                    <Text style={tw`text-blue-500`}>Create</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {categories.map((category) => (
              <View
                key={category.id}
                style={tw`flex-row items-center justify-between mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg`}
              >
                {editingCategory?.id === category.id ? (
                  <View style={tw`flex-1`}>
                    <TextInput
                      style={tw`p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white mb-2`}
                      value={editingCategory.name}
                      onChangeText={(text) =>
                        setEditingCategory({ ...editingCategory, name: text })
                      }
                    />
                    <TouchableOpacity
                      onPress={() => setShowColorPicker(true)}
                      style={tw`flex-row items-center p-2 rounded-lg border border-gray-300 dark:border-gray-700`}
                    >
                      <View
                        style={[
                          tw`w-6 h-6 rounded-full mr-2`,
                          { backgroundColor: editingCategory.color },
                        ]}
                      />
                      <Text style={tw`text-gray-700 dark:text-gray-300`}>
                        Change Color
                      </Text>
                    </TouchableOpacity>
                    <View style={tw`flex-row justify-end mt-2`}>
                      <TouchableOpacity
                        onPress={() => setEditingCategory(null)}
                        style={tw`mr-2`}
                      >
                        <Text style={tw`text-gray-500`}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={handleSaveEdit}>
                        <Text style={tw`text-blue-500`}>Save</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <>
                    <View style={tw`flex-row items-center flex-1`}>
                      <View
                        style={[
                          tw`w-6 h-6 rounded-full mr-2`,
                          { backgroundColor: category.color },
                        ]}
                      />
                      <Text style={tw`text-gray-800 dark:text-white`}>
                        {category.name}
                      </Text>
                    </View>
                    <View style={tw`flex-row`}>
                      {!category.is_system && (
                        <>
                          <TouchableOpacity
                            onPress={() => handleEdit(category)}
                            style={tw`mr-4`}
                          >
                            <Text style={tw`text-blue-500`}>Edit</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleDelete(category)}
                          >
                            <Text style={tw`text-red-500`}>Delete</Text>
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
                  </>
                )}
              </View>
            ))}
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
                  color={editingCategory?.color || newCategory.color}
                  onColorChange={(color) => {
                    if (editingCategory) {
                      setEditingCategory({ ...editingCategory, color });
                    } else {
                      setNewCategory({ ...newCategory, color });
                    }
                  }}
                  thumbSize={30}
                  sliderSize={30}
                  noSnap={true}
                  row={false}
                />
              </View>
            </View>
          </Modal>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
