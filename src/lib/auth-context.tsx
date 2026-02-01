
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from './firebase';
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
  OAuthProvider
} from 'firebase/auth';

interface User {
  email: string;
  name: string;
  avatar?: string;
  id: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  loginWithProvider: (provider: 'google' | 'github' | 'gitlab') => Promise<{ error: any }>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        mapFirebaseUserToUser(firebaseUser);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const mapFirebaseUserToUser = (firebaseUser: FirebaseUser) => {
    const name = firebaseUser.displayName ||
      firebaseUser.email?.split('@')[0] ||
      'User';

    const avatar = firebaseUser.photoURL ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.email}`;

    setUser({
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      name,
      avatar
    });
    setIsLoading(false);
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const loginWithProvider = async (provider: 'google' | 'github' | 'gitlab') => {
    try {
      let authProvider;
      switch (provider) {
        case 'google':
          authProvider = new GoogleAuthProvider();
          break;
        case 'github':
          authProvider = new GithubAuthProvider();
          break;
        case 'gitlab':
          // GitLab isn't built-in same way, using generic OAuth or custom logic
          // Firebase supports OAuthProvider for custom OIDC but defaults maybe tricky.
          // Fallback to simple generic OAuthProvider if configured in Console
          authProvider = new OAuthProvider('oidc.gitlab');
          break;
        default:
          throw new Error('Unsupported provider');
      }

      await signInWithPopup(auth, authProvider);
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      loginWithProvider,
      logout,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
