// Orchestrators
displayNowPlayingMovies();
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
  document.getElementById("page-title").innerText = `Search Results for "${query}`;
  uncheckButtons();
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
async function getSearchResults(query) {
  let apiKey = localStorage.getItem("tmdbAPIkey");
  const searchURL = `https://api.themoviedb.org/3/search/movie?query=${query}`;
  try {
    let response = await fetch(searchURL, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    if (!response.ok) throw new Error("Network response was not ok");
    let search = await response.json();
    return search.results;
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
    // Write
    movieRow.appendChild(movieCard);
  });
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
  let checked = Array.from(buttons).find(button => button.checked);
  if (checked) {
    checked.checked = false;
  }
  
}
