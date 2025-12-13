'use client';

import React from 'react';
import { AppProvider } from "@/src/context/AppContext";
import { ToastProvider } from "@/src/components/Toast";
import { Layout } from "@/src/components/Layout";
import { HashRouter } from 'react-router-dom';

// Note: We are keeping the React Router (SPA) logic inside Next.js for now 
// to minimize the rewrite of the specific page logic (Dashboard, ListDetail).
// In a full Next.js migration, you would replace HashRouter with Next.js Routing (app folder structure).
// But to keep the existing components working "as is" with minimal changes, we wrap the SPA router here.
// Wait - combining HashRouter inside Next.js App Router is tricky because Next intercepts routes.
// A better approach for a "true" Next.js app is to use the App Router for routing.

// Let's do a TRUE migration. We will NOT use HashRouter. We will use Next.js pages.
// So this shell only provides Context.

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AppProvider>
         {/* We reuse the UI Layout component, but we need to ensure it uses Next/Link instead of react-router-link if we switch routing */}
         {/* However, the Layout component uses useLocation and Link from react-router-dom. */}
         {/* To make this work seamlessly without rewriting EVERYTHING, we will use a compatible Layout wrapper or update Layout.tsx */}
         {children}
      </AppProvider>
    </ToastProvider>
  );
}