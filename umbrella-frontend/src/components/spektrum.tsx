import React, { useEffect, useRef, useState } from "react";
import { Scatter } from "react-chartjs-2";
import { Chart as ChartJS, PointElement, ScatterController, CategoryScale, LinearScale, Title, Tooltip, Legend , LineElement} from 'chart.js';
import "./spektrum.css";
import html2canvas from 'html2canvas'; // Import html2canvas for converting to PNG

ChartJS.register(ScatterController, CategoryScale, LinearScale, Title, Tooltip, Legend,PointElement, LineElement);

function Spektrum() {
  const [ftirData, setData] = useState({ wellNumber: [], values: [], black: [], blackWellNumber: [], blackName: "",  seriel_number : ""});
  const [serialNumber, setSerialNumber] = useState(""); // State variable for serial number input
  const [temperature, setTemperature] = useState("500"); // State variable for temperature input, defaulting to "500"
  const [scale, setScale] = useState("1.05");
  const [error, setError] = useState(false); // State variable for scale input, defaulting to "1.05"
  const chartRef = useRef(null); // Reference for the chart canvas element

 
  const materialColors = [
    "#064FF0", // Blue
    "#E91E63", // Pink
    "#FFC107", // Amber
    "#4CAF50", // Green
    "#3F51B5", // Indigo
    "#2196F3", // Light Blue
    "#00BCD4", // Cyan
    "#FF5722", // Deep Orange
    "#FF9800", // Orange
    "#673AB7", // Deep Purple
    "#9C27B0", // Purple
    "#8BC34A", // Light Green
    "#009688", // Teal
    "#FFEB3B", // Yellow
    "#4CAF50", // Green
  ];
  const fetchData = async () => {
    try {
      
      const url = new URL("http://127.0.0.1:8000/api/get_dpt_data/");
      url.searchParams.append("serial_number", serialNumber);
      url.searchParams.append("temp", temperature);
      url.searchParams.append("scale",scale);
  
      const response = await fetch(url.toString());
      const jsonData = await response.json();
      const values  = jsonData.values 
      if (values.length === 0){
        setError(true)
        return
      }
      setError(false)
      const datasets = []
      for (let i = 0; i < values.length; i++){
         let dataset = {
            label: values[i].date,
            data:  values[i].values.map((value : number, index: number) => ({ x: jsonData.wellNumber[index], y: value })),
            backgroundColor: materialColors[i],
            borderColor: materialColors[i],
            pointBackgroundColor: materialColors[i],
            pointBorderColor: materialColors[i],
            pointRadius: 0,
            pointHoverRadius: 2,
            showLine: true, // Connect points with lines
            borderWidth : 1.5
          
         }
         datasets.push(dataset)
      }
      datasets.push({
        label: jsonData.blackName,
        data: jsonData.blackWellNumber.map((value : number, index : number) => ({ x: value , y: jsonData.black[index] })),
            backgroundColor: "#000000",
            borderColor: "#000000",
            pointBackgroundColor:  "#000000",
            pointBorderColor: "#000000",
            pointRadius: 0,
            pointHoverRadius: 2,
            showLine: true, // Connect points with lines
            borderWidth : 1.5
          

      })
      jsonData.values = datasets
      setData(jsonData);
      console.log(jsonData)
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleSerialNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSerialNumber(e.target.value);
  };

  const handleTemperatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemperature(e.target.value);
  };

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScale(e.target.value);
  };

  const handleSubmit = ( ) => {
    
    fetchData();
  };
 
 
  const data = {
    datasets:ftirData.values,
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: ftirData.seriel_number,
      },
      legend: {
        labels: {
          color: 'black',
        },
        backgroundColor: '#550000',
        borderRadius: 10,
      },
    },
    scales: {
      x: {
        type: 'linear' as const, // Specify the type explicitly as 'linear'
        min: 0,
        max: 15,
        ticks: {
          stepSize: 0.5,
        },
        grid: {
          display: false, // Remove x-axis grid lines
        },
      },
      y: {
        min: 0,
        max: 1.2,
        ticks: {
          stepSize: 0.2,
        },
        grid: {
          display: false, // Remove y-axis grid lines
        },
      },
    },
  };
  return (
    <div className="d-flex justify-content-center align-items-center flex-column container">
      <div className="dashboard-name">Spektrum</div>
      <div className="container mt-3">
        <div className="d-flex flex-column mt-2 align-items-center justify-content-center gap-4">
        <div className="row align-items-center w-75 gap-2">
            <label className="col-12 col-lg-2 offset-lg-3">
              {" "}
              Stahlernummer*
            </label>
            <input
              type="text"
              className="col-12 col-lg-4 "
              id="serial_number"
              placeholder="Stahlernummer eingeben"
              required
              value={serialNumber}
              onChange={handleSerialNumberChange}
            />
          </div>
          <div className="row align-items-center w-75 gap-2">
            <label className="col-12 col-lg-2 offset-lg-3">
              {" "}
              Temperatur*
            </label>
            <input
             type="number"
              className="col-12 col-lg-4 "
              id="temp"
              placeholder="Temperatur eingeben"
              required
              value={temperature}
              onChange={handleTemperatureChange}
            />
          </div>
          <div className="row align-items-center w-75 gap-2">
            <label className="col-12 col-lg-2 offset-lg-3">
              {" "}
              Scale*
            </label>
            <input
              type="number"
              className="col-12 col-lg-4 "
              id="scale"
              placeholder="Scale eingeben"
              required
              value={scale}
              onChange={handleScaleChange}
            />
          </div>
          {error &&(
            <p className="text-danger m-2"> Es gibt keine Messung mit dieser Strahlernummer!</p>
          )
          }
          <div className="d-flex just-conntent-center align-items-center mt-2 gap-4 ">
            <button
              type="submit"
              className="main-btn"
              id="messen-btn"
              onClick={handleSubmit}
            >
              Auswertung zeigen
            </button>
            <button
              type="button"
              className="main-btn"
              
            >
             Als PNG herrunterladen
            </button>
          </div>
          <div className="dataCard revenueCard m-5">
            <Scatter id="mychart" data={data} options={options}  ref={chartRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Spektrum;
