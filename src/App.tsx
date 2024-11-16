import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LoginPage } from './pages/LoginPage';
import { TodoApp } from './pages/TodoApp';

function AppContent() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <TodoApp /> : <LoginPage />;
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AnimatePresence mode="wait">
          <AppContent />
        </AnimatePresence>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;