import React, { Component } from 'react';
import './App.css';
import Movie from './Movie';




class App extends Component {

    state = {
    };


    componentWillMount(){ console.log('will mount')}
    componentDidMount(){
       /* setTimeout(()=>{
            this.setState({
                movies : [
                    {
                        title:'Note Book',
                        poster:'https://picsum.photos/200/300/?image=00'
                    },
                    {
                        title:'Forest',
                        poster:'https://picsum.photos/200/300/?image=10'
                    },
                    {
                        title:'Desk',
                        poster:'https://picsum.photos/200/300/?image=20'
                    },
                    {
                        title:'Mug cup',
                        poster:'https://picsum.photos/200/300/?image=30'
                    }
                ]
            });
        },2000)*/
     console.log(  fetch('https://jsonplaceholder.typicode.com/posts'));
    }

    _renderMovies =()=>{
       const movies =  this.state.movies.map((movie, index)=>{
            return  <Movie title={movie.title} poster={movie.poster} key={index}/>
        });
        return movies;
    };

  render() {
        console.log('did render');
    return (
      <div className="App">
          {this.state.movies?this._renderMovies() : "Loading"}
      </div>
    );
  }
}

export default App;
