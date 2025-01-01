import React from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface Condolence {
  id: string;
  name: string;
  content: string;
  created_at: string;
  candle_url?: string;
}

interface CondolenceListProps {
  condolences: Condolence[];
}

export function CondolenceList({ condolences }: CondolenceListProps) {
  return (
    <div className="space-y-4">
      {condolences.map((condolence) => (
        <div key={condolence.id} className="bg-white p-4 rounded-lg shadow-md">
          {condolence.candle_url && (
            <div className="flex justify-center mb-4">
              <img 
                src={condolence.candle_url} 
                alt="Kerze" 
                className="w-24 h-24 object-contain"
              />
            </div>
          )}
          <div className="flex justify-between items-start mb-2">
            <span className="font-medium">{condolence.name}</span>
            <span className="text-sm text-gray-500">
              {format(new Date(condolence.created_at), 'dd. MMMM yyyy', { locale: de })}
            </span>
          </div>
          <p className="text-gray-700">{condolence.content}</p>
        </div>
      ))}
    </div>
  );
}
