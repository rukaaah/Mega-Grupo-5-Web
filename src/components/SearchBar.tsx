'use client';

import React, { useState, useEffect } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { FilterType } from '@/types';
import Input from './ui/Input';

export default function SearchBar() {
  const { searchTerm, setSearchTerm, filterType, setFilterType } = useTaskContext();
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  
  // Debounce para a busca
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchTerm(localSearchTerm);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [localSearchTerm, setSearchTerm]);

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          type="text"
          placeholder="Buscar tarefas..."
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
          className="flex-1"
          aria-label="Buscar tarefas por título"
        />
        
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as FilterType)}
          className="px-3 py-2 bg-white border shadow-sm border-gray-300 rounded-md sm:text-sm focus:ring-1 focus:outline-none focus:border-blue-500 focus:ring-blue-500"
          aria-label="Filtrar tarefas"
        >
          <option value="none">Filtrar por...</option>
          <option value="priority_high">Prioridade: Alta</option>
          <option value="priority_medium">Prioridade: Média</option>
          <option value="priority_low">Prioridade: Baixa</option>
          <option value="date_asc">Data: Mais próxima</option>
          <option value="date_desc">Data: Mais distante</option>
          <option value="alphabetical">Ordem alfabética</option>
        </select>
      </div>
    </div>
  );
}