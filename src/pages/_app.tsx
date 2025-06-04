import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { AuthError, Session } from '@supabase/supabase-js';
import '../styles/globals.css';
import styles from '@/styles/toast.module.css'
import { ToastContainer } from 'react-toastify';
const authError = {
  backgroundColor: '#f44336',
}

export default function App({ Component, pageProps }: AppProps) {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  useEffect(() => {
    // verifica a sessão atual do usuário
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session && !['/login'].includes(router.pathname)) {
        router.push('/login');
      }
    });

    // escuta mudanças de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (!session && !['/login'].includes(router.pathname)) {
        router.push('/login');
      }
      if (event === 'SIGNED_OUT') {
        router.push('/login');
      }
    });

    // limpa a assinatura quando o componente é desmontado
    return () => subscription.unsubscribe();
  }, []);
  // retorna a session para os componentes
  // retorna o container do toast
  return (
      <>
        <Component {...pageProps} session={session} />;
        <ToastContainer />
      </>
    );
}