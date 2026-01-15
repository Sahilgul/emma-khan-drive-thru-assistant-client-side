// src/hooks/useDashboardData.ts
import { useState, useEffect, useCallback } from 'react';
import { fetchDashboardData, getCurrentMonthRange, type DashboardData } from '../services/dashboardService';

interface UseDashboardDataProps {
  restaurantId: string;
  startDate?: string;
  endDate?: string;
}

export const useDashboardData = ({ restaurantId, startDate, endDate }: UseDashboardDataProps) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const dateRange = startDate && endDate ? { startDate, endDate } : getCurrentMonthRange();
      
      const dashboardData = await fetchDashboardData(
        restaurantId,
        dateRange.startDate,
        dateRange.endDate
      );
      
      setData(dashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [restaurantId, startDate, endDate]);

  useEffect(() => {
    if (restaurantId) {
      loadData();
    }
  }, [restaurantId, loadData]);

  return { 
    data, 
    loading, 
    error, 
    refetch: loadData 
  };
};