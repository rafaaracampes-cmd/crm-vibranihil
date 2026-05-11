"use client";

import { type ReactNode } from "react";
import { AuthProvider, useAuth } from "./AuthProvider";
import { LoginPage } from "./LoginPage";
import { Sidebar } from "./Sidebar";

function AppContent({ children }: { children: ReactNode }) {
  const { user, loading, cloudMode } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary">VIBRANIHIL</h1>
          <p className="text-text-secondary text-sm mt-2">Carregando...</p>
        </div>
      </div>
    );
  }

  if (cloudMode && !user) {
    return <LoginPage />;
  }

  return (
    <div className="h-full flex">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 pt-14 md:pt-6 md:p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AppContent>{children}</AppContent>
    </AuthProvider>
  );
}
