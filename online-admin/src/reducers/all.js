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
        case 'ATTACH-CANDIDATES':
            return{
                ...state, 
                candidates: action.payload
            }
        default:
            return state
    }
}

export default reducers;