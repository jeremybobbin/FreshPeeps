import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import { Inject } from './Context';

const dev = process.env.NODE_ENV === 'development';


//Route for subscribers only
const SubRoute = ({component: Component, ...rest}) => (
        <React.Fragment>
            <Route {...rest}
                render={(props) => {
                    if(rest.isSubscribed()) {
                        return <Component {...props} {...rest}/>
                    }  else {
                        rest.setMessage("You must be subscribed.");
                        return (<Redirect to='/account' />);
                    }
            }}/>
        </React.Fragment>
);

export default Inject(SubRoute, 'isSubscribed', 'setMessage');