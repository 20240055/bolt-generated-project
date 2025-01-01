/*
  # Add candle URL to comments

  1. Changes
    - Add `candle_url` column to `comments` table for storing GIF URLs
*/

ALTER TABLE comments
ADD COLUMN candle_url text;
