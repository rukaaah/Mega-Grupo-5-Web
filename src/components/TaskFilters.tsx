import React from 'react';
import styles from '@/styles/Home.module.css';

type TaskFiltersProps = {
  filtros: {
    titulo: string;
    prioridade: string;
    data: string;
    descricao: string;
    ordenar: string;
    };
    setFiltros: React.Dispatch<React.SetStateAction<any>>;
    aplicarFiltros: (filtros: any) => void;
    limparFiltros: (setFiltros: React.Dispatch<React.SetStateAction<any>>) => void;
    handleDeleteCompletas: () => void;
};

const TaskFilters: React.FC<TaskFiltersProps> = ({ 
  filtros, 
  setFiltros, 
  aplicarFiltros, 
  limparFiltros, 
  handleDeleteCompletas 
}) => {
  return (
    <div className={styles.taskFilters}>
      <h2 className={styles.sectionTitle}>Filtrar Tarefas</h2>
      
      <div className={styles.filterGroup}>
        <div className={styles.formGroup}>
          <label htmlFor="filter-titulo" className={styles.label}>
            Por título
          </label>
          <input
            id="filter-titulo"
            type="text"
            placeholder="Filtrar por título"
            value={filtros.titulo}
            onChange={(e) => setFiltros({...filtros, titulo: e.target.value})}
            className={styles.input}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="filter-descricao" className={styles.label}>
            Por descrição
          </label>
          <input
            id="filter-descricao"
            type="text"
            placeholder="Filtrar por descrição"
            value={filtros.descricao}
            onChange={(e) => setFiltros({...filtros, descricao: e.target.value})}
            className={styles.input}
          />
        </div>
        
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="filter-prioridade" className={styles.label}>
              Prioridade
            </label>
            <select
              id="filter-prioridade"
              value={filtros.prioridade}
              onChange={(e) => setFiltros({...filtros, prioridade: e.target.value})}
              className={styles.select}
            >
              <option value="">Todas</option>
              <option value="1">Alta</option>
              <option value="2">Média</option>
              <option value="3">Baixa</option>
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="filter-data" className={styles.label}>
              Data
            </label>
            <input
              id="filter-data"
              type="date"
              value={filtros.data}
              onChange={(e) => setFiltros({...filtros, data: e.target.value})}
              className={styles.input}
            />
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="filter-ordenar" className={styles.label}>
            Ordenar por
          </label>
          <select
            id="filter-ordenar"
            value={filtros.ordenar}
            onChange={(e) => setFiltros({...filtros, ordenar: e.target.value})}
            className={styles.select}
          >
            <option value="padrao">Padrão</option>
            <option value="alfabetica">Ordem alfabética</option>
          </select>
        </div>
        
        <div className={styles.filterActions}>
          <button
            type="button"
            onClick={(e) => aplicarFiltros(filtros)}
            className={styles.primaryButton}
          >
            Aplicar Filtros
          </button>
          
          <button
            type="button"
            onClick={(e) => limparFiltros(setFiltros)}
            className={styles.secondaryButton}
          >
            Limpar
          </button>
        </div>
        
        <button
          type="button"
          onClick={handleDeleteCompletas}
          className={styles.dangerButton}
        >
          Limpar Tarefas Concluídas
        </button>
      </div>
    </div>
  );
};

export default TaskFilters;