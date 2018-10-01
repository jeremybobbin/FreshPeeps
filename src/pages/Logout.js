import React from 'react';
import {Inject} from '../components/Context';

const LogOut = ({logOut}) => logOut();

export default Inject(LogOut, 'logOut');