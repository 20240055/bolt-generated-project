import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Upload, Calendar } from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { UploadProgress } from '../components/UploadProgress';
import { ImageCropper } from '../components/ImageCropper';

export function CreateObituaryPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [cropData, setCropData] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    birth_date: '',
    death_date: '',
    description: '',
    funeral_date: '',
    funeral_location: '',
    photo_url: '',
  });

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      setLoading(true);
      setUploadProgress(0);

      const { error: uploadError, data } = await supabase.storage
        .from('obituary-photos')
        .upload(filePath, file, {
          onUploadProgress: (progress) => {
            const percent = (progress.loaded / progress.total) * 100;
            setUploadProgress(Math.round(percent));
          },
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('obituary-photos')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, photo_url: publicUrl }));
    } catch (error) {
      console.error('Error uploading photo:', error);
      setError('Fehler beim Hochladen des Fotos');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: insertError } = await supabase
        .from('obituaries')
        .insert([
          {
            ...formData,
            user_id: user?.id,
            crop_data: cropData
          }
        ]);

      if (insertError) throw insertError;
      navigate('/');
    } catch (error) {
      console.error('Error creating obituary:', error);
      setError('Fehler beim Erstellen der Parte');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-serif text-center mb-8">Neue Parte erstellen</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foto
              </label>
              <div className="flex items-center justify-center w-full">
                {!formData.photo_url ? (
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Klicken</span> oder Foto hierher ziehen
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                    />
                  </label>
                ) : (
                  <div className="w-full">
                    <ImageCropper
                      imageUrl={formData.photo_url}
                      onCropComplete={setCropData}
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Wählen Sie den sichtbaren Bereich für die Startseite aus
                    </p>
                  </div>
                )}
              </div>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <UploadProgress progress={uploadProgress} />
              )}
            </div>

            {/* Rest of the form remains the same */}
          </div>
        </form>
      </div>
    </div>
  );
}
