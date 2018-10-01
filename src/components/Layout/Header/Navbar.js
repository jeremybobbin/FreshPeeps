import React, {Component} from 'react';
import Transition from 'react-transition-group/Transition';
import {NavLink} from 'react-router-dom';


import Username from './Username';
import LinkList from './LinkList';

export default class Navbar extends Component {
    constructor() {
        super();
        this.timeout = 0;
        this.state = {
            isOpen: false
        }
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
    
    render() {
        return (
                <nav className='navbar'>
                        <Hamburger 
                            visibility={this.state.isOpen}
                            toggle={() => this.toggle()}
                            layers={4}
                        />
                        <li className="title"><NavLink exact to="/">FreshPeeps</NavLink></li>
                    <Transition timeout={this.timeout} in={this.state.isOpen}>
                        {(state) => <LinkContainer className={state} />}
                    </Transition>
                </nav>
        );
    }
}

const linkContainerStyles = {
    entered: {
        maxHeight: '150px',
    },
};

const LinkContainer = ({className}) =>
        <ul className='link-list' style={{...linkContainerStyles[className]}} >
            <LinkList />
        </ul>;

const Hamburger = ({layers, visibility, toggle}) => {
    const layerz = [];
    for(let i = 0; i < layers; i++) {
        layerz.push(<div key={i} className={`bar-${i}`}></div>)
    }
    return (
        <div
            className={`hamburger  ${visibility ? 'showing' : 'hiding'}`}
            onClick={() => toggle()}>
            {layerz}
        </div>
    );
}
