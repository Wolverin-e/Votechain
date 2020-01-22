import React, { Component } from "react";
import Vote from './vote';
import Details from './details';
import { Redirect } from 'react-router-dom';
import {connect} from 'react-redux';
import fetch_all from '../actions/fetch_all';

class DashboardSidebar extends Component {

	state = {
		vote: true,
		details: false, 
		logout: false
	}

	changeTile = async (evt) => {
		this.setState({vote:false});
		await Object.assign([], Object.keys(this.state).map((x) => {
			return evt.target.id===x?{[x]:true}:{[x]:false}
		})).forEach((stateVar) => {
			this.setState(stateVar);
		})
		for (let tab of Object.keys(this.state)) {
			let elem = document.getElementById(tab);
			elem.className = this.state[tab]?"sub-link sub-link-active":"sub-link";
		}
	};

	componentDidMount = () => {
		if(this.props.user){
			this.props.dispatch(fetch_all(this.props.user.tkn, this.props.user.rtkn));
		} else {
			this.handleLogout();
			// console.log("logging out!");
		}
	}

	handleLogout = () => {
		this.props.dispatch({
			type:"HANDLE-LOGOUT"
		});
		this.setState({logout: true});
	};

	render() {
		if(this.state.logout){
			return <Redirect to="/"/>;
		}
		return (
			<div>
			<div className="dashboard1">
				<div className="title">
					MENU
				</div>
				<input type="button" id="vote" onClick={(evt) => this.changeTile(evt)} value="VOTE" className="sub-link sub-link-active"/>
				<input type="button" id="details" onClick={(evt) => this.changeTile(evt)} value="DETAILS" className="sub-link"/>
				<input type="button" id="logout" onClick={() => this.handleLogout()} value="LOGOUT" className="sub-link"/>
			</div>
			{ this.state.vote?<Vote />:true }
			{ this.state.details?<Details />:true }
			</div>
		);
	}
}

const mapStateToProps = state => {
	return state;
}

export default connect(mapStateToProps)(DashboardSidebar);