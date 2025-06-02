import React, { useState, useEffect } from 'react';
import { useTarefas } from '@/hooks/useTarefa';
import { useSign } from '@/hooks/useSign';
import { sign } from 'crypto';


export default function Home() {
  // cria as consts q serão usadas no index
  const [procurarNome, setProcurarNome] = useState('');
  // consts necessarias no hook
  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    prioridade: 1,
    state: '',
    date: new Date().toISOString().split('T')[0],
    });

  const [filtros, setFiltros] = useState({
    titulo: '',
    prioridade: '',
    data: '',
    descricao: '',
    ordenar: 'padrao'
    });
  
  // declara os metodos que foram exportados do hook
  const { signOut } = useSign();

  const {
    tarefas,
    handleSubmit,
    handleDelete,
    handleDeleteCompletas,
    MudaCheckTarefa,
    modoEdit,
    editTarefa,
    setEditTarefa,
    fetchTasks,
    aplicarFiltros,
    limparFiltros,
    agruparState
  } = useTarefas();


  return (
    
    <div className="container">
      <h1>Lista de Tarefas do Sr. Jubileu</h1>
      
      {/* Formulário de tarefa */}
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

        <div className="form-group">
          <label>Estado:</label>
          <select
            value={form.state}
            onChange={(e) => setForm({...form, state: e.target.value})}
          >
            <option value="To Do">To Do</option>
            <option value="Doing">Doing</option>
            <option value="Done">Done</option>
            <option value="Backlog">Backlog</option>
            <option value="Stopped">Stopped</option>
          </select>
        </div>

        <button type="submit">{editTarefa ? 'Atualizar' : 'Adicionar'}</button>
        {editTarefa && (
          <button type="button" onClick={() => setEditTarefa(null)}>Cancelar</button>
        )}
      </form>
      
      {/* Filtros */}
      <div className="filters">
        <input
          type="text"
          placeholder="Filtrar por título"
          value={filtros.titulo}
          onChange={(e) => setFiltros({...filtros, titulo: e.target.value})}
        />
        
        <input
          type="text"
          placeholder="Filtrar por descrição"
          value={filtros.descricao}
          onChange={(e) => setFiltros({...filtros, descricao: e.target.value})}
        />
        
        <select
          value={filtros.prioridade}
          onChange={(e) => setFiltros({...filtros, prioridade: e.target.value})}
        >
          <option value="">Todas prioridades</option>
          <option value="1">Alta</option>
          <option value="2">Média</option>
          <option value="3">Baixa</option>
        </select>
        
        <input
          type="date"
          value={filtros.data}
          onChange={(e) => setFiltros({...filtros, data: e.target.value})}
        />
        
        <select
          value={filtros.ordenar}
          onChange={(e) => setFiltros({...filtros, ordenar: e.target.value as 'padrao' | 'alfabetica'})}
        >
          <option value="padrao">Ordenação padrão</option>
          <option value="alfabetica">Ordem alfabética</option>
        </select>
        
        <button onClick={(e) => aplicarFiltros(filtros)}>Aplicar Filtros</button>
        <button onClick={(e) => limparFiltros(setFiltros)}>Limpar Filtros</button>
        <button onClick={handleDeleteCompletas} className="delete-completed">
          Limpar concluídas
        </button>
      </div>
      
      {/* Lista de tarefas */}
      <div className="task-list">
      {tarefas.length === 0 ? (
        <p>Nenhuma tarefa encontrada</p>
      ) : (
        Object.entries(agruparState(tarefas)).map(([state, tasks]) => (
          <div key={state} className="state-group">
            <h2>{state}</h2>
            <ul>
              {tasks.map(task => (
                <li key={task.id} className={`task-item ${task.check ? 'completed' : ''}`}>
                  <div className="task-header">
                    <input
                      type="checkbox"
                      checked={(task.check as boolean)}
                      onChange={async () => {await MudaCheckTarefa(task); fetchTasks();}}
                    />
                    <h3>{task.titulo}</h3>
                    <span className={`priority-badge priority-${task.prioridade}`}>
                      {task.prioridade === 1 ? 'Alta' : task.prioridade === 2 ? 'Média' : 'Baixa'}
                    </span>
                    <span className="task-date">
                      {new Date(task.date).toLocaleDateString('pt-BR')} às {new Date(task.date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  
                  <div className="task-details">
                    <p>{task.descricao}</p>
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
          </div>
        ))
      )}
      <button 
      onClick={signOut}
      className="logout-button"
      >
      Sair
    </button>
    </div>
      
      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        
        .task-form {
          background: #f5f5f5;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .task-form h2 {
          margin-top: 0;
          color: #333;
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
          color: #555;
        }
        
        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .form-group textarea {
          min-height: 100px;
          resize: vertical;
        }
        
        button {
          padding: 8px 16px;
          margin-right: 10px;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s;
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
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 20px;
          align-items: center;
        }
        
        .filters input,
        .filters select {
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          flex: 1;
          min-width: 150px;
        }
        
        .task-list ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .task-item {
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 10px;
          transition: all 0.2s;
        }
        
        .task-item:hover {
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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
          color: #333;
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
        
        .task-details p {
          margin: 5px 0;
          color: #555;
        }
        
        .task-actions {
          margin-top: 10px;
          display: flex;
          gap: 10px;
        }
        
        @media (max-width: 768px) {
          .filters {
            flex-direction: column;
          }
          
          .filters input,
          .filters select {
            width: 100%;
          }
          
          .task-header {
            flex-wrap: wrap;
          }
          
          .task-date {
            width: 100%;
            margin-top: 5px;
          }
        }
          .state-group {
            margin-bottom: 30px;
            border: 1px solid #eee;
            border-radius: 8px;
            padding: 15px;
          }

          .state-group h2 {
            margin-top: 0;
            padding-bottom: 10px;
            border-bottom: 1px solid #ddd;
            color: #333;
          }
      `}</style>
    </div>
  );
}