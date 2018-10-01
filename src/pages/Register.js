import React from 'react';
import Form from '../components/Form';

import {Inject} from '../components/Context';



const Register = ({register, redirect, resendVerification}) =>
    <div className='register'>
        <h1>Sign up for FreshPeeps</h1>
        <Form
            submitHandler={(username, email, password) =>
                register(username, email, password)}

            buttonText='Register'
            inputs={[
                {
                    placeholder: 'Username',
                    className: 'username',
                },
                {
                    placeholder: 'Email',
                    type: 'email',
                    className: 'email',
                },
                {
                    placeholder: 'Password',
                    type: 'password',
                    className: 'password'
                },
            ]}
        />
        <div className='below-registration'>
            <p>You're already is an account with us? <a
                className='login-link'
                onClick={() => redirect('login')}
            >Sign in here</a></p>
        </div>
    </div>;

export default Inject(Register, 'register', 'redirect', 'resendVerification');