import { useState } from "react";
import "./App.css";
import Home from "./Home";
import Navbar from "./Navbar";
import DevicesDashboard from "./DevicesDashboard";
import ProcessDashboard from "./ProcessDashboard";
import ResultsDashboard from "./ResultsDashboard";
import Spektrum from "./spektrum";
import FTIR from "./FTIR";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import HMP4040 from "./HMP4040";
import DptDataiAuswertung from "./DptDataiAuswertung";
function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <div className="App">
        <Navbar></Navbar>
        <Switch>
          <div className=" app-container position-relative overflow-hidden">
            <div className="p-5">
              <Route exact path="/" component={Home}></Route>
              <Route
                exact
                path="/devicesdashboard"
                component={DevicesDashboard}
              ></Route>
              <Route
                exact
                path="/devicesdashboard/HMP4040/:param"
                component={HMP4040}
              ></Route>
              <Route
                exact
                path="/processesdashboard"
                component={ProcessDashboard}
              ></Route>
              <Route
                exact
                path="/processesdashboard/ftir"
                component={FTIR}
              ></Route>
              <Route
                exact
                path="/resultsdashboard"
                component={ResultsDashboard}
              ></Route>
              <Route
                exact
                path="/resultsdashboard/spektrum"
                component={Spektrum}
              ></Route>
               <Route
                exact
                path="/resultsdashboard/dptfiletogrpah"
                component={DptDataiAuswertung}
              ></Route>
            </div>
            <div className="gray-box"></div>
            <div className="infrasolid-background"> INFRASOLID</div>
          </div>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
