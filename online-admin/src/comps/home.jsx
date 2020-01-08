import React, { Component } from "react";
import logo from '../imgs/vote4.png';
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
// import DB from '../DB/db';

class Home extends Component{

    constructor(){
        super();
        this.state = {
            redirect: false, 
            username: "", 
            pass: "" 
        }
    }

    setRedirect = () => {
        // DB("SELECT * FROM admins WHERE username = '"+this.state.username+"'")
        // .then( res => {
        //     const {qry_res} = res;
        //     // console.log(qry_res);
        //     if(qry_res[0].password === this.state.pass){
        //         this.setState({redirect: true});
        //     }
        // })
        this.props.dispatch({type:"LOGIN-SUCCESSFUL", payload:{id:"0", username:"alpha", password:"Beta"}})
        this.setState({redirect: true});
    }

    handleChange = (field, evt) => {
		this.setState({ [field]: evt.target.value });
	};

    render(){

        if(this.state.redirect){
            return <Redirect to={{pathname:"/dashboard"}} />
        }

        return(
            <div>
                <form className="login">
                    <img src={logo} className="logo" alt="Logo"/>
                    <input type="text" placeholder="USERNAME" onChange={(evt) => this.handleChange("username", evt)} className="inp" />
                    <input type="password" placeholder="PASSWORD" onChange={(evt) => this.handleChange("pass", evt)} className="inp" />
                    <input type="button" value="CRUNCH" className="inp-btn" onClick={this.setRedirect} />
                </form> 
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        ...state
    }
}

export default connect(mapStateToProps)(Home);