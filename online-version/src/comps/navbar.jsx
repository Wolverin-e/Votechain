import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Home from "./home";
import About from "./about";
import Register from "./register";
import Dashboard from './dashboard';

class navbar extends Component {

  constructor() {
    super();
    document.addEventListener("DOMContentLoaded",() =>{
      let nav_items = document.getElementsByClassName("nav-item");
      for (var i=0; i<nav_items.length; i++) {
        nav_items[i].addEventListener("click",function() {
          var current = document.getElementsByClassName("active");
          current[0].className = current[0].className.replace(" active", "");
          this.className += " active";
        });
      }
    });
  }

  render() {
    return (
      <div>
      <Router>
        <nav className="navbar navbar-expand-sm navbar-fixed-top navbar-light custom-nav">
          <ul className="navbar-nav">
            <li className="navbar-brand">
                VOTECHAIN
            </li>
            <li className="nav-item active">
              <Link id="homelink" to="/" className="nav-link">
                <b>Home</b>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/register" className="nav-link">
                <b>Register</b>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link">
                <b>About</b>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="custom-nav-after"></div>
      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/register" component={Register} />
      <Route path="/dashboard" component={Dashboard} />
      </Router>
      </div>
    );
  }
}

export default navbar;
