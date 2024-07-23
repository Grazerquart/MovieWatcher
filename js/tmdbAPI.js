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
  const movieURL = `https://api.themoviedb.org/3/movie/${id}?append_to_response=release_dates&language=en-US`;
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
async function getMovieVideos(id) {
  let apiKey = localStorage.getItem("tmdbAPIkey");
  const videosURL = `https://api.themoviedb.org/3/movie/${id}/videos`;
  try {
    let response = await fetch(videosURL, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    if (!response.ok) throw new Error("Network response was not ok");
    let videoList = await response.json();
    return videoList.results;
  } catch (error) {
    console.error(`Fetch Error ${error}`);
    return [];
  }
}
async function getCredits(id) {
  let apiKey = localStorage.getItem("tmdbAPIkey");
  const creditsURL = `https://api.themoviedb.org/3/movie/${id}/credits`;
  try {
    let response = await fetch(creditsURL, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    if (!response.ok) throw new Error("Network response was not ok");
    let credits = await response.json();
    return credits;
  } catch (error) {
    console.error(`Fetch Error ${error}`);
    return [];
  }
}