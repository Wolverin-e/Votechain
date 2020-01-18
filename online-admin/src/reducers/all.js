let default_state = {
    user: {}, 
    new_contract_deployed: false, 
    new_contract_address: ""
}

const reducers = (state = default_state, action) => {
    switch(action.type){
        case 'LOGIN-SUCCESSFUL':
            return{
                ...state, 
                user: action.payload
            }
        case 'ATTACH-CANDIDATES-ERR':
            if(state.votes){
                return {
                    ...state, 
                    candidates: state.map(x => "LOADING")
                }
            } else {
                return state;
            }
        case 'ATTACH-CANDIDATES':
            return {
                ...state, 
                candidates: action.payload
            }
        case 'ATTACH-RESULTS-ERR':
            if(state.candidates){
                return {
                    ...state, 
                    votes: state.candidates.map(x => "LOADING")
                }
            } else {
                return state;
            }
        case 'ATTACH-RESULTS':
            return {
                ...state, 
                votes: action.payload
            }
        case 'CHANGE_DEPLOYMENT_STATUS':
            return {
                ...state, 
                new_contract_deployed: true, 
                new_contract_address: action.payload
            }
        default:
            return state
    }
}

export default reducers;