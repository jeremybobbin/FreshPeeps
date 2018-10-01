import React, {Fragment} from 'react';

import {Inject} from './Context';

const SessionCheckbox = ({toggleSession, sessionEnabled}) =>
    <Fragment>
        <input 
            id='session-checkbox'
            checked={sessionEnabled}
            onChange={() => toggleSession()}
            type='checkbox' />
        <label className='session-label' htmlFor='session-checkbox'>Remember me</label>
    </Fragment>;

export default Inject(SessionCheckbox, 'toggleSession', 'sessionEnabled');