export interface Tarefa {
    id: number;
    titulo: string;
    desc: string;
    prioridade: number;
    date: string;
    state: string;
    check?: boolean;
  }