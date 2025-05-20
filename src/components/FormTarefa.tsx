// import React, { useState } from 'react';

// interface Props {
//   onTarefaCriada: () => void;
// }

// export default function FormTarefa({ onTarefaCriada }: Props) {
//   const [form, setForm] = useState({
//     titulo: '',
//     descricao: '',
//     prioridade: 1,
//   });

//   const criarTarefa = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await fetch("/api/routesNomes", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });
//       setForm({ titulo: '', descricao: '', prioridade: 1 });
//       onTarefaCriada();
//     } catch (err) {
//       console.error("Erro ao criar tarefa", err);
//     }
//   };

//   return (
//     <form onSubmit={criarTarefa}>
//       <input
//         type="text"
//         placeholder="Título"
//         value={form.titulo}
//         onChange={(e) => setForm({ ...form, titulo: e.target.value })}
//         required
//       />
//       <textarea
//         placeholder="Descrição"
//         value={form.descricao}
//         onChange={(e) => setForm({ ...form, descricao: e.target.value })}
//         required
//       />
//       <select
//         value={form.prioridade}
//         onChange={(e) => setForm({ ...form, prioridade: Number(e.target.value) })}
//       >
//         <option value={1}>Alta</option>
//         <option value={2}>Média</option>
//         <option value={3}>Baixa</option>
//       </select>
//       <button type="submit">Salvar Tarefa</button>
//     </form>
//   )
