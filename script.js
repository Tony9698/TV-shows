
// initialize page after HTML loads
window.onload = function() {
   closeLightBox();  // close the lightbox because it's initially open in the CSS
   document.getElementById("button").onclick = function () {
     searchTvShows();
   };
   document.getElementById("lightbox").onclick = function () {
     closeLightBox();
   };
} // window.onload

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js'); 
}


// get data from TV Maze
function searchTvShows() {
  document.getElementById("main").innerHTML = "";
  
  var search = document.getElementById("search").value;  
    
  fetch('https://api.tvmaze.com/search/shows?q=' + search)
    .then(response => response.json())
    .then(data => showSearchResults(data) 
    );
} // window.onload 
 

// change the activity displayed 
function showSearchResults(data) {
  
  // show data from search
  console.log(data); 
  
  // show each tv show from search results in webpage
  for (let tvshow in data) {
    createTVShow(data[tvshow]);
  } // for


} // showSearchResults

// in the json, genres is an array of genres associated with the tv show 
// this function returns a string of genres formatted as a bulleted list
function showGenres(genres) {
   var g;
   var output = "<ul>";
   for (g in genres) {
      output += "<li>" + genres[g] + "</li>"; 
   } // for       
   output += "</ul>";
   return output; 
} // showGenres

// constructs one TV show entry on webpage
function createTVShow (tvshowJSON) {
  
    // get the main div tag
    var elemMain = document.getElementById("main");
    
    // create a number of new html elements to display tv show data
    var elemDiv = document.createElement("div");
    
    var elemImage = document.createElement("img");
    elemImage.id = "a";
    
    var elemShowTitle = document.createElement("h2");
    elemShowTitle.id = "c";
    elemShowTitle.classList.add("showtitle"); // add a class to apply css
    
    var elemGenre = document.createElement("div");
    elemGenre.id = "d";
    var elemRating = document.createElement("div");
    elemRating.id = "e";
    var elemSummary = document.createElement("div");
    elemSummary.id = "f";
    
    // add JSON data to elements
    if (tvshowJSON.show.image != null){
      elemImage.src = tvshowJSON.show.image.medium;
    }
    if (tvshowJSON.show.name != null){
      elemShowTitle.innerHTML = tvshowJSON.show.name;
    }
    if (tvshowJSON.show.genres != null && tvshowJSON.show.genres != ""){
      elemGenre.innerHTML = "Genres: " + showGenres(tvshowJSON.show.genres);
    }
    if (tvshowJSON.show.rating.average != null){
      elemRating.innerHTML = "Rating: " + tvshowJSON.show.rating.average;
    }
    if (tvshowJSON.show.summary != null){
      elemSummary.innerHTML = tvshowJSON.show.summary;
    }
    
       
    // add 5 elements to the div tag elemDiv
    elemDiv.appendChild(elemShowTitle);  
    elemDiv.appendChild(elemImage);
    elemDiv.appendChild(elemGenre);
    elemDiv.appendChild(elemRating);
    elemDiv.appendChild(elemSummary);
    
    
    // get id of show and add episode list
    var showId = tvshowJSON.show.id;
    fetchEpisodes(showId, elemDiv);
    
    // add this tv show to main
    elemMain.appendChild(elemDiv);
    
} // createTVShow

// fetch episodes for a given tv show id
function fetchEpisodes(showId, elemDiv) {
     
  console.log("fetching episodes for showId: " + showId);
  
  fetch('https://api.tvmaze.com/shows/' + showId + '/episodes')  
    .then(response => response.json())
    .then(data => showEpisodes(data, elemDiv));
    
} // fetch episodes

// list all episodes for a given showId in an ordered list 
// as a link that will open a light box with more info about
// each episode
function showEpisodes (data, elemDiv) {
  
    // print data from function fetchEpisodes with the list of episodes
    console.log("episodes");
    console.log(data); 
    
    if(data.length > 0){
      var elemEpisodes = document.createElement("div");  // creates a new div tag
      elemEpisodes.id = "b";
      var output = "<ol id='episodes'>";
      for (episode in data) {
          output += "<li id='li'><a onclick='fetchEpisodeData(" + data[episode].id + ")'>" + data[episode].name + "</a></li>";
      }
      output += "</ol>";
      elemEpisodes.innerHTML = output;
      elemDiv.appendChild(elemEpisodes);  // add div tag to page
    }else{

    }
        
} // showEpisodes

function fetchEpisodeData(episodeId){
  fetch('https://api.tvmaze.com/episodes/' + episodeId)  
  .then(response => response.json())
  .then(data => showLightBox(data));
}


// open lightbox and display episode info
function showLightBox(episodeData){
  document.getElementById("message").innerHTML = "<p> sorry there is no info for this episode yet </p>"
     document.getElementById("lightbox").style.display = "block";
     
     // show episode info in lightbox
     let img = true;
     if(episodeData.image != null){
      document.getElementById("message").innerHTML += "<img src='" + episodeData.image.medium + " '>";
      img = true;
     } else {
      document.getElementById("message").innerHTML = "<h2>" + episodeData.name + "</h2>";
      img = false;
     }
     if(img){
      document.getElementById("message").innerHTML += "<h2>" + episodeData.name + "</h2>";
     }
     document.getElementById("message").innerHTML += "<p> season number: " + episodeData.season + "</p>";
     document.getElementById("message").innerHTML += "<p> number of episode: " + episodeData.number + "</p>";
     if(episodeData.summary == "" || episodeData.summary == null){
      document.getElementById("message").innerHTML += "<p></p>"
     }else {
      document.getElementById("message").innerHTML += "<p>summary: <br> " + episodeData.summary + "</p>";
     }
     
} // showLightBox

 // close the lightbox
 function closeLightBox(){
     document.getElementById("lightbox").style.display = "none";
 } // closeLightBox 






