"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/providers/auth-provider";
import type { UserRole } from "@/lib/providers/auth-provider";

export function RequireAuth({
  children,
  requireRole,
}: {
  children: React.ReactNode;
  requireRole?: UserRole;
}) {
  const { currentUser, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (isLoading) return;
    if (!currentUser) {
      router.replace("/login");
      return;
    }
    if (requireRole && currentUser.role !== requireRole) {
      router.replace("/");
    }
  }, [isLoading, currentUser, requireRole, router]);

  if (isLoading || !currentUser) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (requireRole && currentUser.role !== requireRole) {
    return null;
  }

  return <>{children}</>;
}
