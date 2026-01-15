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

import "./Dashboard.css";
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
  <div className="dashboard-state loading-state">
    <Loader className="animate-spin" size={48} />
    <h3>Loading Dashboard...</h3>
    {/* <p>Please wait while we load your data...</p> */}
  </div>
);

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => (
  <div className="dashboard-state error-state">
    <AlertCircle size={48} />
    <h3>Something went wrong</h3>
    <p>{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="retry-btn">
        Try Again
      </button>
    )}
  </div>
);

const EmptyState: React.FC = () => (
  <div className="dashboard-state empty-state">
    <Database size={48} />
    <h3>No Data Available</h3>
    <p>No dashboard data found for the selected period</p>
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

  // Check if data is essentially empty (all zeros)
  // const isEmptyData = 
  //   data.salesOverview.revenue.value === 0 &&
  //   data.salesOverview.totalSales.value === 0 &&
  //   data.salesOverview.driveThruOrders.value === 0 &&
  //   data.driveThruCustomers.count === 0;

  // if (isEmptyData) {
  //   return <EmptyState />;
  // }


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
        borderColor: "#76B900",
        backgroundColor: "rgba(118,185,0,0.2)",
        fill: true,
        tension: 0.4,
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
        borderColor: "#EC975F",
        backgroundColor: "rgba(236,151,95,0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const lineOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#777" } },
      y: { grid: { color: "#eee" }, ticks: { color: "#777" } },
    },
  };

  // ===== Doughnut Chart (Upselling) =====
  const doughnutUpsellData: ChartData<"doughnut"> = {
    labels: ["Combos", "Regular"],
    datasets: [
      {
        data: [data.upsellingPerformance.combos, 100 - data.upsellingPerformance.combos],
        backgroundColor: ["#76B900", "#EFEFEF"],
        borderWidth: 0,
      },
    ],
  };

  const doughnutUpsellOptions: ChartOptions<"doughnut"> = {
    cutout: "50%",
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          color: "#4B5563",
          font: { size: 12 },
        },
      },
    },
  };

  // ===== Line Chart (Drive Thru) =====
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
        borderColor: "#76B900",
        backgroundColor: "rgba(118,185,0,0.2)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#76B900",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const driveThruOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
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
        ticks: { color: "#777" }
      },
      y: {
        grid: { color: "#eee" },
        ticks: {
          color: "#777",
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
        backgroundColor: ["#FF0000", "#FFBABA"],
        borderWidth: 0,
      },
    ],
  };

  const refundOptions: ChartOptions<"doughnut"> = {
    cutout: "55%",
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          color: "#6B7280",
          font: { size: 12 },
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
        backgroundColor: "#76B900",
        borderRadius: 8,
      },
    ],
  };

  const peakHoursOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#777" } },
      y: { grid: { color: "#eee" }, ticks: { color: "#777" } },
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



  // // ===== Line Chart (Revenue Trend) =====
  // const lineData: ChartData<"line"> = {
  //   labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  //   datasets: [
  //     {
  //       label: "Current",
  //       data: [40, 60, 55, 70, 90, 50, 45],
  //       borderColor: "#76B900",
  //       backgroundColor: "rgba(118,185,0,0.2)",
  //       fill: true,
  //       tension: 0.4,
  //     },
  //     {
  //       label: "Last Month",
  //       data: [50, 55, 60, 45, 85, 40, 30],
  //       borderColor: "#EC975F",
  //       backgroundColor: "rgba(236,151,95,0.2)",
  //       fill: true,
  //       tension: 0.4,
  //     },
  //   ],
  // };

  // const lineOptions: ChartOptions<"line"> = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   plugins: { legend: { display: false } },
  //   scales: {
  //     x: { grid: { display: false }, ticks: { color: "#777" } },
  //     y: { grid: { color: "#eee" }, ticks: { color: "#777" } },
  //   },
  // };

  // // ===== Doughnut Chart (Upselling) =====
  // const doughnutUpsellData: ChartData<"doughnut"> = {
  //   labels: ["Combos", "Regular"],
  //   datasets: [
  //     {
  //       data: [22, 78],
  //       backgroundColor: [
  //         getComputedStyle(document.documentElement).getPropertyValue("--secondary-color").trim() || "#76B900",
  //         getComputedStyle(document.documentElement).getPropertyValue("--chart-bg").trim() || "#EFEFEF",
  //       ],
  //       borderWidth: 0,
  //     },
  //   ],
  // };

  // const doughnutUpsellOptions: ChartOptions<"doughnut"> = {
  //   cutout: "50%",
  //   plugins: {
  //     legend: {
  //       display: true,
  //       position: "bottom",
  //       labels: {
  //         color: "#4B5563",
  //         font: { size: 12 },
  //         generateLabels: (chart) => {
  //           const labels = chart.data.labels as string[];
  //           const bgColors =
  //             chart.data.datasets[0]
  //               .backgroundColor as string[]; // ✅ safely cast as string[]

  //           return labels.map((label, i) => ({
  //             text: label,
  //             fillStyle: bgColors[i] || "#ccc",
  //           }));
  //         },
  //       },
  //     },
  //   },
  // };

  // // ===== Line Chart (Drive Thru) =====
  // const driveThruData: ChartData<"line"> = {
  //   labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  //   datasets: [
  //     {
  //       label: "Customers",
  //       data: [65, 45, 60, 75, 55, 80, 70],
  //       borderColor: "#76B900",
  //       backgroundColor: "rgba(118,185,0,0.2)",
  //       fill: true,
  //       tension: 0.4,
  //     },
  //   ],
  // };

  // const driveThruOptions: ChartOptions<"line"> = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   plugins: { legend: { display: false } },
  //   scales: {
  //     x: { grid: { display: false }, ticks: { color: "#777" } },
  //     y: { grid: { color: "#eee" }, ticks: { color: "#777" } },
  //   },
  // };

  // // ===== Doughnut Chart (Refunds) =====
  // const refundData: ChartData<"doughnut"> = {
  //   labels: ["Refunds", "Successful"],
  //   datasets: [
  //     {
  //       data: [0.5, 99.5],
  //       backgroundColor: [
  //         getComputedStyle(document.documentElement)
  //           .getPropertyValue("--danger-color")
  //           .trim() || "#FF0000",
  //         getComputedStyle(document.documentElement)
  //           .getPropertyValue("--danger-light")
  //           .trim() || "#FFBABA",
  //       ],
  //       borderWidth: 0,
  //     },
  //   ],
  // };

  // const refundOptions: ChartOptions<"doughnut"> = {
  //   cutout: "55%",
  //   plugins: {
  //     legend: {
  //       display: true,
  //       position: "bottom",
  //       labels: {
  //         color: "#6B7280", // Tailwind gray-500
  //         font: { size: 12 },
  //         generateLabels: (chart) => {
  //           const labels = chart.data.labels as string[];
  //           const bgColors =
  //             chart.data.datasets[0].backgroundColor as string[];
  //           return labels.map((label, i) => ({
  //             text: label,
  //             fillStyle: bgColors[i] || "#ccc",
  //           }));
  //         },
  //       },
  //     },
  //   },
  // };
  // // ===== Bar Chart (Peak Hours) =====
  // const peakHoursData: ChartData<"bar"> = {
  //   labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  //   datasets: [
  //     {
  //       label: "Current",
  //       data: [8, 12, 16, 14, 10, 18, 15, 19, 13, 10],
  //       backgroundColor: "#76B900",
  //       borderRadius: 8,
  //     },
  //   ],
  // };

  // const peakHoursOptions: ChartOptions<"bar"> = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   plugins: { legend: { display: false } },
  //   scales: {
  //     x: { grid: { display: false }, ticks: { color: "#777" } },
  //     y: { grid: { color: "#eee" }, ticks: { color: "#777" } },
  //   },
  // };

  // // ===== Orders Table =====
  // const orders = [
  //   { name: "Cheese Burger", orderNo: "#1756", customer: "Gerard Fabiano", price: "$6.20", status: "Received" },
  //   { name: "Jalapeno Burger Combo", orderNo: "#2485", customer: "Nicole Foster", price: "$3.45", status: "In Kitchen" },
  //   { name: "Vanilla Shake", orderNo: "#7490", customer: "Fernando Agaro", price: "$7.15", status: "Canceled" },
  //   { name: "Cheese Burger",  orderNo: "#1756", customer: "Gerard Fabiano", price: "$6.20", status: "In Kitchen" },
  //   { name: "Jalapeno Burger Combo", orderNo: "#2485", customer: "Nicole Foster", price: "$3.45", status: "In Kitchen" },
  // ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Sales Overview</h1>
        <div className="date-filter-container">
          <button
            className="date-btn"
            onClick={() => setShowDateDropdown(!showDateDropdown)}
          >
            <Calendar size={16} />
            {dateRange.label}
            <ChevronDown size={14} className={showDateDropdown ? 'rotate-180' : ''} />
          </button>

          {showDateDropdown && (
            <div className="date-dropdown">
              <button
                className={`dropdown-item ${dateRange.type === 'today' ? 'active' : ''}`}
                onClick={() => handleDateRangeSelect('today')}
              >
                Today
              </button>
              <button
                className={`dropdown-item ${dateRange.type === 'week' ? 'active' : ''}`}
                onClick={() => handleDateRangeSelect('week')}
              >
                Week
              </button>
              <button
                className={`dropdown-item ${dateRange.type === 'month' ? 'active' : ''}`}
                onClick={() => handleDateRangeSelect('month')}
              >
                Month
              </button>
              {/* <button 
                className={`dropdown-item ${dateRange.type === 'custom' ? 'active' : ''}`}
                onClick={() => handleDateRangeSelect('custom')}
              >
                Custom Range
              </button> */}
            </div>
          )}
        </div>
      </div>

      {/* Top KPIs */}
      <div className="kpi-grid">
        {kpiData.map((kpi, i) => (
          <div key={i} className="kpi-card">
            <div className="kpi-title">{kpi.title}</div>
            <div className="kpi-row">
              <div className="kpi-value">{kpi.value}</div>
              <div className={`kpi-badge ${kpi.up ? "up" : "down"}`}>
                {kpi.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {kpi.change}
              </div>
            </div>
            <p>{kpi.desc}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="chart-grid">
        <div className="chart-card revenue-card">
          <div className="chart-header">
            <h3>Revenue Trend</h3>
            <div className="chart-legend">
              <span className="dot green"></span> Current
              <span className="dot orange"></span> Last Month
            </div>
          </div>
          <div className="chart-container">
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>

        <div className="chart-card upsell-card center">
          <h3>Upselling Performance</h3>
          <div className="doughnut-container">
            <Doughnut data={doughnutUpsellData} options={doughnutUpsellOptions} />
            <div className="doughnut-center">
              <span className="main">{data.upsellingPerformance.combos}%</span>
              <span className="sub">Combos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Drive Thru + Refund + Peak Hours */}
      <div className="chart-grid drive-grid">
        <div className="chart-card drive-card">
          <h3>Drive Thru Customers</h3>
          <div className="chart-container">
            <Line data={driveThruData} options={driveThruOptions} />
          </div>
          <p className="chart-footer">
            <span>{data.driveThruCustomers.count.toLocaleString()}</span> Customers
          </p>
        </div>

        <div className="chart-card refund-card center">
          <h3>Refunds/Cancellation</h3>
          <div className="doughnut-container">
            <Doughnut data={refundData} options={refundOptions} />
            <div className="doughnut-center">
              <span className="refund">{data.refunds.percent}%</span>
            </div>
          </div>
          <p>Total Refund: {formatCurrency(data.refunds.totalAmount)}</p>
        </div>

        <div className="chart-card peak-card">
          <div className="chart-header">
            <h3>Peak Hours</h3>
            <div className="chart-legend">
              <span className="dot green"></span> Current
            </div>
          </div>
          <div className="chart-container">
            <Bar data={peakHoursData} options={peakHoursOptions} />
          </div>
        </div>
      </div>


      {/* Orders Table */}
      <div className="table-card">
        <div className="table-header">
          <h3>Recently Placed Orders</h3>
          <button className="date-btn">
            Last 24h <ChevronDown size={14} />
          </button>

        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Order Name</th>
                <th>Customer</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.recentOrders.map((order, i) => (
                <tr key={i}>
                  <td>
                    {order.name} <br />
                    <span className="orderNo">{order.orderNumber}</span>
                  </td>
                  <td>{order.customer}</td>
                  <td>{formatCurrency(order.price)}</td>
                  <td>
                    <span className={`status ${order.status.toLowerCase().replace(" ", "-")}`}>
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
