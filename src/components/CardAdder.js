import React from 'react';

import { Inject } from './Context';
import UrlInput from './UrlInput';

const CardAdder = ({name, url, update, protocol, post, toggle}) =>
    <form onSubmit={(e) => {
        e.preventDefault();
        post(name, protocol + url);
    }} className='card-adder'>

        <input
            value={name}
            className='name'
            onChange={(e) => update('name', e.target.value)}
            placeholder="Campaign Name"/>
        
        <UrlInput
            toggle={toggle}
            update={update}
            protocol={protocol}
            url={url}/>

        <button
            type="submit"
            onClick={(e) => {
                e.preventDefault();
                post(name, protocol + url)
            }}>
            Add Campaign
        </button>

    </form>;


export default Inject(CardAdder, 'post');