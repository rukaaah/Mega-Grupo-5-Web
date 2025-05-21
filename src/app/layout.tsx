import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { TaskProvider } from '@/context/TaskContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Lista de Tarefas',
  description: 'Aplicação para gerenciar tarefas diárias',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gray-50`}>
        <TaskProvider>
          <div className="min-h-screen">
            <header className="bg-blue-600 text-white">
              <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                  <a href="/" className="text-2xl font-bold">To-Do List</a>
                  <nav>
                    <ul className="flex space-x-4">
                      <li>
                        <a href="/" className="hover:underline">Tarefas</a>
                      </li>
                      <li>
                        <a href="/create" className="hover:underline">Nova Tarefa</a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </header>
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
            <footer className="bg-gray-100 border-t">
              <div className="container mx-auto px-4 py-4 text-center text-gray-600 text-sm">
                &copy; {new Date().getFullYear()} Todos os direitos reservados
              </div>
            </footer>
          </div>
        </TaskProvider>
      </body>
    </html>
  );
}