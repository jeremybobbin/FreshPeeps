import React from 'react';

import CardAdder from '../components/CardAdder';
import CampaignList from '../components/CampaignList';


export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            url: '',
            protocol: 'https://'
        };
    }

    toggleProtocol() {
        const protocol = this.state.protocol === 'https://' ?
            'http://'
            :
            'https://';
        
        this.setState({
            ...this.state,
            protocol
        });
    }

    update(k, v) {
        const state = this.state;
        state[k] = v;

        this.setState(state);
    }

    render() {
        return (
            <div className='dashboard'>
                <div className='campaign-container'>
                    <h1>Dashboard</h1>
                    <CampaignList/>
                    <CardAdder 
                    {...this.state}
                    update={(k,v) => this.update(k,v)}
                    toggle={() => this.toggleProtocol()}
                />
                </div>
            </div>
        ); 
    }
}


//Campaign List props: 
// toggle={(id, prop) => this.toggle(id, prop)}
// campaigns={this.state.campaigns}
// remove={id => this.removeCampaign(id)}
// update={(id, k, v) => this.update(id, k, v)}
// toLeads={(id) => this.toLeads(id)}