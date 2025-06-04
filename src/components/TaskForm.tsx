import React from 'react';
import styles from '@/styles/Home.module.css';
// import { Tarefa } from '@/types/tarefa';

interface tipoTarefa {
    titulo: string,
    descricao: string,
    prioridade: number,
    state: string
    date: string,
}
  
type TaskFormProps = {
    form: tipoTarefa;
    setForm: React.Dispatch<React.SetStateAction<tipoTarefa>>;
    editTarefa: any;
    setEditTarefa: React.Dispatch<React.SetStateAction<any>>;
    handleSubmit: (form: tipoTarefa, setForm: React.Dispatch<React.SetStateAction<tipoTarefa>>) => void;
  };

const TaskForm: React.FC<TaskFormProps> = ({ form, setForm, editTarefa, setEditTarefa, handleSubmit }) => {
  return (
    <div className={styles.taskForm}>
      <h2 className={styles.sectionTitle}>
        {editTarefa ? 'Editar Tarefa' : 'Adicionar Nova Tarefa'}
      </h2>
      
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(form, setForm);
      }}>
        <div className={styles.formGroup}>
          <label htmlFor="titulo" className={styles.label}>
            Título *
          </label>
          <input
            id="titulo"
            type="text"
            value={form.titulo}
            onChange={(e) => setForm({...form, titulo: e.target.value})}
            className={styles.input}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="descricao" className={styles.label}>
            Descrição
          </label>
          <textarea
            id="descricao"
            value={form.descricao}
            onChange={(e) => setForm({...form, descricao: e.target.value})}
            rows={3}
            className={styles.textarea}
          />
        </div>
        
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="prioridade" className={styles.label}>
              Prioridade
            </label>
            <select
              id="prioridade"
              value={form.prioridade}
              onChange={(e) => setForm({...form, prioridade: Number(e.target.value)})}
              className={styles.select}
            >
              <option value={1}>Alta</option>
              <option value={2}>Média</option>
              <option value={3}>Baixa</option>
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="state" className={styles.label}>
              Estado
            </label>
            <select
              id="state"
              value={form.state}
              onChange={(e) => setForm({...form, state: e.target.value})}
              className={styles.select}
            >
              <option value="To Do">To Do</option>
              <option value="Doing">Doing</option>
              <option value="Done">Done</option>
              <option value="Backlog">Backlog</option>
              <option value="Stopped">Stopped</option>
            </select>
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="date" className={styles.label}>
            Data e Hora
          </label>
          <input
            id="date"
            type="datetime-local"
            value={form.date}
            onChange={(e) => setForm({...form, date: e.target.value})}
            className={styles.input}
          />
        </div>
        
        <div className={styles.formActions}>
          <button
            type="submit"
            className={styles.primaryButton}
          >
            {editTarefa ? 'Atualizar' : 'Adicionar'}
          </button>
          
          {editTarefa && (
            <button
              type="button"
              onClick={() => setEditTarefa(null)}
              className={styles.secondaryButton}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TaskForm;