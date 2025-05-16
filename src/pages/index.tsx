import { time } from 'console';
import { set } from 'date-fns';
import { title } from 'process';
import React, { useState } from 'react';

export default function Home() {

//? funções para as routes serem manipuladas no front-end
const [form, setForm] = useState({
  titulo: '',
  descricao: '',
  prioridade: 1,
  // valores padrões para a tabela tarefa
});

  const criarTarefa = async (e: React.FormEvent) => {
    e.preventDefault();
    // evita q a pag recarregue

    try{
      // vai tentar fazer a requisição
      // se der erro, vai p catch
      const response = await fetch("/api/routesNomes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form)
        // transforma o objeto em string
      });

      if (!response.ok) {
        throw new Error('Erro ao criar tarefa');
      }
      // se a resposta não for ok, lança um erro

      const data = await response.json();
      console.log("Tarefa criada:", data);

      setForm({
        titulo: '',
        descricao: '',
        prioridade: 1,
      });
      // limpa o input
    } catch (error) { console.error(error); console.log("Erro ao criar tarefa") }
    } 


  return(
    //html aqui
    //! para manipular os dados use as nomeclaturas do objeto form
    <form onSubmit={criarTarefa}>
      <input
        type="text"
        value={form.titulo}
        onChange={(e) => setForm({...form, titulo: e.target.value})}
        placeholder="Título"
        required
      />
      
      <textarea
        value={form.descricao}
        onChange={(e) => setForm({...form, descricao: e.target.value})}
        placeholder="Descrição"
        required
      />
      
      <select
        value={form.prioridade}
        onChange={(e) => setForm({...form, prioridade: Number(e.target.value)})}
      >
        <option value={1}>Alta</option>
        <option value={2}>Média</option>
        <option value={3}>Baixa</option>
      </select>
      
      <button type="submit">Salvar Tarefa</button>
    </form>
  )
}