import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { account } from '../../context/AuthContext';
import { ID } from 'appwrite';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { checkAuthStatus } = useAuth();
  const navigation = useNavigation();

  // Improved phone sanitization: only digits, always 10 digits, always +91
  const sanitizePhone = (phone: string) => {
    let sanitized = phone.replace(/\D/g, ''); // Remove all non-digits
    if (sanitized.length === 10) {
      return '+91' + sanitized;
    } else if (sanitized.length === 12 && sanitized.startsWith('91')) {
      return '+' + sanitized;
    }
    return sanitized; // fallback
  };

  // Validate phone number: must be 10 digits
  const isValidPhone = (phone: string) => {
    const sanitized = phone.replace(/\D/g, '');
    return sanitized.length === 10;
  };

  const handleSendOtp = async () => {
    if (!isValidPhone(phone)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Number',
        text2: 'Please enter a valid 10-digit phone number.',
      });
      return;
    }
    setIsLoading(true);
    try {
      const sanitizedPhone = sanitizePhone(phone);

      const checkRes = await axios.post(process.env.VITE_BACKEND_URL + "/api/user/checkUser", {
        phone: sanitizedPhone,
      });

      setIsNewUser(!checkRes.data.exists);

      const token = await account.createPhoneToken(ID.unique(), sanitizedPhone);
      setUserId(token.userId);
      setIsOtpSent(true);

      Toast.show({
        type: 'success',
        text1: 'OTP Sent',
        text2: 'Please enter the OTP sent to your phone.',
      });
    } catch (error: any) {
      // More detailed error logging
      if (error.response) {
        console.error('OTP Send Error - Response:', JSON.stringify(error.response.data, null, 2));
        console.error('Status:', error.response.status);
        console.error('Headers:', JSON.stringify(error.response.headers, null, 2));
      } else if (error.request) {
        console.error('OTP Send Error - No Response:', error.request);
      } else {
        console.error('OTP Send Error - General:', error.message);
      }
      Toast.show({
        type: 'error',
        text1: 'Failed to send OTP',
        text2: 'Please check your number and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    try {
      await account.createSession(userId, otp);

      if (isNewUser) {
        await axios.post(process.env.VITE_BACKEND_URL + "/api/user/addUser", {
          name,
          phone: sanitizePhone(phone),
        });
        Toast.show({
          type: 'success',
          text1: 'User Created',
          text2: 'You have been registered successfully.',
        });
      }

      await checkAuthStatus();
      navigation.navigate('Home' as never);
    } catch (error: any) {
      // More detailed error logging
      if (error.response) {
        console.error('OTP Verification Error - Response:', JSON.stringify(error.response.data, null, 2));
        console.error('Status:', error.response.status);
        console.error('Headers:', JSON.stringify(error.response.headers, null, 2));
      } else if (error.request) {
        console.error('OTP Verification Error - No Response:', error.request);
      } else {
        console.error('OTP Verification Error - General:', error.message);
      }
      Toast.show({
        type: 'error',
        text1: 'Invalid OTP',
        text2: 'Please check the OTP and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.outerContainer}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <View style={styles.card}>
        <Text style={styles.welcomeTitle}>Welcome Back</Text>
        <Text style={styles.subtitle}>Please enter your phone number to continue</Text>

        {!isOtpSent && (
          <>
            <View style={styles.phoneInputContainer}>
              <View style={styles.countryCodeBox}>
                <Text style={styles.countryCodeText}>+91</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                placeholder="Enter your 10-digit number"
                keyboardType="number-pad"
                maxLength={10}
                value={phone}
                onChangeText={setPhone}
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleSendOtp} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Send OTP</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {isOtpSent && (
          <>
            {isNewUser && (
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
            />

            <TouchableOpacity style={styles.button} onPress={handleVerifyOtp} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Verify OTP</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSendOtp} disabled={isLoading}>
              <Text style={styles.link}>Resend OTP</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <Toast />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#f7fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 28,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  countryCodeBox: {
    backgroundColor: '#f3f4f6',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  countryCodeText: {
    fontSize: 16,
    color: '#111827',
  },
  phoneInput: {
    flex: 1,
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  input: {
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    marginBottom: 15,
    fontSize: 16,
    width: '100%',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  link: {
    color: '#2563eb',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default LoginScreen;