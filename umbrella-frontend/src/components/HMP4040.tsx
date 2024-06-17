import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./HMP4040.css";
import HMP4040Channel from "./HMP4040Channel";

interface RouteParams {
  param: string;
}

function HMP4040() {
  const { param } = useParams<RouteParams>();
  const [isWindowOpen, setIsWindowOpen] = useState(false);

  const openWindow = () => setIsWindowOpen(true);
  const closeWindow = () => setIsWindowOpen(false);
  const toggleWindow = () => setIsWindowOpen((prevState) => !prevState);

  const sendPost = () => {
    const radioValue = (
      document.querySelector(
        'input[name="custom-radio-group"]:checked'
      ) as HTMLInputElement
    )?.value ?? null;

    const checkboxes = document.querySelectorAll(
      'input[type="checkbox"]:checked'
    );
    const textInput = (
      document.querySelector('input[type="text"]') as HTMLInputElement
    )?.value ?? "";

    const checkboxData = Array.from(checkboxes).map((checkbox) => {
      const inputElement = checkbox as HTMLInputElement;
      return {
        number: inputElement.name,
        value: inputElement.value,
      };
    });

    const ip = param;
    const postData = {
      ip,
      radioValue,
      checkboxes: checkboxData,
      value: textInput,
    };

    fetch("http://172.16.0.163:8000/api/hmp4040/set/", {
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

  const OutPutSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const ip = param;
    const isChecked = event.target.checked;
    const postData = {
      ip,
      isChecked,
    };

    fetch("http://172.16.0.163:8000/api/hmp4040/output/", {
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
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const DataLogSwitch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const ip = param;
    const isChecked = event.target.checked;
    const postData = {
      ip,
      isChecked,
    };

    fetch("http://172.16.0.163:8000/api/hmp4040/datalog/", {
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
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  const get_status = (ip: string) => {
    const url = new URL("http://172.16.0.163:8000/api/out_save_status");
    url.searchParams.append("ip", ip);
    return fetch(url.toString())
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        (document.getElementById("output") as HTMLInputElement).checked =
          data.out_status ?? false;
        (document.getElementById("save") as HTMLInputElement).checked =
          data.saving_status ?? false;
        return data;
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        throw error;
      });
  };

  useEffect(() => {
    if (param) {
      get_status(param);
    }
  }, [param]);

  return (
    <div className="d-flex justify-content-center align-items-center flex-column container">
      <div className="dashboard-name">
        Rohde & Schwarz &#8192;
        <span className="fw-normal"> HMP4040</span>
      </div>
      <h4 className="mt-2">{param}</h4>

      <div className="mt-3 d-flex gap-5 justify-content-center align-items-center">
        <button onClick={openWindow}>Ansteuern</button>
        <div>
          <input
            type="checkbox"
            id="output"
            name="output"
            onChange={OutPutSwitch}
          />
          <label className="checkbox-label" id="outputlabel" htmlFor="output">
            OUTPUT
          </label>
        </div>
        <div>
          <input
            type="checkbox"
            id="save"
            name="save"
            onChange={DataLogSwitch}
          />
          <label className="checkbox-label" id="saveLabel" htmlFor="save">
            Data Speichern
          </label>
        </div>
      </div>

      <div>
        {isWindowOpen && (
          <div className="window position-relativ">
            <div
              className="window-background w-100 h-100 position-absolute"
              onClick={toggleWindow}
            ></div>
            <div className="window-content">
              <h2 className="fw-bold">Ansteuern</h2>
              <div className="d-flex flex-column align-items-center gap-5 mt-4 justify-content-center">
                <div className="d-flex gap-3 justify-content-center">
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

      <div className="row gap-5 mt-5">
        <HMP4040Channel ip={param} number="1"></HMP4040Channel>
        <HMP4040Channel ip={param} number="2"></HMP4040Channel>
        <HMP4040Channel ip={param} number="3"></HMP4040Channel>
        <HMP4040Channel ip={param} number="4"></HMP4040Channel>
      </div>
    </div>
  );
}

export default HMP4040;
