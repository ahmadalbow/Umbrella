import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from 'chart.js';
import revenueData from "./data/revenueData.json";
import "./spektrum.css";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

function Spektrum() {
  const data = {
    labels: revenueData.map((data) => data.label),
    datasets: [
      {
        label: "Revenue",
        data: revenueData.map((data) => data.revenue),
        backgroundColor: "#064FF0",
        borderColor: "#064FF0",
        fill: false,
        pointRadius: 0,
      },
     
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Monthly Revenue & Cost",
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Remove x-axis grid lines
        },
      },
      y: {
        grid: {
          display: false, // Remove y-axis grid lines
        },
      },
    },
    elements: {
      line: {
        tension: 0.5,
      },
    },
  };

  return (
    <div className="d-flex justify-content-center align-items-center flex-column container">
      <div className="dashboard-name">Spektrum</div>
      <div className="container mt-3">
        <div className="d-flex flex-column mt-2 align-items-center justify-content-center gap-4">
          <div className="dataCard revenueCard">
            <Line data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Spektrum;