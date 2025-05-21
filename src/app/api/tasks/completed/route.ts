import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function DELETE() {
  try {
    const deleted = await db.tasks.deleteCompleted();
    
    return NextResponse.json({ success: deleted });
  } catch (error) {
    console.error('Erro ao excluir tarefas concluídas:', error);
    return NextResponse.json(
      { error: 'Falha ao excluir tarefas concluídas' },
      { status: 500 }
    );
  }
}