import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
  type ChartData,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { TrendingUp, TrendingDown, Calendar, ChevronDown, Loader, AlertCircle, Database } from "lucide-react";

import { formatCurrency } from "../../services/dashboardService";
import { useDashboardData } from "../../hooks/useDashboardData";
import { useAuth } from "../../hooks/useAuth";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// State Components
const LoadingState: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px] h-[60vh] text-teal-600 p-4">
    <Loader className="animate-spin mb-4" size={40} />
    <h3 className="text-lg sm:text-xl font-semibold text-slate-700 text-center">Loading Dashboard...</h3>
  </div>
);

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] h-[60vh] text-red-500 p-4 text-center">
    <AlertCircle size={40} className="mb-4" />
    <h3 className="text-lg sm:text-xl font-semibold text-slate-800">Something went wrong</h3>
    <p className="text-sm sm:text-base text-slate-500 mb-6 max-w-md">{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="w-full sm:w-auto px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
        Try Again
      </button>
    )}
  </div>
);

const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px] h-[60vh] text-slate-400 p-4 text-center">
    <Database size={40} className="mb-4" />
    <h3 className="text-lg sm:text-xl font-semibold text-slate-700">No Data Available</h3>
    <p className="text-sm sm:text-base">No dashboard data found for the selected period</p>
  </div>
);

type DateRangeType = 'today' | 'week' | 'month' | 'custom';

interface DateRange {
  type: DateRangeType;
  startDate: string;
  endDate: string;
  label: string;
}

const Dashboard: React.FC = () => {

  const [dateRange, setDateRange] = useState<DateRange>({
    type: 'month',
    startDate: getCurrentMonthStart(),
    endDate: getCurrentMonthEnd(),
    label: 'Month'
  });

  const [showDateDropdown, setShowDateDropdown] = useState(false);

  const { user } = useAuth();
  const restaurantId = user?.userId || ""; // Replace with dynamic ID

  const { data, loading, error, refetch } = useDashboardData({
    restaurantId,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate
  });


  function getTodayRange(): DateRange {
    const today = new Date().toISOString().split('T')[0];
    return {
      type: 'today',
      startDate: today,
      endDate: today,
      label: 'Today'
    };
  }

  function getWeekRange(): DateRange {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return {
      type: 'week',
      startDate: startOfWeek.toISOString().split('T')[0],
      endDate: endOfWeek.toISOString().split('T')[0],
      label: 'Week'
    };
  }

  function getCurrentMonthStart(): string {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  }

  function getCurrentMonthEnd(): string {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
  }

  function getMonthRange(): DateRange {
    return {
      type: 'month',
      startDate: getCurrentMonthStart(),
      endDate: getCurrentMonthEnd(),
      label: 'Month'
    };
  }

  // Date range handlers
  const handleDateRangeSelect = (rangeType: DateRangeType) => {
    let newRange: DateRange;

    switch (rangeType) {
      case 'today':
        newRange = getTodayRange();
        break;
      case 'week':
        newRange = getWeekRange();
        break;
      case 'month':
        newRange = getMonthRange();
        break;
      case 'custom':
        // For custom, you might want to open a date picker modal
        // For now, we'll use a default custom range (last 30 days)
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 30);

        newRange = {
          type: 'custom',
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          label: 'Custom'
        };
        break;
      default:
        newRange = getMonthRange();
    }

    setDateRange(newRange);
    setShowDateDropdown(false);
  };

  // Handle retry
  const handleRetry = () => {
    refetch?.();
  };

  // Show loading state
  if (loading) {
    return <LoadingState />;
  }

  // Show error state
  if (error) {
    return (
      <ErrorState
        message="Unable to load dashboard data!"
        onRetry={handleRetry}
      />
    );
  }

  // Show empty state if no data
  if (!data) {
    return <EmptyState />;
  }

  // Validate essential data structure to prevent crashes
  if (
    !data.revenueTrend?.currentPeriod ||
    !data.salesOverview ||
    !data.upsellingPerformance ||
    !data.driveThruCustomers?.lastSevenDays ||
    !data.refunds ||
    !data.peakHours ||
    !data.recentOrders
  ) {
    console.error("Dashboard: Data structure is invalid or incomplete", data);
    return (
      <ErrorState
        message="Received incomplete data from server."
        onRetry={handleRetry}
      />
    );
  }

  // ===== Line Chart (Revenue Trend) =====
  const lineData: ChartData<"line"> = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Current",
        data: [
          data.revenueTrend.currentPeriod.monday,
          data.revenueTrend.currentPeriod.tuesday,
          data.revenueTrend.currentPeriod.wednesday,
          data.revenueTrend.currentPeriod.thursday,
          data.revenueTrend.currentPeriod.friday,
          data.revenueTrend.currentPeriod.saturday,
          data.revenueTrend.currentPeriod.sunday,
        ],
        borderColor: "#0d9488", // teal-600
        backgroundColor: "rgba(13, 148, 136, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#0d9488",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: "Last Month",
        data: [
          data.revenueTrend.lastPeriod.monday,
          data.revenueTrend.lastPeriod.tuesday,
          data.revenueTrend.lastPeriod.wednesday,
          data.revenueTrend.lastPeriod.thursday,
          data.revenueTrend.lastPeriod.friday,
          data.revenueTrend.lastPeriod.saturday,
          data.revenueTrend.lastPeriod.sunday,
        ],
        borderColor: "#cbd5e1", // slate-300
        backgroundColor: "rgba(203, 213, 225, 0.1)",
        fill: true,
        tension: 0.4,
        borderDash: [5, 5],
        pointRadius: 0,
        pointHoverRadius: 0,
      },
    ],
  };

  const lineOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#64748b" } },
      y: { grid: { color: "#f1f5f9" }, ticks: { color: "#64748b" } },
    },
  };

  // ===== Doughnut Chart (Upselling) =====
  const doughnutUpsellData: ChartData<"doughnut"> = {
    labels: ["Combos", "Regular"],
    datasets: [
      {
        data: [data.upsellingPerformance.combos, 100 - data.upsellingPerformance.combos],
        backgroundColor: ["#0d9488", "#e2e8f0"], // teal-600, slate-200
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const doughnutUpsellOptions: ChartOptions<"doughnut"> = {
    cutout: "75%",
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          color: "#475569",
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
        },
      },
    },
  };

  // ===== Line Chart (Drive Thru) =====
  const driveThruValues = [
    data.driveThruCustomers.lastSevenDays.monday,
    data.driveThruCustomers.lastSevenDays.tuesday,
    data.driveThruCustomers.lastSevenDays.wednesday,
    data.driveThruCustomers.lastSevenDays.thursday,
    data.driveThruCustomers.lastSevenDays.friday,
    data.driveThruCustomers.lastSevenDays.saturday,
    data.driveThruCustomers.lastSevenDays.sunday,
  ].map(value => value === null ? 0 : Math.round(value)); // Handle null values

  const maxValue = Math.max(...driveThruValues);
  const minValue = Math.min(...driveThruValues);

  const driveThruData: ChartData<"line"> = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Customers",
        data: driveThruValues,
        borderColor: "#0891b2", // cyan-600
        backgroundColor: "rgba(8, 145, 178, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#0891b2",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const driveThruOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        titleColor: '#f8fafc',
        bodyColor: '#f8fafc',
        callbacks: {
          label: function (context) {
            return `Customers: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#64748b" }
      },
      y: {
        grid: { color: "#f1f5f9" },
        ticks: {
          color: "#64748b",
          precision: 0,
          stepSize: maxValue - minValue <= 10 ? 1 : Math.ceil((maxValue - minValue) / 10),
        },
        beginAtZero: true,
        min: 0,
        max: maxValue === 0 ? 10 : Math.ceil(maxValue * 1.1),
      },
    },
  };

  // ===== Doughnut Chart (Refunds) =====
  const refundData: ChartData<"doughnut"> = {
    labels: ["Refunds", "Successful"],
    datasets: [
      {
        data: [data.refunds.percent, 100 - data.refunds.percent],
        backgroundColor: ["#ef4444", "#fee2e2"], // red-500, red-100
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const refundOptions: ChartOptions<"doughnut"> = {
    cutout: "75%",
    plugins: {
      tooltip: { enabled: false }, // Disable tooltip for cleaner look if desired
      legend: {
        display: true,
        position: "bottom",
        labels: {
          color: "#475569",
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
        },
      },
    },
  };

  // ===== Bar Chart (Peak Hours) =====
  const peakHoursData: ChartData<"bar"> = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Current",
        data: [
          data.peakHours.monday,
          data.peakHours.tuesday,
          data.peakHours.wednesday,
          data.peakHours.thursday,
          data.peakHours.friday,
          data.peakHours.saturday,
          data.peakHours.sunday,
        ],
        backgroundColor: "#0d9488", // teal-600
        borderRadius: 4,
        hoverBackgroundColor: "#0f766e",
      },
    ],
  };

  const peakHoursOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#64748b" } },
      y: { grid: { color: "#f1f5f9" }, ticks: { color: "#64748b" } },
    },
  };

  // Format KPI data from API
  const kpiData = [
    {
      title: "Revenue",
      value: formatCurrency(data.salesOverview.revenue.value),
      change: `${data.salesOverview.revenue.percentage > 0 ? '+' : ''}${data.salesOverview.revenue.percentage}%`,
      up: data.salesOverview.revenue.percentage > 0,
      desc: `Compared to (${formatCurrency(data.salesOverview.revenue.comparedTo)} last ${data.salesOverview.revenue.rangeType})`
    },
    {
      title: "Total Sales",
      value: formatCurrency(data.salesOverview.totalSales.value),
      change: `${data.salesOverview.totalSales.percentage > 0 ? '+' : ''}${data.salesOverview.totalSales.percentage}%`,
      up: data.salesOverview.totalSales.percentage > 0,
      desc: `Compared to (${formatCurrency(data.salesOverview.totalSales.comparedTo)} last ${data.salesOverview.totalSales.rangeType})`
    },
    {
      title: "Drive Thru Orders",
      value: formatCurrency(data.salesOverview.driveThruOrders.value),
      change: `${data.salesOverview.driveThruOrders.percentage > 0 ? '+' : ''}${data.salesOverview.driveThruOrders.percentage}%`,
      up: data.salesOverview.driveThruOrders.percentage > 0,
      desc: `Compared to (${formatCurrency(data.salesOverview.driveThruOrders.comparedTo)} last ${data.salesOverview.driveThruOrders.rangeType})`
    },
    {
      title: "Avg. Order Value",
      value: formatCurrency(data.salesOverview.avgOrderValue.value),
      change: `${data.salesOverview.avgOrderValue.percentage > 0 ? '+' : ''}${data.salesOverview.avgOrderValue.percentage}%`,
      up: data.salesOverview.avgOrderValue.percentage > 0,
      desc: `Compared to (${formatCurrency(data.salesOverview.avgOrderValue.comparedTo)} last ${data.salesOverview.avgOrderValue.rangeType})`
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-24 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Sales Overview</h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1">Welcome back, here's what's happening today.</p>
        </div>

        <div className="relative w-full sm:w-auto">
          <button
            className="w-full sm:w-auto flex items-center justify-between sm:justify-center gap-2 px-4 py-2.5 bg-white text-slate-700 rounded-xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors text-sm font-medium"
            onClick={() => setShowDateDropdown(!showDateDropdown)}
          >
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-teal-600" />
              {dateRange.label}
            </div>
            <ChevronDown size={14} className={`text-slate-400 transition-transform ${showDateDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showDateDropdown && (
            <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-20 animate-in fade-in zoom-in-95 duration-200">
              <button
                className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${dateRange.type === 'today' ? 'text-teal-600 font-medium bg-teal-50' : 'text-slate-600'}`}
                onClick={() => handleDateRangeSelect('today')}
              >
                Today
              </button>
              <button
                className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${dateRange.type === 'week' ? 'text-teal-600 font-medium bg-teal-50' : 'text-slate-600'}`}
                onClick={() => handleDateRangeSelect('week')}
              >
                This Week
              </button>
              <button
                className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${dateRange.type === 'month' ? 'text-teal-600 font-medium bg-teal-50' : 'text-slate-600'}`}
                onClick={() => handleDateRangeSelect('month')}
              >
                This Month
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiData.map((kpi, i) => (
          <div key={i} className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="text-sm font-medium text-slate-500 mb-3 sm:mb-4">{kpi.title}</div>
            <div className="flex items-end justify-between mb-2">
              <div className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">{kpi.value}</div>
              <div className={`flex items-center gap-1 text-[10px] sm:text-sm font-bold px-2 py-1 rounded-full ${kpi.up ? "text-teal-700 bg-teal-50" : "text-red-600 bg-red-50"}`}>
                {kpi.up ? <TrendingUp size={12} className="sm:w-3.5 sm:h-3.5" /> : <TrendingDown size={12} className="sm:w-3.5 sm:h-3.5" />}
                {kpi.change}
              </div>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 line-clamp-1">{kpi.desc}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Trend - Spans 2 columns */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Revenue Trend</h3>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
                <span className="text-slate-600">Current</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                <span className="text-slate-600">Last Month</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>

        {/* Upsell Card */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
          <h3 className="text-lg font-bold text-slate-800 mb-6 w-full text-left sm:text-center lg:text-left">Upselling Performance</h3>
          <div className="relative h-[200px] w-[200px] sm:h-[220px] sm:w-[220px]">
            <Doughnut data={doughnutUpsellData} options={doughnutUpsellOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl sm:text-3xl font-bold text-slate-800">{data.upsellingPerformance.combos}%</span>
              <span className="text-[10px] sm:text-xs text-slate-500 font-medium uppercase tracking-wider">Combos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Drive Thru + Refund + Peak Hours */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Drive Thru Customers */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-1 sm:mb-2 text-center sm:text-left">Drive Thru Traffic</h3>
          <p className="text-sm text-slate-500 mb-6 text-center sm:text-left">Weekly customer overview</p>
          <div className="h-[200px] sm:h-[220px] w-full">
            <Line data={driveThruData} options={driveThruOptions} />
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-slate-500 text-sm">Total Visitors</span>
            <span className="text-xl font-bold text-cyan-600">{data.driveThruCustomers.count.toLocaleString()}</span>
          </div>
        </div>

        {/* Refunds */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
          <h3 className="text-lg font-bold text-slate-800 mb-4 w-full text-left sm:text-center lg:text-left">Refunds & Cancellation</h3>
          <div className="relative h-[160px] w-[160px] sm:h-[180px] sm:w-[180px] mb-4">
            <Doughnut data={refundData} options={refundOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl sm:text-2xl font-bold text-red-500">{data.refunds.percent}%</span>
              <span className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">Rate</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 text-center">
            Total Refunded: <span className="font-bold text-slate-800">{formatCurrency(data.refunds.totalAmount)}</span>
          </p>
        </div>

        {/* Peak Hours */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 md:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 text-center sm:text-left w-full">Peak Hours</h3>
          </div>
          <div className="h-[200px] w-full">
            <Bar data={peakHoursData} options={peakHoursOptions} />
          </div>
          <div className="mt-6 flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm text-slate-500">
            <div className="w-2 h-2 rounded-full bg-teal-600"></div>
            <span>Busiest: <b>12:00 PM - 2:00 PM</b></span>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-slate-800">Recent Orders</h3>
          <button className="text-xs sm:text-sm font-medium text-teal-600 hover:text-teal-700 hover:bg-teal-50 px-2 sm:px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
            View All <ChevronDown size={14} className="-rotate-90" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Order Details</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.recentOrders.map((order, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800">{order.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{order.orderNumber}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                        {order.customer?.charAt(0) || "?"}
                      </div>
                      <span className="text-sm text-slate-600 font-medium">{order.customer || "Unknown"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-700">{formatCurrency(order.price)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                      ${order.status === "Received" ? "bg-blue-50 text-blue-700 border-blue-100" :
                        order.status === "In Kitchen" ? "bg-amber-50 text-amber-700 border-amber-100" :
                          order.status === "Completed" ? "bg-green-50 text-green-700 border-green-100" :
                            "bg-slate-100 text-slate-600 border-slate-200"
                      }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
