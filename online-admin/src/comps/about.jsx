import React, { Component } from "react";
// import { connect } from 'react-redux';

export default class about extends Component{
    render()
    {
        // console.log(this.props);
        console.log(process.env);
        return(
            <div>
                {/* <div>{this.props.prop1} {this.props.prop2}</div> */}
                {/* <div> ABOUT! </div> */}
            </div>
        )
    }
}

// const mapStateToProps = (state) => {
//     return{
//         ...state
//     }
// }

// export default connect(mapStateToProps)(about);