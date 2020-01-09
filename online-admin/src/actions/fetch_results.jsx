
export function fetch_results() {

    return function(dispatch) {
        return fetch(process.env.REACT_APP_ADMIN_API+"/result", {
            method: "GET", 
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json'
            }
        }).then( res => {
            return res.json()
        }).then( resl => {
            console.log(resl);
            
            return dispatch({
                type: "ATTACH-RESULTS", 
                payload: resl
            })
        })
    }
}