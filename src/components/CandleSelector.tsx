import React from 'react';

const CANDLE_TYPES = [
  { id: 'candle1', url: 'https://i.gifer.com/origin/89/8938980d93576eb34547b965cc46ef10.gif', label: 'Klassische Kerze' },
  { id: 'candle2', url: 'https://static.wixstatic.com/media/709c35_5ec0ab577e70493bb995b711b98f1dcd~mv2.gif', label: 'Gedenkkerze' },
  { id: 'candle3', url: 'https://www.bestattung-kroell.at/UserFiles/structure/kerze.gif', label: 'Trauerkerze' },
  { id: 'candle4', url: 'https://www.bestattungen-heidenreich.eu/wp-content/themes/basic6/gedenkkerzen/1.gif', label: 'Hoffnungskerze' },
];

interface CandleSelectorProps {
  onSelect: (candleUrl: string) => void;
}

export function CandleSelector({ onSelect }: CandleSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      {CANDLE_TYPES.map((candle) => (
        <button
          key={candle.id}
          onClick={() => onSelect(candle.url)}
          className="flex flex-col items-center p-2 border rounded-lg hover:border-gray-400 transition-colors"
        >
          <img src={candle.url} alt={candle.label} className="w-24 h-24 object-contain" />
          <span className="mt-2 text-sm text-gray-600">{candle.label}</span>
        </button>
      ))}
    </div>
  );
}
