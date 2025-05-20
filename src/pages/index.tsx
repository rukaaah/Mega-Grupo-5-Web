import React, { useState, useEffect } from 'react';
import { useTarefas } from '@/hooks/useTarefa';


export default function Home() {
  // cria as consts q serão usadas no index
  const [procurarNome, setProcurarNome] = useState('');
  // consts necessarias no hook
  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    prioridade: 1,
    date: new Date().toISOString().split('T')[0],
    });

  // declara os metodos que foram exportados do hook
  const {
    tarefas,
    handleSubmit,
    handleDelete,
    handleDeleteCompletas,
    MudaCheckTarefa,
    modoEdit,
    editTarefa,
    setEditTarefa
  } = useTarefas();

  return (
    <div className="container">
      <h1>Lista de Tarefas do Sr. Jubileu</h1>
      
      {/* Formulário para adicionar/editar tarefas */}
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(form, setForm);
        }} className="task-form">
        <h2>{editTarefa ? 'Editar Tarefa' : 'Adicionar Tarefa'}</h2>
        
        <div className="form-group">
          <label>Título:</label>
          <input
            type="text"
            value={form.titulo}
            onChange={(e) => setForm({...form, titulo: e.target.value})}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Descrição:</label>
          <textarea
            value={form.descricao}
            onChange={(e) => setForm({...form, descricao: e.target.value})}
          />
        </div>
        
        <div className="form-group">
          <label>Prioridade:</label>
          <select
            value={form.prioridade}
            onChange={(e) => setForm({...form, prioridade: Number(e.target.value)})}
          >
            <option value={1}>Alta</option>
            <option value={2}>Média</option>
            <option value={3}>Baixa</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Data e hora:</label>
          <input
            type="datetime-local"
            value={form.date}
            onChange={(e) => setForm({...form, date: e.target.value})}
          />
        </div>
        
        <button type="submit">{editTarefa ? 'Atualizar' : 'Adicionar'}</button>
        {editTarefa && (
          <button type="button" onClick={() => setEditTarefa(null)}>Cancelar</button>
        )}
      </form>
      
      {/* Filtros e busca */}
      <div className="filters">
        <input
          type="text"
          placeholder="Buscar por título ou descrição..."
          value={procurarNome}
          onChange={(e) => setProcurarNome(e.target.value)}
        />
        {/* implementar logica de filtragem */}
        {/* <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
        >
          <option value="all">Todas as tarefas</option>
          <option value="high">Prioridade Alta</option>
          <option value="medium">Prioridade Média</option>
          <option value="low">Prioridade Baixa</option>
        </select> */}
        
        <button onClick={handleDeleteCompletas} className="delete-completed">
          Limpar concluídas
        </button>
      </div>
      
      {/* Lista de tarefas */}
      <div className="task-list">
        {tarefas.length === 0 ? (
          <p>Nenhuma tarefa encontrada</p>
        ) : (
          <ul>
            {tarefas.map(task => (
              <li key={task.id} className={`task-item ${task.check ? 'completed' : ''}`}>
                <div className="task-header">
                  {/* a checkbox n esta atualizando a ui certinho (parte feita com chat) */}
                  <input
                    type="checkbox"
                    checked={task.check}
                    onChange={() => MudaCheckTarefa(task)}
                  />
                  <h3>{task.titulo}</h3>
                  <span className={`priority-badge priority-${task.prioridade}`}>
                    {task.prioridade === 1 ? 'Alta' : task.prioridade === 2 ? 'Média' : 'Baixa'}
                  </span>
                  <span className="task-date">
                    {new Date(task.date).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="task-details">
                  <p>{task.desc}</p>
                  <div className="task-actions">
                    <button onClick={() => modoEdit(task, setForm)}>Editar</button>
                    <button onClick={() => handleDelete(task.id)} className="delete">
                      Excluir
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .task-form {
          background: #f5f5f5;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        
        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        
        .form-group textarea {
          min-height: 100px;
        }
        
        button {
          padding: 8px 16px;
          margin-right: 10px;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        button:hover {
          background: #005bb5;
        }
        
        .delete {
          background: #ff4444;
        }
        
        .delete:hover {
          background: #cc0000;
        }
        
        .delete-completed {
          background: #ff8800;
        }
        
        .delete-completed:hover {
          background: #cc6d00;
        }
        
        .filters {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        
        .filters input {
          flex: 1;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        
        .filters select {
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        
        .task-list ul {
          list-style: none;
          padding: 0;
        }
        
        .task-item {
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 10px;
        }
        
        .task-item.completed {
          opacity: 0.7;
          background: #f9f9f9;
        }
        
        .task-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }
        
        .task-header h3 {
          margin: 0;
          flex: 1;
        }
        
        .priority-badge {
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
          color: white;
        }
        
        .priority-1 { background: #ff4444; }
        .priority-2 { background: #ffbb33; }
        .priority-3 { background: #00C851; }
        
        .task-date {
          font-size: 14px;
          color: #666;
        }
        
        .task-details {
          padding-left: 30px;
        }
        
        .task-actions {
          margin-top: 10px;
          display: flex;
          gap: 10px;
        }
      `}</style>
    </div>
  );
}