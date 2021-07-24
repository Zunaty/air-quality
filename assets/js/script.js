// This holds all searched items
var searchHistory = [];

// Hamburger menu functionality
document.addEventListener('DOMContentLoaded', () => {
const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
if ($navbarBurgers.length > 0) {
  $navbarBurgers.forEach(el => {
    el.addEventListener('click', () => {
      const target = el.dataset.target;
      const $target = document.getElementById(target);
      el.classList.toggle('is-active');
      $target.classList.toggle('is-active');
    });
  });
}
});

// hide cat facts modal
$( ".delete" ).click(function() {
  $( "#cat-modal" ).addClass( "is-hidden" );
});

// Shows search city data
$( "#search" ).click(function() {
  $( "#data-display" ).removeClass( "is-hidden" );
  searchWeather();
});

// This pulls a random fact into the modal
fetch('https://cat-fact.herokuapp.com/facts/random?amount=2')
.then(function(response) {
  return response.json();
})
.then(function(catData) {
  var catP = document.getElementById('cat-facts');
  catP.innerHTML = catData[0].text;
});

// This will search for a city's long and lat, then search with those coords for weather
function searchWeather() {
  var searchInput = document.getElementById('input-text').value;
  searchHistory.push(searchInput);
  console.log(searchHistory);

  fetch('http://api.positionstack.com/v1/forward?access_key=8b6705bd3db1ed3c15005b1f93926e8e&query=' + searchInput)
    .then(function(response) {
      return response.json();
    })
    .then(function(searchLatLong) {
      fetch('http://api.airvisual.com/v2/nearest_city?lat=' + searchLatLong.data[0].latitude + '&lon=' + searchLatLong.data[0].longitude + '&key=a4444be5-06aa-432c-96f8-fadf504bf0e0')
        .then(function(response) {
          return response.json();
        })
        .then(function(weatherData) {
          console.log(weatherData);
        });
    })
}


