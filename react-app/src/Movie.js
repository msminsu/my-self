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

function Movie({title, poster,genres,synopsis}){
    return (
        <div className="Movie">
            <div className="Movie__Columns">
                <MoviePoster poster={poster} alt={title}/>
            </div>


            <div className="Movie__Columns">
                <h1>{title}</h1>
                    <div className="Movie__Genres">
                        {genres.map((genre,index)=><MovieGenre genre={genre} key={index} />)}
                    </div>
                    <p className="Movie__synopsis">
                        {synopsis}
                    </p>
            </div>
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

function MoviePoster({poster,alt}){
    return (
        //<div>{poster}</div>
        <img src={poster} alt={alt} className="Movie__Poster"/>
    );
}

function MovieGenre({genre}){
    return (
        //<div>{poster}</div>

        <span className="Movie__Genre">{genre}</span>
    );
}

Movie.propTypes={
    title:PropTypes.string.isRequired,
    poster:PropTypes.string.isRequired,
    genres:PropTypes.array.isRequired,
    synopsis:PropTypes.string.isRequired
};

MoviePoster.propTypes={
    poster:PropTypes.string.isRequired,
    alt:PropTypes.string.isRequired
};

MovieGenre.propTypes={
    genre:PropTypes.number.isRequired
};

export default Movie;