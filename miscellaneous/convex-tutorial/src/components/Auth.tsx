import { useState } from "react";
import { SignIn } from "./SignIn";
import { SignUp } from "./SignUp";

export function Auth() {
  const [isSignIn, setIsSignIn] = useState(true);

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <div>
      {isSignIn ? <SignIn onToggle={toggleForm} /> : <SignUp onToggle={toggleForm} />}
    </div>
  );
}
