import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Contact from './component/Contact';
import Result from './component/Result';


class App extends Component
{
    render()
    {
        return (
            <div>
                <Contact/>
                <Result />
            </div>
        );
    }
}


ReactDOM.render(<App/>, document.getElementById('root'));