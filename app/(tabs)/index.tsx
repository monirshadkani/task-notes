//Écran principal des notes
import { StyleSheet, View } from "react-native";
import React from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { NoteList } from "@/components/notes/NoteList";

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">My Notes</ThemedText>
      </ThemedView>
      <View style={styles.contentContainer}>
        <NoteList />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
    padding: 16,
  },
  contentContainer: {
    flex: 1,
  },
});
