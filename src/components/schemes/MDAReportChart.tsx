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
} from "chart.js";
import { fetchMdaReports } from "@/services/content.service";
import { FaSpinner } from "react-icons/fa6";

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

interface ReportData {
  report_year?: string | number;
  month?: string;
  amount: string | number;
  no_of_cfc?: string | number;
}

export type SchemeType = "MDA" | "TTS" | "MMS" | "CFC";

interface MDAReportChartProps {
  viewType?: 'monthly' | 'bi-monthly' | 'yearly';
  title?: string;
  scheme?: SchemeType;
}



export default function MDAReportChart({ viewType = 'bi-monthly', title, scheme = "MDA" }: MDAReportChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const chartlabels: any = {
    MDA: ['Reimbursed Amount (in Lakh)', 'Number of Claims'],
    TTS: ['Physical Trained (No)', 'Tool Kit Distribution (No)'],
    MMS: ['Physical Progress (No)', 'Financial Progress (Margin Money in Lakh Rs)'],
    CFC: ['Amount (₹)', 'Count'],
  };

  useEffect(() => {
    let isMounted = true;

    // Shared font defaults from event-budget-report
    Chart.defaults.font.family = "'Inter', 'Segoe UI', sans-serif";
    Chart.defaults.color = "#4A5568";

    const primaryColor = "#1B3C72";
    const orangeColor = "#E8562E";

    const currentLabels = chartlabels[scheme] || ['Amount', 'Count'];
    const label1 = currentLabels[0];
    const label2 = currentLabels[1];

    async function loadDataAndRenderChart() {
      try {
        setLoading(true);
        console.log(`[MDAReportChart] Fetching data for viewType: ${viewType}, scheme: ${scheme}`);
        const response = await fetchMdaReports(scheme);
        
        if (!isMounted) {
          console.log("[MDAReportChart] Component unmounted during fetch, skipping update.");
          return;
        }

        console.log("[MDAReportChart] API Response:", response);
        
        // Extract raw data safely from response
        const dataPayload = response.data;
        let rawData: ReportData[] | undefined;
        
        if (Array.isArray(dataPayload)) {
          rawData = dataPayload as ReportData[];
        } else if (dataPayload && typeof dataPayload === 'object') {
          const nestedData = (dataPayload as Record<string, unknown>).data;
          if (Array.isArray(nestedData)) {
            rawData = nestedData as ReportData[];
          }
        }

        if (!rawData) {
          console.error("[MDAReportChart] Invalid data format. Expected array but got:", dataPayload);
          throw new Error("Invalid data format");
        }

        const reportData = rawData;
        console.log(`[MDAReportChart] Processing ${reportData.length} records`);
        let sortedLabels: string[] = [];
        let amountData: number[] = [];
        let countData: number[] = [];

        const parseNum = (val: any) => {
          if (val === null || val === undefined) return 0;
          const cleaned = String(val).replace(/[^0-9.-]/g, "");
          return parseFloat(cleaned) || 0;
        };

        if (viewType === 'yearly') {
          const groupedData: Record<string, { amount: number; count: number }> = {};
          
          reportData.forEach((item) => {
            if (!item.report_year) return;
            const label = String(item.report_year);
            const amount = parseNum(item.amount);
            const count = parseNum(item.no_of_cfc);
            if (!groupedData[label]) groupedData[label] = { amount: 0, count: 0 };
            groupedData[label].amount += amount;
            groupedData[label].count += count;
          });

          sortedLabels = Object.keys(groupedData).sort();
          amountData = sortedLabels.map(label => groupedData[label].amount);
          countData = sortedLabels.map(label => groupedData[label].count);
        } else if (viewType === 'bi-monthly') {
          const monthToBucket: Record<string, number> = {
            'APR': 0, 'MAY': 0,
            'JUN': 1, 'JUL': 1,
            'AUG': 2, 'SEP': 2,
            'OCT': 3, 'NOV': 3,
            'DEC': 4, 'JAN': 4,
            'FEB': 5, 'MAR': 5
          };
          const bucketLabels = ['Apr-May', 'Jun-Jul', 'Aug-Sep', 'Oct-Nov', 'Dec-Jan', 'Feb-Mar'];
          const groupedData: Record<string, { amount: number; count: number }> = {};
          
          reportData.forEach((item) => {
            if (!item.month || !item.report_year) return;
            const year = item.report_year;
            const bucketIdx = monthToBucket[item.month.toUpperCase()];
            if (bucketIdx === undefined) return;
            const label = `${year} ${bucketLabels[bucketIdx]}`;
            const amount = parseNum(item.amount);
            const count = parseNum(item.no_of_cfc);
            if (!groupedData[label]) groupedData[label] = { amount: 0, count: 0 };
            groupedData[label].amount += amount;
            groupedData[label].count += count;
          });

          sortedLabels = Object.keys(groupedData).sort((a, b) => {
            const [yearA, rangeA] = a.split(' ');
            const [yearB, rangeB] = b.split(' ');
            if (yearA !== yearB) return yearA.localeCompare(yearB);
            return bucketLabels.indexOf(rangeA) - bucketLabels.indexOf(rangeB);
          });
          amountData = sortedLabels.map(label => groupedData[label].amount);
          countData = sortedLabels.map(label => groupedData[label].count);
        } else {
          // Monthly view
          const monthOrder = ['APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC', 'JAN', 'FEB', 'MAR'];
          const groupedData: Record<string, { amount: number; count: number }> = {};
          
          reportData.forEach((item) => {
            if (!item.month || !item.report_year) return;
            const label = `${item.report_year} ${item.month.toUpperCase()}`;
            const amount = parseNum(item.amount);
            const count = parseNum(item.no_of_cfc);
            if (!groupedData[label]) groupedData[label] = { amount: 0, count: 0 };
            groupedData[label].amount += amount;
            groupedData[label].count += count;
          });

          sortedLabels = Object.keys(groupedData).sort((a, b) => {
            const [yearA, monthA] = a.split(' ');
            const [yearB, monthB] = b.split(' ');
            if (yearA !== yearB) return yearA.localeCompare(yearB);
            return monthOrder.indexOf(monthA) - monthOrder.indexOf(monthB);
          });
          amountData = sortedLabels.map(label => groupedData[label].amount);
          countData = sortedLabels.map(label => groupedData[label].count);
        }

        console.log("[MDAReportChart] Sorted Labels:", sortedLabels);
        console.log("[MDAReportChart] Final Amount Data:", amountData);
        console.log("[MDAReportChart] Final Count Data:", countData);

        if (chartRef.current && isMounted) {
          if (sortedLabels.length === 0) {
            console.warn("[MDAReportChart] No labels generated, chart will be empty.");
          }

          // Destroy existing chart on this canvas before creating new one
          const existingChart = Chart.getChart(chartRef.current);
          if (existingChart) {
            existingChart.destroy();
          }

          // For MMS, Physical Progress (Count) is first, Financial (Amount) is second.
          const d1Data = scheme === 'MMS' ? countData : amountData;
          const d2Data = scheme === 'MMS' ? amountData : countData;

          chartInstanceRef.current = new Chart(chartRef.current, {
            type: "line",
            data: {
              labels: sortedLabels,
              datasets: [
                {
                  label: label1,
                  data: d1Data,
                  backgroundColor: "rgba(27, 60, 114, 0.12)",
                  borderColor: primaryColor,
                  borderWidth: 2.5,
                  fill: true,
                  tension: 0.4,
                  pointRadius: 4,
                  pointHoverRadius: 7,
                  pointBackgroundColor: primaryColor,
                  pointBorderColor: "#fff",
                  pointBorderWidth: 2,
                  yAxisID: 'y',
                },
                {
                  label: label2,
                  data: d2Data,
                  backgroundColor: "rgba(232, 86, 46, 0.10)",
                  borderColor: orangeColor,
                  borderWidth: 2.5,
                  fill: true,
                  tension: 0.4,
                  pointRadius: 4,
                  pointHoverRadius: 7,
                  pointBackgroundColor: orangeColor,
                  pointBorderColor: "#fff",
                  pointBorderWidth: 2,
                  yAxisID: 'y1',
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              animation: { duration: 750, easing: 'easeOutQuart' },
              interaction: { mode: "index", intersect: false },
              plugins: {
                legend: { 
                  position: "top", 
                  labels: { 
                    usePointStyle: true, 
                    padding: 20,
                    font: { size: 12, weight: 500 }
                  } 
                },
                tooltip: { 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  titleColor: '#1A202C',
                  bodyColor: '#4A5568',
                  borderColor: '#E2E8F0',
                  borderWidth: 1,
                  padding: 12,
                  boxPadding: 6,
                  usePointStyle: true,
                  callbacks: { 
                    label: (ctx) => {
                      const label = ctx.dataset.label || '';
                      const value = (ctx.parsed.y ?? 0);
                      if (label.toLowerCase().includes('amount') || label.toLowerCase().includes('financial') || label.toLowerCase().includes('money')) {
                        return ` ${label}: ₹${value.toLocaleString()}`;
                      }
                      return ` ${label}: ${value.toLocaleString()}`;
                    }
                  } 
                },
              },
              scales: {
                x: { 
                  grid: { display: false }, 
                  title: { 
                    display: true, 
                    text: viewType === 'yearly' ? "Financial Year" : viewType === 'monthly' ? "Month" : "Period (Bi-monthly)",
                    font: { size: 11, weight: 600 },
                    padding: { top: 10 }
                  },
                  ticks: { font: { size: 10 } }
                },
                y: { 
                  beginAtZero: true, 
                  position: 'left',
                  title: { 
                    display: true, 
                    text: '',
                    font: { size: 11, weight: 600 }
                  }, 
                  grid: { color: "rgba(0,0,0,0.05)" },
                  ticks: { 
                    font: { size: 10 },
                    callback: (v) => Number(v).toLocaleString()
                  } 
                },
                y1: {
                  beginAtZero: true,
                  position: 'right',
                  title: {
                    display: true,
                    text:'',
                    font: { size: 11, weight: 600 }
                  },
                  grid: { display: false },
                  ticks: {
                    font: { size: 10 },
                    callback: (v) => Number(v).toLocaleString()
                  }
                }
              },
            },
          });
        }
        setLoading(false);
      } catch (err) {
        console.error(`Failed to load ${scheme} reports:`, err);
        setError(`Failed to load ${scheme} chart data`);
        setLoading(false);
      }
    }

    loadDataAndRenderChart();
    
    return () => {
      isMounted = false;
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [viewType, scheme]);
  const schemeDash: any = {
  CFC: "Common Facility Centre Cfc Scheme",
  MDA: "Marketing Development Assistance Scheme",
  TTS: "Training And Toolkit Scheme",
  MMS: "Margin Money Scheme",
};
  const getTitle = () => {
    if (title) return title;
    switch (viewType) {
      case 'yearly': return `Yearly ${schemeDash[scheme]} Distribution`;
      case 'monthly': return `Monthly ${schemeDash[scheme]} Distribution`;
      default: return `Bi-monthly ${schemeDash[scheme]} Distribution`;
    }
  };

  return (
    <div className="report-card mb-0 !p-4 rounded-lg" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', border: '1px solid rgba(0,0,0,0.05)' }}>
      <div className="report-card-title" style={{ display: 'flex', alignItems: 'center' }}>
       <span>{getTitle()}</span>
      </div>
      <div className="chart-wrap" style={{ height: "350px", position: 'relative' }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-10 rounded-lg">
            <FaSpinner className="animate-spin text-3xl text-primary" />
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center text-red-500 z-10 bg-white/90 rounded-lg">
            {error}
          </div>
        )}
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}

