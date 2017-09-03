import React, {Component} from 'react';




class Input extends Component {
    constructor(){
        super();
        this.state={
            inputValue:'입력창에 값을 입력해 주세요.'
        }
    }

    changeInput(e){
        this.setState({inputValue:e.target.value});
    }

    render(){
        return (
            <div>
                <input type="text" onChange={this.changeInput.bind(this)} value={this.state.inputValue} />
            </div>
        );
    }
}

export default Input;