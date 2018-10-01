import Axios from 'axios';
import Cookies from 'universal-cookie';


const cookies = new Cookies();

export default class Dao {
    constructor(url) {
        this.url = url;
        this.campaigns = [];
    }


    //Custom request method for appending authentication headers.
    request(method = 'get', path = '', data = {}, headers = {}) {
        const url = this.url + path;
        console.log(url);
        if(this.cookiesAreSet()) {
            headers['Session'] = this.getSession();
            headers['X-CSRF-Token'] = this.getToken();
        }

        return Axios({method, url, data, headers})
            .then(response => {
                console.log(`Response from ${method} ${path}`);
                console.log(response, '\n\n');
                if(response.data === "\n") throw "Server is DOWN.";
                return response;
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




    setRemember(bool) {
        cookies.set('remember', bool);
    }

    isRemembering() {
        return Boolean(cookies.get('remember'));
    }

    clearCookies() {
        cookies.remove('session');
        cookies.remove('token');
    }

    getSession() {
        return cookies.get('session');
    }

    getToken() {
        return cookies.get('token');
    }

    cookiesAreSet() {
        return this.getSession() && this.getToken(); 
    }

    setCookies(session, token) {
        this.setSession(session);
        cookies.set('token', token);
    }

    setSession(session) {
        const expireAfterMinute = {
            expires: new Date().getTime() + (1000 * 60)
        }
        if(this.isRemembering()) {
            cookies.set('session', session);
        } else {
            cookies.set('session', session, expireAfterMinute);
        }
    }

    logIn(username, password, isRemembering = null) {
        let requestArgs;
        
        if(isRemembering !== null && typeof isRemembering === 'boolean') {
            this.setRemember(isRemembering);
        }

        if(username && password) {
            requestArgs = ['user/login', {username, password}];
        } else if (this.cookiesAreSet()) {
            requestArgs = ['user/info']; 
        } else {
            return Promise.reject('');
        }
            
        return this.request('post', ...requestArgs)
            .then(response => {
                const {session, token, username, email} = response.data;

                if(session && token) this.setCookies(session, token, isRemembering);

                return {username, email};
            }, err => {
                // Reads error and throws it back onto the promise chain
                let errMessage = 'Something went wrong.';
                try {
                    err.response.status === 401 ?
                        errMessage = 'Incorrect username or password'
                        :
                        errMessage = 'Please try again.';

                    // This will not execute if response is null
                    this.clearCookies();
                } catch(e) {
                    errMessage = 'Our servers are down. Please try again later.';
                }

                throw errMessage;
            });
    }

    // Takes nothing, returns a promise for logout request. Always clears cookies
    logOut() {
        return this.request('post', 'user/logout')
            .finally(() => this.clearCookies());
    }


    // Takes username, email and password, returns UNKNOWN
    register(username, email, password) {
        return this.request('post', 'user/register', { username, email, password })
            .then(response => {

                this.setSession(response.data.session);
                
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