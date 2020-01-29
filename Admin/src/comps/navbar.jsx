import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Home from './home.jsx';
import About from './about.jsx';
import Dashboard from './dashboard.jsx';

class navbar extends Component{
    constructor(){
        super();
        document.addEventListener("DOMContentLoaded", () => {
            let nav_items = document.getElementsByClassName("nav-item");
            for(let i = 0; i< nav_items.length; i++){
                nav_items[i].addEventListener("click", function(){
                    var current = document.getElementsByClassName("active");
                    current[0].className = current[0].className.replace(" active", "");
                    this.className += " active";
                });
            }
        });
    }

    render(){
        return(
            <Router>
                <div>
                    <nav className="navbar navbar-expand-sm navbar-fixed-top navbar-dark custom-nav">
                        <ul className="navbar-nav">
                            <li className="navbar-brand">
                                VOTECHAIN-ADMIN
                            </li>
                            <li className="nav-item active">
                                <Link to="/" className="nav-link">
                                    Home
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/about" className="nav-link">
                                    About
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
                <Route exact path="/" component={Home} />
                <Route path="/about" component={About} />
                <Route path="/dashboard" component={Dashboard} />
            </Router>
        )
    }
}

export default navbar;