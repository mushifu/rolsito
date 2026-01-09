'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [user, setUser] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(storedUser);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const wait = new Promise(res => setTimeout(res, 2000));
    const login = supabase
        .from('Usuario')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();
    const [{ data, error }] = await Promise.all([login, wait]); // espera mínimo 2s

    if (error || !data) {
      setError('Usuario o contraseña incorrecta');
    } else {
      setUser(data.username);
      localStorage.setItem('user', data.username);
      setError('');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setUsername('');
    setPassword('');
  };

  return (
    <div className="crt bg-black text-green-400 font-mono min-h-screen flex items-center justify-center">
      {/* Contenedor interno para controlar columna y gap */}
      <div className="flex flex-col items-center justify-center gap-4 max-w-xs">
        {!user ? (
          <>
            <h1 className="text-4xl animate-flicker mb-2">BIENVENIDO/A</h1>
            <form onSubmit={handleLogin} className="flex flex-col gap-4 vgap ">
              <input
                className="bg-black border border-green-400 px-3 py-2 text-green-400 placeholder-green-600 outline-none font-mono"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                className="bg-black border border-green-400 px-3 py-2 text-green-400 placeholder-green-600 outline-none font-mono"
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="submit"
                className="border border-green-400 px-4 py-2 hover:bg-green-400 hover:text-black transition-colors font-mono"
              >
                Entrar
              </button>
              {loading && (
                <div className="thinking text-green-400 font-mono mt-2">
                  Procesando<span>.</span><span>.</span><span>.</span>
                </div>
              )}
            </form>
            {error && <p className="mt-2 text-red-600 font-mono">{error}</p>}
          </>
        ) : (
          <>
            <h1 className="text-5xl animate-flicker mb-4">HOLA {user}!</h1>
            <button
              onClick={handleLogout}
              className="border border-green-400 px-4 py-2 hover:bg-green-400 hover:text-black transition-colors font-mono"
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </div>
  );
}
