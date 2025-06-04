import React, { useState } from 'react';
import { useTarefas } from '@/hooks/useTarefa';
import { useSign } from '@/hooks/useSign';
import { Tarefa } from '@/types/tarefa';
import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import TaskForm from '@/components/TaskForm';
import TaskFilters from '@/components/TaskFilters';
import TaskList from '@/components/TaskList';
import EditOverlay from '@/components/EditOverlay';

export default function Home() {
  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    prioridade: 1,
    state: 'To Do',
    date: new Date().toISOString().slice(0, 16),
  });

  const [filtros, setFiltros] = useState({
    titulo: '',
    prioridade: '',
    data: '',
    descricao: '',
    ordenar: 'padrao'
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = (task: Tarefa) => {
    modoEdit(task, setForm);
    setIsEditing(true);
  };

  const { signOut, UserEmail } = useSign();
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
    <div className={styles.container}>
      <Head>
        <title>Lista de Tarefas | Sr. Jubileu</title>
      </Head>

      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Lista de Tarefas do Sr. Jubileu</h1>
          <div className={styles.userEmail}>
            <p>{UserEmail}</p>
          </div>
          <button 
            onClick={signOut}
            className={styles.logoutButton}
          >
            Sair
          </button>
        </div>
      </header>
      {isEditing && (
      <EditOverlay onClose={() => {
        setEditTarefa(null);
        setIsEditing(false);
      }}>
        <TaskForm
          form={form}
          setForm={setForm}
          editTarefa={editTarefa}
          setEditTarefa={(t) => {
            setEditTarefa(t);
            if (!t) setIsEditing(false);
          }}
          handleSubmit={(form) => {
            handleSubmit(form, setForm, filtros);
            setIsEditing(false);
          }}
        />
      </EditOverlay>
    )}
      <main className={styles.main}>
        <div className={styles.grid}>
          {/* Coluna esquerda - Formulário e Filtros */}
          <div className={styles.leftColumn}>
            <TaskForm
              form={form}
              setForm={setForm}
              editTarefa={editTarefa}
              setEditTarefa={setEditTarefa}
              handleSubmit={(form) => handleSubmit(form, setForm, filtros)}
            />
            
            <TaskFilters 
              filtros={filtros}
              setFiltros={setFiltros}
              aplicarFiltros={aplicarFiltros}
              limparFiltros={limparFiltros}
              handleDeleteCompletas={handleDeleteCompletas}
            />
          </div>
          
          {/* Coluna direita - Lista de tarefas */}
          <div className={styles.rightColumn}>
            
            <TaskList 
              tarefas={tarefas}
              agruparState={agruparState}
              MudaCheckTarefa={MudaCheckTarefa}
              fetchTasks={fetchTasks}
              // modoEdit={(task) => modoEdit(task, setForm)}
              modoEdit={handleEditClick}
              handleDelete={handleDelete}
            />
          </div>
        </div>
      </main>
    </div>
  );
}