import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import {Inject} from '../Context';

let baseUrl = 'https://freshpeeps.com/api/';

export default class Script extends React.Component {

    constructor() {
        super();
        this.state = {
            copied: false,
        };
    }
  
    onCopy() {
        this.setState({ copied: true });
    }
  
  
    render() {
        const script = `<script>(function(w,n) {if (typeof(w[n]) == 'undefined'){ob=n+'Obj';w[ob]=[];w[n]=function(){w[ob].push(arguments);};d=document.createElement('script');d.type = 'text/javascript';d.async=1;d.src='${baseUrl + 'script'}' ;x=document.getElementsByTagName('script')[0];x.parentNode.insertBefore(d,x);}})(window, 'sparrow', '');</script>`;
        const Copy = Inject(CopyButton, 'setMessage');
        return (
            <React.Fragment>
                <Copy
                    onCopy={() => this.onCopy()}
                    text={script}/>
            </React.Fragment>
        );
    }
}


const CopyButton = ({onCopy, script, setMessage}) =>
    <CopyToClipboard
        text={script}
        onCopy={() => {
            onCopy();
            setMessage('Copied to Clipboard');

        }}>
        <button className='copy-pasta'>
            Copy Script
        </button>
    </CopyToClipboard>;