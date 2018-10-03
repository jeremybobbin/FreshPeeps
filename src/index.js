import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker, { unregister } from './registerServiceWorker';
const { pathname } = window.location;

function redirect(path) {
    unregister();
    window.location.href = 'https://www.freshpeeps.com' + path;
}


if(pathname.startsWith('/drupal')) {
    redirect(pathname);
} else if (pathname.startsWith('/widget')) {
    redirect(pathname);
} else if (pathname.startsWith('/api')) {
    redirect(pathname);
} else {
    ReactDOM.render(<App />, document.getElementById('root'));
}


registerServiceWorker();
