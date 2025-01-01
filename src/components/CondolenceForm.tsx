import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { CandleSelector } from './CandleSelector';

interface CondolenceFormProps {
  obituaryId: string;
  onCondolenceAdded: () => void;
}

export function CondolenceForm({ obituaryId, onCondolenceAdded }: CondolenceFormProps) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [candleUrl, setCandleUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: insertError } = await supabase
        .from('comments')
        .insert([
          {
            obituary_id: obituaryId,
            name,
            content: message,
            candle_url: candleUrl
          }
        ]);

      if (insertError) throw insertError;
      
      setName('');
      setMessage('');
      setCandleUrl('');
      onCondolenceAdded();
    } catch (error) {
      console.error('Error adding condolence:', error);
      setError('Fehler beim Speichern der Kondolenz');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-serif mb-4">Kondolieren</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Wählen Sie eine Kerze
          </label>
          <CandleSelector onSelect={setCandleUrl} />
        </div>

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
            Ihre Kondolenz
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
            rows={3}
            required
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !candleUrl}
          className="w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400"
        >
          {loading ? 'Wird gespeichert...' : 'Kondolenz mit Kerze senden'}
        </button>
      </form>
    </div>
  );
}
