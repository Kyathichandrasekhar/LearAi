import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  Bot,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Code2,
  BookOpen,
  Map,
  ArrowRight,
  Loader2
} from 'lucide-react';

// SVG icons for providers
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const GitHubIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const GitLabIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#E24329" d="m12 22.17 4.24-13.05H7.76L12 22.17z" />
    <path fill="#FC6D26" d="M12 22.17 7.76 9.12H1.46L12 22.17z" />
    <path fill="#FCA326" d="m1.46 9.12-.95 2.91a.65.65 0 0 0 .24.72L12 22.17 1.46 9.12z" />
    <path fill="#E24329" d="M1.46 9.12h6.3L5.15 1.45a.32.32 0 0 0-.62 0L1.46 9.12z" />
    <path fill="#FC6D26" d="M12 22.17 16.24 9.12h6.3L12 22.17z" />
    <path fill="#FCA326" d="m22.54 9.12.95 2.91a.65.65 0 0 1-.24.72L12 22.17l10.54-13.05z" />
    <path fill="#E24329" d="M22.54 9.12h-6.3l2.61-7.67a.32.32 0 0 1 .62 0l3.07 7.67z" />
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const { login, loginWithProvider, isLoading } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      return;
    }

    const { error } = await login(email, password);

    if (!error) {
      toast({
        title: "Welcome back!",
        description: "Successfully logged in"
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive"
      });
    }
  };

  const handleProviderLogin = async (provider: 'google' | 'github' | 'gitlab') => {
    setLoadingProvider(provider);
    const { error } = await loginWithProvider(provider);
    setLoadingProvider(null);

    if (!error) {
      // OAuth redirect handles the rest, but if there's no error immediately:
      toast({
        title: "Redirecting...",
        description: `Connecting to ${provider.charAt(0).toUpperCase() + provider.slice(1)}`
      });
    } else {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const features = [
    { icon: BookOpen, label: 'Smart Notes', color: 'text-notes' },
    { icon: Code2, label: 'Code Analysis', color: 'text-code' },
    { icon: Map, label: 'Learning Paths', color: 'text-roadmap' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
      >
        {/* Animated background */}
        <div className="absolute inset-0 animated-gradient opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/80" />

        {/* Floating shapes */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl float" style={{ animationDelay: '-2s' }} />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-accent/20 rounded-full blur-3xl float" style={{ animationDelay: '-4s' }} />

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-primary rounded-xl blur-xl opacity-50 pulse-glow" />
                <div className="relative p-3 bg-gradient-to-br from-primary to-secondary rounded-xl">
                  <Bot className="w-10 h-10 text-primary-foreground" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold gradient-text">Code Companion</h1>
                <p className="text-muted-foreground">AI-Powered Learning</p>
              </div>
            </div>

            <h2 className="text-4xl xl:text-5xl font-bold mb-6 leading-tight">
              Your Personal
              <br />
              <span className="gradient-text">AI Study Partner</span>
            </h2>

            <p className="text-lg text-muted-foreground mb-10 max-w-md">
              Transform the way you learn with intelligent notes summarization,
              code analysis, and personalized learning roadmaps.
            </p>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                  className="flex items-center gap-4 glass-card p-4 hover-glow cursor-default"
                >
                  <div className={`p-2 rounded-lg bg-muted ${feature.color}`}>
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium">{feature.label}</span>
                  <Sparkles className="w-4 h-4 text-primary ml-auto" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-xl">
              <Bot className="w-8 h-8 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold gradient-text">Code Companion</span>
          </div>

          <div className="glass-card p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
              <p className="text-muted-foreground">Sign in to continue learning</p>
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-3 mb-6">
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 gap-3 hover-glow bg-card hover:bg-muted border-border"
                onClick={() => handleProviderLogin('google')}
                disabled={isLoading || loadingProvider !== null}
              >
                {loadingProvider === 'google' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <GoogleIcon />
                )}
                Continue with Google
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 gap-3 hover-glow bg-card hover:bg-muted border-border"
                onClick={() => handleProviderLogin('github')}
                disabled={isLoading || loadingProvider !== null}
              >
                {loadingProvider === 'github' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <GitHubIcon />
                )}
                Continue with GitHub
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 gap-3 hover-glow bg-card hover:bg-muted border-border"
                onClick={() => handleProviderLogin('gitlab')}
                disabled={isLoading || loadingProvider !== null}
              >
                {loadingProvider === 'gitlab' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <GitLabIcon />
                )}
                Continue with GitLab
              </Button>
            </div>

            <div className="relative my-6">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-4 text-sm text-muted-foreground">
                or continue with email
              </span>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 h-12 bg-muted/50 border-border input-glow"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 pr-11 h-12 bg-muted/50 border-border input-glow"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading && !loadingProvider ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account?{' '}
              <button
                onClick={() => {
                  toast({
                    title: "Demo Mode",
                    description: "Enter any email and password (6+ chars) to try the app!"
                  });
                }}
                className="text-primary hover:underline font-medium"
              >
                Sign up for free
              </button>
            </p>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
