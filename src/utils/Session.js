import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default class Session {

    static get isRemembering() {
        return Boolean(cookies.get('remember'));
    }

    // Exposes session on Session.session;
    static get session() {
        return cookies.get('session');
    }

    static get token() {
        return cookies.get('token');
    }

    // Expose Session.isSet;
    static get isSet() {
        return (Session.session && Session.token);
    }





    static set isRemembering(value) {
        if(typeof value === 'boolean')
            cookies.set('remember', value);
    }

    static set session(newSession) {

        const expireAfterMinute = {
            expires: new Date().getTime() + (1000 * 60)
        }

        if(newSession && typeof newSession === 'string') {

            if(Session.isRemembering)
                cookies.set('session', newSession);
            else 
                cookies.set('session', newSession, expireAfterMinute);

        }

    }

    static set token(newToken) {
        if(newToken && typeof newToken === 'string')
            cookies.set('token', newToken);
    }





    static set(session, token, isRemembering) {
        Session.session = session;
        Session.token = token;
        Session.isRemembering = isRemembering;
    }

    static get() {
        const { session, token, isRemembering } = Session;

        return { session, token, isRemembering };
    }

    static clear() {
        cookies.remove('session');
        cookies.remove('token');
    }


    static tokenize(obj) {
        return {
            ...obj,
            "Session": Session.session,
            "X-CSRF-Token": Session.token,
        }
    }

}