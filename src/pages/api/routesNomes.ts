import { supabase, AuthUser } from '../../lib/supabase'; // Ajuste o caminho para seu lib/supabase
import { NextApiRequest, NextApiResponse } from 'next';
import { Tarefa } from '../../types/tarefa'; // Ajuste o caminho para seu types/tarefa

interface AuthenticatedRequest extends NextApiRequest {
    user: AuthUser;
}

const allowCors = (fn: Function) => async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173'); // Sua origem do frontend
  // Ou para testes, pode ser '*' mas não é recomendado para produção:
  // res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};


const withAuth = (handler: Function) => async (req: AuthenticatedRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Cabeçalho de autorização não fornecido' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido ou mal formatado' });
    }
  
    const { data: { user }, error } = await supabase.auth.getUser(token);
  
    if (error || !user) {
      return res.status(401).json({ error: error?.message || 'Token inválido ou expirado' });
    }
  
    req.user = user;
    return handler(req, res);
};
  
const getAuthenticatedUser = async (req: NextApiRequest): Promise<AuthUser> => {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new Error('Não autenticado: Cabeçalho de autorização ausente');
    
    const token = authHeader.split(' ')[1];
    if (!token) throw new Error('Não autenticado: Token ausente');
    
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
        console.error("Erro ao obter usuário autenticado com token:", error?.message);
        throw error || new Error('Usuário não encontrado ou token inválido');
    }
    return user;
};

async function getTarefas(req: AuthenticatedRequest, res: NextApiResponse) {
    try {
        const user = req.user; // Obtido pelo middleware withAuth
        const { 
            titulo, 
            prioridade, 
            desc,
            date, 
            ordenar, 
        } = req.query;

        let query = supabase
            .from('todoJubileu')
            .select('id, titulo, prioridade, desc, date, check, state')
            .eq('user_id', user.id);

        if (titulo) query = query.ilike('titulo', `%${String(titulo)}%`);
        if (desc) query = query.ilike('desc', `%${String(desc)}%`);
        if (prioridade) query = query.eq('prioridade', Number(prioridade));
        if (date) {
            const dataObj = new Date(date as string);
            const inicioDia = new Date(dataObj.getFullYear(), dataObj.getMonth(), dataObj.getDate()).toISOString();
            const fimDia = new Date(dataObj.getFullYear(), dataObj.getMonth(), dataObj.getDate(), 23, 59, 59, 999).toISOString();
            query = query.gte('date', inicioDia).lte('date', fimDia);
        }

        if (ordenar === 'alfabetica') {
            query = query.order('titulo', { ascending: true });
        } else {
            query = query
                .order('check', { ascending: true })
                .order('prioridade', { ascending: true })
                .order('date', { ascending: true });
        }

        const { data, error: dbError } = await query;

        if (dbError) throw dbError;
        return res.status(200).json(data);
    } catch (error: any) {
        console.error("Erro em getTarefas:", error.message);
        return res.status(500).json({ error: "Erro ao buscar tarefas", details: error.message });
    }
}

async function postTarefa(req: AuthenticatedRequest, res: NextApiResponse) {
    try {
        const user = req.user;
        const { titulo, descricao, prioridade, date, state, check }: Partial<Tarefa> = req.body;

        if (!titulo || prioridade == null) {
            return res.status(400).json({ error: "Título e prioridade são obrigatórios" });
        }
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        const dataHora = date || now.toISOString().slice(0, 16); 
 
        const { data, error: dbError } = await supabase
            .from('todoJubileu')
            .insert({
                titulo,
                desc: descricao,
                prioridade: Number(prioridade),
                check: check || false,
                state: state || 'To Do',
                date: dataHora,
                user_id: user.id
            })
            .select()
            .single(); // Espera-se que insira e retorne um único objeto

        if (dbError) throw dbError;
        return res.status(201).json(data);
    } catch (error: any) {
        console.error("Erro em postTarefa:", error.message);
        return res.status(500).json({ error: 'Erro ao inserir dados', details: error.message });
    }
}

async function deleteTarefa(req: AuthenticatedRequest, res: NextApiResponse) {
    try {
        const user = req.user;
        const id = req.query.id ? Number(req.query.id) : null;

        if (id) {
            const { data, error: dbError } = await supabase
                .from('todoJubileu')
                .delete()
                .eq('id', id)
                .eq('user_id', user.id)
                .select();

            if (dbError) throw dbError;
            if (!data || data.length === 0) {
                return res.status(404).json({ message: "Tarefa não encontrada ou não pertence ao usuário" });
            }
            return res.status(200).json({ message: "Tarefa deletada com sucesso" });
        } else {
            // Deletar tarefas concluídas (check: true) do usuário
            const { data, error: dbError } = await supabase
                .from('todoJubileu')
                .delete()
                .eq('check', true)
                .eq('user_id', user.id)
                .select();

            if (dbError) throw dbError;
            return res.status(200).json({ message: `${(data || []).length} tarefa(s) concluída(s) deletada(s)` });
        }
    } catch (err: any) {
        console.error("Erro em deleteTarefa:", err.message);
        return res.status(500).json({ error: "Erro ao deletar tarefa(s)", details: err.message });
    }
}

async function patchTarefa(req: AuthenticatedRequest, res: NextApiResponse) {
    const id = req.query.id ? Number(req.query.id) : null;
    if (!id) {
        return res.status(400).json({ error: "ID da tarefa é obrigatório para atualizar" });
    }

    const { titulo, descricao, prioridade, check, date, state }: Partial<Omit<Tarefa, 'desc'> & {descricao?: string}> = req.body;
    const user = req.user;

    const novoValor: any = {};
    if (titulo !== undefined) novoValor.titulo = titulo;
    if (descricao !== undefined) novoValor.desc = descricao; // API interna usa 'desc'
    if (prioridade !== undefined) novoValor.prioridade = Number(prioridade);
    if (check !== undefined) novoValor.check = check;
    if (date !== undefined) novoValor.date = date;
    if (state !== undefined) novoValor.state = state;

    if (Object.keys(novoValor).length === 0) {
        return res.status(400).json({ error: "Nenhum campo foi enviado para atualização" });
    }

    try {
        const { data, error: dbError } = await supabase
            .from('todoJubileu')
            .update(novoValor)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single(); // Espera-se que atualize e retorne um único objeto

        if (dbError) throw dbError;
        if (!data) {
             return res.status(404).json({ message: "Tarefa não encontrada ou nenhuma alteração necessária." });
        }
        return res.status(200).json(data);
    } catch (error: any) {
        console.error("Erro em patchTarefa:", error.message);
        return res.status(500).json({ error: "Erro ao atualizar tarefa", details: error.message });
    }
}

async function mainApiHandler(req: NextApiRequest, res: NextApiResponse) {
    const authenticatedHandler = withAuth(async function apiLogic(req: AuthenticatedRequest, res: NextApiResponse) {
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
                res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PATCH']);
                return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
        }
    });
    return authenticatedHandler(req as AuthenticatedRequest, res);
}

export default allowCors(mainApiHandler);