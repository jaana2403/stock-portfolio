import React from 'react';
import { useAuth } from './hooks/useAuth';
import { Dashboard } from './components/Dashboard';
import { AuthForm } from './components/AuthForm';
import { ThemeToggle } from './components/ThemeToggle';
import { Toaster } from 'react-hot-toast';

function App() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dark:bg-gray-900">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <AuthForm onSuccess={() => {}} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Toaster position="top-right" />
      <Dashboard user={user} onSignOut={signOut} />
    </div>
  );
}

export default App;