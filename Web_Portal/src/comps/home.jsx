import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import logo from '../imgs/vote4.png';
import {connect} from 'react-redux';
import Hasher from "../HASHER/hasher";
const crypto = require('crypto-js');

class Login extends Component {
  
  state = {
    username : "", 
    pass : "", 
    redirect: false
  };

	handleChange = (field, evt) => {
		this.setState({ [field]: evt.target.value });
	};

	setRedirect = () => {
    if( (/^[1-9][0-9]{15}$/.test(this.state.username)) && (/^[A-Za-z0-9]{4,}$/.test(this.state.pass))){
      navigator.usb.requestDevice({ filters: [] })
      .then(device => {
        let deviceID = device.productId+''+device.vendorId;
        return deviceID;
      }).then( devID => {
        fetch(process.env.REACT_APP_DB_API+"/login", {
          method: "POST", 
          body: JSON.stringify({
            username: Hasher(this.state.username).cipher, 
            password: Hasher(crypto.SHA512(this.state.pass).toString()).cipher
          }), 
          headers: {
            'Accept': 'application/json', 
            'Content-Type': 'application/json', 
            'api_key': process.env.REACT_APP_DB_API_ACCESS_KEY
          }
        })
        .then(res => res.json())
        .then(resl => {
          if(resl.succeed && (crypto.AES.decrypt(resl.usr.dhash, crypto.SHA512(this.state.pass).toString()).toString(crypto.enc.Utf8) === crypto.SHA512(devID).toString())){
            this.props.dispatch({
              type: "ATTACH-USER", 
              payload: resl.usr
            })
            this.setState({redirect:true});
          } else {
            alert("PLEASE CHECK ID & PASSWORD");
          }
        })
      }).catch(err => {
        if(err.message !== "No device selected."){
          console.log(err);
        }
      });
    } else {
      alert("YOU CAN ALWAYS WASTE YOUR TIME!");
    }
  };

  componentDidMount(){
    if(this.props.user){
      this.setState({redirect: true});
    } else if(this.props.registered_for) {
      document.getElementById('uname').value = this.props.registered_for;
      this.setState({username: this.props.registered_for})
    }
  }

  render() {
  	if(this.state.redirect) {
      return <Redirect to={{pathname:"/dashboard"}} />;
    }

    return (
    	<div>
    		<form className="login">
    		<img src={logo} className="logo" alt="Logo"/>
    		<input type="text" id="uname" placeholder="USERNAME" onChange={(evt) => this.handleChange("username", evt)} className="inp" />
    		<input type="password" placeholder="PASSWORD" onChange={(evt) => this.handleChange("pass", evt)} className="inp" />
    		<input type="button" value="CRUNCH" className="inp-btn" onClick={this.setRedirect} />
    		</form>
    	</div>
    );
  }
}

const mapStateToProps = state => {
  return state;
}

export default connect(mapStateToProps)(Login);
