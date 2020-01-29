// import store from '../store/store';

export function fetch_candidates() {
    return function(dispatch) {
        
        return fetch(process.env.REACT_APP_ADMIN_API+"/candidates", {
            method: "GET", 
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json'
            }
        }).then( res => {
            return res.json();
        }).then(resl => {
            return dispatch({
                type: 'ATTACH-CANDIDATES', 
                payload: resl
            })
        }).catch(err => {
            return dispatch({
                type: 'ATTACH-CANDIDATES-ERR'
            })
        })
    }
}