import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Flame } from 'lucide-react';

interface LightCandleProps {
  obituaryId: string;
  onCandleLit: () => void;
}

export function LightCandle({ obituaryId, onCandleLit }: LightCandleProps) {
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: insertError } = await supabase
        .from('candles')
        .insert([
          {
            obituary_id: obituaryId,
            message,
            name,
          }
        ]);

      if (insertError) throw insertError;
      
      setMessage('');
      setName('');
      onCandleLit();
    } catch (error) {
      console.error('Error lighting candle:', error);
      setError('Fehler beim Anzünden der Kerze');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-serif mb-4 flex items-center">
        <Flame className="h-5 w-5 mr-2 text-amber-500" />
        Eine Kerze anzünden
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ihr Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ihre Nachricht (optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
            rows={3}
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 text-white py-2 px-4 rounded-md hover:bg-amber-600 transition-colors disabled:bg-amber-300"
        >
          {loading ? 'Wird angezündet...' : 'Kerze anzünden'}
        </button>
      </form>
    </div>
  );
}
