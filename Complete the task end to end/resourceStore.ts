import { create } from 'zustand';
import { Resource } from '@/types';

// Mock data for resources
const mockResources: Resource[] = [
  { id: '1', name: 'CNC Machine 1', status: 'Available' },
  { id: '2', name: 'Assembly Line A', status: 'Available' },
  { id: '3', name: 'Paint Booth 2', status: 'Busy' },
  { id: '4', name: 'Quality Control Station', status: 'Available' },
  { id: '5', name: 'Packaging Line B', status: 'Busy' },
];

interface ResourceState {
  resources: Resource[];
  getResourceById: (id: string) => Resource | undefined;
  updateResourceStatus: (id: string, status: 'Available' | 'Busy') => void;
}

export const useResourceStore = create<ResourceState>((set, get) => ({
  resources: mockResources,
  
  getResourceById: (id: string) => {
    return get().resources.find(resource => resource.id === id);
  },
  
  updateResourceStatus: (id: string, status: 'Available' | 'Busy') => {
    set(state => ({
      resources: state.resources.map(resource => 
        resource.id === id ? { ...resource, status } : resource
      )
    }));
  },
}));
