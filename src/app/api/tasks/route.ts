import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { TaskCreateInput } from '@/types';

export async function GET() {
  try {
    const tasks = await db.tasks.getAll();
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar tarefas' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as TaskCreateInput;
    
    // Validação básica
    if (!body.title || !body.description || !body.date || !body.priority) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }
    
    const newTask = await db.tasks.create({
      ...body,
      completed: body.completed || false
    });
    
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    return NextResponse.json(
      { error: 'Falha ao criar tarefa' },
      { status: 500 }
    );
  }
}

