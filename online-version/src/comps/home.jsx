import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import logo from '../imgs/vote4.png';
import DB from '../DB/db';
import {connect} from 'react-redux';
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
    if( (this.state.username.length === 16) && (this.state.pass.length !== 0)){
      navigator.usb.requestDevice({ filters: [] })
        .then(device => {
          let deviceID = device.productId+''+device.vendorId;
          return deviceID;
        }).then( devID => {
          DB("SELECT * FROM voters WHERE aid = '"+this.state.username+"'")
          .then(data => {
            const { qry_res } = data;
            if ((qry_res.length) && devID === crypto.AES.decrypt(qry_res[0].dhash, this.state.pass).toString(crypto.enc.Utf8)) {
              this.props.dispatch({
                type: "ATTACH-USER", 
                payload: qry_res[0]
              })
              this.setState({redirect:true});
            } else {
              alert("PLEASE CHECK ID & PASSWORD");
            }
          });
        });
    } else {
      alert("YOU CAN ALWAYS WASTE YOUR TIME!");
    }
  };
  
  componentDidMount(){
    if(this.props.user){
      this.setState({redirect: true});
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
    		<input type="text" placeholder="USERNAME" onChange={(evt) => this.handleChange("username", evt)} className="inp" />
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
