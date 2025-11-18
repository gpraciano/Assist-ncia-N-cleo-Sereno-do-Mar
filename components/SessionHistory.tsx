
import React, { useState, useMemo, useRef } from 'react';
import { Session, SessionType, Vegetal } from '../types';
import Card from './Card';
import Input from './Input';
import Select from './Select';
import Button from './Button';
import { Search, SlidersHorizontal, X, Upload, Download, Users } from 'lucide-react';

interface SessionHistoryProps {
    sessions: Session[];
    onViewSession: (session: Session) => void;
    historicalStock: Vegetal[];
    onImport: (file: File) => void;
    onExport: (sessions: Session[]) => void;
    onOpenSociosModal: () => void;
}

const SessionHistory: React.FC<SessionHistoryProps> = ({ sessions, onViewSession, historicalStock, onImport, onExport, onOpenSociosModal }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [advancedFilters, setAdvancedFilters] = useState({
        dirigente: '',
        assistantMaster: '',
        type: '',
        vegetalId: '',
        monthYear: '',
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const getVegetalName = (id: string) => historicalStock.find(v => v.id === id)?.name || 'ID Desconhecido';

    const handleAdvancedFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setAdvancedFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const resetAdvancedFilters = () => {
        setAdvancedFilters({
            dirigente: '',
            assistantMaster: '',
            type: '',
            vegetalId: '',
            monthYear: '',
        });
    }

    const handleFileImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onImport(file);
        }
        // Reset file input value to allow selecting the same file again
        if(event.target) {
            event.target.value = '';
        }
    };


    const filteredSessions = useMemo(() => {
        const sortedSessions = [...sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return sortedSessions.filter(session => {
            // Main search term (broad search)
            if (searchTerm.trim()) {
                const lowercasedFilter = searchTerm.toLowerCase();
                const searchFields = [
                    session.dirigente,
                    session.type,
                    session.explanator,
                    session.reader,
                    session.assistantMaster,
                    new Date(session.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
                ];
                if (!searchFields.some(field => field && field.toLowerCase().includes(lowercasedFilter))) {
                    return false;
                }
            }

            // Advanced filters
            if (advancedFilters.dirigente && !session.dirigente.toLowerCase().includes(advancedFilters.dirigente.toLowerCase())) return false;
            if (advancedFilters.assistantMaster && !session.assistantMaster.toLowerCase().includes(advancedFilters.assistantMaster.toLowerCase())) return false;
            if (advancedFilters.type && session.type !== advancedFilters.type) return false;
            if (advancedFilters.vegetalId && !session.consumption.vegetals.some(v => v.vegetalId === advancedFilters.vegetalId)) return false;
            if (advancedFilters.monthYear) {
                const sessionMonthYear = session.date.substring(0, 7); // Format YYYY-MM
                if (sessionMonthYear !== advancedFilters.monthYear) return false;
            }

            return true;
        });
    }, [sessions, searchTerm, advancedFilters]);

    return (
        <Card title="Histórico de Sessões">
            <div className="mb-4 space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                     <Input
                        label="Buscar em todo o histórico"
                        id="history-search"
                        type="text"
                        placeholder="Buscar por nome, tipo, data..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        containerClassName="w-full flex-grow"
                    />
                    <div className="flex gap-2 self-start md:self-end">
                        <Button variant="secondary" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)} title="Filtros">
                            <SlidersHorizontal size={16}/>
                        </Button>
                        <Button variant="secondary" onClick={onOpenSociosModal} title="Banco de Dados de Sócios">
                            <Users size={16}/>
                        </Button>
                        <Button variant="secondary" onClick={handleFileImportClick} title="Importar">
                            <Upload size={16}/>
                        </Button>
                         <Button variant="secondary" onClick={() => onExport(filteredSessions)} title="Exportar">
                            <Download size={16}/>
                        </Button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept=".xlsx, .xls, .csv"
                        />
                    </div>
                </div>
               
                {showAdvancedFilters && (
                    <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <Select label="Filtrar por Tipo de Sessão" name="type" value={advancedFilters.type} onChange={handleAdvancedFilterChange}>
                                <option value="">Todos os Tipos</option>
                                {Object.values(SessionType).map(type => <option key={type} value={type}>{type}</option>)}
                            </Select>
                            <Input label="Filtrar por Mestre (Dirigente)" name="dirigente" value={advancedFilters.dirigente} onChange={handleAdvancedFilterChange} />
                            <Input label="Filtrar por Mestre Assistente" name="assistantMaster" value={advancedFilters.assistantMaster} onChange={handleAdvancedFilterChange} />
                             <Select label="Filtrar por Vegetal" name="vegetalId" value={advancedFilters.vegetalId} onChange={handleAdvancedFilterChange}>
                                <option value="">Todos os Vegetais</option>
                                {historicalStock.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                            </Select>
                            <Input label="Filtrar por Mês e Ano" type="month" name="monthYear" value={advancedFilters.monthYear} onChange={handleAdvancedFilterChange} />
                        </div>
                        <div className="flex justify-end">
                            <Button variant="secondary" onClick={resetAdvancedFilters} className="text-sm flex items-center gap-2 bg-gray-700/50 hover:bg-gray-700">
                                <X size={16} /> Limpar Filtros
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-700/50">
                        <tr>
                            <th className="p-4 font-semibold">Data</th>
                            <th className="p-4 font-semibold">Tipo</th>
                            <th className="p-4 font-semibold">Dirigente</th>
                            <th className="p-4 font-semibold">Explanador</th>
                            <th className="p-4 font-semibold">Leitor</th>
                            <th className="p-4 font-semibold">Mestre Assistente</th>
                            <th className="p-4 font-semibold">Vegetais Utilizados</th>
                            <th className="p-4 font-semibold text-right">Vegetal Consumido (L)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSessions.length > 0 ? filteredSessions.map(session => {
                            const vegetalNames = session.consumption.vegetals
                                .map(v => getVegetalName(v.vegetalId))
                                .join(', ');
                            return (
                                <tr 
                                    key={session.id} 
                                    onClick={() => onViewSession(session)}
                                    className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors cursor-pointer"
                                >
                                    <td className="p-4 whitespace-nowrap">{new Date(session.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                                    <td className="p-4">{session.type}</td>
                                    <td className="p-4">{session.dirigente}</td>
                                    <td className="p-4">{session.explanator}</td>
                                    <td className="p-4">{session.reader}</td>
                                    <td className="p-4">{session.assistantMaster}</td>
                                    <td className="p-4">{vegetalNames}</td>
                                    <td className="p-4 text-right font-mono">{session.consumption.totalConsumed.toLocaleString('pt-BR', { minimumFractionDigits: 3 })}</td>
                                </tr>
                            )
                        }) : (
                            <tr>
                                <td colSpan={8} className="p-8 text-center text-gray-400">Nenhum resultado encontrado.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default SessionHistory;
