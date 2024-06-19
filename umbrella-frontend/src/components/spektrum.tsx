import React, { useEffect, useRef, useState } from "react";
import { Scatter } from "react-chartjs-2";
import { Chart as ChartJS, PointElement, ScatterController, CategoryScale, LinearScale, Title, Tooltip, Legend , LineElement} from 'chart.js';
import "./spektrum.css";
import html2canvas from 'html2canvas'; // Import html2canvas for converting to PNG

ChartJS.register(ScatterController, CategoryScale, LinearScale, Title, Tooltip, Legend,PointElement, LineElement);
interface Dataset {
  label: string;
  data: { x: number; y: number }[];
  backgroundColor: string;
  borderColor: string;
  pointBackgroundColor: string;
  pointBorderColor: string;
  pointRadius: number;
  pointHoverRadius: number;
  showLine: boolean;
  borderWidth: number;
}
function Spektrum() {
  const [ftirData, setData] = useState({ wellNumber: [], values: [], black: [], blackWellNumber: [], blackName: "",  seriel_number : "", });
  let [DifDataSets, setDifDataSets] = useState<Dataset[]>([]);

  const [serialNumber, setSerialNumber] = useState(""); // State variable for serial number input
  const [temperature, setTemperature] = useState("500"); // State variable for temperature input, defaulting to "500"
  const [scale, setScale] = useState("1.05");
  const [error, setError] = useState(false); // State variable for scale input, defaulting to "1.05"
  const chartRef = useRef(null); // Reference for the chart canvas element

  const [selectedCheckboxes, setSelectedCheckboxes] = useState<number[]>([]);

  const handleCheckboxChange = (index: number) => {
    setSelectedCheckboxes(prevState => {
      let updatedState;
      if (prevState.includes(index)) {
        // If the checkbox is already selected, unselect it
        updatedState = prevState.filter(i => i !== index);
      } else if (prevState.length < 2) {
        // If less than 2 checkboxes are selected, select the new one
        updatedState = [...prevState, index];
      } else {
        // If 2 checkboxes are already selected, do nothing
        return prevState;
      }
      // Sort the updated state before setting it
      return updatedState.sort((a, b) => a - b);
    });
  };
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
  const handleDownload = () => {
    if (chartRef.current) {
      console.log(chartRef.current.canvas)

      const link = document.createElement('a');
        link.href = chartRef.current.canvas.toDataURL('image/png');
        link.download = ftirData.seriel_number + '.png';
        link.click();
    }
  };
  const fetchData = async () => {
    try {
      
      const url = new URL("http://172.16.0.163:8000/api/get_dpt_data/");
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
 
  const hundelShowDiff = () =>{
    const data = []
    DifDataSets = []
    const [index1, index2] = selectedCheckboxes;
    if (selectedCheckboxes.length === 2){

      const data1 = ftirData.values[index1].data;
      const data2 = ftirData.values[index2].data;
  
      for (let i = 0; i < data1.length; i++) {
        // Assuming data1 and data2 have the same length and corresponding x values
        const diff = {
          x: data1[i].x,
          y: data2[i].y - data1[i].y
        };
        data.push(diff);
      }
      
      const newDataSet: Dataset = {
        label: "Differenz zwíschen "+ ftirData.values[index1].label  + "und " + ftirData.values[index2].label,
        data: data,
        backgroundColor: "#000000",
        borderColor: "#000000",
        pointBackgroundColor: "#000000",
        pointBorderColor: "#000000",
        pointRadius: 0,
        pointHoverRadius: 2,
        showLine: true, // Connect points with lines
        borderWidth: 1.5
      };
      setDifDataSets([newDataSet]);

      console.log("diff",DifDataSets)
    }
  }
 
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

const difData = {
  datasets : DifDataSets
}
const difOptions = {
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
        min: 1,
        max: 15,
        ticks: {
          stepSize: 0.5,
        },
        grid: {
          display: false, // Remove x-axis grid lines
        },
      },
      y: {
        min: Math.min(...DifDataSets.flatMap(dataset => dataset.data.map(point => point.y))),
        max: Math.max(...DifDataSets.flatMap(dataset => dataset.data.map(point => point.y))),
        ticks: {
          stepSize: 0.01,
        },
        grid: {
          display: false, // Remove y-axis grid lines
        },
      },
    },
};
// Inside your component
useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}, [serialNumber, temperature, scale]); // Add all relevant state variables he
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
              onClick={handleDownload}
            >
             Als PNG herrunterladen
            </button>
          </div>
          <div className="dataCard revenueCard-Full m-5">
            <Scatter id="mychart" data={data} options={options}  ref={chartRef} />
          </div>
          <div className="dashboard-name">Differenz Rechner</div>
          <h5 className="text-secondary">Zwei Messungen auswählen</h5>
         <div className="d-flex gap-4 flex-wrap">
         {
  ftirData.values.map((e, index) => (
    <div key={index}>
      <input
        type="checkbox"
        id={"mes" + index}
        checked={selectedCheckboxes.includes(index)}
        onChange={() => handleCheckboxChange(index)}
      />
      <label
        className="checkbox-label"
        id={"mes-label" + index}
        htmlFor={"mes" + index}
      >
        {e.label}
      </label>
    </div>
  ))
}

         </div>
         <button
              type="submit"
              className="main-btn"
              id="messen-btn"
              onClick={hundelShowDiff}
            >
              Differenz zeigen
            </button>
          <div className="dataCard revenueCard-Full m-5">
            <Scatter id="mychart1" data={difData} options={difOptions}  ref={chartRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Spektrum;
