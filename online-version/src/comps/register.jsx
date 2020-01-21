import React, { Component } from "react";
import DB from '../DB/db';
import {connect} from 'react-redux';
var crypto = require("crypto-js");

class Register extends Component {

	constructor(){
		super();
		this.state = {
			aid: '', 
			name: '', 
			email: '', 
			number: '', 
			deviceID: '', 
			pin: '',
			device: false
		}
	}

	handleChange = (field, evt) => {
		this.setState({ [field]: evt.target.value });
		// console.log(this.state)
	};

	copyToClipboard = txt => {
        var txtField = document.createElement('textarea');
        txtField.innerText = txt;
        document.body.appendChild(txtField);
        txtField.select();
        document.execCommand('copy');
        txtField.remove();
    }

	handleSigner = (evt) => {
		var elem = evt.target;
		if(! this.state.device) {
			navigator.usb.requestDevice({ filters: [] }).then(device => {
				this.setState({deviceID: device.productId+''+device.vendorId, device:true});
				// console.log(this.state);
				elem.value = "CONNECTED!";
			});
		} else {
			elem.value = "PLEASE MOVE FORWARD!";
		}
	};

	handleSubmit = async () => {
		if(this.checkform()){
			const device = this.state.deviceID;
			const pin = this.state.pin;
			await this.setState({deviceID: crypto.AES.encrypt(device, pin).toString()});
			// eslint-disable-next-line
			var sql = "INSERT INTO voters (aid, name, email, number, vhash, dhash) VALUES ("+this.state.aid+", '"+this.state.name+"', '"+this.state.email+"', "+this.state.number+', '+"'', '"+this.state.deviceID+"')";
			var validation_sql = "SELECT aid FROM voters WHERE aid="+this.state.aid;
			DB(validation_sql).then(res => {
				if(!res.qry_res.length) {
					DB(sql).then(resp => {
						// console.log(resp);
						this.copyToClipboard(this.state.aid);
						alert('REGISTERED!\n COPIED AAADHAR ID TO YOUR CLIPBOARD!');
						this.props.dispatch({
							type: "ATTACH-REGISTERED-USER", 
							payload: this.state.aid
						})
						document.getElementById('homelink').click();
					});
				} else {
					alert('ALREADY REGISTERED!');
				};
			});
		}
	};

	checkform = () => {
		var errs = []
		if(! /^[1-9][0-9]{15}$/.test(this.state.aid)){
			errs.push("PLEASE ENTER VALID AADHAR ID!");
		}
		if(! /^[A-Za-z0-9]+@([A-Za-z]+.)+[A-Za-z]+$/.test(this.state.email)){
			errs.push("PLEASE ENTER VALID EMAIL ID!");
		}

		if(! /^[A-Za-z]+ ?[A-Za-z]*$/.test(this.state.name)){
			errs.push("PLEASE ENTER VALID NAME!");
		}

		if(! /^[1-9][0-9]{9}$/.test(this.state.number)){
			errs.push("PLEASE ENTER 10 DIGIT NUMBER!");
		}

		if(! this.state.device){
			errs.push("PLEASE CONNECT SIGNER!");
		}

		if(errs.length){
			alert(errs.join("\n"));
			return false;
		} else {
			return true;
		}
	}

	render() {
		return(
			<div className="Register">
				<h3 className="vote-h3">REGISTRATION</h3>
				<input type="text" className="inp" onChange={evt => this.handleChange("aid", evt)} placeholder="AADHAR"/>
				<input type="text" className="inp" onChange={evt => this.handleChange("name", evt)} placeholder="NAME"/>
				<input type="text" className="inp" onChange={evt => this.handleChange("email", evt)} placeholder="EMAIL"/>
				<input type="text" className="inp" onChange={evt => this.handleChange("number", evt)} placeholder="NUMBER"/>
				<input type="password" className="inp" onChange={evt => this.handleChange("pin", evt)} placeholder="PIN"/>
				<input type="text" className="inp" onClick={evt => this.handleSigner(evt)} readOnly value="SIGNER NOT CONNECTED. CLICK ME!"/>
				<input type="button" className="inp-btn" onClick={() => this.handleSubmit()} value="SUBMIT"/>
				<div className="empty_space_bottom"> </div>
			</div>
		);
	}
}

export default connect()(Register);