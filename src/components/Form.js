import React, {Fragment} from 'react';

export default class Form extends React.Component {
    constructor({inputs, submitHandler, className, buttonText, children}) {
        super();
        const values = {};
        inputs.forEach(input => values[input.id] = '');
        this.state = values;
        this.children = children;
        this.inputs = inputs;
        this.submitHandler = submitHandler;
        this.className = className;
        this.buttonText = buttonText;
    }

    set = callback => new Promise(
        resolve => this.setState(callback(this.state), (s) => resolve)
    );
    
    update(e) {
        const {name, value} = e.target;
        this.set(s => {
            s[name] = value;
            return s;
        }).then(res => console.log(res))
    }

    handle(e) {
        e.preventDefault();
        const args = Object.keys(this.state)
            .map(k => this.state[k]);
            
        this.submitHandler(...args);
    }

    render() {
        const inputs = this.inputs
            .map(({label, id, type, placeholder, className, followUp, wrap}, i) => {
                let Div = wrap ? 
                    ({children}) => <div className={`${className || ''}-wrapper`}>{children}</div>
                    :
                    Fragment;
                let InputFeild = (
                    <Div key={i}>
                        <Input
                            key={i}
                            label={label}
                            id={id}
                            className={className}
                            type={type || null}
                            placeholder={placeholder}
                            name={id}

                            // Value doesn't update any other way.
                            value={this.state[(() => id)]}
                            onChange={(e) => this.update(e) }
                        />
                        {followUp && <label htmlFor={id}>{followUp}</label> /* Render followUp if exists */}
                    </Div>
                );
                return InputFeild;
            });

        return (
            <form className={`form ${this.className || ''}`} onSubmit={(e) => this.handle(e)}>
                {inputs}
                {this.children}
                <button className='submit-button' type='submit'>{this.buttonText}</button>
            </form>
        );
    }
}




const Input = ({label, id, name, className, onChange, type, placeholder, value}) => 
    label ?
    <label htmlFor={id || name}>{label}
        <input name={name} value={value} onChange={(e) => onChange(e)} type={type || 'text'} className={className || ''} id={id || name} placeholder={placeholder} />
    </label>
    :
    <input value={value} name={name} onChange={(e) => onChange(e)} type={type} className={className || ''} id={id} placeholder={placeholder} />;
