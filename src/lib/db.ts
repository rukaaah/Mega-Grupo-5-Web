import { Task, TaskPriority } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Simulação de banco de dados em memória
let tasks: Task[] = [
  {
    id: '1',
    title: 'Estudar Next.js',
    description: 'Aprender sobre app router, server components e API routes.',
    date: '2025-05-25',
    priority: TaskPriority.HIGH,
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Fazer compras',
    description: 'Comprar itens para a semana: frutas, vegetais, leite e pão.',
    date: '2025-05-20',
    priority: TaskPriority.MEDIUM,
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Reunião com equipe',
    description: 'Discutir o progresso do projeto e próximos passos.',
    date: '2025-05-21',
    priority: TaskPriority.HIGH,
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Métodos para manipular tarefas
export const db = {
  tasks: {
    getAll: async (): Promise<Task[]> => {
      return tasks;
    },
    
    getById: async (id: string): Promise<Task | null> => {
      const task = tasks.find(t => t.id === id);
      return task || null;
    },
    
    create: async (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
      const now = new Date().toISOString();
      const newTask: Task = {
        id: uuidv4(),
        ...data,
        createdAt: now,
        updatedAt: now
      };
      
      tasks.push(newTask);
      return newTask;
    },
    
    update: async (id: string, data: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Task | null> => {
      const index = tasks.findIndex(t => t.id === id);
      
      if (index === -1) {
        return null;
      }
      
      tasks[index] = {
        ...tasks[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      return tasks[index];
    },
    
    delete: async (id: string): Promise<boolean> => {
      const initialLength = tasks.length;
      tasks = tasks.filter(t => t.id !== id);
      return tasks.length < initialLength;
    },
    
    deleteCompleted: async (): Promise<boolean> => {
      const initialLength = tasks.length;
      tasks = tasks.filter(t => !t.completed);
      return tasks.length < initialLength;
    }
  }
};