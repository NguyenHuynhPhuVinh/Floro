import React from 'react';
import { SettingsButton } from './SettingsButton';

interface AppHeaderProps {
  className?: string;
}

/**
 * Application header component with centered Floro logo and settings button.
 * Provides the main navigation and branding for the application.
 */
export const AppHeader: React.FC<AppHeaderProps> = ({ 
  className = '' 
}) => {
  return (
    <header className={`bg-white border-b border-gray-200 shadow-sm ${className}`}>
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left spacer for centering */}
        <div className="flex-1" />
        
        {/* Centered Logo */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-900 tracking-wide">
            Floro
          </h1>
        </div>
        
        {/* Right side with Settings button */}
        <div className="flex-1 flex justify-end">
          <SettingsButton />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
