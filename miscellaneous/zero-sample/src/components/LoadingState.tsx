import { Loader, Text, View } from "reshaped";

type LoadingStateProps = {
  message?: string;
  size?: "small" | "medium" | "large";
};

export function LoadingState({
  size = "medium",
  message = "Loading...",
}: LoadingStateProps) {
  return (
    <View direction="row" gap={3} align="center">
      <Loader size={size} ariaLabel="Loading" />
      <Text variant="body-2" color="neutral-faded">
        {message}
      </Text>
    </View>
  );
}
