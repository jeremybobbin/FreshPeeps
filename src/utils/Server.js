import Settings from '../Settings';
import Session from './Session';

export default class Server {

    static request(method = 'GET', path = '', body, headers = {}) {
                
        path = Settings.url + path;
        headers = Session.tokenize(headers);
        if(body) body = JSON.stringify(body);

        return fetch(path, {method, body, headers})
            .then(res => {

                if(res === "\n") {
                    const msg = "Server did not response."
                    console.log(msg);
                    throw msg;
                }

                //Just return null if .json() throws
                const jsonify = res.json()
                    .catch(() => {
                        console.log('Could not jsonify:', res);
                        return null;
                    });

                return Promise.all([ res, jsonify ]);
            })
            .then(([ response, body ]) => {
                
                const { status } = response;

                if(status < 200 || status > 299) {
                    console.log(`Server responded with the status code `)
                    throw response;
                }

                return {
                    body,
                    ...response
                };

            });
            
    }

    static get(path, data, headers) {
        return Server.request('GET', path, data, headers)
    }

    static post(path, data, headers) {
        return Server.request('POST', path, data, headers)
    }

    static put(path, data, headers) {
        return Server.request('PUT', path, data, headers)
    }

    static delete(path, data, headers) {
        return Server.request('DELETE', path, data, headers)
    }


    // Sends error or string to server
    static log(err) {
        let message;

        if(typeof err === 'string') {
            message = err;

        } else if(err instanceof Error) {
            message = err.message;

        } else {
            throw `Cannot log ${message}`;
        }

        console.log(`Sending "${message}" to server.`);
        Server.post('/log', { message })
        
    }
}