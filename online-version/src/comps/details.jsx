import React, { Component } from "react";
import {connect} from 'react-redux';
import { fetch_results } from "../actions/fetch_results";

class Details extends Component {

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
					<div className="results">
						<table className="results-table">
							{(this.props.candidates.length)?(
								this.props.candidates.map( (x, i) => (
									<tbody key={x}>
										<tr className="results-tr" key={i}>
											<td className="results-td-left">{x}</td>
											<td className="results-td-right">{this.props.results[i]}</td>
										</tr>
									</tbody>
								))
							):<tbody><tr><td>{"LOADING"}</td></tr></tbody>}
						</table>
					</div>
				</div>
				<input type="button" className="inp-btn" onClick={() => this.props.dispatch(fetch_results())} value="RELOAD"/>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return state;
}

export default connect(mapStateToProps)(Details);