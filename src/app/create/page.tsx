'use client';

import TaskForm from '@/components/TaskForm';

export default function CreateTaskPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Criar Nova Tarefa</h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <TaskForm />
      </div>
    </div>
  );
}
