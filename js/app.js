// Orchestrators
async function displayNowPlayingMovies() {
  let movies = await getNowPlayingMovies();
  displayMovies(movies);
  document.getElementById("page-title").innerText = "Now Playing Movies";
}
async function displayPopularMovies() {
  let movies = await getPopularMovies();
  displayMovies(movies);
  document.getElementById("page-title").innerText = "Popular Movies";
}
async function displayFavorites() {
  let movies = await getFavoriteMovies();
  displayMovies(movies);
  document.getElementById("page-title").innerText = "Your Favorite Movies";
}
async function displaySearchResults() {
  let query = document.getElementById("movie-search").value;
  let encodeQuery = encodeURIComponent(query);
  let movies = await getSearchResults(encodeQuery);
  displayMovies(movies);
  document.getElementById(
    "page-title"
  ).innerText = `Search Results for "${query}`;
  uncheckButtons();
}
async function displayMovieDetails() {
  const defaultMovieID = 47852;
  const urlParams = new URLSearchParams(window.location.search);
  let id = urlParams.get("id") || defaultMovieID;
  let movie = await getMovie(id);
  if (!movie) {
    console.log(`Movie with id ${id} not found.`);
    id = defaultMovieID;
    movie = await getMovie(id);
  }
  document.getElementById("movie-title").innerText = movie.title;
  let movieDetails = document.getElementById("movie-details");
  let backdropPath = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
  if (movie.backdrop_path == null) {
    backdropPath = "/img/Backdrop.jpg";
  }
  movieDetails.style.background = `url(${backdropPath}), linear-gradient(rgba(0,0,0, .5), rgba(0,0,0, .9))`;
  movieDetails.style.backgroundPosition = "cover";
  movieDetails.style.backgroundRepeat = "no-repeat";
  movieDetails.style.backgroundBlendMode = "overlay";
  let moviePoster = document.getElementById("movie-poster");
  let posterPath = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  if (movie.poster_path == null) {
    posterPath = "/img/poster.png";
  }
  moviePoster.src = posterPath;
  let movieCert = document.getElementById("movie-cert");
  movieCert.innerText = displayCertification(movie);
  let movieRelease = document.getElementById("movie-release");
  movieRelease.innerText = new Date(movie.release_date).toLocaleDateString();
  let minutes = movie.runtime % 60;
  let hours = (movie.runtime - minutes) / 60;
  let movieRuntime = document.getElementById("movie-runtime");
  movieRuntime.innerText = `${hours}h ${minutes}m`;
  let movieOverview = document.getElementById("movie-overview");
  movieOverview.innerText = movie.overview;
  let movieGenres = document.getElementById("movie-genres");
  movieGenres.innerHTML = displayGenres(movie);
  let movieTagline = document.getElementById("movie-tagline");
  movieTagline.innerText = movie.tagline;
  let movieRating = document.getElementById("movie-rating");
  let rating = (movie.vote_average * 10).toFixed(0);
  movieRating.innerText = `User Rating: ${rating}%`;
  let videos = await getMovieVideos(id);
  if (videos.length < 1) {
    document.getElementById("btn-trailer").style.display = "none";
  } else {
    document.getElementById("btn-trailer").style.display = "block";
  }
}
async function loadVideo() {
  let urlParams = new URLSearchParams(window.location.search);
  let id = urlParams.get("id") || 47852;
  let videos = await getMovieVideos(id);
  if (videos.length > 0) {
    let defaultVideo = videos[0];
    videos = videos.filter((video) => video.type == "Trailer");
    let trailerVideo = videos[0] || defaultVideo;
    document.getElementById("trailerModalLabel").innerText = trailerVideo.name;
    document.getElementById(
      "movie-trailer"
    ).src = `https://www.youtube.com/embed/${trailerVideo.key}`;
  }
}
async function unloadVideo() {
  document.getElementById("movie-trailer").src = '';
}
// Favorite Movie Management
async function addFavoriteMovie(btn) {
  let id = btn.getAttribute("data-movie-id");
  btn.style.display = "none";
  let parent = btn.parentElement;
  let otherBtn = parent.querySelector('[data-fav="true"]');
  otherBtn.style.display = "block";
  let favorites = getFavoriteMovies();
  let duplicate = favorites.find((movie) => movie.id == id);
  if (duplicate == undefined) {
    let newFavorite = await getMovie(id);
    if (newFavorite != undefined) {
      favorites.push(newFavorite);
      saveFavoriteMovies(favorites);
    }
  }
  selectAndClickCategory();
}
async function removeFavoriteMovie(btn) {
  let id = btn.getAttribute("data-movie-id");
  btn.style.display = "none";
  let parent = btn.parentElement;
  let otherBtn = parent.querySelector('[data-fav="false"]');
  otherBtn.style.display = "block";
  let favorites = getFavoriteMovies();
  let exists = favorites.find((movie) => movie.id == id);
  if (exists.id == id) {
    let newFavorites = favorites.filter((movie) => movie.id != id);
    saveFavoriteMovies(newFavorites);
  }
  selectAndClickCategory();
  //let choice = getRadioValue();
  //if (choice == "favorites") {
  //displayFavorites();
  //}
}
function getFavoriteMovies() {
  let favoriteMovies = localStorage.getItem("favoriteMovies");
  if (favoriteMovies == null) {
    favoriteMovies = [];
    saveFavoriteMovies(favoriteMovies);
  } else {
    favoriteMovies = JSON.parse(favoriteMovies);
  }
  return favoriteMovies;
}
function saveFavoriteMovies(movies) {
  let moviesJSON = JSON.stringify(movies);
  localStorage.setItem("favoriteMovies", moviesJSON);
}
function isFavoriteMovie(id) {
  let favorites = getFavoriteMovies();
  if (!favorites) {
    return false;
  }
  return favorites.some((movie) => movie.id == id);
}

function displayMovies(movies) {
  const movieCardTemplate = document.getElementById("movie-card-template");
  const movieRow = document.getElementById("movie-row");
  movieRow.innerHTML = "";
  movies.forEach((movie) => {
    let movieCard = document.importNode(movieCardTemplate.content, true);
    // Title
    let titleElement = movieCard.querySelector(".card-body > .card-title");
    titleElement.textContent = movie.title;
    // Release date
    let descriptionElement = movieCard.querySelector(".card-body > .card-text");
    descriptionElement.textContent = movie.release_date.toLocaleString(
      undefined,
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
    // Image
    let movieImageElement = movieCard.querySelector(".card-img-top");
    let poster_path = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    if (movie.poster_path == null) {
      poster_path = "/img/poster.png";
    }
    movieImageElement.setAttribute("src", poster_path);
    // Favorite buttons
    let removeFavBtn = movieCard.querySelector('[data-fav="true"]');
    removeFavBtn.setAttribute("data-movie-id", movie.id);
    let addFavBtn = movieCard.querySelector('[data-fav="false"]');
    addFavBtn.setAttribute("data-movie-id", movie.id);
    if (isFavoriteMovie(movie.id)) {
      addFavBtn.style.display = "none";
      removeFavBtn.style.display = "block";
    } else {
      removeFavBtn.style.display = "none";
      addFavBtn.style.display = "block";
    }
    let infoBtn = movieCard.querySelector("[data-info]");
    infoBtn.href = `/movieDetails.html?id=${movie.id}`;
    // Write
    movieRow.appendChild(movieCard);
  });
}
// Display Details Constructors
function displayGenres(movie) {
  let genresTemplate = "";
  movie.genres.forEach((genre) => {
    genresTemplate += `<span class="badge text-bg-secondary rounded-pill me-1">${genre.name}</span>`;
  });
  return genresTemplate;
}
function displayCertification(movie) {
  let certification = "";
  try {
    let usReleaseDates = movie.release_dates.results.find(
      (rd) => rd.iso_3166_1 === "US"
    );
    if (!usReleaseDates) {
      certification = "NR";
    }
    certification = usReleaseDates.release_dates.find(
      (rd) => rd.certification != ""
    );
  } catch {
    certification = "NR";
  }
  return certification.certification;
}
function displayCredits(id) {

}

//function selectAndClickCategory() {
//ONLY works if something is set to the onclick attribute and not just the on change
//// returns as array
//let buttons = document.querySelectorAll("#btn-bar .btn-check");
//let checked = Array.from(buttons).find((button) => button.checked);
//if (checked) {
//checked.click();
//}
//}
function selectAndClickCategory() {
  if (document.getElementById("btn-now-playing").checked) {
    displayNowPlayingMovies();
  } else if (document.getElementById("btn-popular").checked) {
    displayPopularMovies();
  } else if (document.getElementById("btn-favorites").checked) {
    displayFavorites();
  }
}
function uncheckButtons() {
  let buttons = document.querySelectorAll("#btn-bar .btn-check");
  let checked = Array.from(buttons).find((button) => button.checked);
  if (checked) {
    checked.checked = false;
  }
}
