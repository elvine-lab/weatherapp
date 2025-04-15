const form = document.getElementById("weather-form")
const locationInput = document.getElementById("location-input")
const unitToggle = document.getElementById("unit-toggle")
const loadingEl = document.getElementById("loading")
const displayEl = document.getElementById("content")

const WEATHER_API_KEY = '6XGTGT2SRW7D6T87PHJ59QCLX';
const GIPHY_API_KEY = 'BHHGSr5uh2P8NWFCET0mIuhDxJCXhXEI';

async function getWeather (location, unit) {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}?unitGroup=${unit}&key=${WEATHER_API_KEY}&contentType=json`
    const response = await fetch(url)
    const data = await response.json()
    return {
        location: data.resolvedAddress,
        temp: data.currentConditions.temp,
        condition: data.currentConditions.conditions        
    }
}

async function getGif(query){
    const url = `https://api.giphy.com/v1/gifs/translate?api_key=${GIPHY_API_KEY}&s=${encodeURIComponent(query)}`
    const response = await fetch(url)
    const { data } = await response.json()
    return data.images.original.url
}

function setBackground (condition) {
    if (condition.includes('Rain')){
        document.body.style.backgroundColor = '#9ecae1'
    } else if (condition.includes('Sunny') || condition.includes('Clear')){
        document.body.style.backgroundColor = '#fdd835'
    } else if (condition.includes('Cloud')) {
        document.body.style.backgroundColor = '#90a4ae'
    } else {
        document.body.style.backgroundColor = '#c5e1a5'
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const location = locationInput.value
    const unit = unitToggle.value

    loadingEl.style.display = 'block'
    displayEl.innerHTML = ''

        try {
            const weather = await getWeather(location, unit)
            const gifUrl = await getGif(weather.condition)

            setBackground(weather.condition)

            displayEl.innerHTML = `
            <h2>Weather in ${weather.location}</h2>
            <p>Temperature: ${weather.temp}°${unit === 'us' ? 'F' : 'C'}</p>
            <p>Condition: ${weather.condition}</p>
            <img src="${gifUrl}" alt="Weather gif" class="weather-gif">
            `
        } catch (error){
            displayEl.innerHTML = '<p>Error in getting Weather! Please try again.</p>'
            console.error(error)
        } finally {
            loadingEl.style.display = 'none'
        }
})