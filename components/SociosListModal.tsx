
import React, { useState, useMemo, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import Button from './Button';
import Input from './Input';

interface SociosListModalProps {
    isOpen: boolean;
    onClose: () => void;
    socios: string[];
    onUpdateSocios: (updates: { oldName: string; newName: string }[]) => void;
}

const SociosListModal: React.FC<SociosListModalProps> = ({ isOpen, onClose, socios, onUpdateSocios }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [editedSocios, setEditedSocios] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            setEditedSocios([...socios]);
        }
    }, [isOpen, socios]);

    const filteredSocios = useMemo(() => {
        return editedSocios
            .map((socio, index) => ({ socio, originalIndex: index }))
            .filter(item => !searchTerm || item.socio.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [editedSocios, searchTerm]);

    const handleNameChange = (index: number, newName: string) => {
        const updatedSocios = [...editedSocios];
        updatedSocios[index] = newName;
        setEditedSocios(updatedSocios);
    };

    const handleSaveChanges = () => {
        const updates: { oldName: string; newName: string }[] = [];
        socios.forEach((originalName, index) => {
            if (originalName !== editedSocios[index]) {
                updates.push({ oldName: originalName, newName: editedSocios[index] });
            }
        });
        if (updates.length > 0) {
            onUpdateSocios(updates);
        }
        onClose();
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col border border-gray-600">
                <div className="sticky top-0 bg-gray-800/80 backdrop-blur-md px-6 py-4 border-b border-gray-700 z-10 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-sky-400">Banco de Dados de Sócios</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="relative mb-4">
                         <Input
                            id="socio-search"
                            type="text"
                            label="Buscar Sócio"
                            placeholder="Digite um nome para buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                         <Search className="absolute left-3 top-[38px] text-gray-400" size={20} />
                    </div>
                </div>

                <div className="px-6 pb-6 overflow-y-auto flex-grow">
                    <ul className="space-y-2">
                        {filteredSocios.length > 0 ? filteredSocios.map(({ socio, originalIndex }) => {
                             return (
                                 <li key={originalIndex} className="flex items-center bg-gray-900/50 p-2 rounded-md border border-gray-700">
                                    <input
                                        type="text"
                                        value={socio}
                                        onChange={(e) => handleNameChange(originalIndex, e.target.value)}
                                        className="bg-transparent text-white w-full focus:outline-none focus:ring-1 focus:ring-sky-500 rounded px-2 py-1"
                                    />
                                </li>
                            )
                        }) : (
                            <p className="text-center text-gray-400 py-8">Nenhum sócio encontrado.</p>
                        )}
                    </ul>
                </div>

                <div className="sticky bottom-0 px-6 py-4 bg-gray-900/50 flex justify-end gap-4 rounded-b-xl border-t border-gray-700">
                    <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button onClick={handleSaveChanges}>Salvar Alterações</Button>
                </div>
            </div>
        </div>
    );
};

export default SociosListModal;
