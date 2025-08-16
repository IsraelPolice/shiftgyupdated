import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  role: string;
  avatar: string;
  department: string;
  hours: string;
  rating: string;
  status: string;
  assignedShifts: number;
}

interface EmployeeDragCardProps {
  employee: Employee;
  onDragStart: (employee: Employee) => void;
  onDragEnd: () => void;
}

const EmployeeDragCard: React.FC<EmployeeDragCardProps> = ({
  employee,
  onDragStart,
  onDragEnd
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData('application/json', JSON.stringify(employee));
    onDragStart(employee);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onDragEnd();
  };

  const getStatusColor = () => {
    if (employee.assignedShifts === 0) return 'bg-green-500';
    if (employee.assignedShifts < 3) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusText = () => {
    if (employee.assignedShifts === 0) return 'Available';
    if (employee.assignedShifts < 3) return `Partially assigned (${employee.assignedShifts}/5 shifts)`;
    return 'Fully assigned';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`
        p-3 bg-white rounded-lg border cursor-move transition-all duration-200
        ${isDragging 
          ? 'opacity-50 scale-95 shadow-xl border-blue-500' 
          : 'hover:shadow-md border-gray-200 hover:border-gray-300'
        }
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-medium">
              {employee.avatar}
            </div>
            <div className={`absolute -top-1 -right-1 w-3 h-3 ${getStatusColor()} rounded-full border-2 border-white`}></div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{employee.name}</p>
            <p className="text-xs text-gray-500">{employee.role}</p>
            <p className="text-xs text-gray-400">{employee.hours} • {employee.rating}★</p>
            <p className="text-xs text-gray-400">{getStatusText()}</p>
          </div>
        </div>
        <button className="p-1 hover:bg-blue-100 rounded-full transition-colors">
          <Plus className="w-4 h-4 text-blue-600" />
        </button>
      </div>
    </div>
  );
};

export default EmployeeDragCard;