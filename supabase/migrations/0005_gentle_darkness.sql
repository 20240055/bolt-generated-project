/*
  # Add crop data to obituaries

  1. Changes
    - Add crop_data JSON column to obituaries table for storing image crop information
*/

ALTER TABLE obituaries
ADD COLUMN crop_data jsonb;
