import { supabase } from '@/lib/supabase';
import { NextApiRequest, NextApiResponse } from 'next';

interface Tarefa {
    titulo: string;
    descricao: string;
    prioridade: number;
    date: string;
}

async function getTarefas(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { 
            titulo, 
            prioridade, 
            date, 
            desc,
            ordenar 
          } = req.query;

        let query = supabase
            .from('todoJubileu')
            .select('id, titulo, prioridade, desc, date, check')
            // seta uma query base para pegar os dados

        if (titulo) query = query.ilike('titulo', `%${titulo}%`); // vai pegar todos os titulos que contem o termo
        if (desc) query = query.ilike('desc', `%${desc}%`); // vai pegar todos os desc que contem o termo
        if (prioridade) query = query.eq('prioridade', Number(prioridade));  // vai pegar todos os que tem a prioridade exata
        if (date) {
            // pega todas as tarefas do dia
            const dataObj = new Date(date as string);
            console.log("Data recebida:", dataObj);

            // usar sethours tava mudando o fuso horario, ent resolvi somar 23:59
            const inicioDia = new Date(dataObj).toISOString().slice(0, 16);
            const fimDia = new Date(dataObj.getTime() + 86340000).toISOString().slice(0, 16);

            query = query
                .gte('date', inicioDia)
                .lte('date', fimDia);
                // pega datas menores que o fim do dia e maiores que o inicio do dia
            }

        if (ordenar === 'alfabetica') {
            query = query.order('titulo', { ascending: true }); // Ordena alfabeticamente
        } else {
            query = query
                .order('check', { ascending: true }) // Não concluídas primeiro
                .order('prioridade', { ascending: true }) // dentro das n concluidas prioridade mais alta primeiro
                .order('date', { ascending: true }); // dentro das n concluidas e prio mais alta data mais próxima primeiro
        }

        const { data, error } = await query;


        if (error) throw error;
        return res.status(200).json(data);
    } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
        return res.status(500).json({ error: "Erro ao buscar tarefas" });
    }
}

async function postTarefa(req: NextApiRequest, res: NextApiResponse) {
    const { titulo, descricao, prioridade, date }: Tarefa = req.body;

    if (!titulo || !prioridade) {
        return res.status(400).json({ error: "Título e prioridade são obrigatórios" });
    }
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); //! Corrige para local
    const dataHora = date || now.toISOString().slice(0, 16); //! tava errando o horario, fiz aceitar exatamente a entrada
    //! porem se viesse vazio erraria o tbm, ent fiz uma conta com base na timezone
    try {
        const { data, error } = await supabase
            .from('todoJubileu')
            .insert({
                titulo,
                desc: descricao,
                prioridade,
                check: false,
                date: dataHora,
            })
            .select();

        console.log("Dados inseridos:", dataHora); 
        if (error) throw error;
        return res.status(201).json(data);
    } catch (error) {
        console.error("Erro ao inserir dados:", error);
        return res.status(500).json({ error: 'Erro ao inserir dados' });
    }
}

async function deleteTarefa(req: NextApiRequest, res: NextApiResponse) {
    const id = req.query.id ? Number(req.query.id) : null;

    try {
        if (id) {
            const { data, error } = await supabase
                .from('todoJubileu')
                .delete()
                .eq('id', id)
                .select();

            if (error) throw error;
            if (!data || data.length === 0) {
                return res.status(404).json({ message: "Tarefa não encontrada" });
            }

            return res.status(200).json({ message: "Tarefa deletada com sucesso" });
        } else {
            const { data, error } = await supabase
                .from('todoJubileu')
                .delete()
                .eq('check', true)
                .select();

            if (error) throw error;
            return res.status(200).json({ message: `${data.length} tarefa(s) concluída(s) deletada(s)` });
        }
    } catch (err) {
        console.error("Erro ao deletar tarefa(s):", err);
        return res.status(500).json({ error: "Erro ao deletar tarefa(s)" });
    }
}

async function patchTarefa(req: NextApiRequest, res: NextApiResponse) {
    const id = req.query.id ? Number(req.query.id) : null;
    const { titulo, descricao, prioridade, check, date } = req.body;

    if (!id) {
        return res.status(400).json({ error: "ID da tarefa é obrigatório para atualizar" });
    }

    const novoValor: any = {};
    if (titulo !== undefined) novoValor.titulo = titulo;
    if (descricao !== undefined) novoValor.desc = descricao;
    if (prioridade !== undefined) novoValor.prioridade = prioridade;
    if (check !== undefined) novoValor.check = check;
    if (date !== undefined) novoValor.date = date;

    if (Object.keys(novoValor).length === 0) {
        return res.status(400).json({ error: "Nenhum campo foi enviado para atualização" });
    }

    try {
        const { data, error } = await supabase
            .from('todoJubileu')
            .update(novoValor)
            .eq('id', id)
            .select();

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


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            return await getTarefas(req, res);
        case 'POST':
            return await postTarefa(req, res);
        case 'DELETE':
            return await deleteTarefa(req, res);
        case 'PATCH':
            return await patchTarefa(req, res);
        default:
            console.log("Método não permitido:", req.method);
            return res.status(405).json({ error: "Método não permitido" });
    }
}