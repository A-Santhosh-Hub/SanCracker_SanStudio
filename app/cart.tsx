import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Linking,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Animatable from 'react-native-animatable';
import { CartService } from '../services/CartService';
import { CartItem } from '../types';

const { width } = Dimensions.get('window');

export default function CartScreen() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    const items = await CartService.getCartItems();
    setCartItems(items);
    
    const totalAmount = items.reduce((sum, item) => sum + (item.firecracker.price * item.quantity), 0);
    setTotal(totalAmount);
  };

  const updateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await CartService.removeFromCart(id);
    } else {
      await CartService.updateQuantity(id, newQuantity);
    }
    loadCartItems();
  };

  const removeItem = async (id: string) => {
    await CartService.removeFromCart(id);
    loadCartItems();
  };

  const clearCart = async () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to clear all items from cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: async () => {
            await CartService.clearCart();
            loadCartItems();
          }
        }
      ]
    );
  };

  const placeOrder = () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to cart before placing order.');
      return;
    }

    let orderMessage = 'New Firecracker Order!\n\n';
    
    cartItems.forEach(item => {
      orderMessage += `${item.firecracker.name}\n`;
      orderMessage += `Quantity: ${item.quantity}\n`;
      orderMessage += `Price: ₹${(item.firecracker.price * item.quantity).toFixed(2)}\n\n`;
    });
    
    orderMessage += `Total Amount: ₹${total.toFixed(2)}\n\n`;
    orderMessage += 'Please confirm the order and provide payment details. Thank you!';

    const phoneNumber = '9003356047';
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(orderMessage)}`;
    
    Linking.canOpenURL(whatsappUrl).then(supported => {
      if (supported) {
        Linking.openURL(whatsappUrl);
      } else {
        Alert.alert('WhatsApp not installed', 'Please install WhatsApp to place orders.');
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#FF6B35', '#F7931E', '#FFD23F']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          
          <Text style={styles.title}>Shopping Cart</Text>
          
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={clearCart}
          >
            <Ionicons name="trash" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {cartItems.length === 0 ? (
        <View style={styles.emptyCart}>
          <Animatable.View animation="fadeIn" style={styles.emptyCartContent}>
            <Ionicons name="cart-outline" size={80} color="#666" />
            <Text style={styles.emptyCartText}>Your cart is empty</Text>
            <TouchableOpacity 
              style={styles.continueShoppingButton}
              onPress={() => router.back()}
            >
              <LinearGradient
                colors={['#FF6B35', '#F7931E']}
                style={styles.continueShoppingGradient}
              >
                <Text style={styles.continueShoppingText}>Continue Shopping</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      ) : (
        <>
          {/* Cart Items */}
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {cartItems.map((item, index) => (
              <Animatable.View 
                key={item.id}
                animation="fadeInUp"
                delay={index * 100}
                style={styles.cartItemContainer}
              >
                <LinearGradient
                  colors={['#1a1a2e', '#16213e', '#0f3460']}
                  style={styles.cartItem}
                >
                  <Image source={{ uri: item.firecracker.image }} style={styles.itemImage} />
                  
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.firecracker.name}</Text>
                    <Text style={styles.itemPrice}>₹{item.firecracker.price.toFixed(2)} each</Text>
                    
                    <View style={styles.quantityContainer}>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Ionicons name="remove" size={20} color="#FFF" />
                      </TouchableOpacity>
                      
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                      
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Ionicons name="add" size={20} color="#FFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <View style={styles.itemActions}>
                    <Text style={styles.itemTotal}>
                      ₹{(item.firecracker.price * item.quantity).toFixed(2)}
                    </Text>
                    
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeItem(item.id)}
                    >
                      <Ionicons name="trash" size={20} color="#FF3333" />
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </Animatable.View>
            ))}
            
            <View style={styles.spacer} />
          </ScrollView>

          {/* Total and Place Order */}
          <View style={styles.bottomContainer}>
            <LinearGradient
              colors={['#1a1a2e', '#16213e']}
              style={styles.totalContainer}
            >
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Amount:</Text>
                <Text style={styles.totalAmount}>₹{total.toFixed(2)}</Text>
              </View>
              
              <TouchableOpacity
                style={styles.placeOrderButton}
                onPress={placeOrder}
              >
                <LinearGradient
                  colors={['#25D366', '#128C7E']}
                  style={styles.placeOrderGradient}
                >
                  <Ionicons name="logo-whatsapp" size={24} color="#FFF" />
                  <Text style={styles.placeOrderText}>Place Order via WhatsApp</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: '#FFF',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  clearButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
    padding: 8,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyCartContent: {
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#666',
    marginTop: 20,
    marginBottom: 30,
  },
  continueShoppingButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  continueShoppingGradient: {
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  continueShoppingText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  cartItemContainer: {
    marginBottom: 15,
  },
  cartItem: {
    flexDirection: 'row',
    borderRadius: 15,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFF',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#FFD23F',
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  quantityButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFF',
    minWidth: 20,
    textAlign: 'center',
  },
  itemActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  itemTotal: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#FFD23F',
    marginBottom: 10,
  },
  removeButton: {
    backgroundColor: 'rgba(255,51,51,0.2)',
    borderRadius: 15,
    padding: 8,
  },
  spacer: {
    height: 100,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  totalContainer: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFF',
  },
  totalAmount: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: '#FFD23F',
  },
  placeOrderButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  placeOrderGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    gap: 10,
  },
  placeOrderText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
  },
});
