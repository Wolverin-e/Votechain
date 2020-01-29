import React, { Component } from 'react';
import Hasher from '../HASHER/hasher';

class Check extends Component {
    state = {
        txHash: '', 
        receipt: false
    }

    handleChange = val => {
        this.setState({txHash: val});
    }

    handleGet = () => {
        fetch(process.env.REACT_APP_ADMIN_API+"/getReceipt", {
            method: "POST", 
            body: JSON.stringify({
                txHash: Hasher(this.state.txHash).cipher
            }), 
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json'
            }
        }).then(res => {
            return res.json();
        }).then(resl => {
            if(resl.status){
                this.setState({receipt: JSON.stringify(resl.receipt, null, "\t")});
                console.log(resl.receipt)
            }
        })
    }

    render() {
        return (
            <div className="dashboard2">
                <div className="receipt">
                <input type="text" id="txHash" className="inp" onChange={evt => this.handleChange(evt.target.value)} placeholder="txHash"/>
                <input type="button" className="inp-btn" onClick={() => this.handleGet()} value="GET RECEIPT"/>
                {this.state.receipt?<div className="rcpttxt">LOGGED IN CONSOLE</div>:true}
                </div>
            </div>
        );
    }
}
 
export default Check;