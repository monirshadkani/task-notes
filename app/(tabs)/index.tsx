//Écran principal des notes
import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { NoteList } from "@/components/notes/NoteList";
import tw from "twrnc";
export default function Index() {
  return (
    <SafeAreaView style={tw`bg-white dark:bg-gray-900`}>
      <View>
        <NoteList />
      </View>
    </SafeAreaView>
  );
}
