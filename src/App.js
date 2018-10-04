import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';

import  { Provider } from './components/Context';

import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Leads from './pages/Leads';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Root from './pages/Root';
import Account from './pages/Account';

import Debug from './components/Debug';
import Layout from './components/Layout';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import SubRoute from './components/SubRoute';

import './sass/main.scss';



class App extends Component {
	
	render() {
		return (
			<BrowserRouter>
				<Provider>
					<Layout>
						<Route 
							exact path="/" 
							component={Root}
						/>
						<SubRoute
							exact path='/dashboard'
							component={() => <Dashboard/>}
						/>
						<Route
							exact path="/register"
							component={Register}
						/>
						<Route
							exact path="/login"
							component={() => <Login/>}
						/>
						<Route
							exact path="/account"
							component={Account}
						/>
						<SubRoute
							path="/leads"
							component={Leads}
						/>
						<Route
							exact path="/logout"
							component={Logout}
						/>
					</Layout>
					{/* <Debug /> */}
				</Provider>
			</BrowserRouter>
		);
	}
}

export default App;
