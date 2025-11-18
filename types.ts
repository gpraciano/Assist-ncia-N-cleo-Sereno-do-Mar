export enum SessionType {
  PRIMEIRA_ESCALA = "Primeira Escala",
  SEGUNDA_ESCALA = "Segunda Escala",
  ESCALA_ANUAL = "Escala Anual",
  QUADRO_MESTRE = "Quadro de Mestre",
  INSTRUTIVA = "Instrutiva",
  CARATER_INSTRUTIVO = "Caráter Instrutivo",
  DIRECAO = "Direção",
  EXTRA = "Extra",
  ADVENTICIO = "Adventício",
}

export enum StockMovementType {
  ENTRADA = "Entrada",
  SAIDA = "Saída",
  AJUSTE = "Ajuste",
}

export interface ParticipantGrades {
  mestres: number;
  conselho: number;
  corpoInstrutivo: number;
  quadroDeSocios: number;
  visitantes: number;
  jovens: number;
}

export interface Vegetal {
  id: string;
  name: string;
  quantity: number; // in liters
  envaseDate?: string;
  master?: string;
  auxiliary?: string;
  messenger?: string;
  chacronaResp?: string;
  batidaoResp?: string;
  maririSpecies?: string;
  chacronaSpecies?: string;
}

export interface ConsumedVegetal {
  vegetalId: string;
  disponibilizada: number; // in liters
}

export interface Consumption {
  isUnited: boolean;
  vegetals: ConsumedVegetal[];
  totalConsumed: number; // in liters
}

export interface Session {
  id: string;
  date: string;
  type: SessionType;
  dirigente: string;
  explanator?: string;
  reader?: string;
  assistantMaster: string;
  chamadas: string;
  stories: string;
  hasPhotoRecording: boolean;
  hasAudioRecording: boolean;
  participants: ParticipantGrades;
  consumption: Consumption;
}

export type MovementType = 'Entrada' | 'Saída' | 'Ajuste' | 'Consumo em Sessão' | 'Saldo de Sessão';

export interface StockMovement {
  id: string;
  vegetalId: string;
  vegetalName: string;
  sessionId?: string;
  type: MovementType;
  quantity: number; // Amount for Entrada/Saída/Consumo/Saldo. For 'Ajuste', this is the CHANGE (delta).
  date: string; // ISO string
}