
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface StatEntry {
  id: string;
  timestamp: string;
  date: string;
  time: string;
  count: number;
}

export const useStats = () => {
  const [stats, setStats] = useState<StatEntry[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
    loadTotalCount();
  }, []);

  const loadStats = async () => {
    try {
      const { data, error } = await supabase
        .from('alina_stats')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Error loading stats:', error);
        return;
      }

      if (data) {
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTotalCount = async () => {
    try {
      const { data, error } = await supabase
        .from('alina_counter')
        .select('total_count')
        .single();

      if (error) {
        console.error('Error loading total count:', error);
        return;
      }

      if (data) {
        setTotalCount(data.total_count);
      }
    } catch (error) {
      console.error('Error loading total count:', error);
    }
  };

  return {
    stats,
    totalCount,
    isLoading,
    refreshStats: loadStats
  };
};
