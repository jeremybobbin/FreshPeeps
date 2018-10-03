const config = {
    url: 'https://www.freshpeeps.com/api',
    mode: 'dev'
}

export default class Settings {
    static get mode() {
        return config.mode;
    }

    static get url() {
        return window.location.protocol + '//' + window.location.hostname + '/api';
        // return config.url;
    }
}