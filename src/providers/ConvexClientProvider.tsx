"use client";

import { ReactNode, createContext, useContext, useMemo } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL as string | undefined;
const clerkPublishableKey = process.env
  .NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY as string | undefined;

interface AppConfig {
  hasConvex: boolean;
  hasClerk: boolean;
}

const AppConfigContext = createContext<AppConfig>({
  hasConvex: Boolean(convexUrl),
  hasClerk: Boolean(clerkPublishableKey),
});

/** Runtime flags so pages can render honest configuration states. */
export function useAppConfig(): AppConfig {
  return useContext(AppConfigContext);
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const value = useMemo<AppConfig>(
    () => ({ hasConvex: Boolean(convexUrl), hasClerk: Boolean(clerkPublishableKey) }),
    []
  );

  // No Convex URL configured: mount nothing so pages can show a clear
  // configuration state instead of silently failing (no dummy URLs baked in).
  if (!convexUrl) {
    return (
      <AppConfigContext.Provider value={value}>
        {children}
      </AppConfigContext.Provider>
    );
  }

  const convex = new ConvexReactClient(convexUrl);

  if (clerkPublishableKey) {
    return (
      <AppConfigContext.Provider value={value}>
        <ClerkProvider publishableKey={clerkPublishableKey}>
          <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            {children}
          </ConvexProviderWithClerk>
        </ClerkProvider>
      </AppConfigContext.Provider>
    );
  }

  // Convex configured without Clerk (local dev): data queries work but all
  // mutations will correctly fail as UNAUTHENTICATED.
  return (
    <AppConfigContext.Provider value={value}>
      <ConvexProvider client={convex}>{children}</ConvexProvider>
    </AppConfigContext.Provider>
  );
}
