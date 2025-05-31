import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Tarefa } from '@/types/tarefa';

const API_URL_BASE = 'http://localhost:3000/api/routesNomes';

export function useTarefas() {
    const [tarefas, setTarefas] = useState<Tarefa[]>([]);
    const [editTarefa, setEditTarefa] = useState<Tarefa | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchTasks = useCallback(async (filters?:{
        titulo?: string;
        descricao?: string;
        prioridade?: number;
        data?: string;
        state?: string;
        ordenar?: string;
    }) => {
        setError(null);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                const authError = 'Usuário não autenticado para buscar tarefas.';
                setError(authError);
                throw new Error(authError);
            }
            
            const params = new URLSearchParams();
            if(filters?.titulo) params.append('titulo', filters.titulo);
            if(filters?.descricao) params.append('desc', filters.descricao);
            if(filters?.prioridade != null) params.append('prioridade', String(filters.prioridade));
            if(filters?.data) params.append('date', filters.data);
            if(filters?.ordenar) params.append('ordenar', filters.ordenar);
            
            const response = await fetch(`${API_URL_BASE}?${params.toString()}`, {
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            });

            if (!response.ok) {
                let errorMsg = `Erro ao buscar tarefas (Status: ${response.status})`;
                try { 
                    const errData = await response.json(); 
                    errorMsg = errData.error || errData.message || errorMsg; 
                } catch (e) {
                    console.warn("Resposta de erro da API (fetchTasks) não era JSON. Corpo da resposta:", await response.text().catch(()=>""));
                }
                setError(errorMsg);
                throw new Error(errorMsg);
            }
            const dataFromApi = await response.json();
            
            const mappedData = (Array.isArray(dataFromApi) ? dataFromApi : []).map(task => ({
                ...task,
                descricao: task.desc, 
            }));
            setTarefas(mappedData);

        } catch (err: any) {
            console.error('Hook fetchTasks Erro:', err.message);
            setError(err.message || 'Ocorreu um erro ao buscar tarefas.');
            setTarefas([]); 
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleSubmit = async (form: Partial<Omit<Tarefa, 'id' | 'user_id' | 'desc'>> & { id?: number, descricao?: string }, setFormUi?: Function) => {
        setError(null);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                const authError = 'Usuário não autenticado para salvar tarefa.';
                setError(authError);
                throw new Error(authError);
            }

            const isEditing = editTarefa && editTarefa.id != null && form.id != null;
            const url = isEditing ? `${API_URL_BASE}?id=${form.id}` : API_URL_BASE;
            const method = isEditing ? 'PATCH' : 'POST';
            
            const payload: any = { ...form };
            if (!isEditing) {
                delete payload.id;
                if (typeof payload.check === 'undefined') {
                    payload.check = false;
                }
            }
            
            const response = await fetch(url, {
                method,
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                let errorMsg = `Erro ao salvar tarefa (Status: ${response.status})`;
                try { 
                    const errData = await response.json(); 
                    errorMsg = errData.error || errData.message || errorMsg; 
                } catch (e) {
                     console.warn("Resposta de erro da API (handleSubmit) não era JSON. Corpo da resposta:", await response.text().catch(()=>""));
                }
                setError(errorMsg);
                throw new Error(errorMsg);
            }
            
            await fetchTasks();
            if (typeof setFormUi === 'function') {
                const now = new Date();
                now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
                setFormUi({
                    titulo: '',
                    descricao: '',
                    prioridade: 2,
                    date: now.toISOString().slice(0,16),
                    state: 'To Do',
                    check: false, 
                });
            }
            setEditTarefa(null);
        } catch (err: any) {
            console.error('Hook handleSubmit Erro:', err.message);
            setError(err.message || 'Ocorreu um erro ao salvar a tarefa.');
        }
    };

    const handleDelete = async (id: number) => {
        setError(null);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { throw new Error('Usuário não autenticado para deletar tarefa.'); }

            const response = await fetch(`${API_URL_BASE}?id=${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            });
            
            if (!response.ok) {
                let errorMsg = `Erro ao deletar tarefa (Status: ${response.status})`;
                try { const errData = await response.json(); errorMsg = errData.error || errData.message || errorMsg; } 
                catch (e) { console.warn("Resposta de erro da API (handleDelete) não era JSON."); }
                setError(errorMsg);
                throw new Error(errorMsg);
            }
            await fetchTasks();
        } catch (err: any) {
            console.error('Hook handleDelete Erro:', err.message);
            setError(err.message || 'Ocorreu um erro ao deletar a tarefa.');
        }
    };

    const handleDeleteCompletas = async () => {
        setError(null);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { throw new Error('Usuário não autenticado para deletar tarefas completas.'); }

            const response = await fetch(API_URL_BASE, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            });
            
            if (!response.ok) {
                let errorMsg = `Erro ao deletar tarefas concluídas (Status: ${response.status})`;
                try { const errData = await response.json(); errorMsg = errData.error || errData.message || errorMsg; } 
                catch (e) { console.warn("Resposta de erro da API (handleDeleteCompletas) não era JSON.");}
                setError(errorMsg);
                throw new Error(errorMsg);
            }
            await fetchTasks();
        } catch (err: any) {
            console.error('Hook handleDeleteCompletas Erro:', err.message);
            setError(err.message || 'Ocorreu um erro ao deletar tarefas concluídas.');
        }
    };

    const MudaCheckTarefa = async (task: Tarefa) => {
        setError(null);
        const newCheckStatus = !task.check;
        let newState = task.state;
        if (newCheckStatus && task.state !== 'Done') {
            newState = 'Done';
        } else if (!newCheckStatus && task.state === 'Done') {
            newState = 'To Do';
        }
        const payload = { check: newCheckStatus, state: newState };

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { throw new Error('Usuário não autenticado para mudar check da tarefa.'); }

            const response = await fetch(`${API_URL_BASE}?id=${task.id}`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify(payload),
            });
            
            if (!response.ok) {
                let errorMsg = `Erro ao atualizar tarefa (Status: ${response.status})`;
                try { const errData = await response.json(); errorMsg = errData.error || errData.message || errorMsg; } 
                catch (e) { console.warn("Resposta de erro da API (MudaCheckTarefa) não era JSON.");}
                setError(errorMsg);
                throw new Error(errorMsg);
            }
            setTarefas(prev => prev.map(t => (t.id === task.id ? { ...t, ...payload } : t)));
        } catch (err: any) {
            console.error('Hook MudaCheckTarefa Erro:', err.message);
            setError(err.message || 'Ocorreu um erro ao atualizar a tarefa.');
            await fetchTasks(); 
        }
    };

    const modoEdit = (task: Tarefa | (Omit<Tarefa, 'id' | 'user_id' | 'desc'> & { id?: number, check?: boolean, descricao?: string }), setFormUi: Function) => {
        const taskToEdit = task as Tarefa; // Assumindo que task já terá 'descricao' após o mapeamento em fetchTasks
        if ('id' in taskToEdit && taskToEdit.id != null) {
            setEditTarefa(taskToEdit); 
        } else {
            setEditTarefa(null); 
        }
        
        if (typeof setFormUi === 'function') {
            setFormUi({
                id: taskToEdit.id,
                titulo: taskToEdit.titulo,
                descricao: taskToEdit.descricao || '',
                prioridade: taskToEdit.prioridade, 
                state: taskToEdit.state,
                date: taskToEdit.date ? String(taskToEdit.date).slice(0, 16) : '',
                check: taskToEdit.check,
            });
        }
    };

    const aplicarFiltros = (filtrosAplicados: {
        titulo?: string;
        descricao?: string;
        prioridade?: number;
        data?: string;
        ordenar?: string;
    }) => {
      fetchTasks(filtrosAplicados);
    };
  
    const limparFiltros = (setFiltrosUI?: Function) => {
      if(typeof setFiltrosUI === 'function') {
        setFiltrosUI({
            titulo: '',
            descricao: '',
            prioridade: 'all', 
            data: '',
            ordenar: 'padrao'
        });
      }
      fetchTasks();
    };

    const agruparState = (tasksToGroup: Tarefa[]): Record<string, Tarefa[]> => {
        const grouped = (tasksToGroup || []).reduce((acc, currentTask) => {
          const state = currentTask.state || 'To Do';
          if (!acc[state]) {
            acc[state] = [];
          }
          acc[state].push(currentTask);
          return acc;
        }, {} as Record<string, Tarefa[]>);
      
        const order = ['Backlog', 'To Do', 'Doing', 'Done', 'Stopped'];
        const ordered: Record<string, Tarefa[]> = {};
        order.forEach(state => {
            ordered[state] = grouped[state] || [];
        });
      
        Object.keys(grouped).forEach(state => {
          if (!order.includes(state)) {
            ordered[state] = grouped[state];
          }
        });
        return ordered;
      };

    return {
        tarefas,
        error,
        fetchTasks,
        handleSubmit,
        handleDelete,
        handleDeleteCompletas,
        MudaCheckTarefa,
        modoEdit,
        aplicarFiltros,
        limparFiltros,
        agruparState,
    };
}