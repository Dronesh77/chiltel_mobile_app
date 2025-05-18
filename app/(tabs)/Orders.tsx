import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import axios from "axios";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from '@react-navigation/native';

interface Product {
  _id: string;
  name: string;
  thumbnail: string;
  price: number;
}

interface Service {
  _id: string;
  serviceId: {
    _id: string;
    name: string;
    description: string;
    price: number;
    estimatedDuration: string;
  };
  count: number;
}

interface OrderItem {
  orderId: string;
  product?: Product;
  price: number;
  quantity: number;
  date: string;
  status: string;
  paymentMethod: string;
}

interface ServiceItem {
  _id: string;
  services: Service[];
  price: number;
  scheduledFor: string;
  status: string;
  paymentStatus: string;
  addedWorks?: Array<{
    description: string;
    price: number;
  }>;
  additionalWorkPayment?: boolean;
  completedAt?: string;
  remarks?: string;
}

interface CartContextType {
  serviceCart: ServiceItem[];
  setServiceCart: (value: ServiceItem[] | ((prevState: ServiceItem[]) => ServiceItem[])) => void;
}

const Orders = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { isAuthenticated, user, sessionId } = useAuth();
  const cartContext = useCart();
  const serviceCart = (cartContext as unknown as CartContextType).serviceCart;
  const setServiceCart = (cartContext as unknown as CartContextType).setServiceCart;
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [orderData, setOrderData] = useState<OrderItem[]>([]);
  const [serviceData, setServiceData] = useState<ServiceItem[]>([]);
  const [view, setView] = useState("products"); 
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
  if (!API_BASE_URL) {
    throw new Error('EXPO_PUBLIC_API_URL is not set. Please check your .env file and restart Expo.');
  }

  const toggleRow = (rowId: string) => {
    setExpandedRow(expandedRow === rowId ? null : rowId);
  };

  const loadOrderData = async () => {
    setOrdersLoading(true);
    try {
      if (!sessionId || !user?.phoneNumber) {
        console.log('Missing sessionId or phoneNumber:', { sessionId, phoneNumber: user?.phoneNumber });
        return null;
      }
      console.log('Fetching orders with phone:', user.phoneNumber);
      const response = await axios.post(
        `${API_BASE_URL}/api/order/userorders`,
        { phone: user.phoneNumber },
        { headers: { Authorization: sessionId } }
      );
      console.log('Orders API response:', response.data);
      if (response.data.success) {
        const allProductOrders: OrderItem[] = [];
        const allServiceOrders: ServiceItem[] = [];
        response.data.orders.forEach((order: any) => {
          // Extract product orders
          if (order.products && order.products.length > 0) {
            order.products.forEach((item: any) => {
              allProductOrders.push({
                orderId: order._id,
                product: item.product,
                price: item.price,
                quantity: item.quantity,
                date: order.updatedAt,
                status: order.status,
                paymentMethod: order.paymentDetails?.method || 'N/A'
              });
            });
          }
          // Extract service orders
          if (order.services && order.services.length > 0) {
            order.services.forEach((service: any) => {
              allServiceOrders.push({
                _id: service._id,
                services: [service],
                price: service.price,
                scheduledFor: order.updatedAt,
                status: order.status,
                paymentStatus: order.paymentDetails?.paidAt ? 'PAID' : 'PENDING'
              });
            });
          }
        });
        setOrderData(allProductOrders);
        setServiceData(allServiceOrders.reverse());
      }
    } catch (error: any) {
      console.error('Error fetching orders:', error.response?.data || error);
      Toast.show({
        type: "error",
        text1: error.response?.data?.message || "Failed to load orders",
      });
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      console.log('Attempting to cancel order:', orderId);
      const response = await axios.post(
        `${API_BASE_URL}/api/order/cancel`,
        { orderId },
        { 
          headers: { 
            Authorization: sessionId,
            'Content-Type': 'application/json'
          } 
        }
      );

      console.log('Cancel order response:', response.data);

      if (response.data.success) {
        setOrderData(prevOrders => 
          prevOrders.filter(order => order.orderId !== orderId)
        );
        
        Toast.show({
          type: "success",
          text1: "Order cancelled successfully",
        });
        
        loadOrderData();
      } else {
        Toast.show({
          type: "error",
          text1: response.data.message || "Failed to cancel order",
        });
      }
    } catch (error: any) {
      console.error('Full error:', error);
      Toast.show({
        type: "error",
        text1: error.response?.data?.message || "Failed to cancel order",
      });
    }
  };

  const handleCancelService = async (serviceItem: ServiceItem) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/order/cancelservice`,
        { serviceId: serviceItem._id },
        { headers: { Authorization: sessionId } }
      );

      if (response.data.success) {
        Toast.show({
          type: "success",
          text1: "Service cancelled successfully",
        });
        setServiceData((prevServiceData: ServiceItem[]) =>
          prevServiceData.filter((service: ServiceItem) => service._id !== serviceItem._id)
        );
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Something went wrong",
      });
      console.error("Error while cancelling service: ", error);
    }
  };

  const handlePayment = (serviceItem: ServiceItem) => {
    Toast.show({
      type: "info",
      text1: "Payment functionality coming soon!",
    });
  };

  const handleAdditionalWorkPayment = async (serviceId: string) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/services/additionalworkpayment`,
        { serviceId },
        { headers: { Authorization: sessionId } }
      );
      
      if (response.data.success) {
        Toast.show({
          type: "success",
          text1: "Additional work payment successful",
        });
        setServiceCart((prevServiceData: ServiceItem[]) =>
          prevServiceData.map((service: ServiceItem) =>
            service._id === serviceId
              ? { ...service, additionalWorkPayment: true }
              : service
          )
        );
        loadOrderData();
      }
    } catch (error) {
      console.error("Error processing additional work payment:", error);
      Toast.show({
        type: "error",
        text1: "Failed to process payment",
      });
    }
  };

  const calculateTotalPrice = (addedWorks: Array<{ price: number }>) => {
    return addedWorks.reduce((total: number, work: { price: number }) => total + work.price, 0);
  };

  const calculateTotalAdditionalWork = (addedWorks: Array<{ price: number }>) => {
    return addedWorks.reduce((total: number, work: { price: number }) => total + work.price, 0);
  };

  useEffect(() => {
    loadOrderData();
  }, [sessionId]);

  useFocusEffect(
    React.useCallback(() => {
      loadOrderData();
    }, [sessionId])
  );

  if (ordersLoading) {
  return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066CC" />
      </View>
    );
  }

  // Group orders by orderId
  const groupOrdersByOrderId = (orders: any[]) => {
    const grouped: Record<string, any> = {};
    orders.forEach((item) => {
      if (!grouped[item.orderId]) {
        grouped[item.orderId] = {
          orderId: item.orderId,
          date: item.date,
          status: item.status,
          paymentMethod: item.paymentMethod,
          products: [],
        };
      }
      grouped[item.orderId].products.push(item);
    });
    return Object.values(grouped);
  };

  const groupedProductOrders = groupOrdersByOrderId(orderData);

  const renderGroupedOrder = ({ item }: { item: any }) => (
    <View style={styles.orderItem}>
      <View style={styles.orderHeader}>
        <Text style={styles.productName}>Order #{item.orderId?.slice(-6)}</Text>
        <Text style={styles.orderNumber}>{new Date(item.date).toLocaleDateString()}</Text>
        <View style={[styles.statusBadge, {
          backgroundColor:
            item.status === "PENDING"
              ? "#FEF3C7"
              : item.status === "ORDERED"
              ? "#DBEAFE"
              : item.status === "DELIVERED"
              ? "#D1FAE5"
              : item.status === "CANCELLED"
              ? "#FEE2E2"
              : "#F3F4F6",
        }]}
        >
          <Text style={[styles.statusText, {
            color:
              item.status === "PENDING"
                ? "#92400E"
                : item.status === "ORDERED"
                ? "#1E40AF"
                : item.status === "DELIVERED"
                ? "#065F46"
                : item.status === "CANCELLED"
                ? "#991B1B"
                : "#374151",
          }]}
          >
            {item.status}
          </Text>
        </View>
        <View style={[styles.paymentBadge, {
          backgroundColor:
            item.paymentMethod === "cod"
              ? "#F3F4F6"
              : item.paymentMethod === "Razorpay"
              ? "#E0E7FF"
              : "#F3F4F6",
        }]}
        >
          <Text style={[styles.paymentText, {
            color:
              item.paymentMethod === "cod"
                ? "#374151"
                : item.paymentMethod === "Razorpay"
                ? "#3730A3"
                : "#374151",
          }]}
          >
            {item.paymentMethod === "cod" ? "Cash on Delivery" : item.paymentMethod || "N/A"}
          </Text>
        </View>
      </View>
      {/* List all products in this order */}
      {item.products.map((prod: any, idx: number) => (
        <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
          <Image
            source={{ uri: prod.product?.thumbnail || prod.thumbnail || "https://via.placeholder.com/100" }}
            style={styles.productImage}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.productName}>{prod.product?.name || prod.name}</Text>
            <Text style={styles.detailValue}>Price: ₹{prod.price}</Text>
            <Text style={styles.detailValue}>Quantity: {prod.quantity}</Text>
          </View>
        </View>
      ))}
      {/* Actions (Track/Cancel) for the order */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.trackButton}>
          <Text style={styles.trackButtonText}>Track</Text>
        </TouchableOpacity>
        {item.status !== "CANCELLED" && item.status !== "DELIVERED" && (
          <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancelOrder(item.orderId)}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderServiceOrder = ({ item }: { item: ServiceItem }) => (
    <View style={styles.serviceItem}>
      <TouchableOpacity
        style={styles.serviceHeader}
        onPress={() => toggleRow(item._id)}
      >
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName}>
            {item.services.map((service) => service.serviceId.name).join(", ")}
          </Text>
          <Text style={styles.serviceDescription}>
            {item.services[0].serviceId.description}
          </Text>
        </View>
        <View style={styles.serviceMeta}>
          <Text style={styles.servicePrice}>₹{item.price}</Text>
          <Text style={styles.serviceDate}>
            {new Date(item.scheduledFor).toLocaleDateString()}
          </Text>
          <View
            style={[
              styles.serviceStatus,
              {
                backgroundColor:
                  item.status === "CREATED"
                    ? "#DBEAFE"
                    : item.status === "IN_PROGRESS"
                    ? "#FEF3C7"
                    : item.status === "COMPLETED"
                    ? "#D1FAE5"
                    : item.status === "CANCELLED"
                    ? "#FEE2E2"
                    : "#F3F4F6",
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color:
                    item.status === "CREATED"
                      ? "#1E40AF"
                      : item.status === "IN_PROGRESS"
                      ? "#92400E"
                      : item.status === "COMPLETED"
                      ? "#065F46"
                      : item.status === "CANCELLED"
                      ? "#991B1B"
                      : "#374151",
                },
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>
        <Ionicons
          name={expandedRow === item._id ? "chevron-up" : "chevron-down"}
          size={24}
          color="#6B7280"
        />
      </TouchableOpacity>

      {expandedRow === item._id && (
        <View style={styles.expandedContent}>
          <View style={styles.serviceDetails}>
            <Text style={styles.detailTitle}>Service Details</Text>
            {item.services.map((service: Service) => (
              <View key={service._id} style={styles.serviceDetailItem}>
                <Text style={styles.serviceDetailName}>
                                            {service.serviceId.name}
                </Text>
                <Text style={styles.serviceDetailDescription}>
                  {service.serviceId.description}
                </Text>
                <View style={styles.serviceDetailMeta}>
                  <Text style={styles.serviceDetailQuantity}>
                    Quantity: {service.count}
                  </Text>
                  <Text style={styles.serviceDetailPrice}>
                    Price: ₹{service.serviceId.price}
                  </Text>
                  <Text style={styles.serviceDetailDuration}>
                    Duration: {service.serviceId.estimatedDuration}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {item.addedWorks && item.addedWorks.length > 0 && (
            <View style={styles.additionalWork}>
              <View style={styles.additionalWorkHeader}>
                <Text style={styles.additionalWorkTitle}>
                  Additional Work (Total: ₹{calculateTotalAdditionalWork(item.addedWorks)})
                </Text>
                {item.additionalWorkPayment ? (
                  <View style={styles.paidBadge}>
                    <Text style={styles.paidText}>Paid</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.payButton}
                    onPress={() => handleAdditionalWorkPayment(item._id)}
                  >
                    <Text style={styles.payButtonText}>Pay in Cash</Text>
                  </TouchableOpacity>
                )}
              </View>
              {item.addedWorks.map((work: { description: string; price: number }, idx: number) => (
                <View key={idx} style={styles.workItem}>
                  <Text style={styles.workDescription}>{work.description}</Text>
                  <Text style={styles.workPrice}>₹{work.price}</Text>
                </View>
              ))}
            </View>
          )}

          {item.paymentStatus === "PENDING" && (
            <TouchableOpacity
              style={styles.paymentButton}
              onPress={() => handlePayment(item)}
            >
              <Text style={styles.paymentButtonText}>Pay Now</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top - 60 }]}>
      <View style={styles.header}>
        <Text style={styles.title}>MY ORDERS</Text>
        <View style={styles.titleUnderline} />
        <Text style={styles.subtitle}>
          Track and manage your orders and service requests
        </Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, view === "products" && styles.activeTab]}
          onPress={() => setView("products")}
        >
          <Text
            style={[styles.tabText, view === "products" && styles.activeTabText]}
          >
            Products
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, view === "services" && styles.activeTab]}
          onPress={() => setView("services")}
        >
          <Text
            style={[styles.tabText, view === "services" && styles.activeTabText]}
          >
            Services
          </Text>
        </TouchableOpacity>
      </View>

      {view === "products" ? (
        groupedProductOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={64} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No product orders yet</Text>
            <Text style={styles.emptyText}>
              Your product order history will appear here once you make a purchase
            </Text>
            <TouchableOpacity
              style={styles.shopButton}
              onPress={() => router.replace("/chillMart")}
            >
              <Text style={styles.shopButtonText}>Shop now</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={groupedProductOrders}
            renderItem={renderGroupedOrder}
            keyExtractor={(item: any) => item.orderId}
            contentContainerStyle={styles.listContainer}
          />
        )
      ) : serviceCart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="construct-outline" size={64} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No service orders yet</Text>
          <Text style={styles.emptyText}>
            Your service appointment history will appear here once you book a service
          </Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => router.replace("/Collection")}
          >
            <Text style={styles.shopButtonText}>Book a service</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={serviceCart}
          renderItem={renderServiceOrder}
          keyExtractor={(item: ServiceItem) => item._id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    paddingVertical: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
  titleUnderline: {
    width: 64,
    height: 4,
    backgroundColor: "#0066CC",
    marginVertical: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    paddingHorizontal: 32,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 12,
  },
  tab: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  activeTab: {
    backgroundColor: "#0066CC",
  },
  tabText: {
    fontSize: 14,
    color: "#6B7280",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  listContainer: {
    padding: 16,
  },
  orderItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: "row",
    marginBottom: 16,
  },
  productImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 12,
  },
  orderInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  orderNumber: {
    fontSize: 12,
    color: "#6B7280",
  },
  orderDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  detailValue: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "500",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  paymentBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  paymentText: {
    fontSize: 12,
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 16,
  },
  trackButton: {
    backgroundColor: "#0066CC",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  trackButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#DC2626",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  serviceItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceHeader: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: "#6B7280",
  },
  serviceMeta: {
    alignItems: "flex-end",
    marginRight: 12,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  serviceDate: {
    fontSize: 12,
    color: "#6B7280",
    marginVertical: 4,
  },
  serviceStatus: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  expandedContent: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  serviceDetails: {
    marginBottom: 16,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  serviceDetailItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
  },
  serviceDetailName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  serviceDetailDescription: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 8,
  },
  serviceDetailMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  serviceDetailQuantity: {
    fontSize: 12,
    color: "#6B7280",
  },
  serviceDetailPrice: {
    fontSize: 12,
    color: "#6B7280",
  },
  serviceDetailDuration: {
    fontSize: 12,
    color: "#6B7280",
  },
  additionalWork: {
    marginBottom: 16,
  },
  additionalWorkHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  additionalWorkTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
  paidBadge: {
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  paidText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#065F46",
  },
  payButton: {
    backgroundColor: "#0066CC",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  payButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  workItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    marginBottom: 8,
  },
  workDescription: {
    fontSize: 14,
    color: "#1F2937",
    flex: 1,
  },
  workPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginLeft: 12,
  },
  paymentButton: {
    backgroundColor: "#0066CC",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  paymentButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: "#0066CC",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Orders;