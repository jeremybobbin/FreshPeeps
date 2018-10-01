import React, {Component} from 'react';

// Exclusive Component for people with exlusive roles.
export default class Exclusive extends Component {
    constructor({predicate, OnSuccess, OnFailure, WhileWait, ...rest}) {
        super();

        this.rest = rest;

        // Promise
        this.predicate = predicate;
        
        // Components
        this.OnSuccess = OnSuccess;
        this.OnFailure = OnFailure;
        this.WhileWait = WhileWait;

        
        this.state = {
            waiting: true,
            hasSucceeded: false,
            propsToPass: {}
        };

        if(!(this.predicate instanceof Promise))
            throw 'Exclusive predicate must be a promise';
        
        this.predicate
            .then((t) => this.successHandler(t))
            .catch((t) => this.failureHandler(t));

    }

    successHandler(propsToPass) {
        console.log(propsToPass);
        
        this.setState({
            ...this.state,
            hasSucceeded: true,
            waiting: false,
        });
    }

    failureHandler(propsToPass) {
        this.setState({
            ...this.state,
            waiting: false,
            propsToPass
        });
    }

    render() {
        const {waiting, hasSucceeded} = this.state;

        const {OnSuccess, OnFailure, WhileWait, rest} = this;

        if(waiting) { 
            return ( WhileWait ? <WhileWait { ...rest }/> : null );
        }

        if(hasSucceeded) {
            return ( < OnSuccess { ...rest } />);
        }
        
        return ( < OnFailure { ...rest} /> )
    }

}