'use client';

import Link from 'next/link';
import { useTaskContext } from '@/context/TaskContext';
import TaskList from '@/components/TaskList';
import SearchBar from '@/components/SearchBar';
import Button from '@/components/ui/Button';

export default function Home() {
  const { error } = useTaskContext();
  
  return (
    <div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Minhas Tarefas</h1>
        <Link href="/create" passHref>
          <Button>Nova Tarefa</Button>
        </Link>
      </div>
      
      <SearchBar />
      <TaskList />
    </div>
  );
}
