<script setup>
import WindArrowIcon from '@/assets/icons/WindArrowIcon.vue';
import BarometerIcon from '@/assets/icons/BarometerIcon.vue';
import { ref, onMounted } from 'vue';
import axios from 'axios';

const weather = ref({});
const icon = ref('');
const props = defineProps({
  index: Number,
  city: String
})

const getWeather = (api_key, city_name) => {
  if (city_name) {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${api_key}&units=metric`)
      .then((res) => {
        weather.value = res.data;
        icon.value = `http://openweathermap.org/img/wn/${weather.value.weather[0].icon}@2x.png`;
      })
      .catch(error => {
        console.log(error);
      })
  }
}

const formalFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

onMounted(() => {
  const api_key = localStorage.getItem('api_key');
  const city_name = JSON.parse(localStorage.getItem('city_name'))[props.index] || props.city;
  
  getWeather(api_key, city_name);

  setInterval(() => {
    getWeather(api_key, city_name);
  }, 600000)
})
</script>

<template>
  <section class="widget-wrapper" v-if="weather.main?.temp">
    <div class="widget-inner">
      <div class="top">
        <div class="city-name">{{ weather.name }}, {{ weather.sys.country }}</div>
        
      </div>

      <div class="temp-inner">
        <img :src="icon" alt="weather icon" class="temp-icon">
        <span class="temp-degree" >{{ Math.round(weather.main.temp) }}°С</span>
      </div>

      <p class="feels-like">Feels like {{ Math.round(weather.main.feels_like) }}°С. {{ formalFirstLetter(weather.weather[0].description) }}</p>

      <div class="main-info-inner">
        <p class="main-info-text">
          <wind-arrow-icon class="wind-icon icon"/>
          <span class="wind">{{ weather.wind.speed.toFixed(1) }}m/s</span>
        </p>
        <p class="main-info-text">
          <barometer-icon class="pressure-icon icon"/>
          <span class="pressure">{{ weather.main.pressure }}hPa</span>
        </p>
        <p class="main-info-text">Humidity: {{ weather.main.humidity }}%</p>
        <p class="main-info-text">Max temp: {{ Math.round(weather.main.temp_max) }}°C</p>
        <p class="main-info-text">Visibility: {{ Math.round(weather.visibility / 1000).toFixed(1) }}km</p>
      </div>
    </div>
  </section>
</template>
