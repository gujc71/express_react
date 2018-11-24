import { createAction, handleActions } from 'redux-actions';
import axios from 'axios';

// action type
const BOARD_SAVE = 'SAVE';
const BOARD_REMOVE = 'REMOVE';
const BOARD_READ = 'READ';
const BOARD_LIST = 'LIST'; 

export const board_save = createAction(BOARD_SAVE);
export const board_remove = createAction(BOARD_REMOVE, brdno => brdno);
export const board_read = createAction(BOARD_READ);
export const board_list = createAction(BOARD_LIST);

export const express_board_list = () =>{
    return (dispatch) => {
        fetch('/boards')
            .then(response => response.json())
            .then(data => dispatch(board_list(data)));
    }
}

export const express_board_remove = ( brdno = {}) => {
    return (dispatch) => {
        axios.delete('/boards', {params: { brdno: brdno }}) 
            .then(() => dispatch(board_remove(brdno)))
            .catch(err => console.log(err));
    }
};

export const express_board_save = ( data = {}) => {
    return (dispatch) => {
        console.log(data);
        axios.post('/boards', {params: data }) 
            .then(response => dispatch(board_save(response.data)))
            .catch(err => console.log(err));
    }
};

const initialState = {
    boards: [], 
    selectedBoard: {}
};

export default handleActions({
    [BOARD_LIST]: (state, { payload: data }) => {
        return {boards: data, selectedBoard: {} };
    },
    [BOARD_SAVE]: (state, { payload: data }) => {
        let boards = state.boards;
        let inx = boards.findIndex(row => row.brdno === data.brdno);
        if (inx===-1) {                                                    // new : Insert
            let newboards = [{date: new Date(), ...data }]
            return {boards: newboards.concat(boards), selectedBoard: {} };
        } else {                                                           // Update
            return {boards: boards.map(row => data.brdno === row.brdno ? {...data }: row), selectedBoard: {} };
        }    
    },
    [BOARD_REMOVE]: (state, { payload: brdno }) => {
        let boards = state.boards;
        return {boards: boards.filter(row => row.brdno !== brdno), selectedBoard: {} };
    },
    [BOARD_READ]: (state, { payload: brdno }) => {
        let boards = state.boards;
        return {
            boards: boards,
            selectedBoard: boards.find(row => row.brdno === brdno)
        };
    }
}, initialState);
