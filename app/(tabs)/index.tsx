//Écran principal des notes
import { StyleSheet, Button, View } from "react-native";
import React from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

import { NoteList } from "@/components/notes/NoteList";

export default function Index() {
  return (
    <View>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">My Notes</ThemedText>
      </ThemedView>
      <NoteList />
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
