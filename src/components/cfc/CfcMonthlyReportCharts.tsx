"use client";

import { useEffect, useRef, useState } from "react";
import {
  Chart,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  LineController,
  LineElement,
  PointElement,
  ChartConfiguration,
} from "chart.js";
import { getCfcChartDetails } from "@/services/cfc_chart-details.service";
import { CfcMonthlyReport } from "@/lib/api/cfc.types";
import { FaSpinner } from "react-icons/fa6";
import { useLanguage } from "@/hooks/useLanguage";

// Register Chart.js components
Chart.register(
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  LineController,
  LineElement,
  PointElement
);

interface CfcMonthlyReportChartsProps {
  cfcId: string | number;
}

const parseChartValue = (val: string | null | undefined): number => {
  if (!val) return 0;
  const cleaned = val.replace(/[^0-9.-]/g, "");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const MONTH_NAMES_HI = [
  "जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून",
  "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"
];

export default function CfcMonthlyReportCharts({ cfcId }: CfcMonthlyReportChartsProps) {
  const isHi = useLanguage() === "hi";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<CfcMonthlyReport[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response:any = await getCfcChartDetails(cfcId);
        if (response.data && Array.isArray(response.data.data)) {
          console.log("Fetched CFC chart details:", response        );
          setReportData(response.data.data);
        } else {
          setReportData([]);
        }
      } catch (err) {
        console.error("Error fetching CFC chart details:", err);
        setError(isHi ? "चार्ट डेटा लोड करने में विफल" : "Failed to load chart data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [cfcId, isHi]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <FaSpinner className="animate-spin text-3xl text-primary" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 py-10 text-center">{error}</div>;
  }

  if (reportData.length === 0) {
    return null;
  }

  const sortedData = [...reportData].sort((a, b) => {
    const yearA = parseInt(a.year);
    const yearB = parseInt(b.year);
    if (yearA !== yearB) return yearA - yearB;
    return parseInt(a.month) - parseInt(b.month);
  });

  const months = isHi ? MONTH_NAMES_HI : MONTH_NAMES;
  const labels = sortedData.map(item => {
    const monthIdx = parseInt(item.month) - 1;
    const monthName = months[monthIdx] || `${isHi ? "माह" : "Month"} ${item.month}`;
    return `${monthName} ${item.year}`;
  });

  return (
    <div className="cfc-section">
      <h2 className="mb-6">{isHi ? "सीएफसी मासिक प्रदर्शन रिपोर्ट" : "CFC Monthly Performance Reports"}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1">
          <CfcChart
            title={isHi ? "आय और व्यय" : "Income & Expenditure"}
            labels={labels}
            datasets={[
              {
                label: isHi ? "आय (₹)" : "Income (₹)",
                data: sortedData.map(item => parseChartValue(item.income_month_year_wise)),
                borderColor: "#1B3C72",
                backgroundColor: "rgba(27, 60, 114, 0.1)",
                borderWidth: 2,
                type: "line" as const,
                tension: 0.3,
                fill: true,
                pointBackgroundColor: "#1B3C72",
                pointBorderColor: "#fff",
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                spanGaps: true,
              },
              {
                label: isHi ? "व्यय (₹)" : "Expenditure (₹)",
                data: sortedData.map(item => parseChartValue(item.expenses_month_year_wise)),
                borderColor: "#E8562E",
                backgroundColor: "rgba(232, 86, 46, 0.1)",
                borderWidth: 2,
                type: "line" as const,
                tension: 0.3,
                fill: true,
                pointBackgroundColor: "#E8562E",
                pointBorderColor: "#fff",
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                spanGaps: true,
              }
            ]}
          />
        </div>
        <div className="col-span-1">
          <CfcChart
            title={isHi ? "क्षमता उपयोग" : "Capacity Utilization"}
            labels={labels}
            datasets={[
              {
                label: isHi ? "क्षमता उपयोग (%)" : "Capacity Usage (%)",
                data: sortedData.map(item => parseChartValue(item.capacity_usage_month_year_wise)),
                borderColor: "#1B3C72",
                backgroundColor: "rgba(27, 60, 114, 0.1)",
                borderWidth: 2,
                type: "line" as const,
                tension: 0.3,
                fill: true,
                pointBackgroundColor: "#1B3C72",
                pointBorderColor: "#fff",
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                spanGaps: true,
              }
            ]}
          />
        </div>
      </div>
    </div>
  );
}

interface CfcChartProps {
  title: string;
  labels: string[];
  datasets: any[];
}

function CfcChart({ title, labels, datasets }: CfcChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const config: ChartConfiguration = {
      type: datasets[0].type || "line",
      data: {
        labels,
        datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: {
              usePointStyle: true,
              font: { size: 10 }
            }
          },
          tooltip: {
            mode: "index",
            intersect: false,
          }
        },
        scales: {
          x: {
            ticks: { font: { size: 9 } },
            grid: { display: false }
          },
          y: {
            beginAtZero: true,
            ticks: { font: { size: 9 } }
          }
        }
      }
    };

    chartInstanceRef.current = new Chart(ctx, config);

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [labels, datasets]);

  return (
    <div className="report-card mb-0 !p-4 rounded-lg bg-white" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', border: '1px solid rgba(0,0,0,0.05)', height: '100%' }}>
      <h3 className="text-sm font-semibold mb-4 text-gray-700">{title}</h3>
      <div style={{ height: "300px", position: 'relative' }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}
