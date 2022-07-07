function formatDate() {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let now = new Date();
  let hour = now.getHours();
  let minutes = now.getMinutes();
  let day = days[now.getDay()];
  let date = now.getDate();
  let month = months[now.getMonth()];
  if (hour < 10) {
    hour = `0${hour}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `As of ${hour}:${minutes} ${day} ${date} of ${month}`;
}

function formatForecastDate(timestamp) {
  let forecastDate = new Date(timestamp * 1000);
  let date = forecastDate.getDate();
  return date;
}

function formatTime(timestamp) {
  let forecastTime = new Date(timestamp * 1000);
  let hours = forecastTime.getHours();
  return `${hours}:00`;
}

function formatForecastMonth(timestamp) {
  let forecastMonth = new Date(timestamp * 1000);
  let month = forecastMonth.getMonth();
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[month];
}

function formatDay(timestamp) {
  let weekDay = new Date(timestamp * 1000);
  let day = weekDay.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  let dailyForecast = response.data.daily;
  let dailyForecastElement = document.querySelector("#dailyForecast");

  let dailyForecastHTML = `
        <div class="row">`;
  dailyForecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      dailyForecastHTML =
        dailyForecastHTML +
        `
          <div class="col-2">
            <div class="weather-forecast-day">${formatDay(forecastDay.dt)}</div>
                <div class="weather-forecast-date">${formatForecastMonth(
                  forecastDay.dt
                )} ${formatForecastDate(forecastDay.dt)}</div>
            <img src="http://openweathermap.org/img/wn/${
              forecastDay.weather[0].icon
            }@2x.png" alt="" class="forecast-icon">
            <div class="weather-forecast-temp">
              <span class="weather-forecast-temp-max">
                ${Math.round(forecastDay.temp.max)}°
              </span>
              <span class="weather-forecast-temp-min">
                ${Math.round(forecastDay.temp.min)}°
              </span>
            </div>
          </div>
        `;
    }
  });
  dailyForecastHTML = dailyForecastHTML + `</div>`;
  dailyForecastElement.innerHTML = dailyForecastHTML;
}

function displayHourlyForecast(response) {
  console.log(response.data.hourly);

  let hourlyForecast = response.data.hourly;
  let hourlyForecastElement = document.querySelector("#hourlyForecast");

  let hourlyForecastHTML = `
        <div class="row">`;
  hourlyForecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      hourlyForecastHTML =
        hourlyForecastHTML +
        `
          <div class="col-2">
            <div class="weather-forecast-time">${formatTime(
              forecastDay.dt
            )}</div>
            <img src="http://openweathermap.org/img/wn/${
              forecastDay.weather[0].icon
            }@2x.png" alt="" class="forecast-icon">
            <div class="weather-forecast-temp">
              <span class="weather-forecast-temp-max">
                ${Math.round(forecastDay.temp)}°
              </span>
            </div>
          </div>
        `;
    }
  });
  hourlyForecastHTML = hourlyForecastHTML + `</div>`;
  hourlyForecastElement.innerHTML = hourlyForecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "8ff5d1a1376b46b7fe89092d7988204d";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function getHourlyForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "8ff5d1a1376b46b7fe89092d7988204d";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayHourlyForecast);
}

function displayTemperature(response) {
  let temperatureElement = document.querySelector("#current-temperature");
  let cityElement = document.querySelector("#current-city");
  let descriptionElement = document.querySelector("#weather-description");
  let pressureElement = document.querySelector("#pressure");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");
  celsiusTemperature = response.data.main.temp;

  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  pressureElement.innerHTML = response.data.main.pressure;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  dateElement.innerHTML = formatDate(response.data.dt + 1000);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  changeVideo(response.data.weather[0].main);

  getForecast(response.data.coord);

  getHourlyForecast(response.data.coord);
}

function search(city) {
  let apiKey = "8ff5d1a1376b46b7fe89092d7988204d";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#input-form");
  search(cityInputElement.value);
}

function changeVideo(backgroundVideo) {
  let video = document.querySelector("#my-video");
  if (backgroundVideo == "Clear") {
    video.src = "video/clear-sky.mp4";
  }
  if (backgroundVideo == "Clouds") {
    video.src = "video/clouds.mp4";
  }
  if (backgroundVideo == "Mist") {
    video.src = "video/mist.mp4";
  }
  if (backgroundVideo == "Rain") {
    video.src = "video/rain.mp4";
  }
  if (backgroundVideo == "Snow") {
    video.src = "video/snow.mp4";
  }
  if (backgroundVideo == "Thunderstorm") {
    video.src = "video/thunderstorm.mp4";
  }
  if (backgroundVideo == "Drizzle") {
    video.src = "video/drizzle.mp4";
  }
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#current-temperature");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;

  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#current-temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheits");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

function showPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  let apiKey = "8ff5d1a1376b46b7fe89092d7988204d";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

  axios.get(apiUrl).then(displayTemperature);
}

function locateGadget() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

let currentLocation = document.querySelector("#current-location");
currentLocation.addEventListener("click", locateGadget);

search("Boston");
