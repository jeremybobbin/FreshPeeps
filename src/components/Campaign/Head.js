import React from 'react';

import UrlInput from '../UrlInput';

export default ({update, name, url, isOpen}) => {
    return (
        <div className='head'>
            <DynamicInput
                className='name'
                value={name}
                isInput={isOpen}
                onChange={(newName) => update('name', newName)}
                name='Campaign Name'
            />

            <DynamicUrlInput
                isInput={isOpen}
                url={url}
                update={update}
                className='url'/>

        </div>
    );
}
const DynamicInput = ({onChange, isInput, value, className, name}) => isInput ?
    (<input
        value={value}
        onChange={e => onChange(e.target.value)}
        type='text'
        placeholder={name}
        className={className}/>)
    :
    <p className={className}>{value}</p>;

const DynamicUrlInput = ({update, url, className, isInput}) => isInput ?
    <UrlInput
        update={update}
        url={url}/>
    :
    <p className={className}>{url}</p>;


