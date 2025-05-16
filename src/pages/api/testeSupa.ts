// import { supabase } from '@/lib/supabase';
// import { NextApiRequest, NextApiResponse } from 'next';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   // Teste de conexão + inserção
//   const { data, error } = await supabase
//     .from('Teste')
//     .insert([{ nome: "Teste de conexão" }])
//     .select();

//   if (error) {
//     console.error("Erro no Supabase:", error);
//     return res.status(500).json({ error: error.message });
//   }

//   console.log("Conexão OK! Dados inseridos:", data);
//   return res.status(200).json({ success: true, data });
// }
// ! teste de conexão com o supabase