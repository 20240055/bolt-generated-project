/*
  # Add name field to comments table

  1. Changes
    - Add `name` column to `comments` table for storing commenter's name
    - Remove user_id requirement since comments are now public
    - Update RLS policies to allow public comments

  2. Security
    - Enable RLS on comments table
    - Allow public read access
    - Allow public write access with name and content validation
*/

-- Remove the user_id constraint and add name column
ALTER TABLE comments 
  DROP CONSTRAINT comments_user_id_fkey,
  DROP COLUMN user_id,
  ADD COLUMN name text NOT NULL;

-- Drop existing policies
DROP POLICY IF EXISTS "Kommentare sind öffentlich lesbar" ON comments;
DROP POLICY IF EXISTS "Authentifizierte Benutzer können kommentieren" ON comments;

-- Create new policies for public access
CREATE POLICY "Jeder kann Kommentare lesen"
  ON comments FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Jeder kann kommentieren"
  ON comments FOR INSERT
  TO public
  WITH CHECK (
    name IS NOT NULL AND
    content IS NOT NULL AND
    length(content) > 0 AND
    length(name) > 0
  );
