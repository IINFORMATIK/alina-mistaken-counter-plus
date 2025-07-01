
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useCounter = () => {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Загружаем текущий счетчик при инициализации
  useEffect(() => {
    loadCounter();
  }, []);

  const loadCounter = async () => {
    try {
      const { data, error } = await supabase
        .from('alina_counter')
        .select('total_count')
        .single();

      if (error) {
        console.error('Error loading counter:', error);
        return;
      }

      if (data) {
        setCount(data.total_count);
      }
    } catch (error) {
      console.error('Error loading counter:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const incrementCounter = async () => {
    try {
      // Увеличиваем счетчик на 1
      const newCount = count + 1;
      
      // Обновляем общий счетчик
      const { error: counterError } = await supabase
        .from('alina_counter')
        .update({ 
          total_count: newCount,
          updated_at: new Date().toISOString()
        })
        .eq('id', (await supabase.from('alina_counter').select('id').single()).data?.id);

      if (counterError) {
        console.error('Error updating counter:', counterError);
        return;
      }

      // Добавляем запись в статистику
      const now = new Date();
      const { error: statsError } = await supabase
        .from('alina_stats')
        .insert({
          timestamp: now.toISOString(),
          date: now.toDateString(),
          time: now.toTimeString().split(' ')[0],
          count: newCount
        });

      if (statsError) {
        console.error('Error adding stats:', statsError);
        return;
      }

      // Обновляем локальное состояние
      setCount(newCount);
    } catch (error) {
      console.error('Error incrementing counter:', error);
    }
  };

  return {
    count,
    isLoading,
    incrementCounter
  };
};
