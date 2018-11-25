import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import { login } from './App_reducer'

class SignIn extends Component {
    state = {};
    initialSelectedBoard = {
        userid: "",
        userpw: ""
    };

    handleChange = (e) => {
        this.setState ({[e.target.name]: e.target.value});
    }
    
    handleSave = () => {
        axios.post('/member', {params: { userid: this.state.userid, userpw: this.state.userpw }}) 
            .then((response) => this.props.dispatch(login({usersq:this.state.userid, token: response.data.token})) )
            .catch(err => console.log(err));
    }
    
    render() {
        return (
            <div>
                Just type in any letters.<br/>
                <input placeholder="ID" name="userid" value={this.state.userid} onChange={this.handleChange} />
                <input placeholder="Password" name="userpw" value={this.state.userpw} onChange={this.handleChange} />
                <button onClick={this.handleSave}>Login</button>
            </div>
        );
    }
}

export default connect() (SignIn);
