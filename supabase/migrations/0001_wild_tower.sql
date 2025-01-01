/*
  # Initial Schema für Bestattungsportal

  1. Neue Tabellen
    - `obituaries` (Parte)
      - `id` (uuid, Primärschlüssel)
      - `name` (text) - Name der verstorbenen Person
      - `birth_date` (date) - Geburtsdatum
      - `death_date` (date) - Sterbedatum
      - `photo_url` (text) - Foto URL
      - `description` (text) - Partentext
      - `funeral_date` (timestamptz) - Begräbnistermin
      - `funeral_location` (text) - Begräbnisort
      - `created_at` (timestamptz)
      - `user_id` (uuid) - Referenz zum Ersteller

    - `comments` (Kommentare)
      - `id` (uuid, Primärschlüssel)
      - `obituary_id` (uuid) - Referenz zur Parte
      - `user_id` (uuid) - Referenz zum Kommentarersteller
      - `content` (text) - Kommentartext
      - `created_at` (timestamptz)

    - `candles` (Virtuelle Kerzen)
      - `id` (uuid, Primärschlüssel)
      - `obituary_id` (uuid) - Referenz zur Parte
      - `user_id` (uuid) - Referenz zum Ersteller
      - `message` (text) - Optionale Nachricht
      - `created_at` (timestamptz)

  2. Sicherheit
    - RLS für alle Tabellen aktiviert
    - Policies für Lesen/Schreiben definiert
*/

-- Parte Tabelle
CREATE TABLE obituaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  birth_date date NOT NULL,
  death_date date NOT NULL,
  photo_url text,
  description text NOT NULL,
  funeral_date timestamptz NOT NULL,
  funeral_location text NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

ALTER TABLE obituaries ENABLE ROW LEVEL SECURITY;

-- Jeder kann Parten sehen
CREATE POLICY "Parten sind öffentlich lesbar"
  ON obituaries FOR SELECT
  TO public
  USING (true);

-- Nur authentifizierte Benutzer können Parten erstellen
CREATE POLICY "Authentifizierte Benutzer können Parten erstellen"
  ON obituaries FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Kommentare Tabelle
CREATE TABLE comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  obituary_id uuid REFERENCES obituaries(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Jeder kann Kommentare sehen
CREATE POLICY "Kommentare sind öffentlich lesbar"
  ON comments FOR SELECT
  TO public
  USING (true);

-- Authentifizierte Benutzer können kommentieren
CREATE POLICY "Authentifizierte Benutzer können kommentieren"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Virtuelle Kerzen Tabelle
CREATE TABLE candles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  obituary_id uuid REFERENCES obituaries(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE candles ENABLE ROW LEVEL SECURITY;

-- Jeder kann Kerzen sehen
CREATE POLICY "Kerzen sind öffentlich lesbar"
  ON candles FOR SELECT
  TO public
  USING (true);

-- Authentifizierte Benutzer können Kerzen anzünden
CREATE POLICY "Authentifizierte Benutzer können Kerzen anzünden"
  ON candles FOR INSERT
  TO authenticated
  WITH CHECK (true);
