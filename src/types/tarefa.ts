export interface Tarefa {
  id: number;
  titulo: string;
  descricao: string;
  prioridade: number;
  state: string;
  date: string;
  check?: boolean;
  user_id?: string;
}

export type AuthUser = {
  // Definição do tipo de usuário autenticado
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
  };
};