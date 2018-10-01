import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Message from './Message';
import Navbar from './Navbar';


export default class Header extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        }
    }

    render () {
        return (
            <header>
                <Message />
                <Navbar />
            </header>
        );
    }
}

