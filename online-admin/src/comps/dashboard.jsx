import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Add from './add';
import Details from './details';
import { fetch_candidates } from '../actions/fetch_candidates';
import { fetch_results } from '../actions/fetch_results';

class dashboard extends Component{

    state = {
        add: true,
        details: false, 
        logout: false
    }

    componentDidMount() {
        this.props.dispatch(fetch_candidates());
        this.props.dispatch(fetch_results());
    }
    
    changeTile = async (evt) => {
		this.setState({add:false});
		await Object.assign([], Object.keys(this.state).map((x) => {
			return evt.target.id===x?{[x]:true}:{[x]:false}
        })).forEach( stateVar => {this.setState(stateVar);})
        
		for (let tab of Object.keys(this.state)) {
			let elem = document.getElementById(tab);
			elem.className = this.state[tab]?"sub-link sub-link-active":"sub-link";
		}
    };
    
    handleLogout = () => {
        this.setState({logout: true});
    }

    render(){
        if(this.state.logout){
            return <Redirect to="/"/>
        }
        return(
            <div>
                <div className="dashboard1">
                    <div className="title">
                        MENU
                    </div>
                    <input type="button" id="add" onClick={(evt) => this.changeTile(evt)} value="ADD" className="sub-link sub-link-active"/>
                    <input type="button" id="details" onClick={(evt) => this.changeTile(evt)} value="DETAILS" className="sub-link"/>
                    <input type="button" id="logout" onClick={() => this.handleLogout()} value="LOGOUT" className="sub-link"/>
                </div>
                { this.state.add?<Add />:true }
                { this.state.details?<Details />:true}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return state;
}

export default connect(mapStateToProps)(dashboard);