import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zxrtjasxungnpcgxaoip.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4cnRqYXN4dW5nbnBjZ3hhb2lwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxODY0MDIsImV4cCI6MjA2Mjc2MjQwMn0.wR8ExVL3FY_TrQCPY274HHnZCXo40_v31X_uSK-xsXU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    // Configurações de persistência de sessão
    // e detecção de sessão na URL
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });

export type AuthUser = {
// Definição do tipo de usuário autenticado
    id: string;
    email?: string;
    user_metadata?: {
        name?: string;
    };
};