$(document).ready(()=>{
    $('#searchForm').on('submit', (e)=>{
        let searchText = $('#searchText').val();
        getMovies(searchText);
        e.preventDefault();
    })
});

function getMovies(searchText){
    //axios.get('http://www.omdbapi.com?s='+searchText)
    axios.get('https://api.themoviedb.org/3/search/movie?api_key=fa155f635119344d33fcb84fb807649b&query='+searchText)
        .then((response)=>{
            console.log(response);
            let movies = response.data.results;
            let output ='';
            $.each(movies,(index,movie)=>{
                output +=`
                <div class="col-md-3">
                    <div class="well text-center">
                        <img src="https://image.tmdb.org/t/p/w185_and_h278_bestv2/${movie.poster_path}" alt="">
                        <h5> ${movie.title}</h5>
                        <a onclick="movieSelected('${movie.id}')" class="btn btn-primary" href="#">Movie Details</a>
                    </div>
                </div> 
                `;
            });

            $('#movies').html(output);
        })
        .catch((err)=>{
            console.log(err);
        });

}

function movieSelected(id){
    sessionStorage.setItem('movieId', id);
    window.location='movie.html';
    return false;
}

function getMovie() {
    let movieId = sessionStorage.getItem('movieId');

    console.log(movieId);

    //axios.get('https://api.themoviedb.org/3/search/movie?api_key=fa155f635119344d33fcb84fb807649b&query='+movieId)
    axios.get('https://api.themoviedb.org/3/movie/'+movieId+'?api_key=fa155f635119344d33fcb84fb807649b')
        .then((response)=>{
            console.log(response);

            let movie = response.data;
            let genres = response.data.genres;
            let txta ='';
            $.each(genres,(index,genres)=>{
                txta += `${genres['name']},`;
            });

            let output = `
                <div class="row">
                    <div class="col-md-4">
                        <img src="https://image.tmdb.org/t/p/w185_and_h278_bestv2/${movie.poster_path}" class="thumbnail" alt="">                
                    </div>
                    <div class="col-md-8">
                        <h2>${movie.title}</h2>
                        <ul class="list-group">
                           <li class="list-group-item"><strong>Genre:</strong>${txta}</li>
                           <li class="list-group-item"><strong>Released:</strong>${movie.release_date}</li>
                           <li class="list-group-item"><strong>Rated:</strong>${movie.genres}</li>
                           <li class="list-group-item"><strong>IMDB Rating:</strong>${movie.vote_average}</li>
                           <li class="list-group-item"><strong>Director:</strong>${movie.genres}</li>
                           <li class="list-group-item"><strong>Writer:</strong>${movie.genres}</li>
                           <li class="list-group-item"><strong>Actors:</strong>${movie.genres}</li>
                        </ul>
                    </div>
                </div>
                <div class="row">
                    <div class="well">
                        <h3>Plot</h3>
                        ${movie.overview}
                        <hr>
                        <a href="http://imdb.com/title/${movie.imdb_id}" target="_blank" class="btn btn-primary">view IMDB</a>
                        <a href="index.html" class="btn btn-default"> GO Back to Search</a>
                    </div>
                </div>
            `;

            $('#movie').html(output);

        })
        .catch((err)=>{
            console.log(err);
        });
}