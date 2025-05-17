import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useCart } from '@/context/CartContext';

interface CartTotalProps {
  amount?: number | null;
}

const CartTotal = ({ amount = null }: CartTotalProps) => {
  const { cartAmount } = useCart();
  const deliveryFee = 40; // You can move this to a constant or context

  const subtotal = amount ? amount : cartAmount;
  const total = subtotal + deliveryFee;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Summary</Text>

      <View style={styles.detailsContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>Subtotal</Text>
          <Text style={styles.value}>₹{subtotal.toFixed(2)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.label}>Shipping Fee</Text>
          <Text style={styles.value}>₹{deliveryFee.toFixed(2)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={[styles.label, styles.bold]}>Total</Text>
          <Text style={[styles.value, styles.bold]}>₹{total.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  detailsContainer: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#666666',
  },
  value: {
    fontSize: 14,
    color: '#333333',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    width: '100%',
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default CartTotal;