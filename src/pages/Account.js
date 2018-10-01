import React, {Component} from 'react';
import Exclusive from '../components/Exclusive';
import User from '../utils/User';
import dao from '../utils/Dao';

import {Inject} from '../components/Context';


// const Account = ({redirect}) =>
//     <Exclusive
//         predicate={User.isSubscribed()}
//         WhileWait={Wait}
//         OnFailure={(props) => <Failure redirect={redirect} />}
//         OnSuccess={Success}
//     />;

// export default Inject(Account, 'redirect');

// const Wait = props => <p>STILL WAITING</p>;
// const Success = props => <p>YOU ARE SUBSCRIBED</p>;

// const Failure = ({redirect}) => {
//     return (
//     <p>NOT SUBSCRIBED. CLICK <span style={{color: 'blue'}}
//             onClick={() => window.location.assign('https://www.google.com')}
//         >HERE</span> TO SUBSCRIBE</p>
//     );
// };

export default class Account extends Component {
    constructor() {
        super();
        this.state = {
            history: [],
            roles: {}
        };
    }

    componentDidMount() {
        console.log('Inside of componentDidMount of Account.js');
        dao.getAccountInfo()
            .then(info => {
                console.log('getAccountInfo did not throw');
                console.log(info);
                const { history, roles } = info;
                
                this.setState({ history, roles });
            })
            .catch(err => {
                console.log('getAccountInfo did throw: ');
                console.log(err);
                this.setState({
                    ...this.state,
                });
            });
    }

    getLatestCycle() {
        const { history } = this.state;
        if( history && history.length ) return history[0];
    }

    isSubscribed() {
        const { roles } = this.state;

        if(!roles) return false;

        for(let role in roles) {
            const bool = roles[role] === "FreshPeeps Subscriber";
            console.log('Testing: ', role);
            console.log('Role: ', role, ' is ', bool);
            if(bool) return true;
        }

        return false;
    }

    nextCycle() {
        const { next } = this.getLatestCycle();
        return next;
    }


    render() {
        const isSubscribed = this.isSubscribed();
        const latest = this.getLatestCycle();

        return (
            <div className='account'>
                <h1>Your Account</h1>
                <div className='container'>
                    <h3>Account Status: { isSubscribed ? 'Subscribed' : 'NOT Subscribed'}</h3>
                    <button>{ isSubscribed ? 'Cancel' : 'Subscribe'}</button>
                    <h3>Next billing cycle: { latest } </h3>
                    <h3>Billing History</h3>
                    <p>{this.state.history}</p>
                </div>
            </div>
        );
    }


}