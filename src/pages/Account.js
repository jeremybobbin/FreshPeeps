import React, {Component} from 'react';
import ReactTable from "react-table";

import Exclusive from '../components/Exclusive';
import User from '../utils/User';

import dao from '../utils/Dao';

import {Inject} from '../components/Context';

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
]

function dateToString(timestamp) {
    console.log('TimeStamp:', timestamp);
    const date = new Date(1000 * timestamp);
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
}


const tableColumns = [
    {
        Header: "Date",
        id: 'created',
        accessor: d => dateToString(d.created)
    },
    {
        Header: "Payment Method",
        accessor: "method",
    },
    {
        Header: "Status",
        accessor: "status",
    },
    {
        Header: "Total",
        id: 'total',
        accessor: d => `$${d.total}`,
    }
];


export default class Account extends Component {
    constructor() {
        super();
        this.state = {
            history: [{
                created: 275892783,
                method: 'Credit Card',
                status: 'Pending',
                total: 1272
            }],
            roles: {}
        };
    }

    componentDidMount() {
        dao.getAccountInfo()
            .then(info => {
                const { billingInfo, roles } = info;
                
                this.setState({ history: billingInfo, roles });
            })
            .catch(err => {
                this.setState({
                    ...this.state,
                });
            });
    }

    isSubscribed() {
        const { roles } = this.state;

        if(!roles) return false;

        for(let role in roles) {
            const bool = roles[role] === "FreshPeeps Subscriber";
            if(bool) return true;
        }

        return false;
    }



    render() {
        const isSubscribed = this.isSubscribed();
        const {history} = this.state;

        console.log('HISTORY:', history);

        return (
            <div className='account'>
                <h1>Your Account</h1>
                <div className='container'>
                    <div className='button-wrapper'>
                        <p>You are currently <strong>{ isSubscribed ? 'subscribed' : 'unsubscribed'}</strong></p>
                        { isSubscribed ? <Cancel /> : <Subscribe />}
                    </div>
                    <h3>Billing History</h3>
                    <div className='table-wrapper'>
                        <ReactTable
                            data={history}
                            columns={tableColumns}
                            defaultPageSize={10}
                            className="-striped -highlight"/>
                    </div>
                </div>
            </div>
        );
    }
}

const Subscribe = ({ redirect }) =>
    <button onClick={() => window.location.href = 'https://www.google.com'} className='subscribe'>
        Subscribe Now
    </button>;


const Cancel = ({ redirect }) =>
    <button onClick={() => window.location.href = 'https://www.google.com'} className='cancel'>
        Cancel Subscription
    </button>;
// data={leads}
// columns={isMobile ? mobile : desktop}
// manual 
// data={leads}
// pages={pages}
// loading={loading}
// onFetchData={this.fetchLeads} 
// defaultPageSize={10}
// className="-striped -highlight"/>