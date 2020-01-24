let default_state = {
    user: false, 
    has_voted: false, 
    candidates: [], 
    about_candidates: [], 
    results: [], 
    registered_for: false
}

const reducers = (state = default_state, action) => {
    switch(action.type){
        case "ATTACH-USER":
            return {
                ...state, 
                user: action.payload, 
                has_voted: action.payload.vhash.length?true:false
            }
        case "ATTACH-FETCHED-ALL":
            return {
                ...state, 
                candidates: action.payload.map(x => x[0]), 
                about_candidates: action.payload.map(x => x[1]), 
                results: action.payload.map(x => x[2])
            }
        case "FETCH-ALL-ERR":
            return{
                ...state, 
                candidates: []
            }
        case "SET-VOTED":
            return {
                ...state, 
                has_voted: true
            }
        case "ATTACH-RESULTS":
            return {
                ...state, 
                results: action.payload
            }
        case "ATTACH-TKNs":
            var new_state = state;
            new_state.user.tkn = action.payload.tkn;
            new_state.user.rtkn = action.payload.rtkn;
            return new_state;
        case "ATTACH-REGISTERED-USER":
            return{
                ...state, 
                registered_for: action.payload
            }
        case "HANDLE-LOGOUT":
            return {
                ...default_state
            }
        default:
            return state;
    }
}

export default reducers;