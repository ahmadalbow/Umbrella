import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./DevicesDashboard.css";
function DevicesDashboard() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/");
      const jsonData = await response.json();
      console.log(jsonData[1][0]);
      setData(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
    <div className="d-flex justify-content-center align-items-center flex-column container">
      <div className="dashboard-name mt-3">Devices Dashboard </div>
      <div className="row gap-5 mt-5 p-5">
        {data.map((item) => (
          <div className="col-3 dashboard-item ">
            <Link to={"/devicesdashboard/" + item[0] + "/" + item[1]}>
              <img src={"../../public/img/" + item[0] + ".png"} alt="" />
              <div className="pe-none  dark-background"></div>
              <div className="d-flex flex-column device-container pe-none">
                <div className="company-name ">{item[2]}</div>
                <div className="device-name ">{item[0]}</div>
                <div className="">{item[1]}</div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
export default DevicesDashboard;
