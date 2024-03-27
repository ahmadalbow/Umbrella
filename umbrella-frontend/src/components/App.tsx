import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import Test from "./test";
function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <nav className=" navbar-expand navbar-light">
        <div className=" d-flex justify-content-between position-relative align-items-center h-100 ">
          <a className="navbar-brand" href="#">
            <img src="../../public/img/logo.png" className="logo" alt="" />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse nav-links-container"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav  mb-2 mb-lg-0 gap-5">
              <li className="nav-item">
                <a className="nav-link active text-center " href="#">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link " href="#">
                  Geräte
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link " aria-current="page" href="#">
                  Prozesse
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link " href="#">
                  Ergebnisse
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="justify-content-center align-items-center  d-flex h-auto">
        <Test></Test>
      </div>
    </div>
  );
}

export default App;
