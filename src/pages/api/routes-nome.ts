import { supabase } from '@/lib/supabase';
import { asyncWrapProviders } from 'async_hooks';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

interface Tarefa {
    id: number;
    created_at: string;
    nome: string;
    // são os campos que tem na tabela tarefas
    // criei um tipo para facilitar o uso
}

//! coloquei tarefa como uma variavel padrão para ser alterada depois no desenvolvimento

export default async function handler(
    req:NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        const { data } = await supabase.from('Teste').select('*');
        return res.status(200).json(data);
    }

    if (req.method === 'POST') {
        const { id, created_at, nome }: Tarefa = req.body;
        // extrai os dados do body da requisição
        // e coloca nas variáveis

        try {
            const { data, error } = await supabase
                .from('Teste')
                .insert({ 
                    id,
                    created_at,
                    nome,
                // insere os dados na tabela Teste
                }).select();
            // insere os dados na tabela Teste
            // e retorna os dados inseridos

            if (error) throw error;
            // se der erro, lança o erro
            res.status(201).json(data);
            // retorna os dados inseridos
            
        }  catch (error) {
            res.status(500).json({ error: 'Erro ao inserir dados' });
    }

    }
    if (req.method === 'DELETE') {
        const { id } = req.body;
        const { data } = await supabase.from('tarefas').delete().eq('id', id);
        return res.status(200).json(data);
    }
    if (req.method === 'PUT') {
        const { id, tarefa } = req.body;
        const { data } = await supabase.from('Teste').update({ tarefa }).eq('id', id);
        return res.status(200).json(data);
    }
    return res.status(405).json({ message: 'Method not allowed' });
    // return res.status(405).json({ message: 'Method not allowed' });
}