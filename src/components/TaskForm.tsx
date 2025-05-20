'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Task, TaskCreateInput, TaskPriority } from '@/types';
import { useTaskContext } from '@/context/TaskContext';
import Input from './ui/Input';
import Button from './ui/Button';

interface TaskFormProps {
  task?: Task;
  isEditing?: boolean;
}

export default function TaskForm({ task, isEditing = false }: TaskFormProps) {
  const router = useRouter();
  const { addTask, updateTask } = useTaskContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Estado do formulário
  const [formData, setFormData] = useState<TaskCreateInput>({
    title: task?.title || '',
    description: task?.description || '',
    date: task?.date ? new Date(task.date).toISOString().split('T')[0] : '',
    priority: task?.priority || TaskPriority.MEDIUM,
    completed: task?.completed || false
  });

  // Manipular mudanças nos campos do formulário
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpar erro do campo quando ele é alterado
    if(formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validar formulário
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      errors.title = 'O título é obrigatório';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'A descrição é obrigatória';
    }
    
    if (!formData.date) {
      errors.date = 'A data é obrigatória';
    }
    
    if (!formData.priority) {
      errors.priority = 'A prioridade é obrigatória';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Enviar formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (isEditing && task) {
        await updateTask(task.id, formData);
      } else {
        await addTask(formData);
      }
      router.push('/');  // Redirecionar para a página inicial após salvar
      router.refresh();  // Atualizar os dados
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Input
          id="title"
          name="title"
          label="Título"
          placeholder="Digite o título da tarefa"
          value={formData.title}
          onChange={handleChange}
          error={formErrors.title}
          fullWidth
          required
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Descrição
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          placeholder="Descreva sua tarefa"
          value={formData.description}
          onChange={handleChange}
          className={`
            w-full px-3 py-2 bg-white border shadow-sm border-gray-300 placeholder-gray-400 
            focus:outline-none focus:border-blue-500 focus:ring-blue-500 
            rounded-md sm:text-sm focus:ring-1
            ${formErrors.description ? 'border-red-500' : 'border-gray-300'}
          `}
          required
        />
        {formErrors.description && (
          <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            type="date"
            id="date"
            name="date"
            label="Data"
            value={formData.date}
            onChange={handleChange}
            error={formErrors.date}
            fullWidth
            required
          />
        </div>
        
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
            Prioridade
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className={`
              w-full px-3 py-2 bg-white border shadow-sm border-gray-300 
              focus:outline-none focus:border-blue-500 focus:ring-blue-500 
              rounded-md sm:text-sm focus:ring-1
              ${formErrors.priority ? 'border-red-500' : 'border-gray-300'}
            `}
            required
          >
            <option value={TaskPriority.HIGH}>Alta</option>
            <option value={TaskPriority.MEDIUM}>Média</option>
            <option value={TaskPriority.LOW}>Baixa</option>
          </select>
          {formErrors.priority && (
            <p className="mt-1 text-sm text-red-600">{formErrors.priority}</p>
          )}
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/')}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
        >
          {isEditing ? 'Atualizar' : 'Criar'} Tarefa
        </Button>
      </div>
    </form>
  );
}