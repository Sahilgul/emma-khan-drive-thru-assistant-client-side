// src/services/dashboardApi.ts

export interface DashboardData {
  salesOverview: {
    revenue: {
      value: number;
      comparedTo: number;
      percentage: number;
      rangeType: string;
    };
    totalSales: {
      value: number;
      comparedTo: number;
      percentage: number;
      rangeType: string;
    };
    driveThruOrders: {
      value: number;
      comparedTo: number;
      percentage: number;
      rangeType: string;
    };
    avgOrderValue: {
      value: number;
      comparedTo: number;
      percentage: number;
      rangeType: string;
    };
  };
  revenueTrend: {
    currentPeriod: {
      monday: number;
      tuesday: number;
      wednesday: number;
      thursday: number;
      friday: number;
      saturday: number;
      sunday: number;
    };
    lastPeriod: {
      monday: number;
      tuesday: number;
      wednesday: number;
      thursday: number;
      friday: number;
      saturday: number;
      sunday: number;
    };
  };
  upsellingPerformance: {
    combos: number;
  };
  driveThruCustomers: {
    count: number;
    lastSevenDays: {
      monday: number;
      tuesday: number;
      wednesday: number;
      thursday: number;
      friday: number;
      saturday: number;
      sunday: number;
    };
  };
  refunds: {
    percent: number;
    totalAmount: number;
  };
  peakHours: {
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
    saturday: number;
    sunday: number;
  };
  recentOrders: Array<{
    id: string;
    name: string;
    orderNumber: string;
    customer: string;
    price: number;
    status: string;
  }>;
}

export const fetchDashboardData = async (
  restaurantId: string,
  startDate?: string,
  endDate?: string
): Promise<DashboardData> => {

  const baseUrl = import.meta.env.VITE_API_BASE_URL; 
  const url = new URL(`${baseUrl}/dashboard/${restaurantId}`);
  
  if (startDate) {
    url.searchParams.append('start_date', startDate);
  }
  if (endDate) {
    url.searchParams.append('end_date', endDate);
  }

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

// Utility function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

// Utility function to get date range for current month
export const getCurrentMonthRange = (): { startDate: string; endDate: string } => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
};