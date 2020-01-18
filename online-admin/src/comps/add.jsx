import React, { Component } from 'react';
import Hasher from '../HASHER/hasher';
import { connect } from 'react-redux';
import { fetch_candidates } from '../actions/fetch_candidates';
import { fetch_results } from '../actions/fetch_results';
import add from '../imgs/add2.png';

class Add extends Component {

    state = {
        new_candidate: '', 
        about_new_candidate: ''
    }

    handleAdd = () => {
        if(this.state.new_candidate !== '' && this.state.about_new_candidate !== ''){
            if(! this.props.candidates.filter(x => x===this.state.new_candidate).length){
                fetch(process.env.REACT_APP_ADMIN_API+"/add", {
                    method: "POST", 
                    body: JSON.stringify({
                        add: Hasher(this.state.new_candidate).cipher, 
                        about: Hasher(this.state.about_new_candidate).cipher
                    }), 
                    headers: {
                        'Accept': 'application/json', 
                        'Content-Type': 'application/json'
                    }
                }).then(res => {
                    return res.json();
                }).then(resl => {
                    this.props.dispatch(fetch_candidates());
                    this.props.dispatch(fetch_results());
                    alert("ADDED "+this.state.new_candidate+" SUCCESSFULLY");
                });
            } else {
                console.log(this.props.candidates.filter(x => x===this.state.new_candidate));
            }
        } else {
            alert("FILL ALL!");
        }
    }

    handleChange = (txt, type) => {
        if(!type){
            this.setState({new_candidate: txt});
        } else {
            this.setState({about_new_candidate: txt});
        }
    }

    render() { 
        return(
            <div className="dashboard2">
                <div className="add">
                    <img src={add} className="logo" alt="img"/>
                    <input type="text" id="name" className="inp" onChange={evt => this.handleChange(evt.target.value, 0)} placeholder="NEW CANDIDATE"/>
                    <input type="text" id="about" className="inp" onChange={evt => this.handleChange(evt.target.value, 1)} placeholder="ABOUT CANDIDATE"/>
                    <input type="button" className="inp-btn" onClick={() => this.handleAdd()} value="ADD"/>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return state
}

export default connect(mapStateToProps)(Add);