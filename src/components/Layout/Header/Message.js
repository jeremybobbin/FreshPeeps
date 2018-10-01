import React from 'react';
import {Inject} from '../../Context';
import Transition from 'react-transition-group/Transition';

const Message = ({message, hideMessage, messageIsShowing}) => {
    return (
        <Transition timeout={0} in={messageIsShowing}>
            {(state) => (
                <div
                    className={'message-wrapper'}
                    style={{
                        ...divStyles[state]
                    }}>
                    <p
                        onClick={() => hideMessage()}
                        className='message'>
                        {message}</p>
                </div>
            )}
        </Transition>
    );
}

const divStyles = {
    entered:  {
        maxHeight: '100px'
    }
};





export default Inject(Message, 'message', 'hideMessage', 'messageIsShowing');