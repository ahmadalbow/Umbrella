import "./Home.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="d-flex justify-content-center align-items-center flex-column container">
      <img
        src="../../public/img/infrasolid-logo.svg"
        alt=""
        className="infrasolid-logo"
      />
      <div className="dashboard-name mt-3"> Dashboards</div>
      <div className="row gap-5 mt-5">
        <div className="col dashboard-item">
          <Link to="/devicesdashboard">
            {" "}
            <img src="../../public/img/devices.png" alt="" />
            <div className="pe-none  dark-background"></div>
            <div className="dashboard-item-name pe-none">Geräte Dashboard</div>
          </Link>
        </div>
        <div className="col dashboard-item">
          <Link to="/processesdashboard">
            {" "}
            <img src="../../public/img/processes.png" alt="" />
            <div className="pe-none  dark-background"></div>
            <div className="dashboard-item-name pe-none">Prozess Dashboard</div>
          </Link>
        </div>
        <div className="col dashboard-item">
          <Link to="/resultsdashboard">
            {" "}
            <img src="../../public/img/results.png" alt="" />
            <div className="pe-none  dark-background"></div>
            <div className="dashboard-item-name pe-none">
              Ergebnis Dashboard
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
