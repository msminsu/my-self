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

       this._getMovies();
    }




    _renderMovies =()=>{

       const movies =  this.state.movies.map(movie=>{
            return  <Movie
                title={movie.title}
                poster={'https://image.tmdb.org/t/p/w500'+movie.backdrop_path}
                key={movie.id}
                synopsis={movie.overview}
                genres ={movie.genre_ids}
            />
        });

        return movies;
    };

    _getMovies = async() =>{

        const movies = await this._callApi();
        console.log(movies);
        this.setState({
            movies
        });
    }

    _callApi =()=>{

        return fetch('https://api.themoviedb.org/3/movie/popular?api_key=a7ace44a80ccb723782701298053323d')
            .then(potato =>potato.json())
            .then(json => json.results)
            .catch(err=>console.log(err))
    };


render() {
        console.log('did render');
        const {movies} =this.state;
    return (
      <div className={movies ? "App":"App--loading"}>
          {this.state.movies ? this._renderMovies() : "Loading"}
      </div>
    );
  }
}

export default App;
