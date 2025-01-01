import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface ObituaryCardProps {
  obituary: {
    id: string;
    name: string;
    birth_date: string;
    death_date: string;
    photo_url: string;
    description: string;
    funeral_date: string;
    funeral_location: string;
    crop_data?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  };
}

export function ObituaryCard({ obituary }: ObituaryCardProps) {
  const imageStyle = obituary.crop_data ? {
    objectPosition: `${obituary.crop_data.x * 100}% ${obituary.crop_data.y * 100}%`,
    objectFit: 'cover' as const,
  } : {
    objectFit: 'cover' as const,
  };

  return (
    <Link to={`/parte/${obituary.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-w-16 aspect-h-9">
          <img
            src={obituary.photo_url || 'https://images.unsplash.com/photo-1501446529957-6226bd447c46'}
            alt={obituary.name}
            className="w-full h-64"
            style={imageStyle}
          />
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-serif mb-2">{obituary.name}</h2>
          <p className="text-gray-600 mb-4">
            * {format(new Date(obituary.birth_date), 'dd. MMMM yyyy', { locale: de })}
            <br />
            † {format(new Date(obituary.death_date), 'dd. MMMM yyyy', { locale: de })}
          </p>
          <p className="text-gray-700 mb-4 line-clamp-3">{obituary.description}</p>
          <div className="border-t pt-4">
            <p className="text-gray-600 mb-2">
              <strong>Begräbnis:</strong>{' '}
              {format(new Date(obituary.funeral_date), 'dd. MMMM yyyy HH:mm', { locale: de })}
            </p>
            <p className="text-gray-600">{obituary.funeral_location}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
