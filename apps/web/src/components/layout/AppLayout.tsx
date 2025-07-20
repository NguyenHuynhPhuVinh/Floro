'use client';

import React from 'react';
import { AppHeader } from './AppHeader';
import { CoordinateDisplay } from './CoordinateDisplay';
import { SettingsModal } from './SettingsModal';

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Main application layout component that provides the overall structure
 * for the Floro application with header, main content area, and overlays.
 */
export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`h-screen w-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 ${className}`}
    >
      {/* Application Header */}
      <AppHeader />

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden">{children}</main>

      {/* Overlay Components */}
      <CoordinateDisplay />
      <SettingsModal />
    </div>
  );
};

export default AppLayout;
