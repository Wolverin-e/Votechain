import React, { Component } from 'react';
import bus from '../imgs/bus.png';
import Hasher from '../HASHER/hasher';
import { connect } from 'react-redux';

class Deploy extends Component {
    state = {
        deployer: "", 
        contract_address: "CURRENT "+process.env.REACT_APP_CONTRACT_ADDRESS
    }

    componentDidMount = () => {
        if(this.props.new_contract_address !== ''){
            this.setState({contract_address: "NEW "+this.props.new_contract_address});
        }
    }

    handleChange = val => {
        this.setState({deployer: val});
    }

    copyToClipboard = txt => {
        var txtField = document.createElement('textarea');
        txtField.innerText = txt;
        document.body.appendChild(txtField);
        txtField.select();
        document.execCommand('copy');
        txtField.remove();
    }

    handleDeploy = () => {
        if(this.state.deployer !== ''){
            if(!this.props.new_contract_deployed){
                fetch(process.env.REACT_APP_ADMIN_API+"/deploy", {
                    method: "POST", 
                    body: JSON.stringify({
                        deployer: Hasher(this.state.deployer).cipher, 
                    }), 
                    headers: {
                        'Accept': 'application/json', 
                        'Content-Type': 'application/json'
                    }
                }).then(res => {
                    return res.json();
                }).then(resl => {
                    alert("NEW CONTRACT DEPLOYED SUCCESSFULLY\n PLEASE CHANGE ADDRESS IN ENV\n");
                    this.setState({contract_address: "NEW "+resl.contract_address});
                    this.props.dispatch({
                        type: "CHANGE_DEPLOYMENT_STATUS", 
                        payload: resl.contract_address
                    })
                    this.copyToClipboard(resl.contract_address);
                });
            } else {
                alert("ALREADY DEPLOYED\n CHECK YOUR CLIPBOARD\n");
                this.copyToClipboard(this.props.new_contract_address);
            }
        } else {
            alert("THIS IS SERIOUS STUFF!")
        }
    }

    doNothing = () => {}

    render() { 
        return (
            <div className="dashboard2">
                <div className="deploy">
                    <img src={bus} className="logo" alt="img"/>
                    <input type="text" id="prev" className="inp" onChange={evt => this.doNothing()} value={this.state.contract_address}/>
                    <input type="text" id="about" className="inp" onChange={evt => this.handleChange(evt.target.value)} placeholder="NEW DEPLOYER"/>
                    <input type="button" className="inp-btn" onClick={() => this.handleDeploy()} value="DEPLOY"/>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return state;
}

export default connect(mapStateToProps)(Deploy);