import "./Home.css";
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
          <div className=" bg-dark dark-background"></div>
          <img src="../../public/img/devices.png" alt="" />

          <div className="dashboard-item-name">Geräte Dashboard</div>
        </div>
        <div className="col dashboard-item">
          <img src="../../public/img/devices.png" alt="" />
          <div className="opacity-75 bg-dark dark-background"></div>
        </div>
        <div className="col dashboard-item">
          <img src="../../public/img/devices.png" alt="" />
          <div className="opacity-75 bg-dark dark-background"></div>
        </div>
      </div>
    </div>
  );
}

export default Home;
