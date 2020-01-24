const attach_tkn = res => {
    return dispatch => {
        var tkn = res.headers.get("new_tkn");
        var rtkn = res.headers.get("new_ref_tkn");
        if(tkn && rtkn){
            return dispatch({
                type: "ATTACH-TKNs", 
                payload: {
                    tkn: tkn, 
                    rtkn: rtkn
                }
            });
        }
    }
}

export default attach_tkn;