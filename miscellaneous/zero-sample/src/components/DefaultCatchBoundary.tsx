import {
  ErrorComponent,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { View, Button } from 'reshaped'

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter()
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  })

  console.error('DefaultCatchBoundary Error:', error)

  return (
    <View padding={4} grow align="center" justify="center" gap={6}>
      <ErrorComponent error={error} />
      <View direction="row" gap={2} align="center" wrap>
        <Button
          onClick={() => {
            router.invalidate()
          }}
        >
          Try Again
        </Button>
        {isRoot ? (
          <Link to="/">
            <Button variant="outline">Home</Button>
          </Link>
        ) : (
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault()
              window.history.back()
            }}
          >
            Go Back
          </Button>
        )}
      </View>
    </View>
  )
}
