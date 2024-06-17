import React, { useState, useEffect } from "react";
import "./HMP4040Channel.css";

interface Props {
  ip: string;
  number: string;
}

function HMP4040Channel({ ip, number }: Props) {
  const [values, setValues] = useState({
    voltage: "32.00",
    current: "32.00",
    power: "32.00",
  });

  const getMeasurementData = async (ip: string, ch: string) => {
    const url = new URL("http://172.16.0.163:8000/api/hmp4040_measure");
    url.searchParams.append("ip", ip);
    url.searchParams.append("ch", ch);
    try {
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  const HandleChannelSwitch = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isChecked = event.target.checked;
    const data = {
      ch: number,
      ip: ip,
      isChecked: isChecked,
    };
    try {
      const response = await fetch(
        "http://172.16.0.163:8000/api/channel_switch/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const HandleAutoCorrectSwitch = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isChecked = event.target.checked;
    const element = document.getElementById(
      "must_power" + number
    ) as HTMLInputElement;
    const value = element.value.replace(",", ".");
    if (isChecked) {
      if (isNaN(Number(value)) || element.value === "") {
        element.style.border = "1px solid red";
        element.style.color = "red";
        event.target.checked = false;
        return;
      }
    }
    element.style.border = "none";
    element.style.color = "black";
    const data = {
      ch: number,
      ip: ip,
      isChecked: isChecked,
      mustPower: parseFloat(value),
    };
    try {
      const response = await fetch(
        "http://172.16.0.163:8000/api/auto_corrector_switch/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMeasurementData(ip, number);
        setValues({
          voltage: data.volt,
          current: data.curr,
          power: data.power,
        });
        document.getElementById("s_ch" + number)?.setAttribute(
          "checked",
          data.status ? "checked" : ""
        );
        if (data.ac) {
          document.getElementById("autocorrector" + number)?.setAttribute(
            "checked",
            "checked"
          );
          document.getElementById("must_power" + number)?.setAttribute(
            "value",
            data.value
          );
        }
      } catch (error) {
        console.error("Failed to fetch measurement data:", error);
      }
    };

    // Fetch data immediately upon mount
    const firstCallTimeoutId = setTimeout(
      fetchData,
      1000 + 200 * (parseInt(number) - 1)
    );

    // Set interval to fetch data every 10 seconds
    const intervalId = setInterval(fetchData, 10000 + 500 * parseInt(number));

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [ip, number]);

  return (
    <div className="channel-container gap-3">
      <input
        type="checkbox"
        id={"s_ch" + number}
        name={number}
        onChange={HandleChannelSwitch}
      />
      <label className="checkbox-label fs-4" htmlFor={"s_ch" + number}>
        Kanal {number}
      </label>
      <div className="value-container d-flex justify-content-center gap-5 ">
        <div>{parseFloat(values.voltage).toFixed(3)}</div>
        <span> V </span>
      </div>
      <div className="value-container d-flex justify-content-center gap-5 ">
        <div> {parseFloat(values.current).toFixed(3)}</div>
        <span> A </span>
      </div>
      <div className="value-container d-flex justify-content-center gap-5 ">
        <div>{parseFloat(values.power).toFixed(3)}</div>
        <span> W </span>
      </div>

      <input
        type="text"
        className=""
        id={"must_power" + number}
        placeholder="Sollwert Eingeben"
        required
      />
      <input
        type="checkbox"
        id={"autocorrector" + number}
        name="autocorrector"
        onChange={HandleAutoCorrectSwitch}
      />
      <label
        className="checkbox-label"
        id="autocorrector"
        htmlFor={"autocorrector" + number}
      >
        Auto Korrektur
      </label>
    </div>
  );
}

export default HMP4040Channel;
