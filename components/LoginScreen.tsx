
import React, { useState } from 'react';
import { Leaf, Lock, User } from 'lucide-react';
import Button from './Button';
import Input from './Input';

interface LoginScreenProps {
    onLogin: (username: string, password: string) => boolean;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        const success = onLogin(username, password);
        if (!success) {
            setError('Credenciais inválidas. Verifique o nome e a senha.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-8">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-gray-700/50 p-3 rounded-full mb-4 border border-gray-600">
                        <Leaf className="text-sky-400" size={40} />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Registro de Sessões</h1>
                    <p className="text-gray-400 text-sm mt-2">Acesse para gerenciar sessões e estoque</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <div className="relative">
                            <User className="absolute left-3 top-[38px] text-gray-500" size={18} />
                            <Input 
                                label="Nome de Usuário" 
                                id="username" 
                                type="text" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                containerClassName="w-full"
                                className="pl-10"
                                placeholder="Ex: Mestre"
                                required
                            />
                        </div>
                    </div>
                    
                    <div>
                         <div className="relative">
                            <Lock className="absolute left-3 top-[38px] text-gray-500" size={18} />
                            <Input 
                                label="Senha" 
                                id="password" 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                containerClassName="w-full"
                                className="pl-10"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-900/30 border border-red-800 rounded-md text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <Button type="submit" className="w-full py-3 text-lg">
                        Entrar no Sistema
                    </Button>
                </form>
                
                <div className="mt-6 text-center text-xs text-gray-500">
                    Sistema de Controle Interno
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
