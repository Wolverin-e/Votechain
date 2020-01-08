import React, { Component } from "react";

class Details extends Component {

	constructor(){
		super();
		this.state = {
			votes: [0, 0, 0, 0], 
			cands: ['MODI', 'PAPPU', 'KEJRIWAL', 'MAMTA'], 
			stage: [0, 1, 2, 3]
		};
	};

	componentDidMount(){
		fetch(process.env.REACT_APP_DB_API+"/result", {
			method: "GET", 
			headers: {
				'Accept': 'application/json', 
				'Content-Type': 'application/json'
			}
		}).then( res => {
			return res.json()
		}).then( result => {
			// console.log(result);
			this.setState({votes: result});
		})
	}

	render() {

		return(
			<div className="dashboard2">
				<div className="results">
				{this.state.stage.map(x => <h5 key={x}>{this.state.cands[x]}:{this.state.votes[x]}</h5>)}
				</div>
			</div>
		);
	}
}

export default Details;