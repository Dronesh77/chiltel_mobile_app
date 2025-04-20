import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { Client, Account } from 'appwrite';
import { View, Text, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {Models} from "appwrite";
import Toast from 'react-native-toast-message';

// Environment variables - you'll need to implement this in React Native
// For example using react-native-dotenv or react-native-config
const BACKEND_URL = 'YOUR_BACKEND_URL';
const PROJECT_ID = 'YOUR_PROJECT_ID';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(PROJECT_ID);

export const account = new Account(client);

// Define types
interface User {
  id: string;
  name: string;
  email: string;
  // Add other user properties as needed
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  checkAuthStatus: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  sessionId: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [sessionId, setSessionId] = useState<string>("");
  
  const navigation = useNavigation();

  // Configure Axios globally to send cookies
  axios.defaults.withCredentials = true;
  
  const getCurrentSessionId = async (): Promise<void> => {
    try {
      const sessions = await account.listSessions();
      
      if (sessions.total > 0) {
        const currentSession = sessions.sessions.find(session => session.current);
        if (currentSession) {
          setSessionId(currentSession.$id);
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error("Error getting session ID:", error);
    }
  };
  
  const checkAuthStatus = async (): Promise<void> => {
    setLoading(true);
    await getCurrentSessionId();
    
    try {
      if(sessionId === "") {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await axios.post(`${BACKEND_URL}/api/user/session`, {
        sessionId
      });

      if (response.status === 200 && response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error checking session:", error);
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

  useEffect(() => {
    checkAuthStatus();
  }, [sessionId]);

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
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Logged out successfully'
      });
      navigation.navigate('Login' as never);
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
    checkAuthStatus,
    login,
    signup,
    logout,
    sessionId
  };

  // Loading state component with improved UI
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

