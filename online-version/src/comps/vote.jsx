import React, { Component } from "react";
import bus from '../imgs/bus.png';
import Hasher from '../HASHER/hasher';

class Vote extends Component {

	constructor(){
		super();
		this.state = {
			for: 1, 
			voted: false
		};
	}

	handleChange = async (evt) => {
		await this.setState({for: evt.target.value});
		console.log(this.state);
	};

	handleVote = () => {
		if(!window.$has_voted){
			var hashed = this.props.user.aid+'---'+this.state.for
			// console.log(hashed)
			fetch(process.env.REACT_APP_DB_API+"/vote", {
				method: "POST", 
				body: JSON.stringify({vhash: Hasher(hashed).cipher}), 
				headers: {
					'Accept': 'application/json', 
					'Content-Type': 'application/json'
				}
			}).then(res => {
				return res.json();
			}).then(resl => {
				this.setState(resl);
				window.has_voted = true;
				alert("VOTED SUCCESSFULLY");
			});
		} else {
			alert("😏😑 Already Voted go back to enjoying yourself!");
		}
	};

	componentDidMount() {
		if(this.props.vhash) {
			this.setState({voted: true});
		}
	}

	render() {
		return(
			<div className="dashboard2">
				<img src={bus} className="logo" alt="img"/>
				<h3 className="vote-h3">CAST YOUR VOTE</h3>
				<select onChange={(evt) => this.handleChange(evt)} className="drp-dwn">
					<option value="1">MODI</option>
					<option value="2">PAPPU</option>
					<option value="3">KEJRIWAL</option>
					<option value="4">MAMTA</option>
				</select>
				<input type="button" className="inp-btn" onClick={() => this.handleVote()} value="VOTE" disabled={this.state.voted}/>
			</div>
		);
	}
}

export default Vote;