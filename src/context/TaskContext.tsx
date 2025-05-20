'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  Task, TaskCreateInput, TaskUpdateInput, 
  FilterType, TaskContextType, TaskPriority 
} from '@/types';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
  children: ReactNode;
}

export function TaskProvider({ children }: TaskProviderProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<FilterType>('none');

  // Carregar tarefas iniciais
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/tasks');
        
        if (!response.ok) {
          throw new Error('Falha ao buscar tarefas');
        }
        
        const data = await response.json();
        setTasks(data);
        setError(null);
      } catch (error) {
        console.error("Erro ao carregar tarefas:", error);
        setError('Falha ao carregar tarefas. Por favor, tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Ordenar e filtrar tarefas sempre que tasks, searchTerm ou filterType mudar
  useEffect(() => {
    let result = [...tasks];
    
    // Aplicar termo de busca
    if (searchTerm) {
      result = result.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Aplicar filtros
    switch (filterType) {
      case 'priority_high':
        result = result.filter(task => task.priority === TaskPriority.HIGH);
        break;
      case 'priority_medium':
        result = result.filter(task => task.priority === TaskPriority.MEDIUM);
        break;
      case 'priority_low':
        result = result.filter(task => task.priority === TaskPriority.LOW);
        break;
      case 'date_asc':
        result = result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'date_desc':
        result = result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'alphabetical':
        result = result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // Ordenação padrão: não concluídas primeiro, por prioridade e depois por data
        result = sortTasks(result);
    }
    
    setFilteredTasks(result);
  }, [tasks, searchTerm, filterType]);

  // Ordenar tarefas por prioridade, data e status de conclusão
  const sortTasks = (taskArray: Task[]): Task[] => {
    return [...taskArray].sort((a, b) => {
      // Tarefas concluídas vão para o final
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      // Ordenar por prioridade (alta -> média -> baixa)
      const priorityOrder: Record<TaskPriority, number> = { 
        [TaskPriority.HIGH]: 0, 
        [TaskPriority.MEDIUM]: 1, 
        [TaskPriority.LOW]: 2 
      };
      
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      
      // Ordenar por data (mais próxima primeiro)
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  };

  // Adicionar nova tarefa
  const addTask = async (newTask: TaskCreateInput): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
      
      if (!response.ok) {
        throw new Error('Falha ao adicionar tarefa');
      }
      
      const createdTask = await response.json();
      setTasks(prevTasks => sortTasks([...prevTasks, createdTask]));
      setError(null);
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
      setError('Falha ao adicionar tarefa. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar tarefa existente
  const updateTask = async (taskId: string, updatedTask: TaskUpdateInput): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask)
      });
      
      if (!response.ok) {
        throw new Error('Falha ao atualizar tarefa');
      }
      
      const updated = await response.json();
      setTasks(prevTasks => 
        sortTasks(prevTasks.map(task => task.id === taskId ? updated : task))
      );
      setError(null);
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      setError('Falha ao atualizar tarefa. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Marcar tarefa como concluída/não concluída
  const toggleTaskCompletion = async (taskId: string): Promise<void> => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    try {
      await updateTask(taskId, { completed: !task.completed });
    } catch (error) {
      console.error("Erro ao alternar status da tarefa:", error);
    }
  };

  // Excluir tarefa
  const deleteTask = async (taskId: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Falha ao excluir tarefa');
      }
      
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      setError(null);
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
      setError('Falha ao excluir tarefa. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Excluir todas as tarefas concluídas
  const deleteCompletedTasks = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tasks/completed', {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Falha ao excluir tarefas concluídas');
      }
      
      setTasks(prevTasks => prevTasks.filter(task => !task.completed));
      setError(null);
    } catch (error) {
      console.error("Erro ao excluir tarefas concluídas:", error);
      setError('Falha ao excluir tarefas concluídas. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: TaskContextType = {
    tasks: filteredTasks,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    addTask,
    updateTask,
    toggleTaskCompletion,
    deleteTask,
    deleteCompletedTasks
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext(): TaskContextType {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext deve ser usado dentro de um TaskProvider');
  }
  return context;
}