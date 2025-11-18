
import React, { useState, useEffect } from 'react';
import { Vegetal } from '../types';
import Card from './Card';
import Input from './Input';
import Button from './Button';

interface StockEntryFormProps {
    initialData?: Vegetal | null;
    onSave: (item: Partial<Vegetal> & { id?: string }, quantity: number) => void;
    onCancel: () => void;
}

const initialVegetalState: Partial<Vegetal> = {
    name: '',
    envaseDate: '',
    master: '',
    auxiliary: '',
    messenger: '',
    chacronaResp: '',
    batidaoResp: '',
    maririSpecies: '',
    chacronaSpecies: '',
};

const StockEntryForm: React.FC<StockEntryFormProps> = ({ initialData, onSave, onCancel }) => {
    const [itemData, setItemData] = useState<Partial<Vegetal>>(initialVegetalState);
    const [quantity, setQuantity] = useState<number>(0);

    useEffect(() => {
        if (initialData) {
            setItemData(initialData);
            setQuantity(initialData.quantity);
        } else {
            setItemData(initialVegetalState);
            setQuantity(0);
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setItemData(prev => ({ ...prev, [name]: value }));
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuantity(parseFloat(e.target.value) || 0);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Combine itemData with the possibly updated quantity if editing, 
        // or use quantity as the initial amount if creating.
        onSave({ ...itemData, id: initialData?.id }, quantity);
    };

    const isEditing = !!initialData?.id;
    const title = isEditing ? 'Editar Item de Estoque' : 'Cadastrar Novo Vegetal';
    const quantityLabel = isEditing ? 'Quantidade Atual (litros)' : 'Quantidade Envasada (litros)';

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card title={title}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input 
                        label="Nome/Identificação do Preparo" 
                        name="name" 
                        value={itemData.name || ''} 
                        onChange={handleChange} 
                        required 
                    />
                    <Input 
                        label={quantityLabel} 
                        type="number" 
                        step="0.001" 
                        value={quantity} 
                        onChange={handleQuantityChange} 
                        min="0" 
                        required 
                    />
                    <Input 
                        label="Data do Envase" 
                        type="date" 
                        name="envaseDate" 
                        value={itemData.envaseDate || ''} 
                        onChange={handleChange} 
                    />
                    <Input 
                        label="Mestre do Preparo" 
                        name="master" 
                        value={itemData.master || ''} 
                        onChange={handleChange} 
                    />
                    <Input 
                        label="Auxiliar do Preparo" 
                        name="auxiliary" 
                        value={itemData.auxiliary || ''} 
                        onChange={handleChange} 
                    />
                    <Input 
                        label="Mensageiro" 
                        name="messenger" 
                        value={itemData.messenger || ''} 
                        onChange={handleChange} 
                    />
                    <Input 
                        label="Responsável pela Chacrona" 
                        name="chacronaResp" 
                        value={itemData.chacronaResp || ''} 
                        onChange={handleChange} 
                    />
                    <Input 
                        label="Responsável pela Batição" 
                        name="batidaoResp" 
                        value={itemData.batidaoResp || ''} 
                        onChange={handleChange} 
                    />
                    <Input 
                        label="Espécie do Mariri" 
                        name="maririSpecies" 
                        value={itemData.maririSpecies || ''} 
                        onChange={handleChange} 
                    />
                    <Input 
                        label="Espécie da Chacrona" 
                        name="chacronaSpecies" 
                        value={itemData.chacronaSpecies || ''} 
                        onChange={handleChange} 
                    />
                </div>
            </Card>
            
            <div className="flex justify-end gap-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
                <Button type="submit">{isEditing ? 'Salvar Alterações' : 'Cadastrar Vegetal'}</Button>
            </div>
        </form>
    );
};

export default StockEntryForm;
