import { createAction, handleActions } from 'redux-actions';
import axios from 'axios';

// action type
const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';

const BOARD_SAVE = 'SAVE';
const BOARD_REMOVE = 'REMOVE';
const BOARD_READ = 'READ';
const BOARD_LIST = 'LIST'; 

export const login = createAction(LOGIN);
export const logout = createAction(LOGOUT);

export const board_save = createAction(BOARD_SAVE);
export const board_remove = createAction(BOARD_REMOVE, brdno => brdno);
export const board_read = createAction(BOARD_READ);
export const board_list = createAction(BOARD_LIST);

const getAuthOption = (dispatch, token) =>{
    return {
        validateStatus: function (status) {
            if (status === 403) {
                dispatch(logout());
                return true;
            }
            if (status === 200) return true;
            return false;
        }, 
        headers: {
            authorization: token
        } 
    }
}

export const express_board_list = () =>{
    return (dispatch, getState) => {
        axios.get('/boards', getAuthOption(dispatch, getState().token)) 
            .then(response => dispatch(board_list(response.data)))
            .catch(err => console.log(err));
    }
}

export const express_board_remove = ( brdno = {}) => {
    return (dispatch, getState) => {
        axios.delete('/boards', {params: { brdno: brdno }, ...getAuthOption(dispatch, getState().token)}) 
            .then(() => dispatch(board_remove(brdno)))
            .catch(err => console.log(err));
    }
};

export const express_board_save = ( data = {}) => {
    return (dispatch, getState) => {
        data.authorization = getState().token;
        
        axios.post('/boards', {params: data, ...getAuthOption(dispatch) }) 
            .then(response => dispatch(board_save(response.data)))
            .catch(err => console.log(err));
    }
};

const initialState = {
    usersq: null,
    token: null,
    boards: [], 
    selectedBoard: {}
};

export default handleActions({
    [LOGIN]: (state, { payload: data }) => {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('usersq', data.usersq);
        return {...initialState, usersq: data.usersq, token: data.token};
    },
    [LOGOUT]: () => {
        sessionStorage.clear();
        return initialState;
    },
    [BOARD_LIST]: (state, { payload: data }) => {
        return {...state, boards: data, selectedBoard: {} };
    },
    [BOARD_SAVE]: (state, { payload: data }) => {
        let boards = state.boards;
        let inx = boards.findIndex(row => row.brdno === data.brdno);
        if (inx===-1) {                                                    // new : Insert
            let newboards = [{date: new Date(), ...data }]
            return {...state, boards: newboards.concat(boards), selectedBoard: {} };
        } else {                                                           // Update
            return {...state, boards: boards.map(row => data.brdno === row.brdno ? {...data }: row), selectedBoard: {} };
        }    
    },
    [BOARD_REMOVE]: (state, { payload: brdno }) => {
        let boards = state.boards;
        return {...state, boards: boards.filter(row => row.brdno !== brdno), selectedBoard: {} };
    },
    [BOARD_READ]: (state, { payload: brdno }) => {
        let boards = state.boards;
        return {
            ...state, 
            boards: boards,
            selectedBoard: boards.find(row => row.brdno === brdno)
        };
    }
}, initialState);
