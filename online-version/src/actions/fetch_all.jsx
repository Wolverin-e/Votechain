
const fetch_all = (tkn, rtkn, _timedelay = 50) => {
    return dispatch => {
        return fetch(process.env.REACT_APP_DB_API+'/all', {
            method: "GET", 
            headers: {
                'api_key': process.env.REACT_APP_DB_API_ACCESS_KEY, 
                'api_auth_key': tkn, 
                'api_auth_refresh_key': rtkn
            }
        }).then(res => res.json())
        .then(resl => {
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
            return setTimeout(() => dispatch(fetch_all(tkn, rtkn, _timedelay*2)), _timedelay);
        })
    }
}

export default fetch_all;