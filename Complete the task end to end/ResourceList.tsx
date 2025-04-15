import React from 'react';
import { useResourceStore } from '@/store/resourceStore';
import { Resource } from '@/types';

interface ResourceListProps {
  onSelectResource?: (resource: Resource) => void;
  selectedResourceId?: string;
}

export const ResourceList: React.FC<ResourceListProps> = ({ 
  onSelectResource,
  selectedResourceId
}) => {
  const { resources } = useResourceStore();

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Available Resources</h2>
      <div className="space-y-2">
        {resources.map((resource) => (
          <div 
            key={resource.id}
            className={`p-3 border rounded-md cursor-pointer transition-colors ${
              selectedResourceId === resource.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => onSelectResource && onSelectResource(resource)}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">{resource.name}</span>
              <span 
                className={`px-2 py-1 text-xs rounded-full ${
                  resource.status === 'Available' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {resource.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceList;
