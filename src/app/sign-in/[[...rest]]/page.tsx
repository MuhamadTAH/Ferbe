"use client";

import { SignIn } from "@clerk/nextjs";
import { ConfigRequired } from "@/components/states/ScreenState";

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function SignInPage() {
  if (!clerkKey) {
    return <ConfigRequired missing="NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" />;
  }
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <SignIn fallbackRedirectUrl="/learn" signUpUrl="/sign-up" />
    </div>
  );
}
