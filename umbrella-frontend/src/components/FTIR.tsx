
import "./Ftir.css";
import { Link } from "react-router-dom";
import { sendScanRequest } from "./api"; // Assuming these are functions for sending requests and checking progress
import React, { useEffect, useRef, useState } from "react";
import { Scatter } from "react-chartjs-2";
import { Chart as ChartJS, PointElement, ScatterController, CategoryScale, LinearScale, Title, Tooltip, Legend , LineElement} from 'chart.js';

import html2canvas from 'html2canvas'; // Import html2canvas for converting to PNG

ChartJS.register(ScatterController, CategoryScale, LinearScale, Title, Tooltip, Legend,PointElement, LineElement);
function FTIR() {
  const [inputValues, setInputValues] = useState({
    unterverzeichnis: "",
    strahlernummer: "",
    strahlertyp: "",
    soll_leistung: 0,
    comment: "",
  });
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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValues({
      ...inputValues,
      [e.target.id]: e.target.value,
    });
  };
  const [errorMessage, setErrorMessage] = useState("");
  const [status, setStatus] = useState({ status: "", className: "" });
  const [ftirData, setData] = useState({ wellNumber: [], values: [], black: [], blackWellNumber: [], blackName: "",  seriel_number : ""});

  const handleSubmit = () => {
    // Validate input values
    if (!inputValues.unterverzeichnis) {
      setErrorMessage("Bitte geben Sie das Unterverzeichnis ein.");
      return;
    } else if (!checkStrahlerNummer(inputValues.strahlernummer)) {
      setErrorMessage("Bitte geben Sie eine gültige Strahlernummer ein.");
      return;
    } else if (!inputValues.strahlertyp) {
      setErrorMessage("Bitte geben Sie den Strahlertyp ein.");
      return;
    } else if (inputValues.soll_leistung < 0.5) {
      setErrorMessage("Bitte geben Sie eine gültige Soll-Leistung ein.");
      return;
    }

    // Reset error message
    setErrorMessage("");

    sendScanRequest(
      inputValues.unterverzeichnis,
      inputValues.strahlertyp,
      inputValues.strahlernummer,
      inputValues.soll_leistung,
      inputValues.comment
    )
      .then(() => {
        setStatus({ status: "Messung fertig", className: "" });
        updateStatus();
        fetchFTIRData();
      })
      .catch((error) => {
        setStatus({ status: "Keine Verbindung", className: "text-danger" });
        console.log("No connection");
        // Handle error as needed
      });
  };
  // Disable button
  const checkStrahlerNummer = (inputString: string) => {
    // Check if the input string has at least 4 characters
    if (inputString.length < 4) {
      return false;
    }

    // Get the last 4 characters of the string
    const last4Characters = inputString.slice(-4);
    const last4Int = Number(last4Characters);

    // Convert the last 4 characters to an integer and add 1
    if (!isNaN(last4Int)) {
      document.getElementById("strahlernummer").style.borderColor = "black";

      return true;
    } else {
      document.getElementById("strahlernummer").style.borderColor = "red";
      return false;
    }
  };
  function updateStatus() {
    // Check if the input string has at least 4 characters
    const inputString = inputValues.strahlernummer;
    if (inputString.length < 4) {
      return false;
    }

    // Get the last 4 characters of the string
    const last4Characters = inputString.slice(-4);

    // Convert the last 4 characters to an integer and add 1
    const last4Int = parseInt(last4Characters, 10);
    const modifiedInt = last4Int + 1;

    // Remove the last 4 characters from the original string
    const stringWithoutLast4 = inputString.slice(0, -4);

    // Concatenate the modified integer to the string
    const modifiedString =
      stringWithoutLast4 + String(modifiedInt).padStart(4, "0");
    console.log(modifiedString);
    setInputValues;
  }

  
  const fetchFTIRData = async () => {
    try {
      
      const url = new URL("http://127.0.0.1:8000/api/get_dpt_data/");
      url.searchParams.append("serial_number",inputValues.strahlernummer,
      );
      url.searchParams.append("temp", "500");
      url.searchParams.append("scale","1.05");
  
      const response = await fetch(url.toString());
      const jsonData = await response.json();
      const values  = jsonData.values 

      const datasets = []
      for (let i = 0; i < values.length; i++){
         let dataset = {
            label: values[i].date,
            data:  values[i].values.map((value, index) => ({ x: jsonData.wellNumber[index], y: value })),
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
        data: jsonData.blackWellNumber.map((value, index) => ({ x: value , y: jsonData.black[index] })),
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
          // Set the font color for the legend labels
          fontColor: 'black',
        },
        // Set the background color for the legend
        backgroundColor: '#550000',
        borderRadius: 10,
      },
    },
    scales: {
      x: {
        type: 'linear',
        min: 0,
        max: 15,
        ticks: {
          stepSize: 1,
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
      <div className="dashboard-name "> FTIR Messung</div>
      <div className="w-100 mt-3  d-flex d-flex  flex-column flex-lg-row   align-items-center  justify-content-between ">
        <div className="d-flex flex-column   mt-2  align-items-center justify-content-center gap-4">
          {errorMessage && (
            <p className="error-message text-danger">{errorMessage}</p>
          )}
          <div className="row align-items-center w-100 gap-2">
            <label className="col-12">
              {" "}
              Unterverzeichnis*
            </label>
            <input
              type="text"
              className="col-12  "
              id="unterverzeichnis"
              placeholder="Unterverzeichnis eingeben"
              required
              value={inputValues.unterverzeichnis}
              onChange={handleInputChange}
            />
          </div>
          <div className="row align-items-center w-100 gap-2">
            <label className="col-12  ">Strahlertyp*</label>
            <input
              type="text"
              className="col-12 "
              id="strahlertyp"
              placeholder="Strahlertyp eingeben"
              required
              value={inputValues.strahlertyp}
              onChange={handleInputChange}
            />
          </div>
          <div className="row align-items-center w-100 gap-2">
            <label className="col-12  ">
              {" "}
              Strahlernummer*
            </label>
            <input
              type="text"
              className="col-12 "
              id="strahlernummer"
              placeholder="Strahlernummer eingeben"
              value={inputValues.strahlernummer}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="row align-items-center w-100 gap-2">
            <label className="col-12 ">
              Soll Leistung*
            </label>
            <input
              type="number"
              className="col-12 "
              id="soll_leistung"
              placeholder="Soll Leistung in W  eingeben"
              required
              min="0.5"
              pattern="[0-9,]*"
              value={inputValues.soll_leistung}
              onChange={handleInputChange}
            />
          </div>

          <div className="d-flex just-conntent-center align-items-center mt-2 gap-4 ">
            <button
              type="submit"
              className="main-btn"
              id="messen-btn"
              onClick={handleSubmit}
            >
              Messen
            </button>
            <div className={status.className}>{status.status}</div>
          </div>
        </div>
        <div className="dataCard revenueCard m-5 ">
            <Scatter id="mychart" data={data} options={options}  />
          </div>
      </div>
    </div>
  );
}

export default FTIR;
