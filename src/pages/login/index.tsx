import { useSign } from '@/hooks/useSign';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Head from 'next/head';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleAuth, error } = useSign();
  const router = useRouter();

  return (
    <div className="login-container">
      <Head>
        <title>Login | Lista de Tarefas</title>
      </Head>
      
      <div className="auth-card">
        <div className="auth-header">
          <h1>Bem-vindo à Lista de Tarefas</h1>
          <p>Projeto desenvolvido para o PS Mega-Ufms 2025</p>
        </div>
        
        <div className="auth-form">
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
            />
          </div>
          
          <div className="form-group">
            <label>Senha:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="auth-buttons">
            <button 
              onClick={() => handleAuth('login', { email, password })}
              className="primary-button"
            >
              Entrar
            </button>
            <button 
              onClick={() => handleAuth('signup', { email, password })}
              className="secondary-button"
            >
              Criar conta
            </button>
          </div>
        </div>
    
      </div>
      
      <style jsx>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f5f7fa;
          padding: 20px;
        }
        
        .auth-card {
          width: 100%;
          max-width: 450px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .auth-header {
          padding: 30px;
          background: linear-gradient(135deg, #0070f3, #19b5fe);
          color: white;
          text-align: center;
        }
        
        .auth-header h1 {
          margin: 0 0 10px;
          font-size: 24px;
        }
        
        .auth-header p {
          margin: 0;
          opacity: 0.9;
          font-size: 14px;
        }
        
        .auth-form {
          padding: 30px;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #333;
          font-size: 14px;
        }
        
        .form-group input {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          transition: border 0.3s;
        }
        
        .form-group input:focus {
          outline: none;
          border-color: #0070f3;
          box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.1);
        }
        
        .auth-buttons {
          display: flex;
          gap: 15px;
          margin-top: 25px;
        }
        
        .primary-button {
          flex: 1;
          padding: 12px;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .primary-button:hover {
          background: #005bb5;
        }
        
        .secondary-button {
          flex: 1;
          padding: 12px;
          background: white;
          color: #0070f3;
          border: 1px solid #0070f3;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .secondary-button:hover {
          background: rgba(0, 112, 243, 0.05);
        }
        
        .error-message {
          margin-top: 15px;
          padding: 10px 15px;
          background: #ffebee;
          color: #c62828;
          border-radius: 6px;
          font-size: 14px;
        }
        
        .auth-footer {
          padding: 15px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-top: 1px solid #eee;
        }
        
        @media (max-width: 480px) {
          .auth-buttons {
            flex-direction: column;
          }
          
          .auth-header {
            padding: 20px;
          }
          
          .auth-form {
            padding: 20px;
          }
        }
      `}</style>
      
      <style global jsx>{`
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, 
            Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          background-color: #f5f7fa;
        }
        
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}