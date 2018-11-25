import React, { Component } from 'react';
import { connect } from 'react-redux';

import BoardForm from './App_BoardForm';
import BoardList from './App_BoardList';
import SignIn from './SignIn';
import { login, logout } from './App_reducer'

class App extends Component {
    
    componentDidMount () {
        var token = sessionStorage.getItem('token');
        if (token) {
            this.props.dispatch(login({token: token, usersq: sessionStorage.getItem('usersq')}));
        }
    }
    render() {
        const { usersq } = this.props;
        return (
            <div>
                <h3>Express + React(Redux) Board II</h3>
                {usersq !== null 
                  ? <>
                        <BoardForm/>
                        <BoardList/>
                        <span onClick={() => this.props.dispatch(logout()) }>Logout</span>                        
                    </>
                  : <SignIn/>  
                }
            </div>
        );
    }
}

//export default App;

let mapStateToProps = (state) => {
    return {
        usersq: state.usersq
    };
}

export default connect(mapStateToProps) (App);