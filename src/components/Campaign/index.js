import React from 'react';

import Head from './Head';
import Settings from './Settings';
import Sidebar from './Sidebar';


export default class Campaign extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            isOpen: false,
            isRed: false
        };
    }

    open() {
        const isOpen = !this.state.isOpen;
        this.setState({ isOpen });
    }

    trashClick() {
        const { isRed } = this.state;

        if(isRed) {
            this.props.remove(this.props.id);
        } else {
            this.setState({
                ...this.state,
                isRed: true
            });
            setTimeout(() => this.unRed(), 3000);
        }
    }

    unRed() {
        this.setState({
            ...this.state,
            isRed: false
        });
    }

    render() {
        const {
            id,
            name,
            url,
            isEnabled,
            message,
            effect,
            leadCount,
            location,
            update,
            remove,
            toggle,
            toLeads,    
        } = this.props;

        const { isRed } = this.state;

        return (
            <div className='campaign'>

                <Head
                    update={(k, v) => update(k, v)}
                    name={name}
                    url={url}
                    isOpen={this.state.isOpen}
                />
                
                <Sidebar
                    id={id}
                    trashClick={() => this.trashClick()}
                    toLeads={() => toLeads(id)}
                    toggleSettings={() => this.open()}
                    toggleSwitch={() => toggle('isEnabled')}
                    isOn={isEnabled}
                    isRed={isRed}
                />
                
                <Settings
                    id={id}
                    isVisible={this.state.isOpen}
                    onChange={(k, v) => update(k, v)}
                    location={location}
                    effect={effect}
                    message={message}
                />

            </div>
        );
    }
}

