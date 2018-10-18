import React from 'react';


export default ({isRed, trashClick, toLeads, toggleSettings, toggleSwitch, isOn, id}) => 
    <div className='sidebar' >
        <Switch
            value={isOn}
            onChange={toggleSwitch}
        />

        <Person
            campaignId={id}
            onClick={toLeads}
        />
        <Cog 
            onClick={toggleSettings}
        />
        <Trash
            onClick={trashClick}
            isRed={isRed}
        />
    </div>;



const Trash = ({onClick, isRed}) => 
    <input type='image'
        className={`icon trash ${isRed ? 'isRed' : ''}`}
        src={'https://image.flaticon.com/icons/svg/126/126468.svg'}
        onClick={(e) => onClick(e)}
    />;

const Person = ({campaignId}) =>
    <input type='image'
        className={`icon person`}
        src={'https://image.flaticon.com/icons/svg/126/126488.svg'}
        onClick={(e) => window.open(`https://www.freshpeeps.com/api/download/${campaignId}`, "_blank")}
    />;

const Cog = ({onClick}) => 
    <input type='image'
        className={`icon cog`}
        src={'https://image.flaticon.com/icons/svg/1/1850.svg'}
        onClick={(e) => onClick(e)}
    />;

const Switch = ({onChange, value}) => 
    <label className={`switch`}>
        <input onChange={(e) => onChange(e)} checked={value} type="checkbox" />
        <span className="slider round"></span>
    </label>;