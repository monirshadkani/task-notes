// Écran des paramètres (déconnexion, switch thème)
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "react-native";
import { useAuth } from "../_layout";

export default function Settings() {
  const { user, userToken, signOut } = useAuth();
  return (
    <ThemedView>
      <ThemedText>
        {user ? `Welcome, ${user.name}!` : "Welcome to your new app!"}
      </ThemedText>
      <ThemedText>
        {userToken ? "You are authenticated." : "You are not authenticated."}
      </ThemedText>
      <ThemedText>
        <Button title="Sign Out" onPress={signOut} />
      </ThemedText>
    </ThemedView>
  );
}
