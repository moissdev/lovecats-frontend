'use client';

import { useState, useEffect } from 'react';
import { CatFact, HistoryItem } from '@/types';
import Image from 'next/image'
import gatoIzq from '../../public/gato-izq.jpeg'
import gatoIzq2 from '../../public/gato-izq2.jpeg'
import gatoIzq3 from '../../public/gato-izq3.jpeg'
import gatoDer from '../../public/gato-der.jpeg'
import gatoDer2 from '../../public/gato-der2.jpeg'
import gatoDer3 from '../../public/gato-der3.jpeg'

export default function CatPage() {
  // Estados de las curiosidades (Actual y del historial)
  const [currentFact, setCurrentFact] = useState<CatFact | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  // Estados de "Cargando" y Error para UI
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL; // Puerto del backend

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
      setError('El Gato Mayor está durmiendo... Intenta de nuevo más tarde.');
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
    <div className="app-wrapper">
      {/* Imágen izquierda */}
      <aside className="side-cat hidden md:flex">
        <span className='cat-photo'>
          <Image src={gatoIzq} alt="Michi mago" />
          <Image src={gatoIzq2} alt="Michi arábico" />
          <Image src={gatoIzq3} alt="Michi fino" />
        </span>
      </aside>

      {/* Contenido central */}
      <main className="main-content">
        <h1 className="text-5xl font-bold mb-6">Lovecats</h1>

        <h2 className="text-2xl font-bold mb-6">De gatos para amantes de los gatos</h2>

        <section className="fact-display">
          {isLoading ? (
            <div className="skeleton"></div>
          ) : error ? (
            <div className="fact-card border-red-200 text-red-500">{error}</div>
          ) : currentFact ? (
            <div className="fact-card italic">
              &quot;{currentFact.fact}&quot;
            </div>
          ) : (
            <div className="fact-card text-gray-400">
              Presiona el botón para recibir sabiduría del Gato Mayor...
            </div>
          )}

          <button 
            className="cat-button"
            onClick={fetchNewFact} 
            disabled={isLoading}
          >
            {isLoading ? 'Jugando con estambre...' : '¡Nueva curiosidad!'}
          </button>
        </section>

        <section className="history-section">
          <h2 className="text-xl font-semibold mb-4">Curiosidades pasadas...</h2>
          <ul>
            {history.map((item) => (
              <li key={item.id} className="history-item shadow-sm">
                <small className="text-pink-400 block mb-1">
                  {new Date(item.created_at).toLocaleDateString()}
                </small>
                {item.fact_text}
              </li>
            ))}
          </ul>
        </section>
      </main>

      {/* Imágen derecha */}
      <aside className="side-cat hidden md:flex">
        <span>
          <Image src={gatoDer} alt="Michi fiestero" />
          <Image src={gatoDer2} alt="Michi fino" />
          <Image src={gatoDer3} alt="Michi fino" />
        </span>
      </aside>
    </div>
  );
}