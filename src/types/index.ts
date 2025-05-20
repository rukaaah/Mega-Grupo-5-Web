export enum TaskPriority {
  HIGH = 'alta',
  MEDIUM = 'média',
  LOW = 'baixa'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date string format
  priority: TaskPriority;
  completed: boolean;
  userId?: string; // Para recursos extras de autenticação
  createdAt: string;
  updatedAt: string;
}

export type TaskCreateInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completed'> & {
  completed?: boolean;
};

export type TaskUpdateInput = Partial<TaskCreateInput>;

export type FilterType = 
  | 'none' 
  | 'priority_high' 
  | 'priority_medium' 
  | 'priority_low' 
  | 'date_asc' 
  | 'date_desc' 
  | 'alphabetical';

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterType: FilterType;
  setFilterType: (type: FilterType) => void;
  addTask: (task: TaskCreateInput) => Promise<void>;
  updateTask: (id: string, task: TaskUpdateInput) => Promise<void>;
  toggleTaskCompletion: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  deleteCompletedTasks: () => Promise<void>;
}