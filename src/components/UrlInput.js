import React, {Component} from 'react';

export default class UrlInput extends Component {
    constructor({update, url}) {
        super();
        this.state = {
            isSecure: url.startsWith('https://'),
            url: url.replace(/(^\w+:|^)\/\//, ''),
        }
        this.updateUrl = (url) => update('url', url);
    }

    set(callback) {
        return new Promise((resolve) => {
            const stateRef = {...this.state};
            callback(stateRef);
            this.setState(stateRef, resolve)
        })
        .then(() => this.updateUrl(this.state.url));
    }

    toggle() {
        this.set(state => {
            state.isSecure = !state.isSecure
        });
    }

    update(url) {
        this.set(state => state.url = url);
    }

    getProtocol() {
        return this.state.isSecure ? 'https://' : 'http://';
    }

    render() {
        const {url} = this.state;

        return (
            <div className='url-wrapper'>
                <div className='protocol-wrapper'>
                    <div
                        className='protocol'
                        onClick={(e) => {
                            e.preventDefault();
                            this.toggle();
                        }}>
                        {this.getProtocol()}
                    </div>
                </div>
                <input
                    type="text"
                    placeholder="Site URL"
                    value={url}
                    onChange={e => this.update(e.target.value)}/>
            </div>
        );
    }
}