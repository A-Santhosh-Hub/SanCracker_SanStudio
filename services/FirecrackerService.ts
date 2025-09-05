import AsyncStorage from '@react-native-async-storage/async-storage';
import { Firecracker } from '../types';
import { faker } from '@faker-js/faker';

const STORAGE_KEY = 'firecrackers';

// Sample data
const sampleFirecrackers: Firecracker[] = [
  {
    id: '1',
    name: 'Standard Flower Pots',
    price: 250.50,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
  },
  {
    id: '2',
    name: 'Sparklers Premium',
    price: 180.75,
    image: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=400&h=300&fit=crop',
  },
  {
    id: '3',
    name: 'Ground Chakra',
    price: 450.00,
    image: 'https://images.unsplash.com/photo-1542382257-80dedb725088?w=400&h=300&fit=crop',
  },
  {
    id: '4',
    name: 'Rocket Crackers',
    price: 320.25,
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
  },
  {
    id: '5',
    name: 'Roman Candles',
    price: 275.90,
    image: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=400&h=300&fit=crop',
  },
  {
    id: '6',
    name: 'Butterfly Crackers',
    price: 195.60,
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
  },
];

export class FirecrackerService {
  static async getAll(): Promise<Firecracker[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      } else {
        // Initialize with sample data
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sampleFirecrackers));
        return sampleFirecrackers;
      }
    } catch (error) {
      console.error('Error loading firecrackers:', error);
      return sampleFirecrackers;
    }
  }

  static async add(firecracker: Omit<Firecracker, 'id'>): Promise<Firecracker> {
    try {
      const firecrackers = await this.getAll();
      const newFirecracker: Firecracker = {
        ...firecracker,
        id: faker.string.uuid(),
      };
      
      firecrackers.push(newFirecracker);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(firecrackers));
      
      return newFirecracker;
    } catch (error) {
      console.error('Error adding firecracker:', error);
      throw error;
    }
  }

  static async update(id: string, updatedFirecracker: Firecracker): Promise<void> {
    try {
      const firecrackers = await this.getAll();
      const index = firecrackers.findIndex(item => item.id === id);
      
      if (index !== -1) {
        firecrackers[index] = updatedFirecracker;
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(firecrackers));
      }
    } catch (error) {
      console.error('Error updating firecracker:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      const firecrackers = await this.getAll();
      const filtered = firecrackers.filter(item => item.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting firecracker:', error);
      throw error;
    }
  }
}
