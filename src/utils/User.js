import Cookies from 'universal-cookie';
const serverUrl = 'https://freshpeeps.com/api/';
const cookies = new Cookies();

export default class User {
    static getSession() {
        return cookies.get('session');
    }

    static getToken() {
        return cookies.get('token');
    }

    static cookiesAreSet() {
        return User.getSession() && User.getToken(); 
    }

    static request(method = 'get', path = '', body = {}, headers = {}) {
        const url = serverUrl + path;
        
        if(User.cookiesAreSet()) {
            headers['Session'] = User.getSession();
            headers['X-CSRF-Token'] = User.getToken();
        }
        return fetch(url, {
            method,
            headers,
            body
        }).then(res => res.json());
    }
    
    static isSubscribed() {

        return User.request('post')
            .then(({user}) => {
                if (user.roles["4"] == "FreshPeeps Subscriber")
                    throw 'Not subscribed.';
            });

    }
}

// return Axios({method, url, data, headers})
// .then(response => {
//     if(response.data === "\n") throw "Server is DOWN.";
//     return response;
// });
