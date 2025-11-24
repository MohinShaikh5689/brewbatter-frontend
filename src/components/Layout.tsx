import { type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignInButton, SignOutButton, useUser } from '@clerk/clerk-react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
  subtitle?: string;
  showBackButton?: boolean;
  headerAction?: {
    label: string;
    onClick: () => void;
    color?: 'green' | 'blue';
  };
}

export default function Layout({
  children,
  subtitle,
  showBackButton,
  headerAction,
}: LayoutProps) {
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();

  const actionColor = {
    green: 'from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700',
    blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-gradient-to-r from-amber-900 to-orange-800 text-white shadow-lg sticky top-0 z-30">
          <div className="px-6 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">{subtitle || 'Dashboard'}</h1>
              </div>
              <div className="flex items-center gap-4">
                {showBackButton && (
                  <button
                    onClick={() => navigate(-1)}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition transform hover:scale-105"
                  >
                    ← Back
                  </button>
                )}
                {headerAction && isSignedIn && (
                  <button
                    onClick={headerAction.onClick}
                    className={`bg-gradient-to-r ${actionColor[headerAction.color || 'green']} text-white font-bold py-3 px-6 rounded-lg shadow-lg transition transform hover:scale-105`}
                  >
                    {headerAction.label}
                  </button>
                )}
                {!isSignedIn ? (
                  <SignInButton mode="modal">
                    <button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition transform hover:scale-105">
                      Admin Sign In
                    </button>
                  </SignInButton>
                ) : (
                  <div className="flex items-center gap-4">
                    <span className="text-amber-100">👤 {user?.firstName || 'Admin'}</span>
                    <SignOutButton>
                      <button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition transform hover:scale-105">
                        Sign Out
                      </button>
                    </SignOutButton>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-6 py-12">{children}</main>

        {/* Footer */}
        <footer className="bg-gray-800 text-gray-300 mt-20 py-8">
          <div className="px-6 text-center">
            <p>© 2025 BrewBatter Cafe. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
