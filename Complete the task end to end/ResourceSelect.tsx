import React from 'react';
import { Resource } from '@/types';

interface ResourceSelectProps {
  resources: Resource[];
  selectedResourceId?: string;
  onChange: (resourceId: string) => void;
  disabled?: boolean;
}

export const ResourceSelect: React.FC<ResourceSelectProps> = ({
  resources,
  selectedResourceId,
  onChange,
  disabled = false
}) => {
  return (
    <div className="w-full">
      <label htmlFor="resource-select" className="block text-sm font-medium text-gray-700 mb-1">
        Select Resource
      </label>
      <select
        id="resource-select"
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        value={selectedResourceId || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        <option value="" disabled>Select a resource...</option>
        {resources.map((resource) => (
          <option 
            key={resource.id} 
            value={resource.id}
            disabled={resource.status === 'Busy'}
          >
            {resource.name} {resource.status === 'Busy' ? '(Busy)' : ''}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ResourceSelect;
