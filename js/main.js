//Input Header
const cityInput=document.querySelector('.city-input');
const searchBtn=document.querySelector('.search-btn');

// Sections
const weatherInfoSection=document.querySelector('.weather-info');
const searchCitySection=document.querySelector('.search-city');
const notFoundSection=document.querySelector('.not-found');

//Weather Info
const countryTxt=document.querySelector('.country-txt');
const tempTxt=document.querySelector('.temp-txt');
const conditionTxt=document.querySelector('.condition-txt');
const humidityValueTxt=document.querySelector('.humidity-value-txt');
const windValueTxt=document.querySelector('.wind-value-txt');
const weatherSummaryImg=document.querySelector('.weather-summary-img');
const currentDateTxt=document.querySelector('.current-date-txt'); 

//Forecast
const forecastItemsContainer=document.querySelector('.forecast-items-container');

const apiKey="57e55ca232ed520cc2c0c6b89e30460f";

searchBtn.addEventListener('click',()=>{
    if(cityInput.value.trim()!==''){
        updateWeatherInfo(cityInput.value);
        cityInput.value='';
        cityInput.blur();

    }
})

cityInput.addEventListener('keydown',(e)=>{
    if(e.key=="Enter"&&cityInput.value.trim()!==''){
        updateWeatherInfo(cityInput.value);
        cityInput.value='';
        cityInput.blur();
    }
})

async function getFetchDate(endPoint,city){
    const apiUrl=`https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
    const response=await fetch(apiUrl);
    return response.json();
}
function getWeatherIcon(id){
    if(id<=232)return 'thunderstorm.svg';
    if(id<=321)return 'drizzle.svg';
    if(id<=531)return 'rain.svg';
    if(id<=622)return 'snow.svg';
    if(id<=781)return 'atmosphere.svg';
    if(id<=800)return 'clear.svg';
    else return 'clouds.svg';

}

function getCurrentDate(){
    const currentDate=new Date();
    const options={
        weekday:'short',
        day:'2-digit',
        month:'short',
    }
    return currentDate.toLocaleDateString('en-GB',options);
}

async function updateWeatherInfo(city){
    const weatherDate=await getFetchDate('weather',city);

    if(weatherDate.cod!=200){
        showDisplaySection(notFoundSection);
    }
    const{
        name:country,
        main:{temp,humidity},
        weather:[{id,main}],
        wind:{speed}
    }=weatherDate;

    countryTxt.textContent=country;
    tempTxt.textContent=Math.round(temp)+' °C';
    conditionTxt.textContent=main;
    humidityValueTxt.textContent=humidity+'%';
    windValueTxt.textContent=speed+' M/s';
    currentDateTxt.textContent=getCurrentDate();
    weatherSummaryImg.src=`imges/${getWeatherIcon(id)}`;

    await updateForecastInfo(city);

    // console.log(weatherDate);
    showDisplaySection(weatherInfoSection);
}

async function updateForecastInfo(city){
    const forecastDate=await getFetchDate('forecast',city);
    const timeTaken='12:00:00';
    const todayDate=new Date().toISOString().split('T')[0];

    forecastItemsContainer.innerHTML="";
    forecastDate.list.forEach(forecastWeather=>{
        if(forecastWeather.dt_txt.includes(timeTaken)&& !forecastWeather.dt_txt.includes(todayDate)){
        updateForecastItems(forecastWeather);
        }
    });
}

function updateForecastItems(weatherDate){
    console.log(weatherDate);
    const{

        dt_txt:date,
        main:{temp},
        weather:[{id}]
    }=weatherDate;
    const dataTaken=new Date(date);
    const dataOption={
        day:"2-digit",
        month:"short",
    }
    const dataResult=dataTaken.toLocaleDateString('en-US',dataOption);
    const forecastItem=`
          <div class="forecast-item">
          <h5 class="forecast-item-date regular-txt">${dataResult}</h5>
          <img src="imges/${getWeatherIcon(id)}" alt="" class="forecast-item-img">
        <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
          </div>
    `;
    forecastItemsContainer.insertAdjacentHTML("beforeend",forecastItem);
}
function showDisplaySection(section){

    [weatherInfoSection,searchCitySection,notFoundSection].forEach(section=>section.style.display="none")
    section.style.display="flex";
}
