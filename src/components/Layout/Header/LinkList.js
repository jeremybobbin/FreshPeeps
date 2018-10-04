import React from 'react';
import {NavLink} from 'react-router-dom';

import {Inject} from '../../Context';

const LinkList = ({isLoggedIn}) =>
    isLoggedIn ?
        <React.Fragment>
            <li><NavLink exact to="/dashboard">Dashboard</NavLink></li>
            <li><NavLink exact to="/leads">Leads</NavLink></li>
            <li><NavLink exact to="/account">Account</NavLink></li>
            <li><NavLink exact to="/logout">Log Out</NavLink></li>
        </React.Fragment>
        :
        <React.Fragment>
            <li><NavLink exact to="/login">Log in</NavLink></li>
            <li><NavLink exact to="/register">Register</NavLink></li>
        </React.Fragment>;

export default Inject(LinkList, 'isLoggedIn');

