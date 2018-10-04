import Axios from 'axios';
import Session from '../Session';
import Server from '../Server';


export default class Dao {
    constructor(url) {
        this.url = url;
        this.campaigns = [];
    }


    //Custom request method for appending authentication headers.
    request(method = 'get', path = '', data = {}, headers = {}) {
        const url = this.url + path;

        if(Session.isSet) {
            headers['Session'] = Session.session;
            headers['X-CSRF-Token'] = Session.token;
        }

        return Axios({method, url, data, headers})
            .then(response => {

                if(response.data === "\n") throw "Server is DOWN.";
                return response;
            })
            .catch(err => {
                Server.log(err);
                throw err;
            });
    }

    getLeads(pageSize, page, sortParams, campaignId) {
        let queryArray = [
            'pageSize=' + pageSize,
            'page=' + page
        ];

        if(sortParams.length) {
            sortParams.forEach(({id, desc}) => 
                queryArray.push(`${id}=${desc ? 'desc' : 'asc'}`)
            );
        }

        if(campaignId) {
            queryArray.push('id=' + campaignId);
        }


        const queryString = 'leads?' + queryArray.join('&');

        return this.request('get', queryString)
            .then(res => {
                const { leads, pages } = res.data;

                if(!(leads && pages)) throw 'No response data.';
                return { leads, pages }; 
            });
    }


    // Returns array of campaigns
    getCampaigns() {
        return this.request('get', 'campaigns')
            .then(({data}) => data.campaigns);
    }


    // It is put it <3
    put(campaign) {
        const { id } = campaign;

        return this.request('put', `campaigns/${id}`, campaign)
            .then(({data}) => data.id)
            .catch(err => {
                let errMessage;
                try {
                    errMessage = err.response.status === 401 ?
                    'You are not authorized to be on this page.'
                    :
                    'Our servers have encountered an error.';
                } catch(e) {
                    errMessage = 'Our servers are down. Please try again later.';
                }
                throw errMessage;
            });
    }


    // Takes name, url, returns new campaignID.
    post(name, url) {
        return this.request('post', 'campaigns', {name, url})
            .then(({data}) => data.id);
    }

    delete(id) {

        return this.request('delete', `campaigns/${id}`);
    }

    logIn(username, password, isRemembering = null) {
        let requestArgs;
        
        Session.isRemembering = isRemembering;

        if(username && password) {
            requestArgs = ['user/login', {username, password}];
        } else if (Session.isSet) {
            requestArgs = ['user/info']; 
        } else {
            return Promise.reject('');
        }
            
        return this.request('post', ...requestArgs)
            .then(response => {
                const {session, token, username, email, roles} = response.data;
                
                Session.set(session, token);

                return {username, email, roles};
                
            }, err => {
                console.log("Evil Error:", err);
                // Reads error and throws it back onto the promise chain
                let errMessage = 'Something went wrong.';
                try {
                    err.response.status === 401 ?
                        errMessage = 'Incorrect username or password'
                        :
                        errMessage = 'Please try again.';

                    // This will not execute if response is null
                    Session.clear();
                } catch(e) {
                    errMessage = 'Our servers are down. Please try again later.';
                }

                throw errMessage;
            });
    }

    // Takes nothing, returns a promise for logout request. Always clears cookies
    logOut() {
        return this.request('post', 'user/logout')
            .finally(() => Session.clear());
    }


    // Takes username, email and password, returns UNKNOWN
    register(username, email, password) {
        return this.request('post', 'user/register', { username, email, password })
            .then(response => {

                Session.session = response.data.session;
                
                return response;
            })
            .catch(err => {
                throw err.response.data;
            });
    }

    getAccountInfo() {
        return this.request('get', 'user/account')
            .then(response => {
                return response.data;
            });
    }

}