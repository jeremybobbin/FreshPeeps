import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import {Inject} from '../Context';

let baseUrl = 'https://freshpeeps.com/api/';

export default class Script extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            copied: false,
            buttonText: 'Copy Script'
        };
    }
  
    onCopy() {
        this.setState({ copied: true, buttonText: 'Copied' });
    }
  
  
    render() {
        const { campaignId } = this.props;
        const { buttonText } = this.state;
        
        const script = `<script>(function(w,n) {if (typeof(w[n]) == 'undefined'){ob=n+'Obj';w[ob]=[];w[n]=function(){w[ob].push(arguments);};d=document.createElement('script');d.type = 'text/javascript';d.async=1;d.src='${baseUrl + 'script'}' ;x=document.getElementsByTagName('script')[0];x.parentNode.insertBefore(d,x);}})(window, 'sparrows', '');sparrows('config', 'campaignId', ${ campaignId });</script>`;
        

        return (
            <CopyToClipboard
                text={script}
                onCopy={() => this.onCopy()}>
                <button className='copy-pasta'>
                    { buttonText }
                </button>
            </CopyToClipboard>
        );
    }
}