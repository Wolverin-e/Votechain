import React, { Component } from "react";
import bus from '../imgs/bus.png';
import Hasher from '../HASHER/hasher';
import {connect} from 'react-redux';
import { fetch_results } from '../actions/fetch_results';
import attach_tkn from '../actions/attach_tkn';

class Vote extends Component {

	state = {
		for: 1
	}

	handleChange = (evt) => {
		this.setState({for: evt.target.value});
		// console.log(this.state);
	}

	handleVote = () => {
		if( (!this.props.has_voted) && this.props.user.vhash === "" ){
			if(! this.props.vote_requested){
				this.props.dispatch({
					type: "HANDLE-VOTE-REQUESTED"
				})

				var hashed = this.props.user.aid+'---'+this.state.for
				fetch(process.env.REACT_APP_DB_API+"/vote", {
					method: "POST", 
					body: JSON.stringify({vhash: Hasher(hashed).cipher}), 
					headers: {
						'Accept': 'application/json', 
						'Content-Type': 'application/json', 
						'api_key': process.env.REACT_APP_DB_API_ACCESS_KEY, 
						'api_auth_key': this.props.user.tkn, 
						'api_auth_refresh_key': this.props.user.rtkn
					}
				}).then(res => {
					this.props.dispatch(attach_tkn(res));
					return res.json();
				}).then(resl => {
					if(resl.voted){
						this.props.dispatch(fetch_results());
						this.props.dispatch({
							type: "SET-VOTED"
						})
						alert("VOTED SUCCESSFULLY");
					} else {
						alert("TRY AGAIN IN SOME TIME");
						console.log(resl.err);
					}
				});
			} else {
				alert("VOTE-REQUESTED!");
			}
		} else {
			alert("😏😑 You have already Voted go back to enjoying yourself!");
		}
	};

	render() {
		return(
			<div className="dashboard2 vote">
				<img src={bus} className="logo" alt="img"/>
				<h3 className="vote-h3">CAST YOUR VOTE</h3>
				<select onChange={(evt) => this.handleChange(evt)} className="drp-dwn">
					{this.props.candidates.map((x, i) => <option key={i} value={i+1}>{x}</option>)}
				</select>
				<div className="about"> {this.props.about_candidates[this.state.for-1]} </div>
				<input type="button" className="inp-btn" onClick={() => this.handleVote()} value="VOTE" disabled={this.props.has_voted}/>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return state;
}

export default connect(mapStateToProps)(Vote);
