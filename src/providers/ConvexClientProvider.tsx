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
  const value = useMemo<AppConfig>(
    () => ({ hasConvex: Boolean(convexUrl), hasClerk: Boolean(clerkPublishableKey) }),
    []
  );

  const convex = useMemo(() => {
    return convexUrl ? new ConvexReactClient(convexUrl) : null;
  }, []);

  // No Convex URL configured: mount nothing so pages can show a clear
  // configuration state instead of silently failing (no dummy URLs baked in).
  if (!convexUrl || !convex) {
    return (
      <AppConfigContext.Provider value={value}>
        {children}
      </AppConfigContext.Provider>
    );
  }

  if (clerkPublishableKey) {
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

  // Convex configured without Clerk (local dev): data queries work but all
  // mutations will correctly fail as UNAUTHENTICATED.
  return (
    <AppConfigContext.Provider value={value}>
      <ConvexProvider client={convex}>{children}</ConvexProvider>
    </AppConfigContext.Provider>
  );
}

