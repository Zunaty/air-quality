// This holds all searched items
var searchHistory = [];

var cityF = "";
var stateF = "";
var z = 11;

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
$(".delete").click(function () {
  $("#cat-modal").addClass("is-hidden");
});

// Shows search city data

$("#search").click(function () {
  $("#data-display").removeClass("is-hidden");
  searchWeather();
});
$(document).on('keypress', function (e) {
  if (e.which == 13) {
    $("data-display").removeClass("is-hidden");
    searchWeather();
  }
});

// This pulls a random fact into the modal
function catFact() {
  fetch('https://cat-fact.herokuapp.com/facts/random?amount=1')
    .then(function (response) {
      return response.json();
    })
    .then(function (catData) {
      var catP = document.getElementById('cat-modal');
      catP.innerHTML = catData[0].text;
      console.log(catData)
    });
}

// This will search for a city's long and lat, then search with those coords for weather
function searchWeather() {
  var searchInput = document.getElementById('input-text').value;
  // This is grabing the same input but making it lowercase for the array
  var searchToL = document.getElementById('input-text').value.toLowerCase();

  if(!searchInput){
    // Need to add an alert modal
  }

  searchHistory.push(searchToL);
  searchHistory = searchHistory.filter((x, index) => {
    return searchHistory.indexOf(x) === index;
  });

  searchHistory = searchHistory.slice(-5);
  removeAllChildNodes(document.querySelector('#dropdown-history'));
  searchHistory.forEach(createSH)

  saveLocal()

  // Getting search input to become lat and long
  fetch('http://api.positionstack.com/v1/forward?access_key=8b6705bd3db1ed3c15005b1f93926e8e&query=' + searchInput)
    .then(function (response) {
      return response.json();
    })
    .then(function (searchLatLong) {
      // Getting the current AQI info
      fetch('http://api.airvisual.com/v2/nearest_city?lat=' + searchLatLong.data[0].latitude + '&lon=' + searchLatLong.data[0].longitude + '&key=a4444be5-06aa-432c-96f8-fadf504bf0e0')
        .then(function (response) {
          return response.json();
        })
        .then(function (weatherData) {
          console.log(weatherData)
          // This inserts the AQI api number into the main info
          document.getElementById('aqi').innerHTML = " " + weatherData.data.current.pollution.aqius;
          document.getElementById('main-city-name').innerHTML = weatherData.data.city + ", " + weatherData.data.state;
          cityF = weatherData.data.city;
          stateF = weatherData.data.state;

          // Changing the color of the AQI Number to follow the color code in the aside
          // Description context pulled from airnow.gov/air-quality-guide
          var aqiNum = weatherData.data.current.pollution.aqius;
          if (aqiNum >= 0 && aqiNum <= 50) {
            document.getElementById('aqi').setAttribute("style", "color:green;");
            document.getElementById('description').textContent = "It's a great day to get outside"
          } else if (aqiNum >= 51 && aqiNum <= 100) {
            document.getElementById('aqi').setAttribute("style", "color:yellow;");
            document.getElementById('description').textContent = "Unusually sensitive people: Consider reducing prolonged or heavy exertion. Watch  for symptoms " +
              "such as coughing or shortness of breath. These are signs to take it easier. " + "Everyone else is fine to be active outside"
          } else if (aqiNum >= 101 && aqiNum <= 150) {
            document.getElementById('aqi').setAttribute("style", "color:orange;");
            document.getElementById('description').textContent = "People with: heart or lung disease, older adults, children, and teenagers " + "Reduce prolonged or heavy " +
              "exertion. It’s OK to be active outside, but take more breaks and do less intense activities. Watch for symptoms such as coughing or shortness of breath " + "People with asthma: " +
              "should follow their asthma action plans and keep quick relief medicine handy " + "If you have heart disease: symptoms such as palpitations, " +
              "shortness of breath, or unusual fatigue may indicate a serious problem. If you have any of these, contact a health care provider. Others exercise caution while outside."
          } else if (aqiNum >= 151 && aqiNum <= 200) {
            document.getElementById('aqi').setAttribute("style", "color:red;");
            document.getElementById('description').textContent = "People with: heart or lung disease, older adults, children, and teenagers: Avoid prolonged or heavy exertion. " +
              "Consider moving activities indoors or rescheduling. Everyone else: Reduce prolonged or heavy exertion. Take more breaks during outdoor activities. "
          } else if (aqiNum >= 201 && aqiNum <= 300) {
            document.getElementById('aqi').setAttribute("style", "color:purple;");
            document.getElementById('description').textContent = "People with: heart or lung disease, older adults, children, and teenagers: Avoid all physical activity outdoors. " +
              "Move activities indoors or reschedule to a time when air quality is better. Everyone else: Avoid prolonged or heavy exertion. Consider moving activities indoors or rescheduling to " +
              "a time when air quality is better"
          } else if (aqiNum >= 301) {
            document.getElementById('aqi').setAttribute("style", "color:brown;");
            document.getElementById('description').textContent = "Everyone: Avoid all physical activity outdoors. People with: heart or lung disease, older adults, children, and teenagers: " +
              "Remain indoors and keep activity levels low. " +
              "Follow tips for keeping particle levels low indoors."
          }
        });

      // This is calling the api for forecast info
      fetch('https://api.weatherbit.io/v2.0/forecast/airquality?lat=' + searchLatLong.data[0].latitude + '&lon=' + searchLatLong.data[0].longitude + '&key=8a2f780dfb5d4e4a9964fb9cce16ad82')
        .then(function (response) {
          return response.json();
        })
        .then(function (forecastInfo) {
          console.log(forecastInfo);
          document.getElementById('five-day-city').innerHTML = cityF + ", " + stateF;
          for (var i = 0; i < 3; i++) {
            var x = i + 1;
            var y = forecastInfo.data[z].aqi;
            var time = forecastInfo.data[z].ts;

            document.getElementById(`us-aqi${x}`).innerHTML = forecastInfo.data[z].aqi;
            document.getElementById(`main-pollutant${x}`).innerHTML = forecastInfo.data[z].pm25;
            document.getElementById(`forecast-date-${x}`).innerHTML = moment.unix(time).format('L');
            if (y >= 0 && y <= 50) {
              document.getElementById(`air-polution-level${x}`).innerHTML = "Good";
              document.getElementById(`air-polution-level${x}`).setAttribute("style", "color:green;");
            } else if (y >= 51 && y <= 100) {
              document.getElementById(`air-polution-level${x}`).innerHTML = "Moderate";
              document.getElementById(`air-polution-level${x}`).setAttribute("style", "color:yellow;");
            } else if (y >= 101 && y <= 150) {
              document.getElementById(`air-polution-level${x}`).innerHTML = "Unhealthy";
              document.getElementById(`air-polution-level${x}`).setAttribute("style", "color:orange;");
            } else if (y >= 151 && y <= 200) {
              document.getElementById(`air-polution-level${x}`).innerHTML = "Unhealthy";
              document.getElementById(`air-polution-level${x}`).setAttribute("style", "color:red;");
            } else if (y >= 201 && y <= 300) {
              document.getElementById(`air-polution-level${x}`).innerHTML = "Very Unhealthy";
              document.getElementById(`air-polution-level${x}`).setAttribute("style", "color:purple;");
            } else if (y >= 301) {
              document.getElementById(`air-polution-level${x}`).innerHTML = "Hazardous";
              document.getElementById(`air-polution-level${x}`).setAttribute("style", "color:brown;");
            }
            z = z + 24;
          }
        });
    })
}

// Saving array to local storage
function saveLocal() {
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
};

// Loading array from local storage and creating relevent anchors for each
function load() {
  searchHistory = JSON.parse(localStorage.getItem("searchHistory"));

  if(!searchHistory) {
      searchHistory = [];
  }

  searchHistory.forEach(createSH);
};

// Creating an anchor for each search
function createSH(x) {
  var a = document.createElement("a");
  a.className = "dropdown-item";
  a.innerHTML = x;
  document.getElementById('dropdown-history').appendChild(a);
};

// Removing all previous searches to update list
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
};

catFact();
load();

