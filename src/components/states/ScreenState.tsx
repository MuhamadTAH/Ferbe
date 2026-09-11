"use client";

import { Component, type ReactNode } from "react";
import Link from "next/link";
import { AlertTriangle, LogIn, Settings } from "lucide-react";

function Shell({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border-2 border-[#E5E5E5] bg-white p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F7F7F7]">
          {icon}
        </div>
        <h2 className="mt-4 text-xl font-extrabold text-[#4B4B4B]">{title}</h2>
        <div className="mt-2 text-sm text-[#777777]">{children}</div>
      </div>
    </div>
  );
}

export function ConfigRequired({ missing }: { missing: string }) {
  return (
    <Shell icon={<Settings className="h-8 w-8 text-[#AFAFAF]" />} title="Configuration required">
      <p>
        This environment is missing <code className="font-mono">{missing}</code>.
        See <span className="font-bold">README.md</span> for the exact setup
        steps and where each value comes from.
      </p>
    </Shell>
  );
}

export function AuthRequired() {
  return (
    <Shell icon={<LogIn className="h-8 w-8 text-[#1CB0F6]" />} title="Sign in required">
      <p>Sign in to track your streak, hearts and progress.</p>
      <Link
        href="/sign-in"
        className="mt-4 inline-block rounded-2xl border-b-4 border-[#1899D6] bg-[#1CB0F6] px-8 py-3 font-extrabold uppercase tracking-wide text-white hover:bg-[#4FC3F9]"
      >
        Sign in
      </Link>
    </Shell>
  );
}

export function BackendError({ onRetry }: { onRetry?: () => void }) {
  return (
    <Shell
      icon={<AlertTriangle className="h-8 w-8 text-[#FFC800]" />}
      title="Cannot reach the learning service"
    >
      <p>
        Your progress could not be loaded. Check your connection and try again —
        nothing was saved during this time.
      </p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-2xl border-b-4 border-[#58A700] bg-[#58CC02] px-8 py-3 font-extrabold uppercase tracking-wide text-white hover:bg-[#61E002]"
        >
          Retry
        </button>
      ) : null}
    </Shell>
  );
}

interface BoundaryState {
  error: Error | null;
}

/** Catches Convex query/render errors and maps them to friendly states. */
export class ErrorBoundary extends Component<
  { children: ReactNode },
  BoundaryState
> {
  state: BoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): BoundaryState {
    return { error };
  }

  render() {
    if (this.state.error) {
      const message = this.state.error.message || "";
      if (message.includes("UNAUTHENTICATED")) {
        return <AuthRequired />;
      }
      return <BackendError />;
    }
    return this.props.children;
  }
}
