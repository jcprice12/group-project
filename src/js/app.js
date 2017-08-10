import '../css/style.scss';
import 'jquery';
import 'tether'
import 'bootstrap';

//import eventApi function from './api.js' file
import {eventApi} from './api.js';
import {signIn} from './userAuth.js';
import {signUp} from './userAuth.js';
import {signOut} from './userAuth.js';
import {authStateChanged} from './userAuth.js';

//call event api
eventApi();
signUp();
signIn();
signOut();
authStateChanged();