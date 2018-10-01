import React, {Fragment} from 'react';

import {Inject} from '../components/Context';
import SessionCheckbox from '../components/SessionCheckbox';
import Form from '../components/Form';

const Login = ({logIn, redirect, resendVerification}) =>
    <div className='login'>
        <h1>Log in to FreshPeeps</h1>
        <Form
            buttonText='Log In'
            submitHandler={(username, password) => logIn(username, password)}
            inputs={[
                {
                    placeholder: 'Username',
                    className: 'username',
                    id: 'username'
                },
                {
                    placeholder: 'Password',
                    type: 'password',
                    className: 'password',
                    id: 'password'
                }
            ]}>
            <SessionCheckbox />
        </Form>
        <div className='below-login'>

            <p>Don't have an account? <a
                className='registration-link'
                onClick={() => redirect('register')}
            >Register here</a></p>

            <p>Awaiting Verification? <a
                className='resend'
                onClick={() => resendVerification()}
            >Resend verification email</a></p>
            
        </div>
    </div>;


    
export default Inject(Login, 'logIn', 'redirect', 'resendVerification');