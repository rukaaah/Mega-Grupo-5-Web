import { supabase } from '@/lib/supabase';
import { NextApiRequest, NextApiResponse } from 'next';

interface Tarefa {
    titulo: string;
    descricao: string;
    prioridade: number;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    console.log(`Método ${req.method} recebido`);

    if (req.method === 'GET') {
        try {
            const { data, error } = await supabase
                .from('todoJubileu')
                .select('id, titulo, prioridade, desc');

            if (error) throw error;

            return res.status(200).json(data);
        } catch (error) {
            console.error("Erro ao buscar tarefas:", error);
            return res.status(500).json({ error: "Erro ao buscar tarefas" });
        }
    }

    if (req.method === 'POST') {
        try {
            const { titulo, descricao, prioridade }: Tarefa = req.body;

            if (!titulo || !prioridade) {
                console.error("Erro: Título e prioridade são obrigatórios");
                return res.status(400).json({ error: "Título e prioridade são obrigatórios" });
            }

            const { data, error } = await supabase
                .from('todoJubileu')
                .insert({
                    titulo,
                    desc: descricao,
                    prioridade,
                })
                .select();

            if (error) throw error;

            res.status(201).json(data);
        } catch (error) {
            console.error("Erro ao inserir dados:", error);
            res.status(500).json({ error: 'Erro ao inserir dados' });
        }
    }

    if (req.method === 'DELETE') {
        const id = req.query.id ? Number(req.query.id) : null; // verifica se id existe e converte pra number pra evitar erros

        if (!id) {
            return res.status(400).json({ error: "ID da tarefa é obrigatório" });
        }

        try {
            const { data, error } = await supabase
                .from('todoJubileu')
                .delete()
                .eq('id', Number(id))
                .select()

            if (error) throw error;

            if (!data || data.length === 0) {
                return res.status(404).json({ message: "Tarefa não encontrada" });
            }

            return res.status(200).json({ message: "Tarefa deletada com sucesso" });
        } catch (err) {
            return res.status(500).json({ error: "Erro ao deletar a tarefa" });
        }
    }

    if (req.method === 'PATCH') {
        const id = req.query.id ? Number(req.query.id) : null;
        const { titulo, descricao, prioridade } = req.body;

        if (!id) {
            return res.status(400).json({ error: "ID da tarefa é obrigatório para atualizar" });
        }

        const novoValor: any = {};
        if (titulo !== undefined) novoValor.titulo = titulo;
        if (descricao !== undefined) novoValor.desc = descricao;
        if (prioridade !== undefined) novoValor.prioridade = prioridade;
        
        if (Object.keys(novoValor).length === 0) {
            return res.status(400).json({ error: "Nenhum campo foi enviado para atualização" });
        }
        console.log('PATCH - id:', id, 'typeof:', typeof id);
        try {
            console.log(novoValor);
            const { data, error } = await supabase
                .from('todoJubileu')
                .update(novoValor)
                .eq('id', id)
                .select();

            console.log('Resultado do update:', data);

            if (error) throw error;

            if (data.length === 0) {
                return res.status(200).json({ message: "Nenhum dado foi alterado. Os valores enviados já estavam salvos." });
            }

            return res.status(200).json({ message: "Tarefa atualizada com sucesso" });
        } catch (error) {
            console.error("Erro ao atualizar tarefa:", error);
            return res.status(500).json({ error: "Erro ao atualizar tarefa" });
        }
    }

    console.log("Método não permitido:", req.method);
    res.status(405).json({ error: "Método não permitido" });
}
