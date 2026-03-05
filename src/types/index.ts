// Interfaz de la curiosidad

export interface CatFact {
  fact: string;
  length: number;
}

// Interfaz de un registro de curiosidad del historial
export interface HistoryItem {
  id: number;
  fact_text: string;
  created_at: string;
}
