import React from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useOrderStore } from '@/store/orderStore';
import { useResourceStore } from '@/store/resourceStore';
import { OrderStatus } from '@/types';

const Dashboard: React.FC = () => {
  const { orders } = useOrderStore();
  const { resources } = useResourceStore();

  // Prepare data for Order Status chart
  const getOrderStatusData = () => {
    const statusCounts: Record<OrderStatus, number> = {
      'Pending': 0,
      'Scheduled': 0,
      'In Progress': 0,
      'Completed': 0,
      'Cancelled': 0
    };

    orders.forEach(order => {
      statusCounts[order.status]++;
    });

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count
    }));
  };

  // Prepare data for Resource Utilization chart
  const getResourceUtilizationData = () => {
    const resourceUtilization = resources.map(resource => {
      const assignedOrders = orders.filter(order => 
        order.resourceId === resource.id && 
        (order.status === 'Scheduled' || order.status === 'In Progress')
      );
      
      return {
        name: resource.name,
        scheduled: assignedOrders.filter(order => order.status === 'Scheduled').length,
        inProgress: assignedOrders.filter(order => order.status === 'In Progress').length
      };
    });

    return resourceUtilization;
  };

  const orderStatusData = getOrderStatusData();
  const resourceUtilizationData = getResourceUtilizationData();

  // Colors for pie chart
  const COLORS = ['#FFBB28', '#0088FE', '#8884D8', '#00C49F', '#FF8042'];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Production Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Order Status</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resource Utilization Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Resource Utilization</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={resourceUtilizationData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="scheduled" stackId="a" fill="#0088FE" name="Scheduled" />
                <Bar dataKey="inProgress" stackId="a" fill="#8884D8" name="In Progress" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard 
          title="Total Orders" 
          value={orders.length} 
          color="bg-blue-500" 
        />
        <SummaryCard 
          title="Scheduled" 
          value={orders.filter(o => o.status === 'Scheduled').length} 
          color="bg-yellow-500" 
        />
        <SummaryCard 
          title="In Progress" 
          value={orders.filter(o => o.status === 'In Progress').length} 
          color="bg-purple-500" 
        />
        <SummaryCard 
          title="Completed" 
          value={orders.filter(o => o.status === 'Completed').length} 
          color="bg-green-500" 
        />
      </div>
    </div>
  );
};

interface SummaryCardProps {
  title: string;
  value: number;
  color: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, color }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className={`${color} h-2`}></div>
      <div className="p-4">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default Dashboard;
