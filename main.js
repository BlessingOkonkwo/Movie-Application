let page = 1;
const queryTerm = document.getElementById("search");
const apiUrl = `https://yts.mx/api/v2/list_movies.json?limit=50&quality=3D&page=${page}`;
const resDiv = document.getElementById("container");
const searchForm = document.getElementById("searchForm");
const overlay = document.querySelector('.overlay');
const infoDiv = document.querySelector('.info');
const card = document.querySelector(".card");
const closeBtn = document.querySelector('#closeOverlay');

window.onload = () => {
    getMovies();
}

window.onscroll= function() {
    infiniteScroll();
}

// this event-handler checks if the scrollbar is at the
// bottom of the page and if it is it fetches another
// set of records
let isScrolled=false;
const infiniteScroll = () => {
// End of the document reached?
    if (window.scrollY > (document.body.offsetHeight - 100) && !isScrolled) {
// Set “isScrolled” to “true” to prevent further execution
    isScrolled = true;
// Your code goes here
    page++;
    getMovies();
// After 1 second the “isScrolled” will be set to “false” to allow the code inside the “if” statement to be executed again
        setTimeout(() => {
        isScrolled = false;
        }, 1000);
    }
}

const getMovies = () => {
    fetch(apiUrl)
    .then(response => {
        return response.json();
    })
    .then(movieData => {
        const movieObj = movieData.data;

        let Output = '';
        
        movieObj.movies.forEach(movieInfo => {
            Output += `
            <div class="card">
                <div><img class="img" src="${movieInfo.medium_cover_image}" alt="${movieInfo.title}"></div>
                <input type="hidden" value="${movieInfo.id}">

                <div class="name">
                    <p class="title"><b>${movieInfo.title_english}</b></p>
                    <p class="year">${movieInfo.year}</p>
                </div>
            </div>
            `;
        });
        resDiv.innerHTML = Output;
    });
}


queryTerm.addEventListener('keyup', (e) => {
    e.preventDefault();
    const movieTerm = queryTerm.value;
  
    if (movieTerm !== "") {
  
      searchMovies(movieTerm);
  
    } else {
        getMovies();
    }
});

const searchMovies = (movie) => {

    fetch(`https://yts.mx/api/v2/list_movies.json?query_term=${movie}&limit=50`)
      .then(response => {
        return response.json();
      })
      .then(movieData => {
        const movieObj = movieData.data;
        let Output = '';
        if (movieObj.movie_count !== 0) {
  
          movieObj.movies.forEach(movieInfo => {
            console.log(movieInfo.id);
            Output += `
            <div class="card">
                <div><img class="img" src="${movieInfo.medium_cover_image}" alt="${movieInfo.title}"></div>
                <input type="hidden" value="${movieInfo.id}">

                <div class="name">
                    <p class="title"><b>${movieInfo.title_english}</b></p>
                    <p class="year">${movieInfo.year}</p>
                </div>
            </div>
            `;
          });
  
  
        } else {
            // alert("no movies found");
        }
        resDiv.innerHTML = Output;
    })
      .catch(error => {
        console.log(`There is an Error: ${error}`);
    });
  
}


resDiv.addEventListener('click', (e) => { 

    if (e.target.className == "img") {
        const movieID = e.target.parentElement.parentElement.children[1].value;
        document.body.setAttribute('style', 'overflow:hidden');
        overlay.style.display = 'block';
    
        getMovieById(movieID);
        console.log(movieID);
    }
});
  
const getMovieById = (id) => {
  
    fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
      .then(response => {
        return response.json();
      })
      .then(movieData => {
        const movieObj = movieData.data.movie;
        let Output = '';
  
  
        Output += `
            <div class="movie-thumbnail">
              <img src="${movieObj.large_cover_image}" alt="${movieObj.title}">
              <div>
              <a href='${movieObj.url}'><button class="submit-btn"><i class="fa fa-download"></i> Download</button></a>
              </div>
            </div>
            <div class="movie-details">
                <h1 title="${movieObj.title}">${movieObj.title_english}</h1> 
                <p>${movieObj.description_full}</p>
            
                <h2>Movie Trailer</h2>
                <div class="trailer">
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/${movieObj.yt_trailer_code}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
            </div>
          
        `;
  
  
        infoDiv.innerHTML = Output;
  
  
    })
        .catch(error => {
        console.log(`There is an Error: ${error}`);
    });
}

closeBtn.addEventListener('click', () => {
    overlay.style.display = 'none';
    document.body.setAttribute('style', 'overflow:auto');
});