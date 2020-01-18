import React, { Component } from "react";
import { connect } from 'react-redux';

class Details extends Component {

	render() {
		return(
			<div className="dashboard2">
				<div className="results">
					<table className="results-table">
						{(this.props.candidates.length)?this.props.candidates.map( (x, i) => 
							<tbody key={x}>
								<tr className="results-tr" key={i}>
									<td className="results-td-left">{x}</td>
									<td className="results-td-right">{this.props.votes[i]}</td>
								</tr>
							</tbody>
						):<tbody><tr><td>{"ADD CANDIDATES FIRST"}</td></tr></tbody>}
					</table>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return state;
}

export default connect(mapStateToProps)(Details);