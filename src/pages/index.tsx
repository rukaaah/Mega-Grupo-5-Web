import { set } from 'date-fns';
import React, { useState } from 'react';

export default function Home() {

const [nome, setNome] = useState('');

  const criarTarefa = async (e: React.FormEvent) => {
    e.preventDefault();
    // evita q a pag recarregue

    try{
      // vai tentar fazer a requisição
      // se der erro, vai p catch
      const response = await fetch("/api/tarefas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
        })
    
      });

      if (!response.ok) {
        throw new Error('Erro ao criar tarefa');
      }
      // se a resposta não for ok, lança um erro

      const data = await response.json();
      setNome('');
      // limpa o input
    } catch (error) { console.error(error); }
    } 


  return(
    //html aqui
    <div>
      <h1>Pagina HOME</h1>

      <div>
      <h1>Cadastrar Nome</h1>
      <form onSubmit={criarTarefa}>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Digite um nome"
          required
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
    </div>
  )
}