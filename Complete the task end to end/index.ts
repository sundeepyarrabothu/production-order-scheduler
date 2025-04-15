// Resource and Production Order type definitions

export type ResourceStatus = 'Available' | 'Busy';

export interface Resource {
  id: string;
  name: string;
  status: ResourceStatus;
}

export type OrderStatus = 'Pending' | 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';

export interface ProductionOrder {
  id: string;
  name: string;
  description: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  // Scheduling information
  resourceId?: string;
  startTime?: Date;
  endTime?: Date;
}

// For form validation with Zod
export interface ProductionOrderFormValues {
  name: string;
  description: string;
  status: OrderStatus;
  resourceId?: string;
  startTime?: Date | string;
  endTime?: Date | string;
}
