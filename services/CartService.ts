import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, Firecracker } from '../types';
import { faker } from '@faker-js/faker';

const CART_STORAGE_KEY = 'cart';

export class CartService {
  static async getCartItems(): Promise<CartItem[]> {
    try {
      const stored = await AsyncStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading cart:', error);
      return [];
    }
  }

  static async addToCart(firecracker: Firecracker, quantity: number): Promise<void> {
    try {
      const cartItems = await this.getCartItems();
      const existingIndex = cartItems.findIndex(item => item.firecracker.id === firecracker.id);
      
      if (existingIndex !== -1) {
        cartItems[existingIndex].quantity += quantity;
      } else {
        const newCartItem: CartItem = {
          id: faker.string.uuid(),
          firecracker,
          quantity,
        };
        cartItems.push(newCartItem);
      }
      
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  static async updateQuantity(cartItemId: string, quantity: number): Promise<void> {
    try {
      const cartItems = await this.getCartItems();
      const index = cartItems.findIndex(item => item.id === cartItemId);
      
      if (index !== -1) {
        cartItems[index].quantity = quantity;
        await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      }
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      throw error;
    }
  }

  static async removeFromCart(cartItemId: string): Promise<void> {
    try {
      const cartItems = await this.getCartItems();
      const filtered = cartItems.filter(item => item.id !== cartItemId);
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }

  static async clearCart(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
}
