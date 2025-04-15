import { create } from 'zustand';
import { ProductionOrder, OrderStatus } from '@/types';

// Generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

interface OrderState {
  orders: ProductionOrder[];
  addOrder: (order: Omit<ProductionOrder, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateOrder: (id: string, updates: Partial<Omit<ProductionOrder, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  getOrderById: (id: string) => ProductionOrder | undefined;
  deleteOrder: (id: string) => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  
  addOrder: (orderData) => {
    const id = generateId();
    const now = new Date();
    const newOrder: ProductionOrder = {
      id,
      ...orderData,
      createdAt: now,
      updatedAt: now,
    };
    
    set(state => ({
      orders: [...state.orders, newOrder]
    }));
    
    return id;
  },
  
  updateOrder: (id, updates) => {
    set(state => ({
      orders: state.orders.map(order => 
        order.id === id 
          ? { 
              ...order, 
              ...updates, 
              updatedAt: new Date() 
            } 
          : order
      )
    }));
  },
  
  getOrderById: (id) => {
    return get().orders.find(order => order.id === id);
  },
  
  deleteOrder: (id) => {
    set(state => ({
      orders: state.orders.filter(order => order.id !== id)
    }));
  },
}));
