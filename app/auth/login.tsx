import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { authService } from "@/services/auth/authService";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [debug, setDebug] = useState("");
  const { signIn } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    setDebug("Démarre la connexion...");

    try {
      setDebug((prev) => prev + `URL de l'API: /login`);

      const data = await authService.login({ email, password });
      setDebug((prev) => prev + `Connexion réussie\n`);

      await signIn(data.access_token, data.user);
    } catch (error) {
      setDebug((prev) => prev + `Erreur: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white dark:bg-gray-900`}>
      <View style={tw`flex-1 px-8 py-12`}>
        <View style={tw`items-center mb-16`}>
          <IconSymbol name="note.text" size={72} color="#4B5563" />
          <Text
            style={tw`text-4xl font-bold text-gray-900 dark:text-white mt-6`}
          >
            Task Notes
          </Text>
          <Text style={tw`text-gray-500 dark:text-gray-400 mt-3 text-lg`}>
            Connectez-vous pour continuer
          </Text>
        </View>

        {/* Form */}
        <View>
          <View>
            <Text style={tw`text-gray-700 dark:text-gray-300 mb-3 text-lg`}>
              Email
            </Text>
            <TextInput
              style={tw`p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white text-lg`}
              placeholder="Entrez votre email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View>
            <Text style={tw`text-gray-700 dark:text-gray-300 mb-3 text-lg`}>
              Mot de passe
            </Text>
            <TextInput
              style={tw`p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white text-lg`}
              placeholder="Entrez votre mot de passe"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            style={[
              tw`p-5 rounded-lg items-center mt-8`,
              loading ? tw`bg-gray-400` : tw`bg-gray-700`,
            ]}
          >
            <Text style={tw`text-white text-lg font-semibold`}>
              {loading ? "Connexion..." : "Se connecter"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`p-5 bg-gray-100 dark:bg-gray-800 rounded-lg items-center mt-4`}
            onPress={() => router.push("/auth/qr-scan")}
          >
            <View style={tw`flex-row items-center`}>
              <IconSymbol name="qrcode" size={24} color="#4B5563" />
              <Text
                style={tw`text-gray-700 dark:text-gray-300 font-semibold ml-3 text-lg`}
              >
                Scanner un QR Code
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Debug Info */}
        {debug ? (
          <View style={tw`mt-12 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg`}>
            <Text style={tw`text-gray-700 dark:text-gray-300 text-sm`}>
              {debug}
            </Text>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
