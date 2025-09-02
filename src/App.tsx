import { useState, useEffect } from 'react';
import { AuthGuard } from './components/AuthGuard';
import { ChatInterface } from './components/ChatInterface';
import { LoadingScreen } from './components/LoadingScreen';
import type { User } from './types';
import { validateConfig } from './lib/config';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);

  useEffect(() => {
    // Validate configuration on app startup
    try {
      validateConfig();
      setConfigError(null);
    } catch (error) {
      setConfigError(error instanceof Error ? error.message : 'Configuration error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAuthenticate = (authenticatedUser: User) => {
    setUser(authenticatedUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (isLoading) {
    return <LoadingScreen message="Loading GenWise Student Data Assistant..." />;
  }

  if (configError) {
    return (
      <LoadingScreen 
        message="Configuration Error"
        error={configError}
      />
    );
  }

  if (!user?.isAuthenticated) {
    return <AuthGuard onAuthenticate={handleAuthenticate}>{null}</AuthGuard>;
  }

  return <ChatInterface user={user} onLogout={handleLogout} />;
}

export default App;
