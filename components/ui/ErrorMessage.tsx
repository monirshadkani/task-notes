import { View, Text, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { IconSymbol } from "@/components/ui/IconSymbol";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  retryText?: string;
}

export const ErrorMessage = ({
  message,
  onRetry,
  retryText = "Retry",
}: ErrorMessageProps) => {
  return (
    <View style={tw`flex-1 items-center justify-center p-4`}>
      <IconSymbol name="exclamationmark.triangle" size={48} color="#EF4444" />
      <Text style={tw`text-red-500 text-center mt-4 mb-2`}>{message}</Text>
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          style={tw`bg-red-500 px-4 py-2 rounded-lg mt-2`}
        >
          <Text style={tw`text-white`}>{retryText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
