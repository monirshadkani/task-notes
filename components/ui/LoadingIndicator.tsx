import { ActivityIndicator, View } from "react-native";
import tw from "twrnc";

interface LoadingIndicatorProps {
  size?: "small" | "large";
  color?: string;
  fullScreen?: boolean;
}

export const LoadingIndicator = ({
  size = "large",
  color,
  fullScreen = false,
}: LoadingIndicatorProps) => {
  return (
    <View style={[tw`items-center justify-center`, fullScreen && tw`flex-1`]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};
