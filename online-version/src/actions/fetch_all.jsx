
const fetch_all = (_timedelay = 50) => {
    return dispatch => {
        return fetch(process.env.REACT_APP_DB_API+'/all')
        .then(res => res.json())
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
            return setTimeout(() => dispatch(fetch_all(_timedelay*2)), _timedelay);
        })
    }
}

export default fetch_all;