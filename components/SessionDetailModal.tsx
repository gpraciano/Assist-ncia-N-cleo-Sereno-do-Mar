
import React from 'react';
import { Session, Vegetal } from '../types';
import { X } from 'lucide-react';
import Button from './Button';

interface SessionDetailModalProps {
    session: Session;
    historicalStock: Vegetal[];
    onClose: () => void;
    onEdit: (session: Session) => void;
}

const DetailItem: React.FC<{ label: string; value?: string | number | null | boolean }> = ({ label, value }) => {
    const displayValue = value === true ? 'Sim' : value === false ? 'Não' : value ?? 'Não informado';
    return (
        <div>
            <p className="text-sm text-gray-400">{label}</p>
            <p className="font-semibold text-white">{String(displayValue)}</p>
        </div>
    );
};

const SessionDetailModal: React.FC<SessionDetailModalProps> = ({ session, historicalStock, onClose, onEdit }) => {
    // Fix: Explicitly type the accumulator for `reduce` to ensure type safety.
    const totalParticipants = Object.values(session.participants).reduce<number>((sum, count) => sum + Number(count), 0);
    const getVegetalName = (id: string) => historicalStock.find(v => v.id === id)?.name || 'ID Desconhecido';

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-600 relative">
                <div className="sticky top-0 bg-gray-800/80 backdrop-blur-md px-6 py-4 border-b border-gray-700 z-10 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-sky-400">Detalhes da Sessão</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* General Info */}
                    <section>
                        <h3 className="text-lg font-semibold text-gray-300 border-b border-gray-700 pb-2 mb-4">Informações Gerais</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <DetailItem label="Data" value={new Date(session.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })} />
                            <DetailItem label="Tipo" value={session.type} />
                            <DetailItem label="Dirigiu" value={session.dirigente} />
                            <DetailItem label="Explanação" value={session.explanator} />
                            <DetailItem label="Leitura" value={session.reader} />
                            <DetailItem label="Mestre Assistente" value={session.assistantMaster} />
                        </div>
                    </section>

                    {/* Content */}
                    <section>
                        <h3 className="text-lg font-semibold text-gray-300 border-b border-gray-700 pb-2 mb-4">Conteúdo</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div>
                                <p className="text-sm text-gray-400 mb-1">Chamadas</p>
                                <p className="text-white bg-gray-900/50 p-3 rounded-md whitespace-pre-wrap">{session.chamadas || 'Não informado'}</p>
                           </div>
                           <div>
                                <p className="text-sm text-gray-400 mb-1">Histórias</p>
                                <p className="text-white bg-gray-900/50 p-3 rounded-md whitespace-pre-wrap">{session.stories || 'Não informado'}</p>
                           </div>
                        </div>
                         <div className="grid grid-cols-2 gap-4 mt-4">
                            <DetailItem label="Registro Fotográfico" value={session.hasPhotoRecording} />
                            <DetailItem label="Registro de Áudio" value={session.hasAudioRecording} />
                        </div>
                    </section>

                    {/* Participants */}
                     <section>
                        <h3 className="text-lg font-semibold text-gray-300 border-b border-gray-700 pb-2 mb-4">Participantes ({totalParticipants} no total)</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                           <DetailItem label="Quadro de Mestres" value={session.participants.mestres} />
                           <DetailItem label="Corpo do Conselho" value={session.participants.conselho} />
                           <DetailItem label="Corpo Instrutivo" value={session.participants.corpoInstrutivo} />
                           <DetailItem label="Quadro de Sócios" value={session.participants.quadroDeSocios} />
                           <DetailItem label="Visitantes" value={session.participants.visitantes} />
                           <DetailItem label="Jovens" value={session.participants.jovens} />
                        </div>
                    </section>

                     {/* Consumption */}
                    <section>
                        <h3 className="text-lg font-semibold text-gray-300 border-b border-gray-700 pb-2 mb-4">Consumo de Vegetal</h3>
                        <div className="space-y-4">
                            <DetailItem label="Vegetal Unido?" value={session.consumption.isUnited} />
                            <div>
                                <p className="text-sm text-gray-400 mb-2">Vegetais Utilizados:</p>
                                <ul className="space-y-2">
                                {session.consumption.vegetals.map((v, i) => (
                                    <li key={i} className="flex justify-between items-center bg-gray-900/50 p-3 rounded-md">
                                        <span className="text-white">{getVegetalName(v.vegetalId)}</span>
                                        <span className="font-mono text-gray-300">{v.disponibilizada.toLocaleString('pt-BR')} L</span>
                                    </li>
                                ))}
                                </ul>
                            </div>
                            <div className="text-right mt-4 pt-4 border-t border-gray-700">
                                <p className="text-gray-400">Total Consumido</p>
                                <p className="text-xl font-bold font-mono text-sky-400">{session.consumption.totalConsumed.toLocaleString('pt-BR')} L</p>
                            </div>
                        </div>
                    </section>
                </div>
                 <div className="sticky bottom-0 px-6 py-4 bg-gray-900/50 flex justify-end gap-4 rounded-b-xl border-t border-gray-700">
                    <Button variant="secondary" onClick={onClose}>Fechar</Button>
                    <Button onClick={() => onEdit(session)}>Editar</Button>
                </div>
            </div>
        </div>
    );
};

export default SessionDetailModal;