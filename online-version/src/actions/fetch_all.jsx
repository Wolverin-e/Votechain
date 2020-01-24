import store from '../store/store';
import attach_tkn from "./attach_tkn";

const fetch_all = (_timedelay = 50) => {
    return dispatch => {
        return fetch(process.env.REACT_APP_DB_API+'/all', {
            method: "GET", 
            headers: {
                'api_key': process.env.REACT_APP_DB_API_ACCESS_KEY, 
                'api_auth_key': store.getState().user.tkn, 
                'api_auth_refresh_key': store.getState().user.rtkn
            }
        }).then(res => {
            dispatch(attach_tkn);
            return res.json();
        }).then(resl => {
            if(resl.length){
                dispatch({
                    type: "ATTACH-FETCHED-ALL", 
                    payload: resl
                })
            } else {
                throw new Error("FETCHED []");
            }
        }).catch( err => {
            console.log("RECALLING FETCH-ALL AFTER "+_timedelay+"ms");
            return setTimeout(() => dispatch(fetch_all(_timedelay*2)), _timedelay);
        })
    }
}

export default fetch_all;