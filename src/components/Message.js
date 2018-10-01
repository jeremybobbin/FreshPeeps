import React from 'react';
import {Inject} from './Context';

const Message = ({message, clearMessage}) => message ?
    <p
        onClick={() => clearMessage()}
        className='message'
    >{message}</p>
    :
    null;

export default Inject(Message, 'message', 'clearMessage');