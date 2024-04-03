import { useState } from "react";
import "./App.css";
import { Link, useLocation } from "react-router-dom";
import NavLink from "./NavLink";
function Navbar() {
  return (
    <nav className=" navbar-expand navbar-light">
      <div className=" d-flex justify-content-between position-relative align-items-center h-100 ">
        <a className="navbar-brand " href="#">
          <img src="../../public/img/Logo.png" className="logo" alt="" />
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
              <NavLink name="Home" linkTo="" />
            </li>
            <li className="nav-item">
              <NavLink name="Geräte" linkTo="devicesdashboard" />
            </li>
            <li className="nav-item">
              <NavLink name="Prozesse" linkTo="processesdashboard" />
            </li>
            <li className="nav-item">
              <NavLink name="Ergebnisse" linkTo="resultsdashboard" />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
