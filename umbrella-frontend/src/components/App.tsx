import { useState } from "react";
import "./App.css";
import Home from "./Home";
import Navbar from "./Navbar";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

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
              <Route path="/ergebnisse">
                <h1>Ahmad2</h1>
              </Route>
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
