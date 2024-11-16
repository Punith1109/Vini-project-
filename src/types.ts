export interface Todo {
  id: string;
  title: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  notes?: string;
  completed: boolean;
  createdAt: string;
}

export type TodoCategory = {
  id: string;
  name: string;
  color: string;
};