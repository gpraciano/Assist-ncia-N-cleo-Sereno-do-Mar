import React from 'react';
import { Vegetal, StockMovement, Session } from '../types';
import { X } from 'lucide-react';
import Button from './Button';

interface StockMovementHistoryModalProps {
    item: Vegetal;
    movements: StockMovement[];
    sessions: Session[];
    onClose: () => void;
}

const StockMovementHistoryModal: React.FC<StockMovementHistoryModalProps> = ({ item, movements, sessions, onClose }) => {
    
    const getSessionInfo = (sessionId?: string) => {
        if (!sessionId) return null;
        const session = sessions.find(s => s.id === sessionId);
        if (!session) return `Sessão (ID: ${sessionId})`;
        return `${session.type} em ${new Date(session.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}`;
    };

    const sortedMovements = [...movements].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-gray-600">
                <div className="sticky top-0 bg-gray-800/80 backdrop-blur-md px-6 py-4 border-b border-gray-700 z-10 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-sky-400">Histórico de Movimentação</h2>
                        <p className="text-gray-300">{item.name}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-grow">
                    {sortedMovements.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="bg-gray-700/50">
                                <tr>
                                    <th className="p-3 font-semibold">Data</th>
                                    <th className="p-3 font-semibold">Tipo</th>
                                    <th className="p-3 font-semibold text-right">Quantidade (L)</th>
                                    <th className="p-3 font-semibold">Detalhes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedMovements.map(mov => {
                                    const isDebit = ['Saída', 'Consumo em Sessão'].includes(mov.type);
                                    const isAdjustment = mov.type === 'Ajuste';

                                    let displayValue: string;
                                    let colorClass: string;
                                    let badgeClass: string;
                                
                                    if (isAdjustment) {
                                        const delta = mov.quantity;
                                        displayValue = delta.toLocaleString('pt-BR', {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                            signDisplay: 'always'
                                        });
                                        colorClass = delta >= 0 ? 'text-green-400' : 'text-red-400';
                                        badgeClass = 'bg-yellow-900/50 text-yellow-300';
                                    } else {
                                        // For other types, quantity is always positive
                                        displayValue = mov.quantity.toLocaleString('pt-BR', {
                                            minimumFractionDigits: 3,
                                            maximumFractionDigits: 3,
                                        });
                                        if (isDebit) {
                                            displayValue = '-' + displayValue;
                                            colorClass = 'text-red-400';
                                            badgeClass = 'bg-red-900/50 text-red-300';
                                        } else { // Entrada, Saldo
                                            displayValue = '+' + displayValue;
                                            colorClass = 'text-green-400';
                                            badgeClass = 'bg-green-900/50 text-green-300';
                                        }
                                    }

                                    return (
                                        <tr key={mov.id} className="border-b border-gray-700">
                                            <td className="p-3 whitespace-nowrap">{new Date(mov.date).toLocaleString('pt-BR', { timeZone: 'UTC', hour12: false })}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${badgeClass}`}>
                                                    {mov.type}
                                                </span>
                                            </td>
                                            <td className={`p-3 text-right font-mono ${colorClass}`}>
                                                {displayValue}
                                            </td>
                                            <td className="p-3 text-gray-400 text-sm">{getSessionInfo(mov.sessionId) || '-'}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-center text-gray-400 py-8">Nenhuma movimentação registrada para este item.</p>
                    )}
                </div>

                <div className="sticky bottom-0 px-6 py-4 bg-gray-900/50 flex justify-end gap-4 rounded-b-xl border-t border-gray-700">
                    <Button variant="secondary" onClick={onClose}>Fechar</Button>
                </div>
            </div>
        </div>
    );
};

export default StockMovementHistoryModal;