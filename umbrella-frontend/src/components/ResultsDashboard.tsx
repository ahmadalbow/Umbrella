import "./ResultsDashboard.css";

import { Link } from "react-router-dom";

function ResultsDashboard() {
  return (
    <div className="d-flex justify-content-center align-items-center flex-column container">
      <div className="dashboard-name mt-3"> Results Dashboard</div>
      <div className="row gap-5 mt-5 flex-wrap">
        <div className="col results-dashboard-item">
          <Link to="/resultsdashboard/spektrum">
            {" "}
            <img src="../../public/img/spektrum.png" alt="" />
            <div className="pe-none  dark-background"></div>
            <div className="dashboard-item-name pe-none">Spektrum</div>
          </Link>
        </div>
        <div className="col process-dashboard-item">
          <Link to="/resultsdashboard/dptfiletogrpah">
            {" "}
            <img src="../../public/img/DptFileToGraph.png" alt="" />
            <div className="pe-none  dark-background"></div>
            <div className="dashboard-item-name pe-none">DPT Datei Auswertung</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResultsDashboard;
