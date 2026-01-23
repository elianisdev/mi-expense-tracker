import { useAuth, AuthProvider } from '@/contexts/AuthContext';
import { AuthPage } from '@/pages/AuthPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { Toaster } from 'sonner';
import './App.css';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-cyan-50 to-violet-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? <DashboardPage /> : <AuthPage />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
}

export default App;
