
-- Создаем таблицу для хранения статистики каждого клика
CREATE TABLE public.alina_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  time TIME NOT NULL DEFAULT CURRENT_TIME,
  count INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем таблицу для хранения общего счетчика
CREATE TABLE public.alina_counter (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  total_count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Вставляем начальную запись счетчика
INSERT INTO public.alina_counter (total_count) VALUES (0);

-- Включаем Row Level Security (делаем таблицы публичными для этого приложения)
ALTER TABLE public.alina_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alina_counter ENABLE ROW LEVEL SECURITY;

-- Создаем политики для публичного доступа к данным
CREATE POLICY "Allow public read access to alina_stats" 
  ON public.alina_stats 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public insert access to alina_stats" 
  ON public.alina_stats 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow public read access to alina_counter" 
  ON public.alina_counter 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow public update access to alina_counter" 
  ON public.alina_counter 
  FOR UPDATE 
  USING (true);
