import React from 'react';
import { Session, Vegetal } from '../types';
import Card from './Card';
import Button from './Button';
import { User, Tag, Package, BookOpen, Archive } from 'lucide-react';

interface DashboardProps {
    sessions: Session[];
    stock: Vegetal[];
    onViewSession: (session: Session) => void;
    onViewFullHistory: (role: keyof Pick<Session, 'dirigente' | 'explanator' | 'reader'>) => void;
    onNavigate: (view: 'dashboard' | 'form' | 'stock' | 'history') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ sessions, stock, onViewSession, onViewFullHistory, onNavigate }) => {
    // Defensive check to prevent render errors from malformed props.
    if (!Array.isArray(sessions) || !Array.isArray(stock)) {
        return <div className="text-center p-8 text-gray-400">Carregando dados...</div>;
    }

    // Ordena as sessões por data em ordem decrescente, garantindo que os dados essenciais existam.
    const sortedSessions = [...sessions]
        .filter(s => s && s.id && s.date) // Stricter validation
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const recentSessions = sortedSessions.slice(0, 5);

    // Safely calculate total stock, ensuring items and quantities are valid.
    const totalStock = stock
        .filter(item => item && typeof item.quantity === 'number') // Stricter validation
        .reduce((sum, item) => sum + item.quantity, 0);

    const createHistoryButtonFooter = (role: keyof Pick<Session, 'dirigente' | 'explanator' | 'reader'>) => (
        <div className="flex justify-end">
            <Button 
                variant="secondary" 
                onClick={() => onViewFullHistory(role)} 
                className="text-sm py-1.5 px-3 flex items-center gap-2 bg-gray-700/50 hover:bg-gray-700"
            >
                Ver Histórico Completo
                <BookOpen size={16} />
            </Button>
        </div>
    );

    const stockCardFooter = (
        <div className="flex justify-end">
            <Button 
                variant="secondary" 
                onClick={() => onNavigate('stock')}
                className="text-sm py-1.5 px-3 flex items-center gap-2 bg-gray-700/50 hover:bg-gray-700"
            >
                Acessar Sala do Vegetal
                <Archive size={16} />
            </Button>
        </div>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-2">
                 <Card title="Estoque Atual de Vegetal" footer={stockCardFooter}>
                    <div className="text-center py-4">
                        {totalStock > 0 ? (
                            <>
                                <div className="flex justify-center items-center gap-3 text-sky-400 mb-2">
                                    <Package size={32} />
                                </div>
                                <p className="text-4xl font-bold font-mono text-sky-400">
                                    {totalStock.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                                <p className="text-gray-400 mt-1">Litros Disponíveis</p>
                            </>
                        ) : (
                            <p className="text-center text-gray-400 py-8">Estoque vazio.</p>
                        )}
                    </div>
                </Card>
            </div>
            <div className="lg:col-span-3 space-y-8">
                <Card title="Últimos 5 Dirigentes" footer={createHistoryButtonFooter('dirigente')}>
                    <div className="space-y-4">
                        {recentSessions.length > 0 ? (
                            recentSessions.map((session) => (
                                <div
                                    key={`${session.id}-dirigente`}
                                    onClick={() => onViewSession(session)}
                                    className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 flex flex-wrap justify-between items-center gap-x-4 gap-y-1 transition-all hover:border-sky-500/50 hover:bg-gray-900 cursor-pointer"
                                >
                                    <p className="font-semibold text-white flex items-center gap-2">
                                        <User size={16} className="text-sky-400" />
                                        {session.dirigente}
                                    </p>
                                    <div className="flex items-center gap-x-4 text-sm text-gray-400">
                                        <span className="flex items-center gap-1.5"><Tag size={14} /> {session.type}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-400 py-8">Nenhuma sessão registrada.</p>
                        )}
                    </div>
                </Card>

                <Card title="Últimos 5 Explanadores" footer={createHistoryButtonFooter('explanator')}>
                    <div className="space-y-4">
                        {recentSessions.length > 0 ? (
                           recentSessions.map((session) => (
                                <div
                                    key={`${session.id}-explanator`}
                                    onClick={() => onViewSession(session)}
                                    className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 flex flex-wrap justify-between items-center gap-x-4 gap-y-1 transition-all hover:border-sky-500/50 hover:bg-gray-900 cursor-pointer"
                                >
                                    <p className="font-semibold text-white flex items-center gap-2">
                                        <User size={16} className="text-sky-400" />
                                        {session.explanator}
                                    </p>
                                    <div className="flex items-center gap-x-4 text-sm text-gray-400">
                                        <span className="flex items-center gap-1.5"><Tag size={14} /> {session.type}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-400 py-8">Nenhuma sessão registrada.</p>
                        )}
                    </div>
                </Card>

                <Card title="Últimos 5 Leitores" footer={createHistoryButtonFooter('reader')}>
                    <div className="space-y-4">
                        {recentSessions.length > 0 ? (
                            recentSessions.map((session) => (
                                <div
                                    key={`${session.id}-reader`}
                                    onClick={() => onViewSession(session)}
                                    className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 flex flex-wrap justify-between items-center gap-x-4 gap-y-1 transition-all hover:border-sky-500/50 hover:bg-gray-900 cursor-pointer"
                                >
                                    <p className="font-semibold text-white flex items-center gap-2">
                                        <User size={16} className="text-sky-400" />
                                        {session.reader}
                                    </p>
                                    <div className="flex items-center gap-x-4 text-sm text-gray-400">
                                        <span className="flex items-center gap-1.5"><Tag size={14} /> {session.type}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-400 py-8">Nenhuma sessão registrada.</p>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;