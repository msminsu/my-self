// import React, { Component } from 'react';
import React from 'react';
import PropTypes from "prop-types";
import './Movie.css';

/*class Movie extends Component{
    static propTypes={
        title:PropTypes.string.isRequired,
        poster:PropTypes.string.isRequired
    };

    render(){
        return (
            <div>
                <MoviePoster poster={this.props.poster}/>
                <h1>{this.props.title}</h1>
            </div>

        )
    }
}*/

function Movie({title, poster}){
    return (
        <div>
            <MoviePoster poster={poster}/>
            <h1>{title}</h1>
        </div>

    )
}

/*class MoviePoster extends Component{
    static propTypes = {
        poster: PropTypes.string.isRequired
    };

    render(){
        return (
           <img src={this.props.poster} alt=""/>
        )
    }
}*/

function MoviePoster({poster}){
    return (
        <div>{poster}</div>
        // <img src={poster} alt=""/>
    );
}
Movie.propTypes={
    title:PropTypes.string.isRequired,
    poster:PropTypes.string.isRequired
};

MoviePoster.propTypes={
    poster:PropTypes.string.isRequired
};

export default Movie;