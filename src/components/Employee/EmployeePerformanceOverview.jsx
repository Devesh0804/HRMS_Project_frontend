import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const data = {
  labels,
  datasets: [
    {
      label: 'Task completion',
      data: [62, 74, 71, 86, 88, 92],
      borderColor: '#4f46e5',
      backgroundColor: 'rgba(79, 70, 229, 0.18)',
      fill: true,
      tension: 0.35,
      borderWidth: 3,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: '#4f46e5',
    },
    {
      label: 'Attendance score',
      data: [70, 72, 78, 81, 84, 87],
      borderColor: '#14b8a6',
      backgroundColor: 'rgba(20, 184, 166, 0.12)',
      fill: false,
      tension: 0.35,
      borderWidth: 3,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: '#14b8a6',
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      position: 'top',
      align: 'start',
      labels: {
        usePointStyle: true,
        boxWidth: 10,
        color: '#334155',
      },
    },
    tooltip: {
      backgroundColor: '#0f172a',
      padding: 12,
      cornerRadius: 10,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: '#64748b',
      },
    },
    y: {
      beginAtZero: true,
      suggestedMax: 100,
      grid: {
        color: 'rgba(148, 163, 184, 0.16)',
      },
      ticks: {
        color: '#64748b',
      },
    },
  },
};

const summaryCards = [
  { label: 'This Week', value: '92%', tone: 'text-indigo-600 bg-indigo-50' },
  { label: 'Avg. Attendance', value: '87%', tone: 'text-teal-600 bg-teal-50' },
  { label: 'Focus Hours', value: '36.5h', tone: 'text-amber-600 bg-amber-50' },
];

const EmployeePerformanceOverview = () => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm mb-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between mb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-800">Performance Overview</h3>
          <p className="text-sm text-gray-600 mt-1">
            Track your weekly productivity and attendance in one place.
          </p>
        </div>
        <div className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700 w-fit">
          Weekly trend
        </div>
      </div>

      <div className="h-72 sm:h-80">
        <Line data={data} options={options} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
        {summaryCards.map((item) => (
          <div key={item.label} className="rounded-lg border border-gray-100 p-4">
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className={`mt-2 inline-flex rounded-full px-3 py-1 text-lg font-bold ${item.tone}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeePerformanceOverview;
