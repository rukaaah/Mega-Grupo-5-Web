import { useState, useEffect } from 'react';
import { Tarefa } from '@/types/tarefa';
import { setegid } from 'process';

export function useTarefas() {
    // estados bases para armezenar as tarefas
    const [tarefas, setTarefas] = useState<Tarefa[]>([]);
    // estado para armazenar a tarefa que está sendo editada
    const [editTarefa, setEditTarefa] = useState<Tarefa | null>(null);
    // estados para armazenar a busca

    // lidar com filtro de tarefas
    //? const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

    // Buscar tarefas ao carregar a página
    useEffect(() => {
    fetchTasks();
    }, []);

    // Função para buscar tarefas da API
    const fetchTasks = async () => {
    try {
        const response = await fetch('/api/routesNomes');

        if (!response.ok) throw new Error('Erro ao buscar tarefas');
        const data = await response.json();

        setTarefas(data);

    } catch (error) {
        console.error('Erro:', error);
    }
    };

    const handleSubmit = async (form: any, setForm: Function) => {
    
    try {

        //! n me pergunte, pedi ajuda pro gpt
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
        headers: { 'Content-Type': 'application/json' },
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
        });
        setEditTarefa(null);

    } catch (error) {
        console.error('Erro:', error);
    }
    };

    // Função para deletar tarefa
    const handleDelete = async (id: number) => {
    try {
        // vai tentar deletar a tarefa usando o id
        const response = await fetch(`/api/routesNomes?id=${id}`, {
        method: 'DELETE',
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
        // vai tentar deletar as tarefas concluídas
        const response = await fetch('/api/routesNomes', {
        method: 'DELETE',
        });
        
        if (!response.ok) throw new Error('Erro ao deletar tarefas concluídas');
        
        fetchTasks();
    } catch (error) {
        console.error('Erro:', error);
    }
    };

    //! fiz meio por cima, fiquei meio perdido na hr de mexer tão diretamente com a ui
    const MudaCheckTarefa = async (task: Tarefa) => {
    const NovoCheck = { ...task, check: !task.check };

    try {
        // usa um patch só pra mudar o check
        const response = await fetch(`/api/routesNomes?id=${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
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

    //! faz entrar no modo tarefa, muda toda a interface da task para a tarefa anterior (front end?)
    //! deixar pra eles fazerem?
    const modoEdit = (task: Tarefa, setForm: Function) => {
    setEditTarefa(task);
    setForm({
        titulo: task.titulo,
        descricao: task.desc,
        prioridade: task.prioridade,
        date: task.date.slice(0, 16),
    });
    };

    // implementar a lógica de filtragem
    // const filteredTasks = tarefas
    //   .filter();

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
    };

}