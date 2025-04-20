import { View, Modal, Text } from "react-native";
import tw from "twrnc";
import { LoadingIndicator } from "./LoadingIndicator";

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export const LoadingOverlay = ({ visible, message }: LoadingOverlayProps) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
    >
      <View style={tw`flex-1 bg-black/50 items-center justify-center`}>
        <View style={tw`bg-white p-6 rounded-lg items-center`}>
          <LoadingIndicator size="large" />
          {message && (
            <Text style={tw`mt-4 text-gray-700 text-center`}>{message}</Text>
          )}
        </View>
      </View>
    </Modal>
  );
};
