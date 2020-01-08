import React, { Component } from "react";
import { connect } from 'react-redux';

class Details extends Component {

	state = {
		votes: []
	}

	componentDidMount(){
		fetch(process.env.REACT_APP_ADMIN_API+"/result", {
			method: "GET", 
			headers: {
				'Accept': 'application/json', 
				'Content-Type': 'application/json'
			}
		}).then( res => {
			return res.json()
		}).then( result => {
			this.setState({votes: result});
		})
	}

	render() {
		
		return(
			<div className="dashboard2">
				<div className="results">
					{this.props.candidates.map( (x, i) => <h5>{x}:{this.state.votes[i]}</h5>)}
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return state;
}

export default connect(mapStateToProps)(Details);