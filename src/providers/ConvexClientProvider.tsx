"use client";

import { ReactNode, createContext, useContext, useEffect, useMemo, useRef } from "react";
import { ConvexProvider, ConvexReactClient, useMutation } from "convex/react";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { api } from "../../convex/_generated/api";

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

/** Automatically provisions the user record & default stats (streak 0, xp 0, hearts 5) upon sign-in/up */
function AuthUserSync() {
  const { isSignedIn } = useAuth();
  const syncUser = useMutation(api.users.syncUser);
  const syncedRef = useRef(false);

  useEffect(() => {
    if (isSignedIn && !syncedRef.current) {
      syncedRef.current = true;
      syncUser().catch(() => {
        syncedRef.current = false;
      });
    } else if (!isSignedIn) {
      syncedRef.current = false;
    }
  }, [isSignedIn, syncUser]);

  return null;
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const hasConvexConfig = Boolean(convexUrl);
  const hasClerkConfig = Boolean(clerkPublishableKey);

  const convex = useMemo(() => {
    return convexUrl ? new ConvexReactClient(convexUrl) : null;
  }, []);

  const value = useMemo<AppConfig>(
    () => ({
      hasConvex: Boolean(hasConvexConfig && convex),
      hasClerk: hasClerkConfig,
    }),
    [hasConvexConfig, hasClerkConfig, convex]
  );

  // Case 1: Both Convex and Clerk are configured
  if (convex && hasClerkConfig && clerkPublishableKey) {
    return (
      <AppConfigContext.Provider value={value}>
        <ClerkProvider publishableKey={clerkPublishableKey}>
          <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            <AuthUserSync />
            {children}
          </ConvexProviderWithClerk>
        </ClerkProvider>
      </AppConfigContext.Provider>
    );
  }

  // Case 2: Only Clerk is configured
  if (hasClerkConfig && clerkPublishableKey) {
    return (
      <AppConfigContext.Provider value={value}>
        <ClerkProvider publishableKey={clerkPublishableKey}>
          {children}
        </ClerkProvider>
      </AppConfigContext.Provider>
    );
  }

  // Case 3: Only Convex is configured
  if (convex) {
    return (
      <AppConfigContext.Provider value={value}>
        <ConvexProvider client={convex}>{children}</ConvexProvider>
      </AppConfigContext.Provider>
    );
  }

  // Case 4: Neither configured (unconfigured fallback)
  return (
    <AppConfigContext.Provider value={value}>
      {children}
    </AppConfigContext.Provider>
  );
}


