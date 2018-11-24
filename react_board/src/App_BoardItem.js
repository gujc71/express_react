import React from 'react';
import { connect } from 'react-redux';
import dateFormat from 'dateformat';

import { board_read, express_board_remove } from './App_reducer'

const BoardItem = ({row, inx, board_read, express_board_remove}) => (
    <tr>
        <td>{inx}</td>
        <td><span onClick={() => { board_read(row.brdno) } }>{row.brdtitle}</span></td>
        <td>{row.brdwriter}</td>
        <td>{dateFormat(row.brddate, "yyyy-mm-dd")}</td>
        <td><span onClick={() => { express_board_remove(row.brdno) }}>X</span></td>
    </tr>
);


const mapDispatchToProps = dispatch => ({
  board_read: brdno => dispatch(board_read(brdno)),
  express_board_remove: brdno => dispatch(express_board_remove(brdno))
})

export default connect(null, mapDispatchToProps)(BoardItem)
