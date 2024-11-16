import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Search, ListTodo, Calendar, Sparkles, LogOut } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { TodoItem } from '../components/TodoItem';
import { TodoForm } from '../components/TodoForm';
import { Todo } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { AnimatedBackground } from '../components/AnimatedBackground';
import axios from 'axios';

export function TodoApp() {
  const { logout, userId } = useAuth();
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const defaultCategories = ['all', 'work', 'personal', 'shopping'];
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/todos/${userId}`);
        const mappedTodos: Todo[] = response.data.map((todo: any) => ({
          id: todo._id,
          title: todo.task,
          category: todo.category,
          priority: todo.priority,
          dueDate: new Date(todo.dueDate).toISOString().split('T')[0],
          notes: todo.notes || '',
          completed: todo.completed,
          createdAt: todo.createdAt
        }));
        setTodos(mappedTodos);
      } catch (error) {
        console.error('Error fetching todos:', error);
        toast.error('Failed to load todos');
      }
    };

    if (userId) {
      fetchTodos();
    }
  }, [userId]);

  const addTodo = async (todoData: Omit<Todo, 'id' | 'completed' | 'createdAt'>) => {
    try {
      const response = await axios.post('http://localhost:5000/api/todos', {
        userId,
        task: todoData.title,
        category: todoData.category,
        priority: todoData.priority,
        dueDate: new Date(todoData.dueDate).toISOString(),
        notes: todoData.notes || ''
      });

      if (response.status === 201) {
        const newTodo: Todo = {
          id: response.data.id,
          title: todoData.title,
          category: todoData.category,
          priority: todoData.priority,
          dueDate: todoData.dueDate,
          notes: todoData.notes || '',
          completed: false,
          createdAt: new Date().toISOString()
        };
        setTodos(prevTodos => [newTodo, ...prevTodos]);
        toast.custom(() => (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2"
          >
            <Sparkles className="h-5 w-5" />
            <span>Task added successfully!</span>
          </motion.div>
        ));
      }
    } catch (error) {
      console.error('Error adding todo:', error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(`Failed to add todo: ${error.response.data.message}`);
      } else {
        toast.error('Failed to add todo: Unknown error occurred');
      }
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
    toast.custom(() => (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-lg shadow-lg"
      >
        Task deleted successfully!
      </motion.div>
    ));
  };

  const editTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  const filteredTodos = todos
    .filter(todo => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    })
    .filter(todo => 
      todo.title.toLowerCase().includes(search.toLowerCase()) ||
      todo.category.toLowerCase().includes(search.toLowerCase())
    )
    .filter(todo => 
      categoryFilter === 'all' ? true : todo.category === categoryFilter
    );

    const categories = [...new Set(['all', ...defaultCategories, ...todos.map(todo => todo.category)])];

  return (
    <div className="min-h-screen py-8 px-4">
      <AnimatedBackground />
      <Toaster position="top-right" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="glass-card rounded-2xl shadow-xl p-8 mb-8">
          <motion.div 
            className="flex items-center justify-between mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-xl shadow-lg">
                <ListTodo size={32} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold gradient-text">My Tasks</h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(true)}
                className="btn-primary px-6 py-3 rounded-xl flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Add Task</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="p-3 hover:bg-gray-100 rounded-xl"
                title="Logout"
              >
                <LogOut size={20} className="text-gray-600" />
              </motion.button>
            </div>
          </motion.div>

          <motion.div 
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'active' | 'completed')}
              className="input-field"
            >
              <option value="all">All Tasks</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </motion.div>

          <AnimatePresence mode="wait">
            {filteredTodos.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-16"
              >
                <motion.div className="float-animation">
                  <Calendar size={64} className="mx-auto text-indigo-400 mb-6" />
                </motion.div>
                <p className="text-xl text-gray-500">No tasks found</p>
              </motion.div>
            ) : (
              <motion.div 
                layout 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {filteredTodos.map((todo, index) => (
                  <motion.div
                    key={todo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <TodoItem
                      todo={todo}
                      onToggle={toggleTodo}
                      onDelete={deleteTodo}
                      onEdit={editTodo}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <TodoForm
            onSubmit={(todoData) => {
              if (editingTodo) {
                // Handle edit
                const updatedTodo = {
                  ...editingTodo,
                  ...todoData
                };
                setTodos(todos.map(t => 
                  t.id === editingTodo.id ? updatedTodo : t
                ));
                toast.custom(() => (
                  <motion.div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-lg shadow-lg">
                    Task updated successfully!
                  </motion.div>
                ));
              } else {
                // Handle add
                addTodo(todoData);
              }
              setEditingTodo(null);
              setShowForm(false);
            }}
            onClose={() => {
              setShowForm(false);
              setEditingTodo(null);
            }}
            initialData={editingTodo || undefined}
          />
        )}
      </AnimatePresence>
    </div>
  );
}