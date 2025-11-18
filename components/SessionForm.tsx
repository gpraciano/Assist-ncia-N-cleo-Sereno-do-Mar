
import React, { useState, useEffect } from 'react';
import { Session, SessionType, Vegetal, ParticipantGrades, Consumption, ConsumedVegetal } from '../types';
import Card from './Card';
import Input from './Input';
import Select from './Select';
import Button from './Button';
import DatalistInput from './DatalistInput';

interface SessionFormProps {
    availableStock: Vegetal[];
    onSaveSession: (session: Omit<Session, 'id'> | Session) => void;
    socios: string[];
    sessionToEdit?: Session | null;
    onCancel?: () => void;
}

const initialSessionState = {
    date: new Date().toISOString().split('T')[0],
    type: SessionType.PRIMEIRA_ESCALA,
    dirigente: '',
    explanator: '',
    reader: '',
    assistantMaster: '',
    chamadas: '',
    stories: '',
    hasPhotoRecording: false,
    hasAudioRecording: false,
};

const initialParticipantsState: ParticipantGrades = {
    mestres: 0,
    conselho: 0,
    corpoInstrutivo: 0,
    quadroDeSocios: 0,
    visitantes: 0,
    jovens: 0,
};

const initialConsumptionState: Consumption = {
    isUnited: false,
    vegetals: [{ vegetalId: '', disponibilizada: 0 }],
    totalConsumed: 0,
};

const SessionForm: React.FC<SessionFormProps> = ({ availableStock, onSaveSession, socios, sessionToEdit, onCancel }) => {
    const [sessionInfo, setSessionInfo] = useState(initialSessionState);
    const [participants, setParticipants] = useState<ParticipantGrades>(initialParticipantsState);
    const [consumption, setConsumption] = useState<Consumption>(initialConsumptionState);
    
    const isEditing = !!sessionToEdit;

    useEffect(() => {
        if (sessionToEdit) {
            const { participants, consumption, ...info } = sessionToEdit;
            // Destructure id away from info for the state
            const { id, ...sessionInfoData } = info;
            setSessionInfo({
                ...initialSessionState,
                ...sessionInfoData,
            });
            setParticipants(participants);
            setConsumption(consumption);
        } else {
            setSessionInfo(initialSessionState);
            setParticipants(initialParticipantsState);
            setConsumption(initialConsumptionState);
        }
    }, [sessionToEdit]);


    const handleSessionInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const target = e.target;
        if (target instanceof HTMLInputElement && target.type === 'checkbox') {
            setSessionInfo(prev => ({ ...prev, [target.name]: target.checked }));
        } else {
            setSessionInfo(prev => ({ ...prev, [target.name]: target.value }));
        }
    };
    
    const handleParticipantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setParticipants(prev => ({ ...prev, [e.target.name]: parseInt(e.target.value) || 0 }));
    };

    const handleConsumptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConsumption(prev => ({ ...prev, totalConsumed: parseFloat(e.target.value) || 0 }));
    };

    const handleIsUnitedChange = (isUnited: boolean) => {
        setConsumption(prev => ({
            ...prev,
            isUnited,
            vegetals: isUnited 
                ? [{ vegetalId: '', disponibilizada: 0 }, { vegetalId: '', disponibilizada: 0 }, { vegetalId: '', disponibilizada: 0 }] 
                : [{ vegetalId: '', disponibilizada: 0 }]
        }));
    };

    const handleConsumedVegetalChange = (index: number, field: keyof ConsumedVegetal, value: string | number) => {
        const updatedVegetals = [...consumption.vegetals];
        const numericValue = typeof value === 'string' ? parseFloat(value) : value;
        updatedVegetals[index] = { ...updatedVegetals[index], [field]: field === 'vegetalId' ? value : numericValue };
        setConsumption(prev => ({ ...prev, vegetals: updatedVegetals }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalConsumption = {
            ...consumption,
            vegetals: consumption.vegetals.filter(v => v.vegetalId && v.disponibilizada > 0)
        };
        if (finalConsumption.vegetals.length === 0) {
            alert('Por favor, selecione ao menos um Vegetal e informe a quantidade disponibilizada.');
            return;
        }

        const sessionData: Omit<Session, 'id'> = {
            ...sessionInfo,
            participants,
            consumption: finalConsumption
        };
        
        if (isEditing) {
            onSaveSession({ ...sessionData, id: sessionToEdit.id });
        } else {
            onSaveSession(sessionData);
        }
    };

    // Fix: Explicitly type the accumulator for `reduce` to ensure type safety.
    const totalParticipants = Object.values(participants).reduce<number>((sum, count) => sum + Number(count), 0);
    const formGridClass = "grid grid-cols-1 md:grid-cols-2 gap-6";

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <Card title={isEditing ? 'Editar Sessão' : 'Registrar Nova Sessão'}>
                <div className={formGridClass}>
                    <Input label="Data da Sessão" type="date" name="date" value={sessionInfo.date} onChange={handleSessionInfoChange} required />
                    <Select label="Tipo de Sessão" name="type" value={sessionInfo.type} onChange={handleSessionInfoChange}>
                        {Object.values(SessionType).map(type => <option key={type} value={type}>{type}</option>)}
                    </Select>
                    <DatalistInput 
                        label="Dirigiu" 
                        name="dirigente" 
                        id="dirigente-list" 
                        value={sessionInfo.dirigente} 
                        onChange={handleSessionInfoChange} 
                        options={socios} 
                        required 
                    />
                    <DatalistInput 
                        label="Realizou a Explanação" 
                        name="explanator" 
                        id="explanator-list" 
                        value={sessionInfo.explanator} 
                        onChange={handleSessionInfoChange} 
                        options={socios}
                    />
                    <DatalistInput 
                        label="Leu os Documentos" 
                        name="reader" 
                        id="reader-list" 
                        value={sessionInfo.reader} 
                        onChange={handleSessionInfoChange} 
                        options={socios}
                    />
                    <DatalistInput 
                        label="Mestre Assistente" 
                        name="assistantMaster" 
                        id="assistant-master-list" 
                        value={sessionInfo.assistantMaster} 
                        onChange={handleSessionInfoChange}
                        options={socios} 
                        required 
                    />
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card title="Conteúdo da Sessão">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="chamadas" className="block mb-1.5 text-sm font-medium text-gray-300">Chamadas</label>
                            <textarea id="chamadas" name="chamadas" value={sessionInfo.chamadas} onChange={handleSessionInfoChange} rows={4} className="bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none transition w-full"></textarea>
                        </div>
                        <div>
                           <label htmlFor="stories" className="block mb-1.5 text-sm font-medium text-gray-300">Histórias Contadas</label>
                           <textarea id="stories" name="stories" value={sessionInfo.stories} onChange={handleSessionInfoChange} rows={4} className="bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none transition w-full"></textarea>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <input type="checkbox" id="hasPhotoRecording" name="hasPhotoRecording" checked={sessionInfo.hasPhotoRecording} onChange={handleSessionInfoChange} className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-sky-600 focus:ring-sky-500"/>
                                <label htmlFor="hasPhotoRecording" className="text-sm font-medium text-gray-300">Houve registro fotográfico?</label>
                            </div>
                             <div className="flex items-center gap-3">
                                <input type="checkbox" id="hasAudioRecording" name="hasAudioRecording" checked={sessionInfo.hasAudioRecording} onChange={handleSessionInfoChange} className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-sky-600 focus:ring-sky-500"/>
                                <label htmlFor="hasAudioRecording" className="text-sm font-medium text-gray-300">Houve registro de áudio?</label>
                            </div>
                        </div>
                    </div>
                </Card>
                <Card title="Participantes">
                    <div className={formGridClass}>
                        <Input label="Quadro de Mestres" type="number" name="mestres" value={participants.mestres} onChange={handleParticipantChange} min="0" />
                        <Input label="Corpo do Conselho" type="number" name="conselho" value={participants.conselho} onChange={handleParticipantChange} min="0" />
                        <Input label="Corpo Instrutivo" type="number" name="corpoInstrutivo" value={participants.corpoInstrutivo} onChange={handleParticipantChange} min="0" />
                        <Input label="Quadro de Sócios" type="number" name="quadroDeSocios" value={participants.quadroDeSocios} onChange={handleParticipantChange} min="0" />
                        <Input label="Visitantes" type="number" name="visitantes" value={participants.visitantes} onChange={handleParticipantChange} min="0" />
                        <Input label="Jovens" type="number" name="jovens" value={participants.jovens} onChange={handleParticipantChange} min="0" />
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-700">
                        <p className="text-lg font-semibold text-right">
                            Total de Participantes: <span className="text-sky-400 font-mono">{totalParticipants}</span>
                        </p>
                    </div>
                </Card>
            </div>
            
            <Card title="Consumo de Vegetal">
                <div className="space-y-6">
                    <fieldset className="space-y-2">
                        <legend className="text-sm font-medium text-gray-300 mb-2">O vegetal foi unido?</legend>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="isUnited" checked={!consumption.isUnited} onChange={() => handleIsUnitedChange(false)} className="h-4 w-4 bg-gray-700 border-gray-600 text-sky-600 focus:ring-sky-500" />
                                Não
                            </label>
                             <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="isUnited" checked={consumption.isUnited} onChange={() => handleIsUnitedChange(true)} className="h-4 w-4 bg-gray-700 border-gray-600 text-sky-600 focus:ring-sky-500" />
                                Sim
                            </label>
                        </div>
                    </fieldset>

                    <div className="space-y-4">
                        {consumption.vegetals.map((veg, index) => (
                             <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                                <Select label={`Vegetal ${index + 1}`} value={veg.vegetalId} onChange={(e) => handleConsumedVegetalChange(index, 'vegetalId', e.target.value)}>
                                    <option value="">Selecione um vegetal</option>
                                    {availableStock.map(stockItem => (
                                        <option key={stockItem.id} value={stockItem.id}>
                                            {stockItem.name} ({stockItem.quantity.toLocaleString('pt-BR')} litros)
                                        </option>
                                    ))}
                                </Select>
                                <Input label="Quantidade Disponibilizada (litros)" type="number" step="0.001" value={veg.disponibilizada} onChange={(e) => handleConsumedVegetalChange(index, 'disponibilizada', e.target.value)} min="0" />
                            </div>
                        ))}
                    </div>
                     <Input label="Quantidade Total Consumida (litros)" type="number" name="totalConsumed" step="0.001" value={consumption.totalConsumed} onChange={handleConsumptionChange} min="0" required />
                </div>
            </Card>

            <div className="flex justify-end gap-4">
                {isEditing && (
                    <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
                )}
                <Button type="submit">{isEditing ? 'Atualizar Sessão' : 'Registrar Sessão'}</Button>
            </div>
        </form>
    );
};

export default SessionForm;