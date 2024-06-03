import { useState } from "react";
import "./Ftir.css";
import { Link } from "react-router-dom";
import { sendScanRequest } from "./api"; // Assuming these are functions for sending requests and checking progress

function FTIR() {
  const [inputValues, setInputValues] = useState({
    unterverzeichnis: "",
    strahlernummer: "",
    strahlertyp: "",
    soll_leistung: 0,
    comment: "",
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValues({
      ...inputValues,
      [e.target.id]: e.target.value,
    });
  };
  const [errorMessage, setErrorMessage] = useState("");
  const [status, setStatus] = useState({ status: "", className: "" });
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
  return (
    <div className="d-flex justify-content-center align-items-center flex-column container">
      <div className="dashboard-name "> FTIR Messung</div>
      <div className="container mt-3">
        <div className="d-flex flex-column mt-2  align-items-center justify-content-center gap-4">
          {errorMessage && (
            <p className="error-message text-danger">{errorMessage}</p>
          )}
          <div className="row align-items-center w-75 gap-2">
            <label className="col-12 col-lg-2 offset-lg-3">
              {" "}
              Unterverzeichnis*
            </label>
            <input
              type="text"
              className="col-12 col-lg-4 "
              id="unterverzeichnis"
              placeholder="Unterverzeichnis eingeben"
              required
              value={inputValues.unterverzeichnis}
              onChange={handleInputChange}
            />
          </div>
          <div className="row align-items-center w-75 gap-2">
            <label className="col-12 col-lg-2 offset-lg-3">Strahlertyp*</label>
            <input
              type="text"
              className="col-12 col-lg-4"
              id="strahlertyp"
              placeholder="Strahlertyp eingeben"
              required
              value={inputValues.strahlertyp}
              onChange={handleInputChange}
            />
          </div>
          <div className="row align-items-center w-75 gap-2">
            <label className="col-12 col-lg-2 offset-lg-3">
              {" "}
              Strahlernummer*
            </label>
            <input
              type="text"
              className="col-12 col-lg-4"
              id="strahlernummer"
              placeholder="Strahlernummer eingeben"
              value={inputValues.strahlernummer}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="row align-items-center w-75 gap-2">
            <label className="col-12 col-lg-2 offset-lg-3">
              Soll Leistung*
            </label>
            <input
              type="number"
              className="col-12 col-lg-4"
              id="soll_leistung"
              placeholder="Soll Leistung in W  eingeben"
              required
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
      </div>
    </div>
  );
}

export default FTIR;
