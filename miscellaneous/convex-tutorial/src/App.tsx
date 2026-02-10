import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Auth } from "./components/Auth";

export default function App() {
  return (
    <>
      <AuthLoading>
        <div>Loading...</div>
      </AuthLoading>
      <Unauthenticated>
        <Auth />
      </Unauthenticated>
      <Authenticated>
        <Dashboard />
      </Authenticated>
    </>
  );
}

function Dashboard() {
  const { signOut } = useAuthActions();

  return (
    <main>
      <header>
        <h1>Convex Tutorial</h1>
        <button onClick={() => void signOut()}>Sign Out</button>
      </header>
      <div>
        <p>Welcome to the application!</p>
      </div>
    </main>
  );
}
