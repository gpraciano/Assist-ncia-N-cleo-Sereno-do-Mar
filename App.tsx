

import React, { useState, useCallback, useMemo } from 'react';
import { Session, Vegetal, StockMovementType, SessionType, StockMovement, Consumption } from './types';
import SessionForm from './components/SessionForm';
import StockManager from './components/StockManager';
import Dashboard from './components/Dashboard';
import SessionHistory from './components/SessionHistory';
import SessionDetailModal from './components/SessionDetailModal';
import StockDetailModal from './components/StockDetailModal';
import FullHistoryModal from './components/FullHistoryModal';
import StockMovementHistoryModal from './components/StockMovementHistoryModal';
import SociosListModal from './components/SociosListModal';
import { Leaf, PlusCircle, Archive, LayoutDashboard, History, Menu } from 'lucide-react';

interface NavButtonProps {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    children: React.ReactNode;
}

// Fix: Explicitly type NavButton as a React.FC to aid TypeScript's type inference.
const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, children }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left font-medium rounded-md transition-colors ${
            active ? 'bg-sky-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`}
    >
        {icon}
        {children}
    </button>
);

const initialStockData: Vegetal[] = [
  { id: 'v1', name: 'Preparo 2023-01-10', quantity: 10, envaseDate: '2023-01-10', master: 'Mestre Gabriel', auxiliary: 'Auxiliar João', messenger: 'Mensageiro Paulo', chacronaResp: 'Responsável Maria', batidaoResp: 'Responsável Pedro', maririSpecies: 'Caupuri', chacronaSpecies: 'Folha Larga' },
  { id: 'v2', name: 'Preparo 2023-02-20', quantity: 10, envaseDate: '2023-02-20', master: 'Mestre Miguel', auxiliary: 'Auxiliar Tiago', messenger: 'Mensageiro André', chacronaResp: 'Responsável Ana', batidaoResp: 'Responsável Carlos', maririSpecies: 'Tucunacá', chacronaSpecies: 'Folha Fina' },
  { id: 'v3', name: 'Preparo 2023-03-05', quantity: 10, envaseDate: '2023-03-05', master: 'Mestre Rafael', auxiliary: 'Auxiliar Lucas', messenger: 'Mensageiro Carlos', chacronaResp: 'Responsável Joana', batidaoResp: 'Responsável Marcos', maririSpecies: 'Boliviano', chacronaSpecies: 'Cabocla' },
  { id: 'v4', name: 'Preparo 2023-04-15', quantity: 10, envaseDate: '2023-04-15', master: 'Mestre José', auxiliary: 'Auxiliar Felipe', messenger: 'Mensageiro Paulo', chacronaResp: 'Responsável Maria', batidaoResp: 'Responsável Pedro', maririSpecies: 'Caupuri', chacronaSpecies: 'Folha Fina' },
  { id: 'v5', name: 'Preparo 2023-05-25', quantity: 10, envaseDate: '2023-05-25', master: 'Mestre Joaquim', auxiliary: 'Auxiliar Marcos', messenger: 'Mensageiro André', chacronaResp: 'Responsável Ana', batidaoResp: 'Responsável Carlos', maririSpecies: 'Tucunacá', chacronaSpecies: 'Folha Larga' },
  { id: 'v6', name: 'Preparo 2024-06-12', quantity: 10, envaseDate: '2024-06-12', master: 'Mestre Gabriel', auxiliary: 'Auxiliar João', messenger: 'Mensageiro Carlos', chacronaResp: 'Responsável Joana', batidaoResp: 'Responsável Marcos', maririSpecies: 'Boliviano', chacronaSpecies: 'Cabocla' },
  { id: 'v7', name: 'Preparo 2024-07-01', quantity: 10, envaseDate: '2024-07-01', master: 'Mestre Miguel', auxiliary: 'Auxiliar Tiago', messenger: 'Mensageiro Paulo', chacronaResp: 'Responsável Maria', batidaoResp: 'Responsável Pedro', maririSpecies: 'Caupuri', chacronaSpecies: 'Folha Fina' },
  { id: 'v8', name: 'Preparo 2024-08-18', quantity: 10, envaseDate: '2024-08-18', master: 'Mestre Rafael', auxiliary: 'Auxiliar Lucas', messenger: 'Mensageiro André', chacronaResp: 'Responsável Ana', batidaoResp: 'Responsável Carlos', maririSpecies: 'Tucunacá', chacronaSpecies: 'Folha Larga' },
  { id: 'v9', name: 'Preparo 2024-09-30', quantity: 10, envaseDate: '2024-09-30', master: 'Mestre José', auxiliary: 'Auxiliar Felipe', messenger: 'Mensageiro Carlos', chacronaResp: 'Responsável Joana', batidaoResp: 'Responsável Marcos', maririSpecies: 'Boliviano', chacronaSpecies: 'Cabocla' },
  { id: 'v10', name: 'Preparo 2024-10-15', quantity: 10, envaseDate: '2024-10-15', master: 'Mestre Joaquim', auxiliary: 'Auxiliar Marcos', messenger: 'Mensageiro Paulo', chacronaResp: 'Responsável Maria', batidaoResp: 'Responsável Pedro', maririSpecies: 'Caupuri', chacronaSpecies: 'Folha Fina' }
];

const initialSessions: Omit<Session, 'id'>[] = [
    {
      date: '2024-10-20',
      type: SessionType.PRIMEIRA_ESCALA,
      dirigente: 'Mestre Gabriel',
      explanator: 'Mestre Miguel',
      reader: 'Mestre Rafael',
      assistantMaster: 'Mestre José',
      chamadas: 'Chamada 1, Chamada 2',
      stories: 'História A',
      hasPhotoRecording: true,
      hasAudioRecording: false,
      participants: { mestres: 5, conselho: 3, corpoInstrutivo: 10, quadroDeSocios: 20, visitantes: 2, jovens: 4 },
      consumption: {
        isUnited: false,
        vegetals: [{ vegetalId: 'v1', disponibilizada: 2 }],
        totalConsumed: 1.8,
      },
    },
    {
      date: '2024-10-27',
      type: SessionType.SEGUNDA_ESCALA,
      dirigente: 'Mestre Joaquim',
      explanator: 'Mestre Gabriel',
      reader: 'Mestre Miguel',
      assistantMaster: 'Mestre Rafael',
      chamadas: 'Chamada 3',
      stories: '',
      hasPhotoRecording: false,
      hasAudioRecording: true,
      participants: { mestres: 6, conselho: 4, corpoInstrutivo: 12, quadroDeSocios: 25, visitantes: 5, jovens: 3 },
      consumption: {
        isUnited: true,
        vegetals: [{ vegetalId: 'v2', disponibilizada: 1.5 }, { vegetalId: 'v3', disponibilizada: 1.5 }],
        totalConsumed: 2.5,
      },
    },
    {
      date: '2024-11-03',
      type: SessionType.PRIMEIRA_ESCALA,
      dirigente: 'Mestre José',
      explanator: 'Mestre Joaquim',
      reader: 'Mestre Gabriel',
      assistantMaster: 'Mestre Miguel',
      chamadas: 'Chamada 4, Chamada 5, Chamada 6',
      stories: 'História B',
      hasPhotoRecording: true,
      hasAudioRecording: true,
      participants: { mestres: 4, conselho: 2, corpoInstrutivo: 8, quadroDeSocios: 18, visitantes: 1, jovens: 2 },
      consumption: {
        isUnited: false,
        vegetals: [{ vegetalId: 'v4', disponibilizada: 1.8 }],
        totalConsumed: 1.7,
      },
    },
    {
      date: '2024-11-10',
      type: SessionType.INSTRUTIVA,
      dirigente: 'Mestre Rafael',
      explanator: 'Mestre José',
      reader: 'Mestre Joaquim',
      assistantMaster: 'Mestre Gabriel',
      chamadas: 'Chamada 7',
      stories: 'História C',
      hasPhotoRecording: false,
      hasAudioRecording: false,
      participants: { mestres: 7, conselho: 5, corpoInstrutivo: 15, quadroDeSocios: 30, visitantes: 8, jovens: 6 },
      consumption: {
        isUnited: true,
        vegetals: [{ vegetalId: 'v5', disponibilizada: 2.0 }, { vegetalId: 'v6', disponibilizada: 2.0 }],
        totalConsumed: 3.5,
      },
    },
    {
      date: '2024-11-17',
      type: SessionType.PRIMEIRA_ESCALA,
      dirigente: 'Mestre Miguel',
      explanator: 'Mestre Rafael',
      reader: 'Mestre José',
      assistantMaster: 'Mestre Joaquim',
      chamadas: 'Chamada 8, Chamada 9',
      stories: '',
      hasPhotoRecording: false,
      hasAudioRecording: true,
      participants: { mestres: 5, conselho: 3, corpoInstrutivo: 11, quadroDeSocios: 22, visitantes: 3, jovens: 5 },
      consumption: {
        isUnited: false,
        vegetals: [{ vegetalId: 'v7', disponibilizada: 2.2 }],
        totalConsumed: 2.0,
      },
    },
];

// This function processes the initial data to ensure consistency between sessions, stock, and movements.
const processInitialData = () => {
    const processedStock: Vegetal[] = JSON.parse(JSON.stringify(initialStockData)); // deep copy
    const movements: StockMovement[] = [];
    const sessionsWithIds: Session[] = initialSessions.map((s, i) => ({...s, id: `s-init-${i+1}`}));
    let nextBalanceId = initialStockData.length + 1;

    // Add initial 'Entrada' movements for the stock
    processedStock.forEach(v => {
        movements.push({
            id: `mov-init-entry-${v.id}`,
            vegetalId: v.id,
            vegetalName: v.name,
            type: 'Entrada',
            quantity: v.quantity,
            date: new Date(v.envaseDate || '2023-01-01').toISOString(),
        });
    });

    // Create a mutable copy of the stock for processing
    const stockToProcess: Vegetal[] = JSON.parse(JSON.stringify(initialStockData));
    const allStockItems: Vegetal[] = [...stockToProcess];

    // Sort sessions by date to process chronologically
    sessionsWithIds.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sessionsWithIds.forEach(session => {
        const { consumption } = session;
        let totalDisponibilizada = 0;
        
        consumption.vegetals.forEach(consumed => {
            const stockItem = stockToProcess.find(v => v.id === consumed.vegetalId);
            if(stockItem && stockItem.quantity >= consumed.disponibilizada) {
                stockItem.quantity -= consumed.disponibilizada;
                totalDisponibilizada += consumed.disponibilizada;
                movements.push({
                    id: `mov-${session.id}-${consumed.vegetalId}`,
                    vegetalId: consumed.vegetalId,
                    vegetalName: stockItem.name,
                    sessionId: session.id,
                    type: 'Consumo em Sessão',
                    quantity: consumed.disponibilizada,
                    date: new Date(session.date).toISOString(),
                });
            }
        });

        const balance = totalDisponibilizada - consumption.totalConsumed;
        if(balance > 0.0001) {
            const balanceName = `Saldo ${new Date(session.date).toLocaleDateString('pt-BR')} - ${session.type}`;
            const newBalanceItem: Vegetal = {
                id: `v${nextBalanceId++}`,
                name: balanceName,
                quantity: balance
            };
            stockToProcess.push(newBalanceItem);
            allStockItems.push(newBalanceItem);
            movements.push({
                id: `mov-balance-${session.id}`,
                vegetalId: newBalanceItem.id,
                vegetalName: newBalanceItem.name,
                sessionId: session.id,
                type: 'Saldo de Sessão',
                quantity: balance,
                date: new Date(session.date).toISOString(),
            });
        }
    });

    return {
        initialProcessedStock: stockToProcess,
        initialHistoricalStock: allStockItems,
        initialProcessedMovements: movements,
        initialProcessedSessions: sessionsWithIds
    };
};

const { initialProcessedStock, initialHistoricalStock, initialProcessedMovements, initialProcessedSessions } = processInitialData();

const App: React.FC = () => {
    const [view, setView] = useState<'dashboard' | 'form' | 'stock' | 'history'>('dashboard');
    const [sessions, setSessions] = useState<Session[]>(initialProcessedSessions);
    const [stock, setStock] = useState<Vegetal[]>(initialProcessedStock);
    const [historicalStockData, setHistoricalStockData] = useState<Vegetal[]>(initialHistoricalStock);
    const [stockMovements, setStockMovements] = useState<StockMovement[]>(initialProcessedMovements);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [editingSession, setEditingSession] = useState<Session | null>(null);
    const [editingStockItem, setEditingStockItem] = useState<Vegetal | null>(null);

    // Modals states
    const [viewingSession, setViewingSession] = useState<Session | null>(null);
    const [viewingStockItem, setViewingStockItem] = useState<Vegetal | null>(null);
    const [fullHistoryRole, setFullHistoryRole] = useState<keyof Pick<Session, 'dirigente' | 'explanator' | 'reader'> | null>(null);
    const [viewingStockMovement, setViewingStockMovement] = useState<Vegetal | null>(null);
    const [isSociosModalOpen, setIsSociosModalOpen] = useState(false);

    const socios = useMemo(() => {
        // Defensive coding: ensure inputs are arrays before processing
        if (!Array.isArray(sessions) || !Array.isArray(historicalStockData)) {
            return [];
        }
        const allNames = new Set<string>();
        sessions.forEach(s => {
            if (!s) return; // Guard against null/undefined items
            if (s.dirigente) allNames.add(s.dirigente);
            if (s.explanator) allNames.add(s.explanator);
            if (s.reader) allNames.add(s.reader);
            if (s.assistantMaster) allNames.add(s.assistantMaster);
        });
        historicalStockData.forEach(v => {
            if (!v) return; // Guard against null/undefined items
            if (v.master) allNames.add(v.master);
            if (v.auxiliary) allNames.add(v.auxiliary);
            if (v.messenger) allNames.add(v.messenger);
            if (v.chacronaResp) allNames.add(v.chacronaResp);
            if (v.batidaoResp) allNames.add(v.batidaoResp);
        });
        return Array.from(allNames).sort();
    }, [sessions, historicalStockData]);

    const historicalStock = useMemo(() => {
        // Defensive coding: ensure inputs are arrays and items are valid objects before processing
        if (!Array.isArray(historicalStockData) || !Array.isArray(stock)) {
            return [];
        }
        // Use a Map to ensure unique items by ID and prioritize current stock data.
        const allStock = new Map<string, Vegetal>();
    
        // First, add all current stock items. They have the most up-to-date info.
        stock.forEach(item => {
            if (item && item.id) {
                allStock.set(item.id, item);
            }
        });
    
        // Then, add any historical items that are not in the current stock (i.e., their quantity is zero).
        // This preserves them in the historical record for name lookups.
        historicalStockData.forEach(item => {
            if (item && item.id && !allStock.has(item.id)) {
                // This is an item that has been fully consumed.
                // We set its quantity to 0 to reflect its historical nature.
                allStock.set(item.id, { ...item, quantity: 0 });
            }
        });
    
        return Array.from(allStock.values());
    }, [stock, historicalStockData]);

    const handleUpdateSocioNames = (updates: { oldName: string; newName: string }[]) => {
        const nameMap = new Map(updates.map(u => [u.oldName, u.newName]));
        if (nameMap.size === 0) return;
    
        const updateName = (currentName: string) => nameMap.get(currentName) || currentName;
    
        const updateObjectNames = <T extends {}>(obj: T, keys: (keyof T)[]): T => {
            let hasChanged = false;
            const newObj = { ...obj };
            for (const key of keys) {
                const currentValue = newObj[key];
                if (typeof currentValue === 'string' && nameMap.has(currentValue)) {
                    newObj[key] = updateName(currentValue) as T[keyof T];
                    hasChanged = true;
                }
            }
            return hasChanged ? newObj : obj;
        };
    
        const sessionKeys: (keyof Session)[] = ['dirigente', 'explanator', 'reader', 'assistantMaster'];
        setSessions(prev => prev.map(s => updateObjectNames(s, sessionKeys)));
    
        const vegetalKeys: (keyof Vegetal)[] = ['master', 'auxiliary', 'messenger', 'chacronaResp', 'batidaoResp'];
        setStock(prev => prev.map(v => updateObjectNames(v, vegetalKeys)));
        setHistoricalStockData(prev => prev.map(v => updateObjectNames(v, vegetalKeys)));
    };

    const handleSaveSession = useCallback((sessionData: Omit<Session, 'id'> | Session) => {
        // --- VALIDATION LOGIC ---
        // Create a deep copy of the stock for validation purposes to avoid side effects.
        let validationStock: Vegetal[] = JSON.parse(JSON.stringify(stock));

        // If updating, revert the original session's consumption to get the pre-session state for validation.
        if ('id' in sessionData && sessionData.id) {
            const originalSession = sessions.find(s => s.id === sessionData.id);
            if (originalSession) {
                originalSession.consumption.vegetals.forEach(consumed => {
                    const stockIndex = validationStock.findIndex(v => v.id === consumed.vegetalId);
                    if (stockIndex !== -1) {
                        validationStock[stockIndex].quantity += consumed.disponibilizada;
                    } else {
                        const historicalItem = historicalStock.find(v => v.id === consumed.vegetalId);
                        if (historicalItem) {
                            validationStock.push({ ...historicalItem, quantity: consumed.disponibilizada });
                        }
                    }
                });
            }
        }
    
        for (const consumed of sessionData.consumption.vegetals) {
            const stockItem = validationStock.find(v => v.id === consumed.vegetalId);
            if (!stockItem) {
                alert(`Erro de Validação: Vegetal com ID ${consumed.vegetalId} não encontrado no estoque.`);
                return; // Abort save
            }
            if (stockItem.quantity < consumed.disponibilizada) {
                alert(`Erro: Quantidade insuficiente de "${stockItem.name}".\nDisponível: ${stockItem.quantity.toLocaleString('pt-BR', {maximumFractionDigits: 3})} L\nSolicitado: ${consumed.disponibilizada.toLocaleString('pt-BR', {maximumFractionDigits: 3})} L.`);
                return; // Abort save
            }
            // "Consume" from the temporary validation stock to handle cases where the same vegetal is used multiple times in the form
            stockItem.quantity -= consumed.disponibilizada;
        }
        // --- END VALIDATION ---


        // UPDATE LOGIC
        if ('id' in sessionData && sessions.some(s => s.id === sessionData.id)) {
            const updatedSession = sessionData as Session;
            const originalSession = sessions.find(s => s.id === updatedSession.id)!;
            
            let tempStock = [...stock];
            let tempMovements = [...stockMovements];

            // 1. Revert old stock movements
            const oldBalanceMovement = tempMovements.find(m => m.sessionId === originalSession.id && m.type === 'Saldo de Sessão');
            if (oldBalanceMovement) {
                tempStock = tempStock.filter(v => v.id !== oldBalanceMovement.vegetalId);
            }

            originalSession.consumption.vegetals.forEach(consumed => {
                const stockIndex = tempStock.findIndex(v => v.id === consumed.vegetalId);
                if (stockIndex !== -1) {
                    tempStock[stockIndex].quantity += consumed.disponibilizada;
                } else {
                    const historicalItem = historicalStock.find(v => v.id === consumed.vegetalId);
                    if(historicalItem) {
                        tempStock.push({...historicalItem, quantity: consumed.disponibilizada });
                    }
                }
            });
            tempMovements = tempMovements.filter(m => m.sessionId !== originalSession.id);

            // 2. Apply new movements
            let totalDisponibilizada = 0;
            const newMovements: StockMovement[] = [];
            updatedSession.consumption.vegetals.forEach(consumed => {
                const stockIndex = tempStock.findIndex(v => v.id === consumed.vegetalId);
                if(stockIndex !== -1) {
                    tempStock[stockIndex].quantity -= consumed.disponibilizada;
                    totalDisponibilizada += consumed.disponibilizada;
                    newMovements.push({
                        id: `mov-${updatedSession.id}-${consumed.vegetalId}`,
                        vegetalId: consumed.vegetalId,
                        vegetalName: tempStock[stockIndex].name,
                        sessionId: updatedSession.id,
                        type: 'Consumo em Sessão',
                        quantity: consumed.disponibilizada,
                        date: new Date(updatedSession.date).toISOString(),
                    });
                }
            });
            const balance = totalDisponibilizada - updatedSession.consumption.totalConsumed;
            if(balance > 0.0001) {
                const balanceName = `Saldo ${new Date(updatedSession.date).toLocaleDateString('pt-BR')} - ${updatedSession.type}`;
                const newBalanceItem: Vegetal = { id: `v${Date.now()}`, name: balanceName, quantity: balance };
                tempStock.push(newBalanceItem);
                setHistoricalStockData(prev => [...prev, newBalanceItem]);
                newMovements.push({
                    id: `mov-balance-${updatedSession.id}`,
                    vegetalId: newBalanceItem.id,
                    vegetalName: newBalanceItem.name,
                    sessionId: updatedSession.id,
                    type: 'Saldo de Sessão',
                    quantity: balance,
                    date: new Date(updatedSession.date).toISOString(),
                });
            }

            setStock(tempStock);
            setStockMovements([...tempMovements, ...newMovements]);
            setSessions(prev => prev.map(s => s.id === updatedSession.id ? updatedSession : s));

        } else { // CREATE LOGIC
            const newSessionId = `s${Date.now()}`;
            const newSession: Session = { ...(sessionData as Omit<Session, 'id'>), id: newSessionId };
            
            let totalDisponibilizada = 0;
            const newMovements: StockMovement[] = [];
            const updatedStock = [...stock];

            newSession.consumption.vegetals.forEach(consumed => {
                const stockIndex = updatedStock.findIndex(v => v.id === consumed.vegetalId);
                if(stockIndex !== -1) {
                    updatedStock[stockIndex].quantity -= consumed.disponibilizada;
                    totalDisponibilizada += consumed.disponibilizada;
                    newMovements.push({
                        id: `mov-${newSessionId}-${consumed.vegetalId}`,
                        vegetalId: consumed.vegetalId,
                        vegetalName: updatedStock[stockIndex].name,
                        sessionId: newSessionId,
                        type: 'Consumo em Sessão',
                        quantity: consumed.disponibilizada,
                        date: new Date(newSession.date).toISOString(),
                    });
                }
            });

            const balance = totalDisponibilizada - newSession.consumption.totalConsumed;
            if(balance > 0.0001) {
                const balanceName = `Saldo ${new Date(newSession.date).toLocaleDateString('pt-BR')} - ${newSession.type}`;
                const newBalanceItem: Vegetal = { id: `v${Date.now()}`, name: balanceName, quantity: balance };
                updatedStock.push(newBalanceItem);
                setHistoricalStockData(prev => [...prev, newBalanceItem]);
                newMovements.push({
                    id: `mov-balance-${newSessionId}`,
                    vegetalId: newBalanceItem.id,
                    vegetalName: newBalanceItem.name,
                    sessionId: newSessionId,
                    type: 'Saldo de Sessão',
                    quantity: balance,
                    date: new Date(newSession.date).toISOString(),
                });
            }
            
            setStock(updatedStock);
            setSessions(prev => [...prev, newSession]);
            setStockMovements(prev => [...prev, ...newMovements]);
        }
        setEditingSession(null);
        setView('history');
    }, [stock, sessions, stockMovements, historicalStock]);

    const handleStockMovement = useCallback(({ type, item, quantity }: { type: StockMovementType, item: Partial<Vegetal> & { id?: string }, quantity: number }) => {
        if (type === StockMovementType.ENTRADA) {
            const newItem: Vegetal = {
                id: `v${Date.now()}`,
                name: item.name || 'Sem nome',
                quantity: quantity,
                ...item
            };
            setStock(prev => [...prev, newItem]);
            setHistoricalStockData(prev => [...prev, newItem]);
            const newMovement: StockMovement = { id: `mov-${newItem.id}`, vegetalId: newItem.id, vegetalName: newItem.name, type: 'Entrada', quantity: quantity, date: new Date().toISOString() };
            setStockMovements(prev => [...prev, newMovement]);
        } else if (item.id) {
            const stockItem = stock.find(s => s.id === item.id);
            if (stockItem) {
                let newMovement: StockMovement | null = null;
                let newQuantity: number | null = null;
    
                if (type === StockMovementType.SAIDA) {
                    if (stockItem.quantity < quantity) {
                        alert(`Erro: Quantidade de saída (${quantity} L) é maior que o estoque disponível (${stockItem.quantity} L).`);
                        return;
                    }
                    newQuantity = stockItem.quantity - quantity;
                    newMovement = { id: `mov-${item.id}-${Date.now()}`, vegetalId: item.id, vegetalName: stockItem.name, type: type, quantity: quantity, date: new Date().toISOString() };
                } else if (type === StockMovementType.AJUSTE) {
                    const delta = quantity - stockItem.quantity;
                    newQuantity = quantity;
                    newMovement = { id: `mov-${item.id}-${Date.now()}`, vegetalId: item.id, vegetalName: stockItem.name, type: type, quantity: delta, date: new Date().toISOString() };
                }
    
                if (newQuantity !== null && newMovement) {
                    setStock(prev => prev.map(s => s.id === item.id ? { ...s, quantity: newQuantity! } : s));
                    setStockMovements(prev => [...prev, newMovement!]);
                }
            }
        }
    }, [stock]);

    const handleImport = (file: File) => {
        // This is a placeholder for the actual import logic.
        // In a real application, you would use a library like 'xlsx' or 'papaparse'
        // to read the file content and then update the state.
        alert(`Arquivo "${file.name}" selecionado. A funcionalidade de importação será implementada futuramente.`);
    };
    
    const handleExport = (sessionsToExport: Session[]) => {
        if (sessionsToExport.length === 0) {
            alert("Nenhuma sessão para exportar.");
            return;
        }

        const getVegetalName = (id: string) => historicalStock.find(v => v.id === id)?.name || id;
        
        const headers = [
            'ID', 'Data', 'Tipo', 'Dirigente', 'Explanador', 'Leitor', 'Mestre Assistente',
            'Chamadas', 'Historias', 'Registro Foto', 'Registro Audio',
            'Part. Mestres', 'Part. Conselho', 'Part. Corpo Instrutivo', 'Part. Quadro Socios', 'Part. Visitantes', 'Part. Jovens', 'Part. Total',
            'Vegetal Unido', 'Vegetais Utilizados', 'Qtds. Disponibilizadas (L)', 'Total Consumido (L)'
        ];

        const escapeCsvCell = (cellData: any): string => {
            const stringData = String(cellData ?? '');
            if (stringData.includes(',') || stringData.includes('"') || stringData.includes('\n')) {
                return `"${stringData.replace(/"/g, '""')}"`;
            }
            return stringData;
        };

        const rows = sessionsToExport.map(s => {
            const totalParticipants = Object.values(s.participants).reduce((sum, count) => sum + count, 0);
            const vegetalNames = s.consumption.vegetals.map(v => getVegetalName(v.vegetalId)).join('; ');
            const vegetalQuantities = s.consumption.vegetals.map(v => v.disponibilizada).join('; ');

            return [
                s.id,
                new Date(s.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'}),
                s.type,
                s.dirigente,
                s.explanator,
                s.reader,
                s.assistantMaster,
                s.chamadas,
                s.stories,
                s.hasPhotoRecording ? 'Sim' : 'Não',
                s.hasAudioRecording ? 'Sim' : 'Não',
                s.participants.mestres,
                s.participants.conselho,
                s.participants.corpoInstrutivo,
                s.participants.quadroDeSocios,
                s.participants.visitantes,
                s.participants.jovens,
                totalParticipants,
                s.consumption.isUnited ? 'Sim' : 'Não',
                vegetalNames,
                vegetalQuantities,
                s.consumption.totalConsumed
            ].map(escapeCsvCell).join(',');
        });

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "historico_sessoes.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleStartEdit = (session: Session) => {
        setViewingSession(null);
        setEditingSession(session);
        setView('form');
    };

    const handleCancelEdit = () => {
        setEditingSession(null);
        setView('history');
    };

    const handleStartEditStockItem = (item: Vegetal) => {
        setViewingStockItem(null);
        setEditingStockItem(item);
        setView('stock');
    };

    const handleUpdateStockItem = (updatedItem: Vegetal) => {
        // The item being edited is in `editingStockItem` state
        if (editingStockItem && editingStockItem.name !== updatedItem.name) {
            setStockMovements(prevMovements =>
                prevMovements.map(mov =>
                    mov.vegetalId === updatedItem.id ? { ...mov, vegetalName: updatedItem.name } : mov
                )
            );
        }
    
        setStock(prevStock => 
            prevStock.map(item => (item.id === updatedItem.id ? updatedItem : item))
        );
        setHistoricalStockData(prev => 
            prev.map(item => (item.id === updatedItem.id ? updatedItem : item))
        );
        setEditingStockItem(null);
    };

    const handleCancelEditStockItem = () => {
        setEditingStockItem(null);
    };


    const renderContent = () => {
        switch (view) {
            case 'dashboard':
                return <Dashboard sessions={sessions} stock={stock} onViewSession={setViewingSession} onViewFullHistory={(role) => setFullHistoryRole(role)} onNavigate={setView} />;
            case 'form':
                return <SessionForm 
                            availableStock={stock.filter(s => s.quantity > 0 || editingSession?.consumption.vegetals.some(v => v.vegetalId === s.id))} 
                            onSaveSession={handleSaveSession} 
                            socios={socios} 
                            sessionToEdit={editingSession}
                            onCancel={handleCancelEdit}
                        />;
            case 'stock':
                return <StockManager 
                            stock={stock} 
                            onStockMovement={handleStockMovement} 
                            onViewStockItem={setViewingStockItem}
                            itemToEdit={editingStockItem}
                            onUpdateStockItem={handleUpdateStockItem}
                            onCancelEdit={handleCancelEditStockItem}
                        />;
            case 'history':
                return <SessionHistory sessions={sessions} onViewSession={setViewingSession} historicalStock={historicalStock} onImport={handleImport} onExport={handleExport} onOpenSociosModal={() => setIsSociosModalOpen(true)} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans">
            <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-40">
                <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Leaf className="text-sky-400" size={28}/>
                        <h1 className="text-xl font-bold text-white hidden sm:block">Registro de Sessões</h1>
                    </div>
                    <div className="relative">
                         <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-sky-500"
                            aria-label="Abrir menu"
                        >
                            <Menu size={24} />
                        </button>
                        {isMenuOpen && (
                             <div 
                                className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50 origin-top-right"
                             >
                                <div className="p-2 flex flex-col gap-1">
                                    <NavButton 
                                        active={view === 'dashboard'} 
                                        onClick={() => { setView('dashboard'); setIsMenuOpen(false); }} 
                                        icon={<LayoutDashboard size={16}/>}
                                    >
                                        Tela Inicial
                                    </NavButton>
                                    <NavButton 
                                        active={view === 'stock'} 
                                        onClick={() => { setView('stock'); setIsMenuOpen(false); }} 
                                        icon={<Archive size={16}/>}
                                    >
                                        Sala do Vegetal
                                    </NavButton>
                                    <NavButton 
                                        active={view === 'form'} 
                                        onClick={() => { setView('form'); setIsMenuOpen(false); setEditingSession(null); }} 
                                        icon={<PlusCircle size={16}/>}
                                    >
                                        Registrar Sessão
                                    </NavButton>
                                    <NavButton 
                                        active={view === 'history'} 
                                        onClick={() => { setView('history'); setIsMenuOpen(false); }} 
                                        icon={<History size={16}/>}
                                    >
                                        Histórico de Sessões
                                    </NavButton>
                                </div>
                            </div>
                        )}
                    </div>
                </nav>
            </header>
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                {renderContent()}
            </main>
             {viewingSession && (
                <SessionDetailModal session={viewingSession} historicalStock={historicalStock} onClose={() => setViewingSession(null)} onEdit={handleStartEdit} />
            )}
            {viewingStockItem && (
                 <StockDetailModal 
                    item={viewingStockItem}
                    initialQuantity={stockMovements.find(m => m.vegetalId === viewingStockItem.id && m.type === 'Entrada')?.quantity}
                    onClose={() => setViewingStockItem(null)} 
                    onViewMovementHistory={setViewingStockMovement}
                    onEdit={handleStartEditStockItem}
                />
            )}
            {fullHistoryRole && (
                <FullHistoryModal 
                    isOpen={!!fullHistoryRole}
                    onClose={() => setFullHistoryRole(null)}
                    sessions={sessions}
                    role={fullHistoryRole}
                />
            )}
            {viewingStockMovement && (
                <StockMovementHistoryModal 
                    item={viewingStockMovement}
                    movements={stockMovements.filter(m => m.vegetalId === viewingStockMovement.id)}
                    sessions={sessions}
                    onClose={() => setViewingStockMovement(null)}
                />
            )}
            {isSociosModalOpen && (
                <SociosListModal
                    isOpen={isSociosModalOpen}
                    onClose={() => setIsSociosModalOpen(false)}
                    socios={socios}
                    onUpdateSocios={handleUpdateSocioNames}
                />
            )}
        </div>
    );
};

export default App;