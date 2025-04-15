import React, { useState } from 'react';
import { ProductionOrder, ProductionOrderFormValues } from '@/types';
import OrderForm from './OrderForm';
import OrderTable from './OrderTable';
import { useOrderStore } from '@/store/orderStore';
import { useResourceStore } from '@/store/resourceStore';

const OrderManagement: React.FC = () => {
  const { orders, addOrder, updateOrder } = useOrderStore();
  const { updateResourceStatus } = useResourceStore();
  const [editingOrder, setEditingOrder] = useState<ProductionOrder | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleCreateOrder = (data: ProductionOrderFormValues) => {
    addOrder(data);
    
    // If order is scheduled, update resource status to busy
    if (data.status === 'Scheduled' && data.resourceId) {
      updateResourceStatus(data.resourceId, 'Busy');
    }
    
    setIsFormVisible(false);
  };

  const handleUpdateOrder = (data: ProductionOrderFormValues) => {
    if (editingOrder) {
      updateOrder(editingOrder.id, data);
      
      // If order is scheduled, update resource status to busy
      if (data.status === 'Scheduled' && data.resourceId) {
        updateResourceStatus(data.resourceId, 'Busy');
      }
      
      setEditingOrder(null);
    }
  };

  const handleEditOrder = (order: ProductionOrder) => {
    setEditingOrder(order);
    setIsFormVisible(true);
  };

  const handleCancelEdit = () => {
    setEditingOrder(null);
    setIsFormVisible(false);
  };

  return (
    <div className="space-y-6">
      {!isFormVisible ? (
        <div className="flex justify-end">
          <button
            onClick={() => setIsFormVisible(true)}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create New Order
          </button>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">
              {editingOrder ? 'Edit Production Order' : 'Create Production Order'}
            </h2>
            <button
              onClick={handleCancelEdit}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
          <div className="p-4">
            <OrderForm
              initialValues={editingOrder || undefined}
              onSubmit={editingOrder ? handleUpdateOrder : handleCreateOrder}
              isEditing={!!editingOrder}
            />
          </div>
        </div>
      )}

      <OrderTable orders={orders} onEditOrder={handleEditOrder} />
    </div>
  );
};

export default OrderManagement;
