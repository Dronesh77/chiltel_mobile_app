import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

const OrderSuccess = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [countdown, setCountdown] = useState(20);
  const progressAnim = new Animated.Value(1);
  const orderId = params.orderId;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(!!orderId);
  const { sessionId, user } = useAuth();

  useEffect(() => {
    if (orderId && sessionId && user?.phoneNumber) {
      setLoading(true);
      console.log('Fetching order with phone:', user.phoneNumber);
      axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/api/order/userorders`,
        { phone: user.phoneNumber },
        { headers: { Authorization: sessionId } }
      )
        .then(res => {
          console.log('Order response:', res.data);
          if (res.data.success && res.data.orders) {
            const found = res.data.orders.find((o: any) => o._id === orderId);
            console.log('Found order:', found);
            setOrder(found || null);
          }
        })
        .catch((error) => {
          console.error('Error fetching order:', error.response?.data || error);
          setOrder(null);
        })
        .finally(() => setLoading(false));
    }
  }, [orderId, sessionId, user?.phoneNumber]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const startCountdown = () => {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            router.replace(`/Orders${orderId ? `?orderId=${orderId}` : ''}`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Animate progress bar
      Animated.timing(progressAnim, {
        toValue: 0,
        duration: 20000,
        useNativeDriver: false,
      }).start();
    };

    startCountdown();

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [orderId]);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.card}>
        {/* Success Animation */}
        <View style={styles.successContainer}>
          <View style={styles.successIconContainer}>
            <View style={styles.successIconBackground}>
              <Ionicons name="checkmark" size={40} color="#22C55E" />
            </View>
          </View>
        </View>

        {/* Order Number */}
        <View style={styles.orderNumberContainer}>
          <Text style={styles.orderNumber}>Order #{orderId || '12345678'}</Text>
        </View>

        {/* Confirmation Text */}
        <Text style={styles.title}>Order Confirmed!</Text>
        <Text style={styles.subtitle}>
          Thank you for your purchase. Your order has been successfully placed.
        </Text>

        {/* Order Details */}
        {loading ? (
          <View style={{ alignItems: 'center', marginVertical: 24 }}>
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
        ) : order ? (
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date:</Text>
              <Text style={styles.detailValue}>{new Date(order.updatedAt).toLocaleDateString()}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment Method:</Text>
              <Text style={styles.detailValue}>{order.paymentDetails?.method === 'cod' ? 'Cash on Delivery' : order.paymentDetails?.method}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total:</Text>
              <Text style={styles.detailValue}>₹{order.totalAmount}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Delivery Address:</Text>
              <Text style={styles.detailValue}>{order.address?.street}, {order.address?.city}, {order.address?.state} - {order.address?.zipCode}</Text>
            </View>
            <View style={{ marginTop: 12 }}>
              <Text style={[styles.detailLabel, { marginBottom: 4 }]}>Products:</Text>
              {order.products?.map((item: any, idx: number) => (
                <Text key={idx} style={styles.detailValue}>- {item.name || item.product?.name} x {item.quantity}</Text>
              ))}
            </View>
          </View>
        ) : (
          <Text style={styles.detailLabel}>Order details not found.</Text>
        )}

        {/* Redirecting Information */}
        <View style={styles.redirectContainer}>
          <Text style={styles.redirectText}>
            Redirecting to your orders page in <Text style={styles.countdown}>{countdown}</Text> seconds...
          </Text>
          <View style={styles.progressBarContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.replace(`/Orders${orderId ? `?orderId=${orderId}` : ''}`)}
          >
            <Text style={styles.primaryButtonText}>View Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/Orders')}
          >
            <Text style={styles.secondaryButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIconBackground: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderNumberContainer: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 24,
  },
  orderNumber: {
    color: '#2563EB',
    fontWeight: '600',
    fontSize: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 24,
  },
  detailsContainer: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    color: '#6B7280',
    fontSize: 14,
  },
  detailValue: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '500',
  },
  redirectContainer: {
    marginBottom: 24,
  },
  redirectText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  countdown: {
    color: '#2563EB',
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 2,
  },
  buttonContainer: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  secondaryButtonText: {
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OrderSuccess;