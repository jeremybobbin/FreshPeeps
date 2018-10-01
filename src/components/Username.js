import React from 'react';
import {Inject} from './Context';

const Username = ({username, redirect}) => username ?
    <p 
        onClick={() => redirect('/logout')}
        className='username'
    >{username}</p>:
    <React.Fragment/>;

export default Inject(Username, 'username', 'redirect');