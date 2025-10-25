/*
  # MediScan Database Schema

  1. New Tables
    - `symptom_analyses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, nullable for anonymous users)
      - `symptoms` (text, user's symptom description)
      - `conditions` (jsonb, predicted conditions with confidence)
      - `created_at` (timestamptz)
    
    - `chat_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, nullable for anonymous users)
      - `messages` (jsonb, array of chat messages)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on all tables
    - Allow anonymous users to insert their own records
    - Users can only read their own data
    
  3. Important Notes
    - All data is stored with proper indexing for performance
    - JSONB format allows flexible storage of AI results
    - Anonymous usage is supported for privacy
*/

-- Create symptom_analyses table
CREATE TABLE IF NOT EXISTS symptom_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  symptoms text NOT NULL,
  conditions jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  messages jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_symptom_analyses_created_at ON symptom_analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_at ON chat_sessions(created_at DESC);

-- Enable Row Level Security
ALTER TABLE symptom_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for symptom_analyses
CREATE POLICY "Anyone can insert symptom analyses"
  ON symptom_analyses FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view own analyses"
  ON symptom_analyses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for chat_sessions
CREATE POLICY "Anyone can insert chat sessions"
  ON chat_sessions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view own chat sessions"
  ON chat_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own chat sessions"
  ON chat_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can update anonymous chat sessions"
  ON chat_sessions FOR UPDATE
  TO anon, authenticated
  USING (user_id IS NULL)
  WITH CHECK (user_id IS NULL);