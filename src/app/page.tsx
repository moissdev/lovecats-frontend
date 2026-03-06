'use client';

import { useState, useEffect } from 'react';
import { CatFact, HistoryItem } from '@/types';

export default function CatPage() {
  // Estados de las curiosidades (Actual y del historial)
  const [currentFact, setCurrentFact] = useState<CatFact | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  // Estados de "Cargando" y Error para UI
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const BACKEND_URL = 'http://localhost:3001/api'; // Puerto del backend

  // Llamada al Backend para obtener una curiosidad
  const fetchNewFact = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/fact`);
      if (!response.ok) throw new Error('Error al conectar con el servidor');
      
      const data: CatFact = await response.json();
      setCurrentFact(data);
      
      loadHistory();
    } catch {
      setError('No se pudo obtener la curiosidad. Intenta de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  // Llamada al Backend para obtener el historial de curiosidades
  const loadHistory = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/history`);
    if (!response.ok) {
      console.error('El backend ha devuelto un error');
      return; 
    }
    
    const data: HistoryItem[] = await response.json();
    if (Array.isArray(data)) {
      setHistory(data);
    }
  } catch (err) {
    console.error('Error al cargar el historial:', err);
  }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <main className="container">
      <h1>Curiosidades curiosas de los michis :3</h1>

      {/* SECCIÓN: SUCCESS / LOADING / ERROR */}
      <section className="main-display">
        {isLoading ? (
          <div className="w-full h-24 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">Cargando la michicuriosidad...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : currentFact ? (
          <div className="fact-card">
            <p>{currentFact.fact}</p>
          </div>
        ) : (
          <p>Nueva michicuriosidad</p>
        )}

        <button onClick={fetchNewFact} disabled={isLoading}>
          {isLoading ? 'Buscando...' : 'Obtener nueva curiosidad'}
        </button>
      </section>

      <hr />

      {/* SECCIÓN: HISTORIAL */}
      <section className="history-section">
        <h2>Historial de michicuriosidades</h2>
        <ul>
          {history.map((item) => (
            <li key={item.id}>
              <small>{new Date(item.created_at).toLocaleDateString()}:</small>
              <p>{item.fact_text}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}