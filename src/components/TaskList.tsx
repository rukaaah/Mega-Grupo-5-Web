import React from 'react';
import styles from '@/styles/Home.module.css';
import { Tarefa } from '@/types/tarefa';

type TaskListProps = {
    tarefas: Tarefa[];
    agruparState: (tarefas: Tarefa[]) => { [state: string]: Tarefa[] };
    MudaCheckTarefa: (tarefa: Tarefa) => Promise<void>;
    fetchTasks: () => void;
    modoEdit: (tarefa: Tarefa) => void;
    handleDelete: (id: number) => void;
  };

const TaskList: React.FC<TaskListProps> = ({ 
  tarefas, 
  agruparState, 
  MudaCheckTarefa, 
  fetchTasks, 
  modoEdit, 
  handleDelete 
}) => {
  const stateColors: any = {
    'To Do': 'stateTodo',
    'Doing': 'stateDoing',
    'Done': 'stateDone',
    'Backlog': 'stateBacklog',
    'Stopped': 'stateStopped'
  };

  return (
    <div className={styles.taskList}>
      {tarefas.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Nenhuma tarefa encontrada</p>
        </div>
      ) : (
        <div className={styles.taskGroups}>
          {Object.entries(agruparState(tarefas)).map(([state, tasks]) => (
            <div key={state} className={styles.taskGroup}>
              <div className={`${styles.stateBadge} ${styles[stateColors[state]]}`}>
                {state}
              </div>
              
              <div className={styles.tasksContainer}>
                {tasks.map(task => (
                  <div 
                    key={task.id} 
                    className={`${styles.taskItem} ${task.check ? styles.taskCompleted : ''}`}
                  >
                    <div className={styles.taskHeader}>
                      <input
                        type="checkbox"
                        checked={(task.check as boolean)}
                        onChange={async () => {await MudaCheckTarefa(task); fetchTasks();}}
                        className={styles.taskCheckbox}
                      />
                      
                      <div className={styles.taskContent}>
                        <h3 className={task.check ? styles.taskCompletedText : ''}>
                          {task.titulo}
                        </h3>
                        {task.desc && (
                          <p className={task.check ? styles.taskCompletedText : ''}>
                            {task.desc}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className={styles.taskMeta}>
                      <span className={`${styles.priorityBadge} ${
                        task.prioridade === 1 ? styles.priorityHigh :
                        task.prioridade === 2 ? styles.priorityMedium :
                        styles.priorityLow
                      }`}>
                        {task.prioridade === 1 ? 'Alta' : task.prioridade === 2 ? 'Média' : 'Baixa'}
                      </span>
                      
                      <span className={styles.taskDate}>
                        {new Date(task.date).toLocaleDateString('pt-BR')} às {new Date(task.date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    
                    <div className={styles.taskActions}>
                      <button
                        onClick={() => modoEdit(task)}
                        className={styles.editButton}
                      >
                        Editar
                      </button>
                      
                      <button
                        onClick={() => handleDelete(task.id)}
                        className={styles.deleteButton}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;