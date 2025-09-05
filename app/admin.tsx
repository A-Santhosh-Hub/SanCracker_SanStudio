import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Animatable from 'react-native-animatable';
import { FirecrackerService } from '../services/FirecrackerService';
import { Firecracker } from '../types';

const ADMIN_PASSWORD = '1922K1396santhosh*';

export default function AdminScreen() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [firecrackers, setFirecrackers] = useState<Firecracker[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Firecracker | null>(null);
  
  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadFirecrackers();
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      Alert.alert('Invalid Password', 'Please enter the correct admin password.');
      setPassword('');
    }
  };

  const loadFirecrackers = async () => {
    const data = await FirecrackerService.getAll();
    setFirecrackers(data);
  };

  const handleAdd = async () => {
    if (!name.trim() || !price.trim() || !imageUrl.trim()) {
      Alert.alert('Missing Fields', 'Please fill all fields.');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Invalid Price', 'Please enter a valid price.');
      return;
    }

    const newFirecracker: Omit<Firecracker, 'id'> = {
      name: name.trim(),
      price: priceNum,
      image: imageUrl.trim(),
    };

    await FirecrackerService.add(newFirecracker);
    resetForm();
    setShowAddModal(false);
    loadFirecrackers();
    Alert.alert('Success', 'Firecracker added successfully!');
  };

  const handleUpdate = async () => {
    if (!editingItem || !name.trim() || !price.trim() || !imageUrl.trim()) {
      Alert.alert('Missing Fields', 'Please fill all fields.');
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Invalid Price', 'Please enter a valid price.');
      return;
    }

    const updatedFirecracker: Firecracker = {
      ...editingItem,
      name: name.trim(),
      price: priceNum,
      image: imageUrl.trim(),
    };

    await FirecrackerService.update(editingItem.id, updatedFirecracker);
    resetForm();
    setEditingItem(null);
    loadFirecrackers();
    Alert.alert('Success', 'Firecracker updated successfully!');
  };

  const handleDelete = (item: Firecracker) => {
    Alert.alert(
      'Delete Firecracker',
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await FirecrackerService.delete(item.id);
            loadFirecrackers();
            Alert.alert('Success', 'Firecracker deleted successfully!');
          }
        }
      ]
    );
  };

  const openEditModal = (item: Firecracker) => {
    setEditingItem(item);
    setName(item.name);
    setPrice(item.price.toString());
    setImageUrl(item.image);
    setShowAddModal(true);
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setImageUrl('');
    setEditingItem(null);
  };

  const closeModal = () => {
    setShowAddModal(false);
    resetForm();
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
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
            
            <Text style={styles.title}>Admin Panel</Text>
            
            <View style={styles.backButton} />
          </View>
        </LinearGradient>

        <View style={styles.loginContainer}>
          <Animatable.View animation="fadeIn" style={styles.loginContent}>
            <Ionicons name="lock-closed" size={80} color="#FF6B35" />
            <Text style={styles.loginTitle}>Admin Access Required</Text>
            <Text style={styles.loginSubtitle}>Enter admin password to continue</Text>
            
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter admin password"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <LinearGradient
                colors={['#FF6B35', '#F7931E']}
                style={styles.loginButtonGradient}
              >
                <Text style={styles.loginButtonText}>Login</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </SafeAreaView>
    );
  }

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
          
          <Text style={styles.title}>Admin Panel</Text>
          
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setIsAuthenticated(false)}
          >
            <Ionicons name="log-out" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Add Button */}
      <View style={styles.addButtonContainer}>
        <TouchableOpacity
          style={styles.addNewButton}
          onPress={() => setShowAddModal(true)}
        >
          <LinearGradient
            colors={['#25D366', '#128C7E']}
            style={styles.addNewButtonGradient}
          >
            <Ionicons name="add" size={24} color="#FFF" />
            <Text style={styles.addNewButtonText}>Add New Firecracker</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Firecrackers List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {firecrackers.map((item, index) => (
          <Animatable.View 
            key={item.id}
            animation="fadeInUp"
            delay={index * 100}
            style={styles.itemContainer}
          >
            <LinearGradient
              colors={['#1a1a2e', '#16213e', '#0f3460']}
              style={styles.item}
            >
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</Text>
              </View>
              
              <View style={styles.itemActions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => openEditModal(item)}
                >
                  <Ionicons name="pencil" size={20} color="#FFF" />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item)}
                >
                  <Ionicons name="trash" size={20} color="#FFF" />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Animatable.View>
        ))}
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView 
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalBackdrop}>
            <LinearGradient
              colors={['#1a1a2e', '#16213e', '#0f3460']}
              style={styles.modalContent}
            >
              <Text style={styles.modalTitle}>
                {editingItem ? 'Edit Firecracker' : 'Add New Firecracker'}
              </Text>
              
              <TextInput
                style={styles.input}
                placeholder="Firecracker name"
                placeholderTextColor="#666"
                value={name}
                onChangeText={setName}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Price (₹)"
                placeholderTextColor="#666"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
              
              <TextInput
                style={styles.input}
                placeholder="Image URL"
                placeholderTextColor="#666"
                value={imageUrl}
                onChangeText={setImageUrl}
                multiline
              />
              
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={editingItem ? handleUpdate : handleAdd}
                >
                  <LinearGradient
                    colors={['#25D366', '#128C7E']}
                    style={styles.saveButtonGradient}
                  >
                    <Text style={styles.saveButtonText}>
                      {editingItem ? 'Update' : 'Add'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loginContent: {
    alignItems: 'center',
    width: '100%',
  },
  loginTitle: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: '#FFF',
    marginTop: 20,
    marginBottom: 10,
  },
  loginSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  passwordInput: {
    width: '100%',
    backgroundColor: '#1a1a1a',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#FFF',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  loginButton: {
    width: '100%',
    borderRadius: 25,
    overflow: 'hidden',
  },
  loginButtonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
  },
  addButtonContainer: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  addNewButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  addNewButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    gap: 10,
  },
  addNewButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 15,
  },
  itemContainer: {
    marginBottom: 15,
  },
  item: {
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
    width: 60,
    height: 60,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFF',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#FFD23F',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 20,
    padding: 10,
  },
  deleteButton: {
    backgroundColor: '#FF3333',
    borderRadius: 20,
    padding: 10,
  },
  modalContainer: {
    flex: 1,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    width: '100%',
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#FFF',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 15,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  saveButton: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});
