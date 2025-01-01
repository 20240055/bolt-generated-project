import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ObituaryCard } from '../components/ObituaryCard';

export function HomePage() {
  const [obituaries, setObituaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadObituaries() {
      const { data, error } = await supabase
        .from('obituaries')
        .select('*')
        .order('funeral_date', { ascending: true });

      if (!error) {
        setObituaries(data);
      }
      setLoading(false);
    }

    loadObituaries();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-900 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-serif text-center mb-12">In liebevoller Erinnerung</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {obituaries.map((obituary) => (
          <ObituaryCard
            key={obituary.id}
            obituary={obituary}
            candleCount={0}
            commentCount={0}
          />
        ))}
      </div>
    </div>
  );
}
