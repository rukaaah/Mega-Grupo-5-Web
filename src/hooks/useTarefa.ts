import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Tarefa } from '@/types/tarefa';
import { headers } from 'next/headers';

export function useTarefas() {
    // estados bases para armezenar as tarefas
    const [tarefas, setTarefas] = useState<Tarefa[]>([]);
    // estado para armazenar a tarefa que está sendo editada
    const [editTarefa, setEditTarefa] = useState<Tarefa | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Buscar tarefas ao carregar a página
    useEffect(() => {
    fetchTasks();
    }, []);

    // Função para buscar tarefas da API
    const fetchTasks = async (filters?:{
        titulo?: string;
        descricao?: string;
        prioridade?: number;
        data?: string;
        state?: string;
        ordenar?: string;
    }) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('Usuário não autenticado');
            
            const params = new URLSearchParams();
            if(filters?.titulo) params.append('titulo', filters.titulo);
            if(filters?.descricao) params.append('desc', filters.descricao);
            if(filters?.prioridade) params.append('prioridade', String(filters.prioridade));
            if(filters?.data) params.append('date', filters.data);
            if(filters?.ordenar) params.append('ordenar', filters.ordenar);
            
            const response = await fetch(`/api/routesNomes?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${session.access_token}`
            }
        });

            if (!response.ok) throw new Error('Erro ao buscar tarefas');
            const data = await response.json();

            setTarefas(data);

        } catch (error) {
            console.error('Erro:', error);
        }
        };

    const handleSubmit = async (form: any, setForm: Function) => {
    
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('Usuário não autenticado');

            // esta definindo a route base para o metodo
            // se a variavel editTarefa estiver preenchida
            // ele vai usar o id da tarefa para editar
            // se não, ele vai usar a rota padrãos
            const url = editTarefa 
            ? `/api/routesNomes?id=${editTarefa.id}` 
            : '/api/routesNomes';
            const method = editTarefa ? 'PATCH' : 'POST';

            // usando a route base definida acima
            const response = await fetch(url, {
            method,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify(form),
            });

            if (!response.ok) throw new Error('Erro ao salvar tarefa');

            // resetando o formulário
            fetchTasks();
            setForm({
            titulo: '',
            descricao: '',
            prioridade: 1,
            date: form.date,
            state: form.state
            });
            setEditTarefa(null);

        } catch (error) {
            console.error('Erro:', error);
        }
        };

    // Função para deletar tarefa
    const handleDelete = async (id: number) => {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('Usuário não autenticado');

        // vai tentar deletar a tarefa usando o id
        const response = await fetch(`/api/routesNomes?id=${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${session.access_token}`
        }
        });
        
        //lança erro
        if (!response.ok) throw new Error('Erro ao deletar tarefa');
        
        // se não der erro, atualiza a lista de tarefas
        fetchTasks();
    } catch (error) {
        console.error('Erro:', error);
    }
    };

    // Função para deletar tarefas concluídas
    const handleDeleteCompletas = async () => {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('Usuário não autenticado');

        // vai tentar deletar as tarefas concluídas
        const response = await fetch('/api/routesNomes', {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${session.access_token}`
        }
        });
        
        if (!response.ok) throw new Error('Erro ao deletar tarefas concluídas');
        
        fetchTasks();
    } catch (error) {
        console.error('Erro:', error);
    }
    };

    const MudaCheckTarefa = async (task: Tarefa) => {
    const NovoCheck = { ...task, check: !task.check };

    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('Usuário não autenticado');

        // usa um patch só pra mudar o check
        const response = await fetch(`/api/routesNomes?id=${task.id}`, {
        method: 'PATCH',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ check: NovoCheck.check }),
        });
        
        if (!response.ok) throw new Error('Erro ao atualizar tarefa');

        // atualiza a lista de tarefas
        // e força o estado do banco de dados na lista da UI
        setTarefas(prev =>
        prev.map(t => (t.id === NovoCheck.id ? NovoCheck : t))
        );
        
    } catch (error) {
        console.error('Erro:', error);
    }
    };

    const modoEdit = (task: Tarefa, setForm: Function) => {
    setEditTarefa(task);
    setForm({
        titulo: task.titulo,
        descricao: task.descricao,
        prioridade: task.prioridade,
        state: task.state,
        date: task.date.slice(0, 16),
    });
    };

    const aplicarFiltros = (filtros: any) => {
      // console.log(filtros.data);
      fetchTasks({
        titulo: filtros.titulo,
        descricao: filtros.descricao,
        prioridade: filtros.prioridade ? Number(filtros.prioridade) : undefined,
        data: filtros.data,
        ordenar: filtros.ordenar
      });
    };
  
    // Limpa os filtros
    const limparFiltros = (setFiltros: Function) => {
      setFiltros({
        titulo: '',
        descricao: '',
        prioridade: '',
        data: '',
        ordenar: 'padrao'
      });
      fetchTasks();
    };

    const agruparState = (tasks: Tarefa[]) => {
        // agrupa as tarefas por estado
        // se não houver state, define como 'To Do' (garantia)
        const grouped = tasks.reduce((acc, task) => {
          const state = task.state || 'To Do'; // Default para 'todo' se não houver state
          if (!acc[state]) {
            acc[state] = [];
          }
          acc[state].push(task);
          return acc;
        }, {} as Record<string, Tarefa[]>);
      
        // ordem que os grupos devem ser exibidos
        const order = ['Backlog', 'To Do', 'Doing', 'Done', 'Stopped'];
        
        // objeto ordenado
        const ordered: Record<string, Tarefa[]> = {};
        order.forEach(state => {
          if (grouped[state]) {
            ordered[state] = grouped[state];
          }
        });
      
        // arruma qlqr estado que não esteja na ordem
        Object.keys(grouped).forEach(state => {
          if (!order.includes(state)) {
            ordered[state] = grouped[state];
          }
        });
      
        return ordered;
      };

    // exporta as variaveis q o front vai usar
    return {
        tarefas,
        fetchTasks,
        editTarefa,
        setEditTarefa,
        handleSubmit,
        handleDelete,
        handleDeleteCompletas,
        MudaCheckTarefa,
        modoEdit,
        aplicarFiltros,
        limparFiltros,
        agruparState
    };

}