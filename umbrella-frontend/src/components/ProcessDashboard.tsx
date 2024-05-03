import "./ProcessDashboard.css";

import { Link } from "react-router-dom";

function ProcessDashboard() {
  return (
    <div className="d-flex justify-content-center align-items-center flex-column container">
      <div className="dashboard-name mt-3"> Process Dashboard</div>
      <div className="row gap-5 mt-5">
        <div className="col process-dashboard-item">
          <Link to="/processesdashboard/ftir">
            {" "}
            <img src="../../public/img/opus.png" alt="" />
            <div className="pe-none  dark-background"></div>
            <div className="dashboard-item-name pe-none">FTIR Messung</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProcessDashboard;
