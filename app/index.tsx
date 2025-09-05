import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  Linking,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Animatable from 'react-native-animatable';
import { format } from 'date-fns';
import { FirecrackerService } from '../services/FirecrackerService';
import { CartService } from '../services/CartService';
import { Firecracker } from '../types';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [firecrackers, setFirecrackers] = useState<Firecracker[]>([]);
  const [searchText, setSearchText] = useState('');
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Load firecrackers
    loadFirecrackers();

    // Load cart count
    loadCartCount();

    return () => clearInterval(timer);
  }, []);

  const loadFirecrackers = async () => {
    const data = await FirecrackerService.getAll();
    setFirecrackers(data);
  };

  const loadCartCount = async () => {
    const items = await CartService.getCartItems();
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    setCartItemCount(count);
  };

  const addToCart = async (firecracker: Firecracker) => {
    await CartService.addToCart(firecracker, 1);
    loadCartCount();
  };

  const filteredFirecrackers = firecrackers.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const indianTime = format(currentTime, 'dd/MM/yyyy hh:mm:ss a');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header with gradient */}
      <LinearGradient
        colors={['#FF6B35', '#F7931E', '#FFD23F']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Animatable.View 
            animation="pulse" 
            iterationCount="infinite" 
            style={styles.titleContainer}
          >
            <Text style={styles.title}>🎆 SanCrackers 🎆</Text>
          </Animatable.View>
          
          <Text style={styles.timeText}>
            🕐 {indianTime} (IST)
          </Text>
          
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.cartButton}
              onPress={() => router.push('/cart')}
            >
              <Ionicons name="cart" size={24} color="#FFF" />
              {cartItemCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
                </View>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.adminButton}
              onPress={() => router.push('/admin')}
            >
              <Ionicons name="settings" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search firecrackers..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#999"
        />
      </View>

      {/* Firecrackers Grid */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {filteredFirecrackers.map((item) => (
            <Animatable.View 
              key={item.id}
              animation="fadeInUp"
              delay={item.id * 100}
              style={styles.cardContainer}
            >
              <LinearGradient
                colors={['#1a1a2e', '#16213e', '#0f3460']}
                style={styles.card}
              >
                <Image source={{ uri: item.image }} style={styles.cardImage} />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardPrice}>₹{item.price.toFixed(2)}</Text>
                  
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => addToCart(item)}
                  >
                    <LinearGradient
                      colors={['#FF6B35', '#F7931E']}
                      style={styles.addButtonGradient}
                    >
                      <Ionicons name="add" size={20} color="#FFF" />
                      <Text style={styles.addButtonText}>Add to Cart</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </Animatable.View>
          ))}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Developed by SanStudio</Text>
        <View style={styles.socialLinks}>
          <TouchableOpacity onPress={() => Linking.openURL('https://facebook.com')}>
            <Ionicons name="logo-facebook" size={24} color="#3b5998" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://instagram.com')}>
            <Ionicons name="logo-instagram" size={24} color="#e1306c" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://twitter.com')}>
            <Ionicons name="logo-twitter" size={24} color="#1da1f2" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  headerContent: {
    alignItems: 'center',
  },
  titleContainer: {
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: '#FFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  timeText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#FFF',
    marginBottom: 15,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  cartButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
    padding: 12,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3333',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  adminButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
    padding: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    margin: 15,
    borderRadius: 25,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    paddingVertical: 12,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 15,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 100,
  },
  cardContainer: {
    width: (width - 45) / 2,
    marginBottom: 15,
  },
  card: {
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFF',
    marginBottom: 5,
  },
  cardPrice: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#FFD23F',
    marginBottom: 10,
  },
  addButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 5,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1a1a1a',
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  footerText: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginBottom: 10,
  },
  socialLinks: {
    flexDirection: 'row',
    gap: 15,
  },
});
