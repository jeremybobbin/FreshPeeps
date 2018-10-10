import React from 'react';
import { Redirect } from 'react-router-dom'; 
import { Promise } from 'es6-promise';

import dao from '../utils/Dao';


const Context = React.createContext();


// Cooldown time on this.update() in milliseconds.
const cooldown = 1000;


export const {Consumer} = Context;

export const Inject = (Component, ...propsToInject) => {
    return (props) => 
        <Consumer>
            {(context) => {

                const filteredContext = {};

                propsToInject.forEach(prop => {
                    filteredContext[prop] = context[prop];
                });

                return <Component {...props} {...filteredContext} />
            }}
        </Consumer>;
}   


export class Provider extends React.Component {

    constructor(props) {
        super(props);

        

        // Determines whether campaigns can be updated.
        this.isOnCooldown = false;

        this.timeoutIsSet = false;


        this.messageTimeout;

        // Array of campaign id's which haven't been updated with the API.
        this.idsOfAlteredCampaigns = [];

        this.redirectPath = '';
        this.state = {
            campaigns: [],
            isLoggedIn: false,
            username: '',
            email: '',
            message: '',
            messageIsShowing: false,
            sessionEnabled: false,
            isSubscribed: false,
            
        };
    }

    // On mount, redirect to https if not in dev.
    componentWillMount() {
        this.logIn();

        const hostname = window.location.hostname;

        const isLocalHost = (
            hostname === 'localhost' ||
            hostname === '[::1]' ||
            hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
        );

        const isHttp = (
            typeof window !== 'undefined' &&
            window.location &&
            window.location.protocol === 'http:'
        );


        if(!isLocalHost && isHttp)
            window.location.href = window.location.href.replace(/^http(?!s)/, 'https');
    }

    
    // < STATE modifications >
    
    // Gets state reference and passes it to the callback.
    set(callback) {
        const stateRef = {...this.state};
        
        callback(stateRef);

        return new Promise(resolve =>
            this.setState(stateRef, () => resolve())
        );
    }

    reset(message = '', redirectPath = '/login') {
        return this.set(state => {
            state.campaigns = [];
            state.username = '';
            state.email = '';
            state.isLoggedIn = false;
            state.isSubscribed = false;
            this.redirect(redirectPath, false);
            return this.setMessage(message);
        });
    }

    setMessage(message) {
        if(message === this.state.message) return;
        return this.hideMessage()
            .then(() => this.set(state =>{
                state.message = message;
                state.messageIsShowing = true;
            }))
            .then(() => {
                clearTimeout(this.messageTimeout);
                this.messageTimeout = setTimeout(() => this.clearMessage(), 5000)
            });
    }


    // Times out until hidden message animation is done, then resolves
    hideMessage() {
        return new Promise(resolve => {
            if(!this.state.messageIsShowing) resolve();
            else this.set(state => state.messageIsShowing = false)
                .then(() => 
                    setTimeout(() => resolve(), 400)
                );
        })
    }

    clearMessage() {
        return this.hideMessage()
            .then(() => this.set(state =>
                state.message = ''    
            ));
    }

    // < CAMPAIGN STATE >

    getCampaigns() {
        return dao.getCampaigns()
            .then((freshCampaigns) => {
                this.set(state => {
                    state.campaigns = freshCampaigns;
                });
            })
            .catch((err) => {
                console.log('Campaigns Error:', err);
                const code = err.response.status;
                if(code == 402) {
                    this.redirect('/account', false);
                    this.setMessage('You must be subscribed.')
                } else {
                    this.logOut();
                }
            });
    }

    toggle(campaignId, prop) {
        this.alterCampaign(campaignId);

        this.set(state => {
            const campaign = this.getCampaignById(campaignId, state);
            campaign[prop] = !campaign[prop];
        });
    }

    update(campaignId, k, v) {
        this.alterCampaign(campaignId);

        this.set(state => {
            const campaign = this.getCampaignById(campaignId, state)
            campaign[k] = v;
        });

    }

    post(name, url) {
        return dao.post(name, url)
            .then(id => this.set(({campaigns}) => campaigns.push({id, name, url})));
    }

        // Takes an array or an int
    remove(idsForDeletion) {
        if(!Array.isArray(idsForDeletion)) idsForDeletion = [idsForDeletion];

        dao.delete(idsForDeletion)
            .then(() => this.set(state => 
                
                state.campaigns = state.campaigns
                    .filter(({ id }) => !idsForDeletion.includes(id))
                ))

            .catch(() => {
                
                this.logOut();
                this.setMessage('An error has occured.');

            });
    }

    // </ CAMPAIGN STATE >



    // < CAMPAIGN UTILITIES > 


    // Can take a reference of state, and can return a reference to the campaign with that ID
    getCampaignById(id, state = this.state) {
        return state.campaigns
            .find(campaign => campaign.id === id);
    }

    getAlteredCampaigns() {
        const campaigns = [];

        while(this.idsOfAlteredCampaigns.length > 0) {

            const id = this.idsOfAlteredCampaigns.shift();
            const campaign = this.getCampaignById(id);

            campaigns.push(campaign);
        }

        return campaigns;
    }

    alterCampaign(id) {
        if(!this.idsOfAlteredCampaigns.includes(id))
            this.idsOfAlteredCampaigns.push(id);
        
        this.push();
    }


    validateCampaign(name, url) {
        return new Promise((resolve, reject) => {

        });
    }

    // Asyncronously update Sparrow API with altered campaigns
    push() {
        if(this.timeoutIsSet) return;

        this.timeoutIsSet = true;

        setTimeout(function() {
            
            this.timeoutIsSet = false;
            
            const campaigns = this.getAlteredCampaigns();
            Promise.all(campaigns.map(campaign => 
                dao.put(campaign))
            ).catch(message => {
                console.log(message);
            });
        }.bind(this), cooldown);
    }

    // </ CAMPAIGN UTILITIES >




    logIn(usernameAttempt, password, message) {
        return dao.logIn(usernameAttempt, password, this.state.sessionEnabled)
            .then(userInfo => this.set(state => {
                    const { roles } = userInfo;

                    
                    if(roles && roles["4"]) {
                        state.isSubscribed = true;
                        console.log('Is subscribed:', roles);
                    } else {
                        console.log('NOT Subscribed:', roles);
                        console.log(userInfo)
                    }
                    state.username = userInfo.username;
                    state.email = userInfo.email;
                    state.isLoggedIn = true;

                    
                    this.redirect('/dashboard', false);

                    this.setMessage('You have been logged in successfully.');
                    
                    if(this.state.campaigns.length == 0)
                        return this.getCampaigns();
                    
                }))
            .catch(errMessage =>
                this.reset(errMessage)
            );
    }

    logOut(message, path) {
        this.reset(message, path);
        dao.logOut()
            .catch();
        // Needs to return NULL for React to render;
        return null;
    }

    register(username, email, password) {
        return dao.register(username, email, password)
            .then(() => 
                this.logIn(username, password, 'You have been registered successfully.')
            )
            .catch(errMsg => {
                let message;
                if(!errMsg || typeof errMsg !== 'string') errMsg = '';
                

                const fir = ' field is required.',
                    ia = ' is already ',
                    emailInvalid = errMsg.includes(ia + 'registered'),
                    emailMissing = errMsg.includes('address' + fir),
                    nameInvalid = errMsg.includes(ia + 'taken.'),
                    nameMissing = errMsg.includes('Username' + fir),
                    passMissing = errMsg.includes('Password' + fir);
                
                //if all fields are missing
                if(emailMissing || nameMissing || passMissing)
                    message = 'All fields are required.';
                
                if (emailInvalid && nameInvalid)
                    message = `The username '${username}' and the email '${email}' are already in use.`;
                else if (emailInvalid)
                    message = `The email '${email}' is already in use.`;
                else if (nameInvalid)
                    message = `The username '${username}' is already in use.`


                this.reset(message || 'Some sort of error has occured', '/register');
            });
    }

    isSubscribed() {
        return this.state.isSubscribed;
    }

    toggleSession() {
        this.set(state => {
            state.sessionEnabled = !state.sessionEnabled;
        });
    }

    resendVerification() {
        // Called when 'Resend verification email' is pressed
        console.log('Resending verifications...');
    }

    
    redirect(url, forceUpdate = true) {
        this.redirectPath = url;
        if(forceUpdate) this.forceUpdate();
    }


    renderRedirect() {
        const path = this.redirectPath; 

        if(path === '') return;
        this.redirectPath = '';

        return <Redirect to={path} />;
    }


    render() {
        return (
            <Context.Provider value={{

                // Makes state accessable from the context object
                ...this.state,

                post: (name, url) => this.post(name, url),
                update: (campaignId, k, v) => this.update(campaignId, k, v),
                toggle: (campaignId, prop) => this.toggle(campaignId, prop),
                remove: (campaignId) => this.remove(campaignId),

                logIn: (user, pass) => this.logIn(user, pass),
                logOut: () => this.logOut(),
                register: (user, email, pass) => this.register(user, email, pass),
                toggleSession: () => this.toggleSession(),
                resendVerification: () => this.resendVerification(),
                isSubscribed: () => this.isSubscribed(),

                redirect: (url) => this.redirect(url),
                
                hideMessage: () => this.hideMessage(),
                clearMessage: () => this.clearMessage(),
                setMessage: (message) => this.setMessage(message),

                // For debugging
                set: (callback) => this.set(callback)
            }}>
                {this.renderRedirect()}
                {this.props.children}
            </Context.Provider>
        );
    }
}



// {
//     id: 2,
//     name: 'Jer\'s Campaign',
//     url: 'https://www.example.com',
//     isEnabled: true,
//     effect: 'fadeIn',
//     location: 2,
//     leadCount: 2151,
//     message: 'Hello!'
// }