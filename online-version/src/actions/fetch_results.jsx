import store from "../store/store";
import attach_tkn from "./attach_tkn";

export function fetch_results() {

    return function(dispatch) {
        return fetch(process.env.REACT_APP_DB_API+"/result", {
            method: "GET", 
            headers: {
                'api_key': process.env.REACT_APP_DB_API_ACCESS_KEY, 
                'api_auth_key': store.getState().user.tkn, 
                'api_auth_refresh_key': store.getState().user.rtkn
            }
        }).then( res => {
            dispatch(attach_tkn(res));
            return res.json()
        }).then( resl => {
            // console.log(resl);
            return dispatch({
                type: "ATTACH-RESULTS", 
                payload: resl
            })
        })
    }
}