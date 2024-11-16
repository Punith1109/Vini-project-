import React from 'react';
import { motion } from 'framer-motion';
import { Check, Trash2, Edit, Clock, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}

const priorityColors = {
  low: 'bg-gradient-to-r from-green-200 to-green-300 text-green-800',
  medium: 'bg-gradient-to-r from-yellow-200 to-yellow-300 text-yellow-800',
  high: 'bg-gradient-to-r from-red-200 to-red-300 text-red-800',
};

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onEdit }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="todo-item p-4 rounded-xl bg-white bg-opacity-60 backdrop-blur-lg border border-gray-100 shadow-md hover:shadow-lg"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onToggle(todo.id)}
            className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors
              ${todo.completed 
                ? 'bg-gradient-to-r from-green-400 to-emerald-400 border-transparent' 
                : 'border-gray-300 hover:border-indigo-400'}`}
          >
            {todo.completed && <Check size={14} className="text-white" />}
          </motion.button>
          
          <div className="flex-1">
            <h3 className={`font-medium ${
              todo.completed 
                ? 'line-through text-[#404040]'
                : 'text-black'
            }`}>
              {todo.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 flex items-center gap-1">
                <Tag size={12} />
                {todo.category}
              </span>
              
              <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[todo.priority]}`}>
                {todo.priority}
              </span>

              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock size={12} />
                {format(new Date(todo.dueDate), 'MMM d')}
              </span>
            </div>
            
            {todo.notes && (
              <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                {todo.notes}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(todo)}
            className="p-2 hover:bg-indigo-50 rounded-lg text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <Edit size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(todo.id)}
            className="p-2 hover:bg-red-50 rounded-lg text-gray-600 hover:text-red-600 transition-colors"
          >
            <Trash2 size={18} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};