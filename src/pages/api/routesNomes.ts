import { supabase } from '@/lib/supabase';
import { asyncWrapProviders } from 'async_hooks';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

interface Tarefa {
    titulo: string;
    descricao: string;
    prioridade: number;
    // são os campos que tem na tabela tarefas
    // criei um tipo para facilitar o uso
}



//! coloquei tarefa como uma variavel padrão para ser alterada depois no desenvolvimento

export default async function handler(
    req:NextApiRequest,
    res: NextApiResponse
) {
    console.log(`Método ${req.method} recebido`);
    if (req.method === 'GET') {
        // ! metodo a ser setado
        return res.status(200).json({ message: "Use POST para criar tarefas" });
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
                    descricao,
                    prioridade,
                // insere os dados na tabela todoJubileu
                }).select();
            // e retorna os dados inseridos

            if (error) throw error;
            // se der erro, lança o erro
            res.status(201).json(data);
            // retorna os dados inseridos
            
        }  catch (error) {
            console.error("Erro ao inserir dados:", error);
            res.status(500).json({ error: 'Erro ao inserir dados' });
    }

    }
    if (req.method === 'DELETE') {
        // ! metodo a ser setado
        return res.status(200).json({ message: "Use POST para criar tarefas" });
    }
    if (req.method === 'PUT') {
        // ! metodo a ser setado
        return res.status(200).json({ message: "Use POST para criar tarefas" });
    }
    console.log("Método não permitido:", req.method); // Aparecerá no terminal
    res.status(405).json({ error: "Método não permitido" });
    // return res.status(405).json({ message: 'Method not allowed' });
}