import React, {Component} from 'react';

class Button extends Component {
    constructor(){
        super(...arguments);
        this.state ={
            addComment: ''
        }
    }

    clickHandler(e){
        this.setState({addComment:'클릭됨'})
    }

    render(){
        return (
            <div>
                <button onClick={this.clickHandler.bind(this)}>입력</button>
            </div>
        );
    }
}

export default Button;