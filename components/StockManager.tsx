
import React, { useState, useEffect } from 'react';
import { Vegetal, StockMovementType } from '../types';
import Card from './Card';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import { Plus, Minus, Edit3, X } from 'lucide-react';

interface StockManagerProps {
    stock: Vegetal[];
    onStockMovement: (movement: { type: StockMovementType, item: Partial<Vegetal> & { id?: string }, quantity: number }) => void;
    onViewStockItem: (item: Vegetal) => void;
    itemToEdit: Vegetal | null;
    onUpdateStockItem: (item: Vegetal) => void;
    onCancelEdit: () => void;
}

const StockManager: React.FC<StockManagerProps> = ({ stock, onStockMovement, onViewStockItem, itemToEdit, onUpdateStockItem, onCancelEdit }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<StockMovementType | 'edit' | null>(null);
    const [currentItem, setCurrentItem] = useState<Partial<Vegetal>>({});
    const [quantity, setQuantity] = useState(0);

    useEffect(() => {
        if (itemToEdit) {
            setModalType('edit');
            setCurrentItem(itemToEdit);
            setQuantity(itemToEdit.quantity);
            setIsModalOpen(true);
        }
    }, [itemToEdit]);


    const openModal = (type: StockMovementType, item: Partial<Vegetal> = {}) => {
        setModalType(type);
        setCurrentItem(item);
        setQuantity(type === StockMovementType.AJUSTE ? item.quantity || 0 : 0);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        if (modalType === 'edit') {
            onCancelEdit();
        }
        setIsModalOpen(false);
        setModalType(null);
        setCurrentItem({});
        setQuantity(0);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (modalType === 'edit' && currentItem.id) {
            const updatedItem: Vegetal = {
                ...(itemToEdit as Vegetal),
                ...currentItem,
                quantity,
            };
            onUpdateStockItem(updatedItem);

        } else if (modalType && modalType !== 'edit') {
            onStockMovement({ type: modalType, item: currentItem, quantity });
        }
        closeModal();
    };
    
    const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentItem(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuantity(parseFloat(e.target.value) || 0);
    };

    const visibleStock = stock.filter(item => item.quantity > 0.0001);

    const renderModalContent = () => {
        if (!modalType) return null;
        
        if (modalType === StockMovementType.ENTRADA || modalType === 'edit') {
            const title = modalType === 'edit' ? 'Editar Item de Estoque' : 'Registrar Entrada';
            const quantityLabel = modalType === 'edit' ? 'Quantidade Atual (litros)' : 'Quantidade Envasada (litros)';

            return (
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-sky-400">{title}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Nome/Identificação do Preparo" name="name" value={currentItem.name || ''} onChange={handleItemChange} required />
                        <Input label={quantityLabel} type="number" step="0.001" value={quantity} onChange={handleQuantityChange} min="0" required />
                        <Input label="Data do Envase" type="date" name="envaseDate" value={currentItem.envaseDate || ''} onChange={handleItemChange} />
                        <Input label="Mestre do Preparo" name="master" value={currentItem.master || ''} onChange={handleItemChange} />
                        <Input label="Auxiliar do Preparo" name="auxiliary" value={currentItem.auxiliary || ''} onChange={handleItemChange} />
                        <Input label="Mensageiro" name="messenger" value={currentItem.messenger || ''} onChange={handleItemChange} />
                        <Input label="Responsável pela Chacrona" name="chacronaResp" value={currentItem.chacronaResp || ''} onChange={handleItemChange} />
                        <Input label="Responsável pela Batição" name="batidaoResp" value={currentItem.batidaoResp || ''} onChange={handleItemChange} />
                        <Input label="Espécie do Mariri" name="maririSpecies" value={currentItem.maririSpecies || ''} onChange={handleItemChange} />
                        <Input label="Espécie da Chacrona" name="chacronaSpecies" value={currentItem.chacronaSpecies || ''} onChange={handleItemChange} />
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                 <h3 className="text-xl font-bold text-sky-400">Registrar {modalType}</h3>
                <Select label="Item do Estoque" onChange={(e) => setCurrentItem(stock.find(s => s.id === e.target.value) || {})} required>
                     <option value="">Selecione um item</option>
                    {visibleStock.map(item => <option key={item.id} value={item.id}>{item.name} ({item.quantity.toLocaleString('pt-BR')} litros)</option>)}
                </Select>
                <Input label="Quantidade (litros)" type="number" step="0.001" value={quantity} onChange={handleQuantityChange} min="0" required />
            </div>
        );
    };

    return (
        <Card title="Sala do Vegetal - Estoque Atual">
             <div className="mb-6 flex justify-end gap-4">
                <Button onClick={() => openModal(StockMovementType.ENTRADA)} className="flex items-center gap-2"><Plus size={16}/> Entrada</Button>
                <Button onClick={() => openModal(StockMovementType.SAIDA)} variant="secondary" className="flex items-center gap-2"><Minus size={16}/> Saída</Button>
                <Button onClick={() => openModal(StockMovementType.AJUSTE)} variant="secondary" className="flex items-center gap-2"><Edit3 size={16}/> Ajuste</Button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-700/50">
                        <tr>
                            <th className="p-4 font-semibold">Nome / Identificação</th>
                            <th className="p-4 font-semibold text-right">Quantidade (litros)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleStock.length > 0 ? visibleStock.map(item => (
                            <tr key={item.id} onClick={() => onViewStockItem(item)} className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors cursor-pointer">
                                <td className="p-4">{item.name}</td>
                                <td className="p-4 text-right font-mono">{item.quantity.toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={2} className="p-4 text-center text-gray-400">Nenhum item em estoque.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
                     <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-600">
                        <form onSubmit={handleSubmit}>
                            <div className="p-6">
                               {renderModalContent()}
                            </div>
                            <div className="px-6 py-4 bg-gray-900/50 flex justify-end gap-4 rounded-b-xl border-t border-gray-700">
                                <Button type="button" variant="secondary" onClick={closeModal}>Cancelar</Button>
                                <Button type="submit">{modalType === 'edit' ? 'Atualizar' : 'Salvar'}</Button>
                            </div>
                        </form>
                        <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-white transition">
                            <X size={24}/>
                        </button>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default StockManager;
