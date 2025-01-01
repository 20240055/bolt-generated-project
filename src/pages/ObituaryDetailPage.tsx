import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { supabase } from '../lib/supabase';
import { CondolenceForm } from '../components/CondolenceForm';
import { CondolenceList } from '../components/CondolenceList';

interface Obituary {
  id: string;
  name: string;
  birth_date: string;
  death_date: string;
  photo_url: string;
  description: string;
  funeral_date: string;
  funeral_location: string;
}

interface Condolence {
  id: string;
  name: string;
  content: string;
  created_at: string;
  candle_url?: string;
}

export function ObituaryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [obituary, setObituary] = useState<Obituary | null>(null);
  const [condolences, setCondolences] = useState<Condolence[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadObituary() {
    if (!id) return;

    const { data, error } = await supabase
      .from('obituaries')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && data) {
      setObituary(data);
    }
  }

  async function loadCondolences() {
    if (!id) return;

    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('obituary_id', id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setCondolences(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadObituary();
    loadCondolences();
  }, [id]);

  if (loading || !obituary) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-900 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* A4-style obituary card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row min-h-[29.7cm] w-full">
            {/* Left side - Photo */}
            <div className="md:w-1/2 bg-gray-100">
              <img
                src={obituary.photo_url || 'https://images.unsplash.com/photo-1501446529957-6226bd447c46'}
                alt={obituary.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Right side - Details */}
            <div className="md:w-1/2 p-8 flex flex-col">
              <div className="flex-grow">
                <h1 className="text-4xl font-serif mb-6">{obituary.name}</h1>
                <div className="space-y-6">
                  <div>
                    <p className="text-xl text-gray-600">
                      * {format(new Date(obituary.birth_date), 'dd. MMMM yyyy', { locale: de })}
                    </p>
                    <p className="text-xl text-gray-600">
                      † {format(new Date(obituary.death_date), 'dd. MMMM yyyy', { locale: de })}
                    </p>
                  </div>

                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-line text-lg">
                      {obituary.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6 mt-8">
                <h2 className="text-2xl font-serif mb-4">Begräbnis</h2>
                <p className="text-lg text-gray-700 mb-2">
                  {format(new Date(obituary.funeral_date), 'EEEE, dd. MMMM yyyy', { locale: de })}
                  <br />
                  {format(new Date(obituary.funeral_date), 'HH:mm', { locale: de })} Uhr
                </p>
                <p className="text-lg text-gray-700">{obituary.funeral_location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Condolences section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-serif mb-4">Kondolenzen</h2>
            <CondolenceList condolences={condolences} />
          </div>
          <div>
            <CondolenceForm 
              obituaryId={obituary.id} 
              onCondolenceAdded={loadCondolences}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
