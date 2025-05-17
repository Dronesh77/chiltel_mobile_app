import React, { useState, useContext } from 'react';
import {
	View,
	Text,
	ScrollView,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator,
	Alert,
	Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import CartTotal from '@/components/CartTotal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface PostOffice {
	Name: string;
	District: string;
	State: string;
}

interface CityOption {
	value: string;
	label: string;
}

const PlaceOrder = () => {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const { isAuthenticated, user, sessionId } = useAuth();
	const { cart, cartAmount, fetchCart } = useCart();
	const [loading, setLoading] = useState(false);
	const [method, setMethod] = useState('cod');
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: user?.email || '',
		street: '',
		city: '',
		state: '',
		zipcode: '',
		phone: '',
	});

	const [pincodeLoading, setPincodeLoading] = useState(false);
	const [cityOptions, setCityOptions] = useState<CityOption[]>([]);
	const [showCityDropdown, setShowCityDropdown] = useState(false);

	const onChangeHandler = (name: string, value: string) => {
		setFormData((data) => ({ ...data, [name]: value }));

		// When pincode is complete (6 digits), fetch location data
		if (name === 'zipcode' && value.length === 6) {
			fetchPincodeDetails(value);
		}
	};

	const fetchPincodeDetails = async (pincode: string) => {
		if (pincode.length !== 6) return;

		try {
			setPincodeLoading(true);
			const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
			const data = await response.json();
			
			if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice && data[0].PostOffice.length > 0) {
				const postOffices = data[0].PostOffice as PostOffice[];
				const state = postOffices[0].State;
				
				const cityOptions = postOffices.map((po: PostOffice) => ({
					value: po.Name,
					label: `${po.District} - ${po.Name}`
				}));
				
				setFormData(prev => ({
					...prev,
					state: state
				}));
				
				setCityOptions(cityOptions);
				
				if (cityOptions.length === 1) {
					setFormData(prev => ({
						...prev,
						city: cityOptions[0].value
					}));
					setShowCityDropdown(false);
					Toast.show({
						type: 'success',
						text1: 'Location details fetched successfully!'
					});
				} else {
					setFormData(prev => ({
						...prev,
						city: ''
					}));
					setShowCityDropdown(true);
					Toast.show({
						type: 'info',
						text1: `${cityOptions.length} locations found. Please select one.`
					});
				}
			} else {
				setShowCityDropdown(false);
				setCityOptions([]);
				Toast.show({
					type: 'error',
					text1: 'No information found for this pincode. Please enter the correct pincode.'
				});
			}
		} catch (error) {
			console.error("Error in pincode lookup:", error);
			Toast.show({
				type: 'error',
				text1: 'Failed to fetch location details. Please enter manually.'
			});
		} finally {
			setPincodeLoading(false);
		}
	};

	const onSubmitHandler = async () => {
		if (!isAuthenticated) {
			Toast.show({
				type: 'info',
				text1: 'Login Required',
				text2: 'Please login to continue with your purchase',
			});
			router.push('/login');
			return;
		}

		if (!cart || !user) {
			Toast.show({
				type: 'error',
				text1: 'Cart or user information is missing',
			});
			return;
		}

		try {
			setLoading(true);
			let orderItems = [];

			for (const item of cart.items) {
				let itemInfo = {
					product: item.productId,
					quantity: item.quantity,
					price: parseInt(item.price.toString()),
				};
				orderItems.push(itemInfo);
			}

			let orderData = {
				userId: user._id,
				orderFirstName: formData.firstName,
				orderLastName: formData.lastName,
				orderType: "product",
				products: orderItems,
				deliveryCharge: 299, // Fixed delivery charge
				services: [],
				totalAmount: cartAmount + 299,
				status: "ORDERED",
				paymentDetails: {
					method: method,
					transactionId: "",
					paidAt: new Date(),
				},
				address: {
					street: formData.street,
					city: formData.city,
					state: formData.state,
					zipCode: formData.zipcode,
					country: "India"
				},
				phone: formData.phone,
				orderEmail: formData.email,
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			const response = await axios.post(
				`${process.env.EXPO_PUBLIC_API_URL}/api/order/place`,
				orderData,
				{ headers: { Authorization: sessionId } }
			);

			if (response.data.success) {
				fetchCart();
				const newOrderId = response.data.order?._id;
				router.replace(`/OrderSuccess${newOrderId ? `?orderId=${newOrderId}` : ''}`);
			} else {
				Toast.show({
					type: 'error',
					text1: response.data.message
				});
			}
		} catch (error) {
			Toast.show({
				type: 'error',
				text1: 'Error placing order',
				text2: 'Please try again later'
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<ScrollView style={[styles.container, { paddingBottom: insets.bottom }]}>
			<View style={styles.formContainer}>
				{/* Personal Information */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Delivery Information</Text>
					<View style={styles.row}>
						<View style={[styles.inputContainer, { flex: 1 }]}>
							<Text style={styles.label}>First Name*</Text>
							<TextInput
								style={styles.input}
								value={formData.firstName}
								onChangeText={(value) => onChangeHandler('firstName', value)}
								placeholder="Enter first name"
							/>
						</View>
						<View style={[styles.inputContainer, { flex: 1 }]}>
							<Text style={styles.label}>Last Name*</Text>
							<TextInput
								style={styles.input}
								value={formData.lastName}
								onChangeText={(value) => onChangeHandler('lastName', value)}
								placeholder="Enter last name"
							/>
						</View>
					</View>

					<View style={styles.inputContainer}>
						<Text style={styles.label}>Email Address*</Text>
						<TextInput
							style={styles.input}
							value={formData.email}
							onChangeText={(value) => onChangeHandler('email', value)}
							placeholder="Enter email address"
							keyboardType="email-address"
							editable={false}
						/>
					</View>

					<View style={styles.inputContainer}>
						<Text style={styles.label}>Street Address*</Text>
						<TextInput
							style={styles.input}
							value={formData.street}
							onChangeText={(value) => onChangeHandler('street', value)}
							placeholder="Enter your street address"
						/>
					</View>

					<View style={styles.row}>
						<View style={[styles.inputContainer, { flex: 1 }]}>
							<Text style={styles.label}>PIN Code*</Text>
							<View style={styles.pincodeContainer}>
								<TextInput
									style={[styles.input, { flex: 1 }]}
									value={formData.zipcode}
									onChangeText={(value) => onChangeHandler('zipcode', value)}
									placeholder="Enter PIN code"
									keyboardType="numeric"
									maxLength={6}
								/>
								{pincodeLoading && (
									<ActivityIndicator style={styles.loader} color="#0066CC" />
								)}
							</View>
						</View>
					</View>

					<View style={styles.row}>
						<View style={[styles.inputContainer, { flex: 1 }]}>
							<Text style={styles.label}>State</Text>
							<TextInput
								style={[styles.input, styles.disabledInput]}
								value={formData.state}
								editable={false}
								placeholder="State"
							/>
						</View>
						<View style={[styles.inputContainer, { flex: 1 }]}>
							<Text style={styles.label}>City*</Text>
							{showCityDropdown ? (
								<View style={styles.dropdown}>
									{cityOptions.map((option: any, index: number) => (
										<TouchableOpacity
											key={index}
											style={styles.dropdownItem}
											onPress={() => onChangeHandler('city', option.value)}
										>
											<Text>{option.label}</Text>
										</TouchableOpacity>
									))}
								</View>
							) : (
								<TextInput
									style={[styles.input, styles.disabledInput]}
									value={formData.city}
									editable={false}
									placeholder="City"
								/>
							)}
						</View>
					</View>

					<View style={styles.inputContainer}>
						<Text style={styles.label}>Phone Number*</Text>
						<TextInput
							style={styles.input}
							value={formData.phone}
							onChangeText={(value) => onChangeHandler('phone', value)}
							placeholder="Enter your phone number"
							keyboardType="phone-pad"
						/>
					</View>
				</View>

				{/* Payment Method */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Payment Method</Text>
					<View style={styles.paymentMethods}>
						<TouchableOpacity
							style={[
								styles.paymentMethod,
								method === 'cod' && styles.selectedPayment,
							]}
							onPress={() => setMethod('cod')}
						>
							<View style={styles.radioButton}>
								{method === 'cod' && <View style={styles.radioButtonSelected} />}
							</View>
							<Text style={styles.paymentText}>Cash on Delivery</Text>
						</TouchableOpacity>
					</View>
				</View>

				{/* Order Summary */}
				<View style={styles.section}>
					<CartTotal />
				</View>

				{/* Place Order Button */}
				<TouchableOpacity
					style={styles.placeOrderButton}
					onPress={onSubmitHandler}
					disabled={loading}
				>
					{loading ? (
						<ActivityIndicator color="#FFFFFF" />
					) : (
						<Text style={styles.placeOrderText}>Place Order</Text>
					)}
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5F5F5',
	},
	formContainer: {
		padding: 16,
	},
	section: {
		backgroundColor: '#FFFFFF',
		borderRadius: 8,
		padding: 16,
		marginBottom: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 16,
		color: '#333333',
	},
	row: {
		flexDirection: 'row',
		gap: 12,
	},
	inputContainer: {
		flex: 1,
		marginBottom: 16,
	},
	label: {
		fontSize: 14,
		color: '#666666',
		marginBottom: 8,
	},
	input: {
		borderWidth: 1,
		borderColor: '#DDDDDD',
		borderRadius: 8,
		padding: 12,
		fontSize: 16,
		backgroundColor: '#FFFFFF',
	},
	disabledInput: {
		backgroundColor: '#F5F5F5',
	},
	pincodeContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	loader: {
		marginLeft: 8,
	},
	dropdown: {
		borderWidth: 1,
		borderColor: '#DDDDDD',
		borderRadius: 8,
		backgroundColor: '#FFFFFF',
		maxHeight: 200,
	},
	dropdownItem: {
		padding: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#DDDDDD',
	},
	paymentMethods: {
		gap: 12,
	},
	paymentMethod: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 12,
		borderWidth: 1,
		borderColor: '#DDDDDD',
		borderRadius: 8,
	},
	selectedPayment: {
		borderColor: '#0066CC',
		backgroundColor: '#E6F0FF',
	},
	radioButton: {
		width: 20,
		height: 20,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: '#0066CC',
		marginRight: 12,
		alignItems: 'center',
		justifyContent: 'center',
	},
	radioButtonSelected: {
		width: 12,
		height: 12,
		borderRadius: 6,
		backgroundColor: '#0066CC',
	},
	paymentText: {
		fontSize: 16,
		color: '#333333',
	},
	placeOrderButton: {
		backgroundColor: '#0066CC',
		borderRadius: 8,
		padding: 16,
		alignItems: 'center',
		marginTop: 16,
		marginBottom: 24,
	},
	placeOrderText: {
		color: '#FFFFFF',
		fontSize: 18,
		fontWeight: 'bold',
	},
});

export default PlaceOrder;