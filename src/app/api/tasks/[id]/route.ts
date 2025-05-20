import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const task = await db.tasks.getById(params.id);
    
    if (!task) {
      return NextResponse.json(
        { error: 'Tarefa não encontrada' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(task);
  } catch (error) {
    console.error('Erro ao buscar tarefa:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar tarefa' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const body = await request.json();
    const updatedTask = await db.tasks.update(params.id, body);
    
    if (!updatedTask) {
      return NextResponse.json(
        { error: 'Tarefa não encontrada' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    return NextResponse.json(
      { error: 'Falha ao atualizar tarefa' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const deleted = await db.tasks.delete(params.id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Tarefa não encontrada' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir tarefa:', error);
    return NextResponse.json(
      { error: 'Falha ao excluir tarefa' },
      { status: 500 }
    );
  }
}