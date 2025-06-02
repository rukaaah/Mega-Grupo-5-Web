import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthError } from '@supabase/supabase-js';
import { Router, useRouter } from 'next/router';

export function useSign() {
    const router = useRouter();
    const [session, setSession] = useState(null);
    const [error, setError] = useState<string | null>(null);

    // Verifica a sessão atual do usuário
    // handleauth('login ou signup', { email, password })
    const handleAuth = async (type: 'login' | 'signup', credentials: { email: string, password: string }) => {
        try {
        setError(null);
        const { data, error } = type === 'login'
            ? await supabase.auth.signInWithPassword(credentials)
            : await supabase.auth.signUp(credentials);

        if (error) throw error;
        router.push('/');
        return data;
        } catch (error) {
        setError(error instanceof AuthError ? error.message : 'Erro desconhecido');
        throw error;
        }
    };

    // desloga o usuário e redireciona para a página de login
    const signOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        setSession(null);
    };

    return {
        session,
        error,
        handleAuth,
        signOut
    };
}