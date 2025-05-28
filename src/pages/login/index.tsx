import { useSign } from '@/hooks/useSign';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleAuth, error } = useSign();
  const router = useRouter();

  const onSubmit = async (type: 'login' | 'signup') => {
    try {
      await handleAuth(type, { email, password });
      router.push('/');
    } catch (error) {
      console.error(error);
    }
  };

    return (
        <div className="auth-container">
        <h2>Login/Cadastro</h2>
        <div className="form-group">
            <label>Email:</label>
            <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
        </div>
        <div className="form-group">
            <label>Senha:</label>
            <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
        </div>
        
        <div className="buttons">
            <button 
            onClick={() => handleAuth('login', { email, password })} 
            >
            Login
            </button>
            <button 
            onClick={() => handleAuth('signup', { email, password })} 
            >
            Cadastrar
            </button>
        </div>
        
        {error && <div className="error">{error}</div>}
    </div>
  );
}