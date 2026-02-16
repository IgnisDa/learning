import type * as React from "react";
import { Text, View } from "reshaped";

type EmptyStateProps = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
};

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <View className="empty-state">
      {icon}
      <Text variant="body-2" weight="medium">
        {title}
      </Text>
      {description && (
        <Text variant="body-3" color="neutral-faded">
          {description}
        </Text>
      )}
    </View>
  );
}
