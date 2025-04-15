import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { ProductionOrderFormValues, OrderStatus } from '@/types';
import { useResourceStore } from '@/store/resourceStore';
import ResourceSelect from '@/components/resources/ResourceSelect';

// Zod schema for form validation
const orderSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  description: z.string().min(5, { message: 'Description must be at least 5 characters' }),
  status: z.enum(['Pending', 'Scheduled', 'In Progress', 'Completed', 'Cancelled']),
  resourceId: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
}).refine((data) => {
  // If status is Scheduled, resourceId, startTime, and endTime are required
  if (data.status === 'Scheduled') {
    return !!data.resourceId && !!data.startTime && !!data.endTime;
  }
  return true;
}, {
  message: "Resource, start time, and end time are required for scheduled orders",
  path: ["status"]
}).refine((data) => {
  // If both startTime and endTime are provided, ensure endTime is after startTime
  if (data.startTime && data.endTime) {
    return new Date(data.endTime) > new Date(data.startTime);
  }
  return true;
}, {
  message: "End time must be after start time",
  path: ["endTime"]
});

interface OrderFormProps {
  initialValues?: Partial<ProductionOrderFormValues>;
  onSubmit: (data: ProductionOrderFormValues) => void;
  isEditing?: boolean;
}

const OrderForm: React.FC<OrderFormProps> = ({
  initialValues,
  onSubmit,
  isEditing = false
}) => {
  const { resources } = useResourceStore();
  
  const defaultValues: Partial<ProductionOrderFormValues> = {
    name: '',
    description: '',
    status: 'Pending',
    resourceId: '',
    startTime: '',
    endTime: '',
    ...initialValues
  };

  const { 
    register, 
    handleSubmit, 
    control, 
    watch, 
    formState: { errors },
    setValue,
    reset
  } = useForm<ProductionOrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues
  });

  // Reset form when initialValues change
  useEffect(() => {
    if (initialValues) {
      reset({
        ...defaultValues,
        ...initialValues,
        // Format dates for input fields if they exist
        startTime: initialValues.startTime instanceof Date 
          ? format(initialValues.startTime, "yyyy-MM-dd'T'HH:mm") 
          : initialValues.startTime || '',
        endTime: initialValues.endTime instanceof Date 
          ? format(initialValues.endTime, "yyyy-MM-dd'T'HH:mm") 
          : initialValues.endTime || '',
      });
    }
  }, [initialValues, reset]);

  const currentStatus = watch('status');
  const isScheduled = currentStatus === 'Scheduled';

  const handleFormSubmit = (data: ProductionOrderFormValues) => {
    // Convert string dates to Date objects
    const formattedData = {
      ...data,
      startTime: data.startTime ? new Date(data.startTime) : undefined,
      endTime: data.endTime ? new Date(data.endTime) : undefined,
    };
    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Production Order' : 'Create Production Order'}</h2>
      
      <div className="space-y-4">
        {/* Order Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Order Name
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            {...register('description')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            {...register('status')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="Pending">Pending</option>
            <option value="Scheduled">Scheduled</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>

        {/* Resource Selection - Only required if status is Scheduled */}
        <div className={isScheduled ? '' : 'opacity-50'}>
          <Controller
            name="resourceId"
            control={control}
            render={({ field }) => (
              <ResourceSelect
                resources={resources}
                selectedResourceId={field.value}
                onChange={field.onChange}
                disabled={!isScheduled}
              />
            )}
          />
          {errors.resourceId && (
            <p className="mt-1 text-sm text-red-600">{errors.resourceId.message}</p>
          )}
        </div>

        {/* Scheduling Times - Only required if status is Scheduled */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isScheduled ? '' : 'opacity-50'}`}>
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
              Start Time
            </label>
            <input
              id="startTime"
              type="datetime-local"
              {...register('startTime')}
              disabled={!isScheduled}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.startTime && (
              <p className="mt-1 text-sm text-red-600">{errors.startTime.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
              End Time
            </label>
            <input
              id="endTime"
              type="datetime-local"
              {...register('endTime')}
              disabled={!isScheduled}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.endTime && (
              <p className="mt-1 text-sm text-red-600">{errors.endTime.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isEditing ? 'Update Order' : 'Create Order'}
        </button>
      </div>
    </form>
  );
};

export default OrderForm;
