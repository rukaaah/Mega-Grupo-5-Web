'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Task } from '@/types';
import TaskForm from '@/components/TaskForm';

export default function EditTaskPage() {
  const params = useParams();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const id = params.id as string;

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`/api/tasks/${id}`);
        
        if (!response.ok) {
          throw new Error('Tarefa não encontrada');
        }
        
        const data = await response.json();
        setTask(data);
      } catch (error) {
        console.error('Erro ao buscar tarefa:', error);
        setError('Não foi possível carregar a tarefa solicitada');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchTask();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
        <p>{error || 'Tarefa não encontrada'}</p>
        <button 
          className="mt-2 underline"
          onClick={() => router.push('/')}
        >
          Voltar para a lista de tarefas
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Editar Tarefa</h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <TaskForm task={task} isEditing={true} />
      </div>
    </div>
  );
}