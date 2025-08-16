import React, { useState } from 'react';
import { Users, X, Plus } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

interface TemplateDropZoneProps {
  templateId: string;
  assignedEmployees: Employee[];
  maxEmployees: number;
  onEmployeeAssign: (templateId: string, employee: Employee) => void;
  onEmployeeRemove: (templateId: string, employeeId: string) => void;
}

const TemplateDropZone: React.FC<TemplateDropZoneProps> = ({
  templateId,
  assignedEmployees,
  maxEmployees,
  onEmployeeAssign,
  onEmployeeRemove
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (assignedEmployees.length < maxEmployees) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (assignedEmployees.length >= maxEmployees) return;
    
    const employeeData = e.dataTransfer.getData('application/json');
    if (employeeData) {
      const employee = JSON.parse(employeeData);
      // Check if employee is already assigned
      if (!assignedEmployees.find(emp => emp.id === employee.id)) {
        onEmployeeAssign(templateId, employee);
      }
    }
  };

  const isFull = assignedEmployees.length >= maxEmployees;

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        min-h-[120px] p-4 border-2 border-dashed rounded-lg transition-all duration-200
        ${isDragOver && !isFull
          ? 'border-blue-500 bg-blue-50' 
          : isFull
          ? 'border-gray-200 bg-gray-50'
          : 'border-gray-300 hover:border-gray-400'
        }
      `}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Users className="w-4 h-4" />
          Employee Assignment
        </h4>
        <span className={`text-xs px-2 py-1 rounded-full ${
          isFull ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
        }`}>
          {assignedEmployees.length}/{maxEmployees} assigned
        </span>
      </div>
      
      {assignedEmployees.length === 0 ? (
        <div className="text-center py-8">
          <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">
            {isDragOver ? 'Drop employee here' : 'Drag employees here to assign'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-2">
          {assignedEmployees.map(employee => (
            <div
              key={employee.id}
              className="relative group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                {employee.avatar}
              </div>
              <button
                onClick={() => onEmployeeRemove(templateId, employee.id)}
                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <X className="w-2 h-2" />
              </button>
              <p className="text-xs text-center mt-1 text-gray-600 truncate">{employee.name}</p>
            </div>
          ))}
          {/* Show empty slots */}
          {Array.from({ length: maxEmployees - assignedEmployees.length }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="w-10 h-10 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center"
            >
              <Plus className="w-4 h-4 text-gray-400" />
            </div>
          ))}
        </div>
      )}
      
      {isFull && (
        <div className="text-center mt-2">
          <span className="text-xs text-green-600 font-medium">✓ Fully Staffed</span>
        </div>
      )}
    </div>
  );
};

export default TemplateDropZone;