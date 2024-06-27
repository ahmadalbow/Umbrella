import React, { useRef, useState } from "react";
import { Scatter } from "react-chartjs-2";
import { Chart as ChartJS, PointElement, ScatterController, CategoryScale, LinearScale, Title, Tooltip, Legend, LineElement } from 'chart.js';
import "./spektrum.css";
import moment from 'moment';

ChartJS.register(ScatterController, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement, LineElement);

function DptDataiAuswertung() {
  const [ftirData, setData] = useState({ wellNumber: [], values: [], black: [], blackWellNumber: [], blackName: "", seriel_number: "", fileData: {} });

  const [inputValues, setInputValues] = useState({
    datum : "",
    strahlernummer: "",
    strahlertyp: "",
    leistung: 0,
    volt: 0,
    current: 0,
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState(false);
  const chartRef = useRef(null);
  const [isWindowOpen, setIsWindowOpen] = useState(false);

  const openWindow = () => setIsWindowOpen(true);
  const closeWindow = () => setIsWindowOpen(false);
  const toggleWindow = () => setIsWindowOpen((prevState) => !prevState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValues({
      ...inputValues,
      [e.target.id]: e.target.value,
    });
  };

  const materialColors = [
    "#064FF0", "#E91E63", "#FFC107", "#4CAF50", "#3F51B5", "#2196F3", "#00BCD4",
    "#FF5722", "#FF9800", "#673AB7", "#9C27B0", "#8BC34A", "#009688", "#FFEB3B", "#4CAF50",
  ];

  const handleDownload = () => {
    if (chartRef.current) {
      const link = document.createElement('a');
      link.href = chartRef.current.canvas.toDataURL('image/png');
      link.download = `${ftirData.seriel_number}.png`;
      link.click();
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const fetchData = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch("http://172.16.0.163:8000/api/dpt_to_graph_values/", {
        method: 'POST',
        body: formData,
      });
      const jsonData = await response.json();
      const values = jsonData.values;
      if (values.length === 0) {
        setError(true);
        return;
      }
      setError(false);
      const datasets = [];
      for (let i = 0; i < values.length; i++) {
        let dataset = {
          label: values[i].date,
          data: values[i].values.map((value, index) => ({ x: jsonData.wellNumber[index], y: value })),
          backgroundColor: materialColors[i],
          borderColor: materialColors[i],
          pointBackgroundColor: materialColors[i],
          pointBorderColor: materialColors[i],
          pointRadius: 0,
          pointHoverRadius: 2,
          showLine: true,
          borderWidth: 1.5
        };
        datasets.push(dataset);
      }
      datasets.push({
        label: jsonData.blackName,
        data: jsonData.blackWellNumber.map((value, index) => ({ x: value, y: jsonData.black[index] })),
        backgroundColor: "#000000",
        borderColor: "#000000",
        pointBackgroundColor: "#000000",
        pointBorderColor: "#000000",
        pointRadius: 0,
        pointHoverRadius: 2,
        showLine: true,
        borderWidth: 1.5
      });
      jsonData.values = datasets;
      setData(jsonData);


      setInputValues(prevValues => ({
        ...prevValues,
        datum: moment(jsonData.fileData.date, "YYYY.MM.DD_HH.mm.ss").format("YYYY-MM-DDTHH:mm"),
        strahlertyp: jsonData.fileData.StrahlerTyp,
        strahlernummer: jsonData.fileData.Strahlernummer,
        volt: jsonData.fileData.volt,
        leistung: jsonData.fileData.Power,
        current: jsonData.fileData.curr
    }));

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    fetchData();
  };
  const saveReq = async () => {
    if (!file) return;
  
    const formData = new FormData();
    formData.append('file', file);
  
    // Append input values to the formData
    Object.keys(inputValues).forEach(key => {
      formData.append(key, inputValues[key]);
    });
  
    try {
      const response = await fetch("http://172.16.0.163:8000/api/save_dpt_in_database/", {
        method: 'POST',
        body: formData,
      });
      const jsonData = await response.json();
      const values = jsonData.values;
      if (values.length === 0) {
        setError(true);
        return;
      }
  
      // Handle successful response if needed
  
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(true);
    }
  };
  const handleSave = (event) => {
    event.preventDefault();
    saveReq();
  };
  const data = {
    datasets: ftirData.values,
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
      },
    },
    scales: {
      x: {
        type: 'linear',
        min: 0,
        max: 15,
        ticks: {
          stepSize: 0.5,
        },
        grid: {
          display: false,
        },
      },
      y: {
        min: 0,
        max: 1.2,
        ticks: {
          stepSize: 0.2,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (


    <div className="d-flex justify-content-center align-items-center flex-column container">
      <div>
        {isWindowOpen && (
          <div className="window position-relativ">
            <div
              className="window-background w-100 h-100 position-absolute"
              onClick={toggleWindow}
            ></div>
            <div className="window-content">
              <h2 className="fw-bold">Im Datenbank speichern</h2>
              <div className="d-flex flex-column align-items-center gap-4 mt-2 justify-content-center">
                <div className="row align-items-center w-100 gap-2">
                  <label className="col-12">Datum*</label>
                  <input
                    type="datetime-local"
                    className="col-12"
                    id="datum"
                    placeholder="Datum eingeben"
                    required
                    value={inputValues.datum}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="row align-items-center w-100 gap-2">
                  <label className="col-12">Strahlertyp*</label>
                  <input
                    type="text"
                    className="col-12"
                    id="strahlertyp"
                    placeholder="Strahlertyp eingeben"
                    required
                    value={inputValues.strahlertyp}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="row align-items-center w-100 gap-2">
                  <label className="col-12">Strahlernummer*</label>
                  <input
                    type="text"
                    className="col-12"
                    id="strahlernummer"
                    placeholder="Strahlernummer eingeben"
                    value={inputValues.strahlernummer}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="row align-items-center w-100 gap-2">
                  <label className="col-12">Soll Leistung*</label>
                  <input
                    type="number"
                    className="col-12"
                    id="leistung"
                    placeholder=" Leistung in W eingeben"
                    required
                    min="0.5"
                    pattern="[0-9,]*"
                    value={inputValues.leistung}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="row align-items-center w-100 gap-2">
                  <label className="col-12">Spaunnung*</label>
                  <input
                    type="number"
                    className="col-12"
                    id="volt"
                    placeholder="Spunnung in V eingeben"
                    required
                    min="0.5"
                    pattern="[0-9,]*"
                    
                    value={inputValues.volt}
                    onChange={handleInputChange}
                  />
                </div><div className="row align-items-center w-100 gap-2">
                  <label className="col-12">Strom*</label>
                  <input
                    type="number"
                    className="col-12"
                    id="current"
                    placeholder=" Strom in A eingeben"
                    required
                   
                    min="0"
                    pattern="[0-9,]*"
                    value={inputValues.current}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <button onClick={handleSave}>Speichern</button>
            </div>
          </div>
        )}
      </div>
      <div className="dashboard-name">Dpt Datei Auswertung</div>

      <div className="container mt-3">
        <div className="d-flex flex-column mt-2 align-items-center justify-content-center gap-4">
          <div className="d-flex just-conntent-center align-items-center mt-2 gap-4 ">
          <input
              type="file"
              id="file-upload"
              className="file-upload"
              accept=".dpt"
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload" className="file-upload-label">
              Datei auswählen
            </label>
            <span className="file-name">
              {file ? file.name : ""}
            </span>
            <button
              type="submit"
              className="main-btn"
              id="messen-btn"
              onClick={handleSubmit}
            >
              Dpt Datei auswerten
            </button>
            <button
              type="button"
              className="main-btn"
              onClick={openWindow}
            >
              Im Datenbank speichern
            </button>
          </div>
          <div className="dataCard revenueCard-Full m-5">
            <Scatter id="mychart" data={data} options={options} ref={chartRef} />
          </div>

        </div>
      </div>
    </div>
  );
}

export default DptDataiAuswertung;