// API Key Setup
function setAPIkey() {
  if (localStorage.getItem("tmdbAPIkey")) {
    let apiKey = localStorage.getItem("tmdbAPIkey");
    alert(apiKey);
  } else {
    alert("please input api key");
  }
}
function printAPI() {
  let apiKey = document.getElementById("api").value;
  localStorage.setItem("tmdbAPIkey", apiKey);
}
// Orchestrators
displayNowPlayingMovies();
async function displayNowPlayingMovies() {
  let movies = await getNowPlayingMovies();
  displayMovies(movies);
}
async function displayPopularMovies() {
  let movies = await getPopularMovies();
  displayMovies(movies);
}
async function displayFavorites() {
  let movies = await getFavoriteMovies();
  displayMovies(movies);
}
// Api pulls
async function getNowPlayingMovies() {
  let apiKey = localStorage.getItem("tmdbAPIkey");
  const nowPlayingMoviesURL = `https://api.themoviedb.org/3/movie/now_playing`;
  try {
    let response = await fetch(nowPlayingMoviesURL, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    if (!response.ok) throw new Error("Network response was not ok");
    let nowPlayingMovies = await response.json();
    return nowPlayingMovies.results;
  } catch (error) {
    console.error(`Fetch Error ${error}`);
    return [];
  }
}
async function getPopularMovies() {
  let apiKey = localStorage.getItem("tmdbAPIkey");
  const popularMoviesUrl = `https://api.themoviedb.org/3/movie/popular`;
  try {
    let response = await fetch(popularMoviesUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    if (!response.ok) throw new Error("Network response was not ok");
    let popularMovies = await response.json();
    return popularMovies.results;
  } catch (error) {
    console.error(`Fetch Error ${error}`);
    return [];
  }
}
async function getMovie(id) {
  let apiKey = localStorage.getItem("tmdbAPIkey");
  const movieURL = `https://api.themoviedb.org/3/movie/${id}`;
  try {
    let response = await fetch(movieURL, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    if (!response.ok) throw new Error("Network response was not ok");
    let movieDetails = await response.json();
    return movieDetails;
  } catch (error) {
    console.error(`Fetch Error ${error}`);
    return [];
  }
}
// Non api pull
async function addFavoriteMovie(btn) {
  let id = btn.getAttribute("data-movie-id");
  btn.style.display = 'none';
  let parent = btn.parentElement;
  let otherBtn = parent.querySelector('[data-fav="true"]');
  otherBtn.style.display = 'block';
  let favorites = getFavoriteMovies();
  let duplicate = favorites.find((movie) => movie.id == id);
  if (duplicate == undefined) {
    let newFavorite =  await getMovie(id);
    if (newFavorite != undefined) {
      favorites.push(newFavorite);
      saveFavoriteMovies(favorites);
    }
  }
}
async function removeFavoriteMovie(btn) {}
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
    // Write
    movieRow.appendChild(movieCard);
  });
}
