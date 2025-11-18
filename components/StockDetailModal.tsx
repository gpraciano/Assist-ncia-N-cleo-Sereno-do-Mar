
import React from 'react';
import { Vegetal } from '../types';
import { X, Trash2 } from 'lucide-react';
import Button from './Button';

interface StockDetailModalProps {
    item: Vegetal;
    initialQuantity?: number;
    onClose: () => void;
    onViewMovementHistory: (item: Vegetal) => void;
    onEdit: (item: Vegetal) => void;
    onDelete: (itemId: string) => void;
}

const DetailItem: React.FC<{ label: string; value?: string | number | null }> = ({ label, value }) => (
    <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="font-semibold text-white">{value ?? 'Não informado'}</p>
    </div>
);

const StockDetailModal: React.FC<StockDetailModalProps> = ({ item, initialQuantity, onClose, onViewMovementHistory, onEdit, onDelete }) => {
    
    const handleDelete = () => {
        if (window.confirm('Tem certeza que deseja excluir este item de estoque? Esta ação não pode ser desfeita e removerá o histórico de movimentações.')) {
            onDelete(item.id);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl border border-gray-600 relative">
                <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-sky-400">Detalhes do Item de Estoque</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                     <section>
                        <h3 className="text-lg font-semibold text-gray-300 border-b border-gray-700 pb-2 mb-4">Informações Básicas</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-4">
                             <div className="md:col-span-2">
                                <DetailItem label="Nome / Identificação" value={item.name} />
                             </div>
                            <DetailItem label="Total Envasado" value={initialQuantity ? `${initialQuantity.toLocaleString('pt-BR', { minimumFractionDigits: 3 })} L` : 'N/A'} />
                            <div>
                                <p className="text-sm text-gray-400">Quantidade Atual</p>
                                <p className="font-semibold font-mono text-xl text-sky-400">{item.quantity.toLocaleString('pt-BR', { minimumFractionDigits: 3 })} L</p>
                            </div>
                        </div>
                    </section>
                    <section>
                        <h3 className="text-lg font-semibold text-gray-300 border-b border-gray-700 pb-2 mb-4">Detalhes do Preparo</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DetailItem label="Data do Envase" value={item.envaseDate ? new Date(item.envaseDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : null} />
                            <DetailItem label="Mestre do Preparo" value={item.master} />
                            <DetailItem label="Auxiliar do Preparo" value={item.auxiliary} />
                            <DetailItem label="Mensageiro" value={item.messenger} />
                            <DetailItem label="Responsável pela Chacrona" value={item.chacronaResp} />
                            <DetailItem label="Responsável pela Batição" value={item.batidaoResp} />
                            <DetailItem label="Espécie do Mariri" value={item.maririSpecies} />
                            <DetailItem label="Espécie da Chacrona" value={item.chacronaSpecies} />
                        </div>
                    </section>
                </div>

                <div className="px-6 py-4 bg-gray-900/50 flex justify-between items-center gap-4 rounded-b-xl border-t border-gray-700">
                    <div>
                        <Button variant="danger" onClick={handleDelete} className="p-2" title="Deletar Item">
                            <Trash2 size={18} />
                        </Button>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="secondary" onClick={() => onEdit(item)}>Editar</Button>
                        <Button onClick={() => onViewMovementHistory(item)}>Ver Histórico de Movimentação</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockDetailModal;