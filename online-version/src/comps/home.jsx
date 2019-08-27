import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import logo from '../imgs/vote4.png';
import DB from '../DB/db';
var crypto = require('crypto-js');

class Login extends Component {
	constructor() {
		super();
		this.state = {
			username : "", 
			pass : "", 
			redirect: false, 
      user: ""
		};
	}

	handleChange = (field, evt) => {
		this.setState({ [field]: evt.target.value });
	};

	setRedirect = () => {
    if( (this.state.username.length === 16) && (this.state.pass.length !== 0)){
      navigator.usb.requestDevice({ filters: [] })
        .then(device => {
          let deviceID = device.productId+''+device.vendorId;
          return deviceID;
        })
        .then( devID => {
          DB("SELECT * FROM voters WHERE aid = '"+this.state.username+"'")
          .then(data => {
            const { qry_res } = data;
            console.log(qry_res);
            if (devID === crypto.AES.decrypt(qry_res[0].dhash, this.state.pass).toString(crypto.enc.Utf8)) {
              this.setState({user: qry_res[0], redirect:true});
            } else {
              alert("PLEASE CHECK ID & PASSWORD");
              return 0;
            }
          });
        });
    } else {
      alert("THIS IS NOT A JOKE!");
      return 0;
    }
	};

  render() {

  	if(this.state.redirect) {
      console.log(this.state.user);
      return <Redirect to={{pathname:"/dashboard", state: { voter: this.state.user}}} />;
  	}

    return (
    	<div>
    		<form className="login">
    		<img src={logo} className="logo" alt="Logo"/>
    		<input type="text" placeholder="USERNAME" onChange={(evt) => this.handleChange("username", evt)} className="inp" />
    		<input type="password" placeholder="PASSWORD" onChange={(evt) => this.handleChange("pass", evt)} className="inp" />
    		<input type="button" value="CRUNCH" className="inp-btn" onClick={this.setRedirect} />
    		</form>
    	</div>
    );
  }
}

export default Login;
