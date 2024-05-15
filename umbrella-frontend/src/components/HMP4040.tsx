import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./HMP4040.css";

interface RouteParams {
  param: string; // Define the type of your parameter here
}

function HMP4040() {
  const { param } = useParams<RouteParams>(); // Specify the type of useParams

  const [isWindowOpen, setIsWindowOpen] = useState(false);
  const openWindow = () => {
    setIsWindowOpen(true);
  };

  const closeWindow = () => {
    setIsWindowOpen(false);
  };

  const toggleWindow = () => {
    setIsWindowOpen((prevState) => !prevState);
  };
  const sendPost = () => {
    const radioValue = (
      document.querySelector(
        'input[name="custom-radio-group"]:checked'
      ) as HTMLInputElement
    )?.value;
    const checkboxes = document.querySelectorAll(
      'input[type="checkbox"]:checked'
    );
    const textInput = (
      document.querySelector('input[type="text"]') as HTMLInputElement
    )?.value;

    const checkboxData = Array.from(checkboxes).map(
      (checkbox: HTMLInputElement) => ({
        number: checkbox.name,
        value: checkbox.value,
      })
    );
    const ip = param;
    const postData = {
      ip: ip,
      radioValue: radioValue,
      checkboxes: checkboxData,
      value: textInput,
    };

    fetch("http://127.0.0.1:8000/api/hmp4040/set/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // Handle successful response here
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center flex-column container">
      <div className="dashboard-name ">
        {" "}
        Rohde & Schwart
        <span className="fw-normal"> HMP4040</span>
      </div>
      <h4>{param}</h4>
      <button onClick={openWindow}>Ansteuern</button>

      <div>
        {/* Show the window/modal when isWindowOpen is true */}
        {isWindowOpen && (
          <div className="window position-relativ">
            <div
              className="window-background w-100 h-100 position-absolute "
              onClick={toggleWindow}
            ></div>
            <div className=" window-content">
              <h2 className="fw-bold">Ansteuern</h2>
              <div className="d-flex flex-column align-items-center gap-5 mt-4 justify-content-center">
                <div className="d-flex gap-3  justify-content-center">
                  <label className="custom-radio">
                    <input type="radio" name="custom-radio-group" value="V" />
                    <div className="radio-button text-center">
                      <h1>U</h1>
                      <p>Spannung</p>
                    </div>
                  </label>

                  <label className="custom-radio">
                    <input type="radio" name="custom-radio-group" value="A" />
                    <div className="radio-button text-center">
                      <h1>I</h1>
                      <p>Strom</p>
                    </div>
                  </label>

                  <label className="custom-radio">
                    <input type="radio" name="custom-radio-group" value="W" />
                    <div className="radio-button text-center">
                      <h1>P</h1>
                      <p>Leistung</p>
                    </div>
                  </label>
                </div>

                <div className="justify-content-center d-flex gap-4">
                  <input type="checkbox" id="s_ch1" name="1" />
                  <label className="checkbox-label" htmlFor="s_ch1">
                    Kanal 1
                  </label>
                  <input type="checkbox" id="s_ch2" name="2" />
                  <label className="checkbox-label" htmlFor="s_ch2">
                    Kanal 2
                  </label>
                  <input type="checkbox" id="s_ch3" name="3" />
                  <label className="checkbox-label" htmlFor="s_ch3">
                    Kanal 3
                  </label>
                  <input type="checkbox" id="s_ch4" name="4" />
                  <label className="checkbox-label" htmlFor="s_ch4">
                    Kanal 4
                  </label>
                </div>

                <label className="custom-radio" style={{ marginLeft: "20px" }}>
                  <input type="text" name="value" placeholder="Wert eingeben" />
                </label>
              </div>
              <button onClick={sendPost}>Senden</button>
            </div>
          </div>
        )}
      </div>
      <div className="container mt-3"></div>
    </div>
  );
}

export default HMP4040;
