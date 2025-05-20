'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Task, TaskPriority } from '@/types';
import { useTaskContext } from '@/context/TaskContext';
import Checkbox from './ui/Checkbox';
import Button from './ui/Button';

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const { toggleTaskCompletion, deleteTask } = useTaskContext();
  const [showDetails, setShowDetails] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  // Definir cores com base na prioridade
  const priorityColors = {
    [TaskPriority.HIGH]: 'border-l-4 border-red-500',
    [TaskPriority.MEDIUM]: 'border-l-4 border-yellow-500',
    [TaskPriority.LOW]: 'border-l-4 border-green-500'
  };

  // Formatar data para exibição
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const handleToggleCompletion = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleTaskCompletion(task.id);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      setIsDeleting(true);
      await deleteTask(task.id);
      setIsDeleting(false);
    }
  };

  return (
    <div 
      className={`mb-3 bg-white rounded-lg shadow-sm overflow-hidden ${priorityColors[task.priority]}`}
      data-testid="task-item"
    >
      <div 
        className="flex items-center p-4 cursor-pointer"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div onClick={handleToggleCompletion}>
          <Checkbox
            checked={task.completed}
            onChange={() => {}} // Controlado pelo onClick do div pai
            className="mr-3 h-5 w-5"
          />
        </div>
        <div className="flex-1">
          <h3 
            className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}
          >
            {task.title}
          </h3>
          <p className="text-sm text-gray-500">
            {formatDate(task.date)}
          </p>
        </div>
        <div className="text-xs font-medium px-2.5 py-0.5 rounded bg-gray-100 text-gray-800">
          {task.priority}
        </div>
      </div>

      {showDetails && (
        <div className="p-4 pt-0 border-t border-gray-100">
          <p className="mb-4 text-gray-700">{task.description}</p>
          <div className="flex justify-end space-x-2">
            <Link href={`/edit/${task.id}`} passHref>
              <Button 
                variant="outline" 
                size="sm"
                onClick={(e) => e.stopPropagation()}
              >
                Editar
              </Button>
            </Link>
            <Button 
              variant="danger" 
              size="sm"
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              Excluir
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}