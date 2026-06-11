import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";

export default function SSOCallback() {
  return (
    <AuthenticateWithRedirectCallback 
      signInUrl="/auth"
      signUpUrl="/auth"
      afterSignInUrl="/"
      afterSignUpUrl="/"
    />
  );
}
