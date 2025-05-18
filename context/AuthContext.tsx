import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { Client, Account } from 'appwrite';
import { View, Text, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { User } from '@/app/types';
import { useRouter } from 'expo-router';

// Environment variables
const BACKEND_URL = process.env.BACKEND_URL;
const PROJECT_ID = process.env.VITE_PROJECT_ID || "PROJECT_ID";

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(PROJECT_ID);

export const account = new Account(client);

// Define types
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  sessionId: string | null;
  checkAuthStatus: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const navigation = useNavigation();
  const router = useRouter();

  axios.defaults.withCredentials = true;

  const checkAuthStatus = async (): Promise<void> => {
    setLoading(true);
    try {
      console.log('Starting checkAuthStatus...');
      try {
        // First try to get the current user
        const user = await account.get();
        console.log('Got user from Appwrite:', JSON.stringify(user, null, 2));
        
        // If we can get the user, we have a valid session
        console.log('Setting isAuthenticated to true based on valid user');
        setIsAuthenticated(true);
        
        // Get the current session
        const sessions = await account.listSessions();
        console.log('Current sessions:', JSON.stringify(sessions, null, 2));
        
        const currentSession = sessions.sessions.find(session => session.current);
        if (currentSession) {
          console.log('Found current session:', JSON.stringify(currentSession, null, 2));
          setSessionId(currentSession.$id);
          
          try {
            // Update backend with session info
            console.log('Updating backend with session info...');
            const response = await axios.post(`${BACKEND_URL}/api/user/session`, {
              sessionId: currentSession.$id,
              userId: user.$id,
              phone: user.phone
            });

            if (response.status === 200 && response.data) {
              console.log('Session check successful, user data:', JSON.stringify(response.data, null, 2));
              setUser(response.data);
            } else {
              console.log('Session check failed, no user data from backend');
              // Keep isAuthenticated true since we have a valid Appwrite session
              // Only update user data if we have it
              if (user) {
                setUser({
                  _id: user.$id,
                  id: user.$id,
                  name: user.name || 'User',
                  email: user.email || '',
                  phone: user.phone || '',
                  phoneNumber: user.phone || ''
                });
              }
            }
          } catch (error) {
            console.error('Error updating backend session:', error);
            // Keep the session active even if backend update fails
            if (user) {
              setUser({
                _id: user.$id,
                id: user.$id,
                name: user.name || 'User',
                email: user.email || '',
                phone: user.phone || '',
                phoneNumber: user.phone || ''
              });
            }
          }
        } else {
          setSessionId(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error: any) {
        console.error('Error getting user:', error);
        if (error.response) {
          console.error('Error response:', JSON.stringify(error.response.data, null, 2));
        }
        // Only clear auth state if we can't get the user
        setSessionId(null);
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error: any) {
      console.error("Error checking session:", error);
      if (error.response) {
        console.error('Error response:', JSON.stringify(error.response.data, null, 2));
      }
      // Only clear auth state if we can't get the user
      setSessionId(null);
      setUser(null);
      setIsAuthenticated(false);
      Toast.show({
        type: 'error',
        text1: 'Authentication Error',
        text2: 'Failed to check authentication. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Add useEffect to check auth status when component mounts
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/user/login`,
        { email, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Logged in successfully'
        });
        navigation.navigate('Home' as never);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: response.data.message
        });
      }
    } catch (error) {
      console.error("Error logging in:", error);
      Toast.show({
        type: 'error',
        text1: 'Login Error',
        text2: 'Failed to log in. Please try again.'
      });
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/user/register`, {
        email,
        password,
        name,
      });

      if (response.data.success) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Signed up successfully'
        });
        return true;
      } else {
        Toast.show({
          type: 'error',
          text1: 'Signup Failed',
          text2: response.data.message
        });
        return false;
      }
    } catch (error) {
      console.error("Error signing up:", error);
      Toast.show({
        type: 'error',
        text1: 'Signup Error',
        text2: 'Failed to sign up. Please try again.'
      });
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await account.deleteSession("current");
      setUser(null);
      setIsAuthenticated(false);
      setSessionId(null);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Logged out successfully'
      });
      router.replace('/login');
    } catch (error) {
      console.error("Error logging out:", error);
      Toast.show({
        type: 'error',
        text1: 'Logout Error',
        text2: 'Failed to log out'
      });
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    sessionId,
    checkAuthStatus,
    login,
    signup,
    logout
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <View className="bg-white p-6 rounded-2xl shadow-md w-4/5 items-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="mt-4 text-lg font-semibold text-gray-700">
            Authenticating...
          </Text>
          <Text className="mt-2 text-sm text-gray-500 text-center">
            Please wait while we verify your credentials
          </Text>
        </View>
      </View>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;

