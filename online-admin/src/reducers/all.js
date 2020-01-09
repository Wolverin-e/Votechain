let default_state = {
    user: {}
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
        default:
            return state
    }
}

export default reducers;