import React, { useMemo } from 'react';
import { Session } from '../types';
import { X, User, Tag } from 'lucide-react';
import Button from './Button';

interface FullHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    sessions: Session[];
    role: keyof Pick<Session, 'dirigente' | 'explanator' | 'reader'>;
}

const roleTitles: { [key in FullHistoryModalProps['role']]: string } = {
    dirigente: 'Dirigentes',
    explanator: 'Explanadores',
    reader: 'Leitores de Documentos',
};

const FullHistoryModal: React.FC<FullHistoryModalProps> = ({ isOpen, onClose, sessions, role }) => {
    const title = `Histórico Completo de ${roleTitles[role]}`;

    const sortedHistory = useMemo(() => {
        return [...sessions]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [sessions]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col border border-gray-600">
                <div className="sticky top-0 bg-gray-800/80 backdrop-blur-md px-6 py-4 border-b border-gray-700 z-10 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-sky-400">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-grow">
                    <ul className="space-y-3">
                        {sortedHistory.map(session => (
                             <li key={session.id} className="flex justify-between items-center bg-gray-900/50 p-3 rounded-md border border-gray-700">
                                <span className="flex items-center gap-2 text-white">
                                    <User size={16} className="text-sky-400/80"/>
                                    {session[role]}
                                </span>
                                <span className="flex items-center gap-1.5 text-sm text-gray-400">
                                     <Tag size={14} />
                                    {session.type}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="sticky bottom-0 px-6 py-4 bg-gray-900/50 flex justify-end gap-4 rounded-b-xl border-t border-gray-700">
                    <Button variant="secondary" onClick={onClose}>Fechar</Button>
                </div>
            </div>
        </div>
    );
};

export default FullHistoryModal;