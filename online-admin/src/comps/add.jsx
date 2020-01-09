import React, { Component } from 'react';
import Hasher from '../HASHER/hasher';
import { connect } from 'react-redux';
import { fetch_candidates } from '../actions/fetch_candidates';

class Add extends Component {

    state = {
        new_candidate: ''
    }

    handleAdd = () => {
        var hashed = this.state.new_candidate;
        fetch(process.env.REACT_APP_ADMIN_API+"/add", {
            method: "POST", 
            body: JSON.stringify({add: Hasher(hashed).cipher}), 
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json'
            }
        }).then(res => {
            return res.json();
        }).then(resl => {
            this.props.dispatch(fetch_candidates());
            alert("ADDED "+this.state.new_candidate+" SUCCESSFULLY");
        });
    }

    handleChange = txt => {
        this.setState({new_candidate: txt});
    }

    render() { 
        return(
            <div className="dashboard2">
                <div className="add">
                <input type="text" className="inp" onChange={evt => this.handleChange(evt.target.value)} placeholder="NEW CANDIDATE"/>
                <input type="button" className="inp-btn" onClick={() => this.handleAdd()} value="ADD"/>
                </div>
            </div>
        );
    }
}


export default connect()(Add);