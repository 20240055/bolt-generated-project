/*
  # Create storage bucket for obituary photos

  1. Storage
    - Create a new public bucket for storing obituary photos
    - Enable public access for reading photos
*/

-- Create the storage bucket for obituary photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('obituary-photos', 'obituary-photos', true);

-- Allow public access to read photos
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'obituary-photos');

-- Allow authenticated users to upload photos
CREATE POLICY "Authenticated users can upload photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'obituary-photos');
