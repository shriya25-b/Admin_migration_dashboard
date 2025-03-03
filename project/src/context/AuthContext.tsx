import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { AuthState, User } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://127.0.0.1:5000/api'; // ✅ Fixed API URL

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Verify token validity
          const decoded = jwtDecode<{ exp: number; user: User }>(token);
          
          // Check if token is expired
          if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            setAuthState({
              isAuthenticated: false,
              user: null,
              loading: false,
              error: null,
            });
            return;
          }
          
          // Set auth headers for all requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          setAuthState({
            isAuthenticated: true,
            user: decoded.user,
            loading: false,
            error: null,
          });
        } catch (error) {
          localStorage.removeItem('token');
          setAuthState({
            isAuthenticated: false,
            user: null,
            loading: false,
            error: 'Invalid token',
          });
        }
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
          error: null,
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { // ✅ Fixed endpoint
        email, // ✅ Changed from "username"
        password,
      });

      const { token } = response.data;
      localStorage.setItem('token', token);
      
      // Set auth headers for all requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const decoded = jwtDecode<{ user: User }>(token);
      
      setAuthState({
        isAuthenticated: true,
        user: decoded.user,
        loading: false,
        error: null,
      });
    } catch (error) {
      setAuthState({
        ...authState,
        error: 'Invalid credentials',
        loading: false,
      });
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
