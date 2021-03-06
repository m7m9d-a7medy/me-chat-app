import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { Route, BrowserRouter as Router} from 'react-router-dom'

import LoginComponent from './login/login';
import DashboardComponent from './dashbard/dashboard';
import SignupComponent from './signup/signup';

const firebase = require('firebase');
require('firebase/firestore');

firebase.initializeApp({
    apiKey: "AIzaSyBXRetXUIoH7caS5TamYRTAkj9HFsOYWYA",
    authDomain: "me-chat-c5164.firebaseapp.com",
    databaseURL: "https://me-chat-c5164.firebaseio.com",
    projectId: "me-chat-c5164",
    storageBucket: "me-chat-c5164.appspot.com",
    messagingSenderId: "678404356852",
    appId: "1:678404356852:web:a1883cdb41e0700866fca1",
    measurementId: "G-BN8VFV9CWY"
});


const routing = (
    <Router>
        <div id='routing-container'>
            <Route exact path={['/','/login']} component={LoginComponent}></Route>
            <Route exact path='/dashboard' component={DashboardComponent}></Route>
            <Route exact path='/signup' component={SignupComponent}></Route>
        </div>
    </Router>
);

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
