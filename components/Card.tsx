import React from 'react';

interface CardProps {
    title: string;
    children: React.ReactNode;
    className?: string;
    footer?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children, className = '', footer }) => {
    return (
        <div className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg flex flex-col ${className}`}>
            <div className="px-6 py-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-sky-400">{title}</h2>
            </div>
            <div className="p-6 flex-grow">
                {children}
            </div>
            {footer && (
                <div className="px-6 py-3 bg-gray-900/20 border-t border-gray-700 rounded-b-xl">
                    {footer}
                </div>
            )}
        </div>
    );
};

export default Card;
