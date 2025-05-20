'use client';

import React from 'react';
import { useTaskContext } from '@/context/TaskContext';
import TaskItem from './TaskItem';
import Button from './ui/Button';

export default function TaskList() {
  const { tasks, isLoading, deleteCompletedTasks } = useTaskContext();
  const completedTasks = tasks.filter(task => task.completed);
  
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-700">Nenhuma tarefa encontrada</h3>
        <p className="text-gray-500">Adicione sua primeira tarefa clicando no botão "Nova Tarefa"</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Suas Tarefas ({tasks.length})
        </h2>
        {completedTasks.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={deleteCompletedTasks}
          >
            Excluir Concluídas ({completedTasks.length})
          </Button>
        )}
      </div>
      
      <div className="space-y-2">
        {tasks.map(task => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}