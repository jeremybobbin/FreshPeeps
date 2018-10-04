import React from 'react';

import {Inject} from './Context';

const Debug = (props) =>
    <div>
        <span 
            onClick={(e) => {
                props.redirect('/dashboard');

            }}
            
            onKeyPress={(e) => {
                console.log(e);
            }}>
            D
        </span>

        <span
            onClick={(e) => {
                props.set(state => {
                    state.campaigns.push({
                        id: 2,
                        name: 'Jer\'s Campaign',
                        url: 'https://www.example.com',
                        isEnabled: true,
                        effect: 'fadeIn',
                        location: 2,
                        leadCount: 2151,
                        message: 'Hello!'
                    });
                });
            }}>
            ebugs
        </span>
        <span 
            onClick={(e) => {
                props.redirect('/dashboard');
            }}
            
            onKeyPress={(e) => {
                console.log(e);
            }}>
            S
        </span>
    </div>;


export default Inject(Debug, 'redirect', 'set', 'getCampaigns');