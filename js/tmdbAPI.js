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
displayPopularMovies();
async function getPopularMovies() {
  let apiKey = localStorage.getItem("tmdbAPIkey");
  //let apiKey = document.getElementById("api").value;
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
async function displayPopularMovies() {
  let movies = await getPopularMovies();
  displayMovies(movies);
}

function displayMovies(movies) {
  const movieCardTemplate = document.getElementById("movie-card-template");
  const movieRow = document.getElementById("movie-row");
  movieRow.innerHTML = "";
  movies.forEach((movie) => {
    let movieCard = document.importNode(movieCardTemplate.content, true);
    let titleElement = movieCard.querySelector(".card-body > .card-title");
    titleElement.textContent = movie.title;
    let descriptionElement = movieCard.querySelector(".card-body > .card-text");
    descriptionElement.textContent =
      movie.release_date.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    let movieImageElement = movieCard.querySelector(".card-img-top");
    let poster_path = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    if (movie.poster_path == null) {
      poster_path = "/img/poster.png";
    }
    movieImageElement.setAttribute("src", poster_path);
    movieRow.appendChild(movieCard);
  });
}
