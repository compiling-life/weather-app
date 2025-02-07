const cityInput = document.getElementById('cityInput');

const suggestionsBox = document.getElementById('suggestionsBox');

const weatherIcon = document.getElementById('weatherIcon');

const temperatureElement = document.getElementById('temperature');

const descriptionElement = document.getElementById('description');

const humidityElement = document.getElementById('humidity');

const windElement = document.getElementById('wind');

const locationElement = document.getElementById('location');

const unitToggle = document.querySelectorAll('.unit');

const API_KEY = "b31b7e42bc06250ce20a246002f69d8d";

function fetchCitySuggestions() 
{

    const query = cityInput.value.trim();

    if (query.length < 3) 
    {
        suggestionsBox.style.display = 'none';

        return;
    }

    fetch(`https://api.openweathermap.org/data/2.5/find?q=${query}&type=like&sort=population&cnt=5&appid=${API_KEY}`)

    .then(response => response.json())
        
    .then(data => {

    suggestionsBox.innerHTML = '';

    if (data.list && data.list.length > 0) 
    {
        data.list.forEach(city => {

        const cityName = city.name;

        const countryName = city.sys.country;

        const state = city.state ? `${city.state}, ` : '';

        const suggestionItem = document.createElement('div');

        suggestionItem.classList.add('suggestion-item');

        suggestionItem.innerText = `${state}${cityName}, ${countryName}`;

        suggestionItem.addEventListener('click', () => {

            cityInput.value = `${state}${cityName}, ${countryName}`;

            suggestionsBox.style.display = 'none';

            const cityParts = cityInput.value.split(',');

            const cityInputName = cityParts[0].trim();

            const stateInput = cityParts.length > 2 ? cityParts[1].trim() : '';

            const countryInput = cityParts[cityParts.length - 1].trim();

            getWeather(cityInputName, stateInput, countryInput);
        });

        suggestionsBox.appendChild(suggestionItem);

    });

    suggestionsBox.style.display = 'block';

} 

else 
{
    suggestionsBox.style.display = 'none';
}
})

.catch(err => {

console.log('Error fetching city suggestions:', err);

suggestionsBox.style.display = 'none';

});
}

function getWeather(cityName, state, country) 
{
    const units = unitToggle[0].classList.contains('active') ? 'metric' : 'imperial';

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName},${country}&appid=${API_KEY}&units=${units}`)

    .then(response => response.json())

    .then(data => {

        if (data.main && data.weather) 
        {
            const temperature = data.main.temp;

            const weatherDescription = data.weather[0].description;

            const humidity = data.main.humidity;

            const windSpeed = data.wind.speed;

            const iconCode = data.weather[0].icon;

            weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

            temperatureElement.textContent = `Temperature: ${temperature}°`;

            descriptionElement.textContent = `Weather: ${weatherDescription}`;

            humidityElement.textContent = `Humidity: ${humidity}%`;

            windElement.textContent = `Wind Speed: ${windSpeed} m/s`;

            locationElement.textContent = `${cityName}, ${state} ${country}`;
        } 
            
        else 
        {
            console.error('Weather data not available.');
        }
        })

        .catch(err => console.log('Error fetching weather data:', err));
}

function switchUnit() 
{
    unitToggle.forEach(button => button.classList.remove('active'));

    unitToggle.forEach(button => button.addEventListener('click', function () 
    {
        unitToggle.forEach(btn => btn.classList.remove('active'));

        this.classList.add('active');

        const unit = this.innerText === '°C' ? 'metric' : 'imperial';

        const cityParts = cityInput.value.split(',');
        
        const cityInputName = cityParts[0].trim();

        const stateInput = cityParts.length > 2 ? cityParts[1].trim() : '';

        const countryInput = cityParts[cityParts.length - 1].trim();

        getWeather(cityInputName, stateInput, countryInput, unit);
    }));
}

cityInput.addEventListener('input', fetchCitySuggestions);

switchUnit();
