import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { View, Text, Button } from 'reshaped'

export function NotFound({ children }: { children?: ReactNode }) {
  return (
    <View gap={3} padding={4}>
      <Text color="neutral-faded">
        {children || "The page you are looking for does not exist."}
      </Text>
      <View direction="row" gap={2} align="center" wrap>
        <Button
          onClick={() => window.history.back()}
          color="positive"
        >
          Go back
        </Button>
        <Link to="/">
          <Button color="primary">Start Over</Button>
        </Link>
      </View>
    </View>
  )
}
