import React, { useMemo } from "react";
import {
  Line
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const Chart = ({ data = [] }) => {
  const chartData = useMemo(() => {
    return {
      labels: data.map((item) => item.day),
      datasets: [
        {
          label: "Revenue",
          data: data.map((item) => item.revenue),

          borderColor: "#14b8a6",
          backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;

            if (!chartArea) return "rgba(20,184,166,0.15)";

            const gradient = ctx.createLinearGradient(
              0,
              chartArea.top,
              0,
              chartArea.bottom
            );

            gradient.addColorStop(0, "rgba(20,184,166,0.45)");
            gradient.addColorStop(1, "rgba(20,184,166,0)");

            return gradient;
          },

          fill: true,
          tension: 0.45,
          borderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 8,
          pointBackgroundColor: "#ffffff",
          pointBorderColor: "#14b8a6",
          pointBorderWidth: 3,
          pointHoverBackgroundColor: "#14b8a6",
          pointHoverBorderColor: "#ffffff",
        },
      ],
    };
  }, [data]);

  const options = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,

      interaction: {
        mode: "index",
        intersect: false,
      },

      plugins: {
        legend: {
          display: false,
        },

        tooltip: {
          backgroundColor: "#111827",
          titleColor: "#ffffff",
          bodyColor: "#e5e7eb",
          padding: 12,
          cornerRadius: 10,
          displayColors: false,

          callbacks: {
            label: (context) => `₹${context.raw.toLocaleString()}`,
          },
        },
      },

      scales: {
        x: {
          grid: {
            display: false,
          },

          ticks: {
            color: "#6b7280",
            font: {
              size: 12,
              weight: "600",
            },
          },

          border: {
            display: false,
          },
        },

        y: {
          beginAtZero: true,

          grid: {
            color: "rgba(107,114,128,0.12)",
            drawBorder: false,
          },

          ticks: {
            color: "#6b7280",
            padding: 10,
            font: {
              size: 12,
            },

            callback: (value) => `₹${value}`,
          },

          border: {
            display: false,
          },
        },
      },

      animation: {
        duration: 1400,
        easing: "easeOutQuart",
      },

      elements: {
        line: {
          capBezierPoints: true,
        },
      },
    };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "420px",
        padding: "24px",
        borderRadius: "24px",
        background:
          "linear-gradient(145deg, rgba(255,255,255,1), rgba(248,250,252,1))",
        boxShadow:
          "0 10px 25px rgba(0,0,0,0.08), 0 4px 10px rgba(0,0,0,0.04)",
      }}
    >
      <Line data={chartData} options={options} />
    </div>
  );
};

export default Chart;
