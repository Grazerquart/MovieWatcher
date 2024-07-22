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