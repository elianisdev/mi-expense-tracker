import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { UserPlus, Wallet } from 'lucide-react';

interface RegisterFormProps {
  onToggleForm: () => void;
}

export function RegisterForm({ onToggleForm }: RegisterFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      toast.success('Account created successfully! You can now sign in.');
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-0 shadow-2xl">
      <CardHeader className="space-y-3 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 flex items-center justify-center shadow-lg">
          <Wallet className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
          Create Account
        </CardTitle>
        <CardDescription className="text-base">
          Start tracking your expenses today
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="h-11"
            />
            <p className="text-xs text-muted-foreground">
              Must be at least 6 characters
            </p>
          </div>
          <Button
            type="submit"
            className="w-full h-11 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
            disabled={loading}
          >
            {loading ? (
              'Creating account...'
            ) : (
              <>
                <UserPlus className="mr-2 h-5 w-5" />
                Sign Up
              </>
            )}
          </Button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <button
              onClick={onToggleForm}
              className="text-violet-600 hover:text-violet-700 font-semibold hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
