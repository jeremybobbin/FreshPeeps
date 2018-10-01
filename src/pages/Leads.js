import React from 'react';

import dao from '../utils/Dao';
import LeadList from '../components/LeadList';

import ReactTable from "react-table";
import "react-table/react-table.css";

import { isMobile } from "react-device-detect";

const desktop = [
    {
        Header: "First Name",
        accessor: "first"
    },
    {
        Header: "Last Name",
        accessor: "last"
    },
    {
        Header: "Email",
        accessor: "email",
        width: 200
    },
    {
        Header: "IP Address",
        accessor: "ip"
    },
    {
        Header: "City",
        accessor: "city"
    },
    {
        Header: "Region",
        accessor: "region"
    },
    {
        Header: "Country",
        accessor: "country"
    },
    {
        Header: "Time",
        accessor: "time"
    }
];

const mobile = [
    {
        Header: "First",
        accessor: "first",
        width: 85
    },
    {
        Header: "Last",
        accessor: "last",
        width: 85
    },
    {
        Header: "Email",
        accessor: "email",
        width: 150
    },
    {
        Header: "Time",
        accessor: "time",
        width: 85
    }
];

export default class Leads extends React.Component {
    constructor() {
        super();
        this.state = {
            leads: [],
            pages: null,
            loading: true
        };
        this.fetchLeads = this.fetchLeads.bind(this);
    }

    fetchLeads(state, instance) {
        this.setState({ loading: true });
        
        dao.getLeads(
            state.pageSize,
            state.page,
            state.sorted
        ).then(({leads, pages}) => {

            this.setState({
                pages,
                leads,
                loading: false
            });
            
        });
    }

    render() {
        const { leads, pages, loading } = this.state;
        return (
            <div className='leads'>
                <h1>Your Leads</h1>
                <div className='table-wrapper'>
                    <ReactTable
                        data={leads}
                        columns={isMobile ? mobile : desktop}
                        manual 
                        data={leads}
                        pages={pages}
                        loading={loading}
                        onFetchData={this.fetchLeads} 
                        defaultPageSize={10}
                        className="-striped -highlight"/>
                </div>
            </div>
        )
    }
}

{/* <div className='lead-page' onScroll={(e) => this.handleScroll(e)}>
<LeadList leads={this.state.leads} />
</div> */}


// const leads = [{
//     first: 'Jer',
//     last: 'Top',
//     ip: '6',
//     email: 'jerbob@gmail.cock',
//     city: 'Orlgnado',
//     region: 'Canda',
//     country: 'Candiadia', 
//     time: '6'
// }]