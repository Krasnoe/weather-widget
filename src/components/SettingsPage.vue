<script setup>
import CloseIcon from '@/assets/icons/CloseIcon.vue';
import MenuIcon from '@/assets/icons/MenuIcon.vue';
import TrashIcon from '@/assets/icons/TrashIcon.vue';
import EnterIcon from '@/assets/icons/EnterIcon.vue';
import { ref, onMounted } from 'vue';

const emit = defineEmits(['onCloseSettings']);

const city_name = ref([]);
const city_input = ref('');
const list = ref(null);
const trash_icon = ref(null);
let activeElement = ref('');
let currentElement = ref('');
let newCities = ref([]);

const addNewCityByEnter = (e) => {
  const input = city_input.value.toLocaleLowerCase().trim();
  if (e.key === 'Enter' && city_input.value && !city_name.value.includes(input)) {
    city_name.value.push(input);
    localStorage.setItem('city_name', JSON.stringify(city_name.value));
    city_input.value = '';
  }
}

const addNewCity = () => {
  const input = city_input.value.toLocaleLowerCase().trim();
  if (city_input.value && !city_name.value.includes(input)) {
    city_name.value.push(input);
    localStorage.setItem('city_name', JSON.stringify(city_name.value));
    city_input.value = '';
  }
}

const deleteCity = ((city, id) => {
  const cities = city_name.value.filter((c, index) => c[index] !== city[id]);
  localStorage.setItem('city_name', JSON.stringify(cities));
  city_name.value = JSON.parse(localStorage.getItem('city_name')) || [];
})

const formalFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const dragStart = (($event) => {
  activeElement.value = $event.target;
}) 

const dragOver = (($event) => {
  currentElement.value = $event.target;
  const isNotTheSameEl = activeElement.value !== currentElement.value &&
  currentElement.value.classList.contains('city-inner');

  if (!isNotTheSameEl) {
    return;
  }

  const nextElement = currentElement.value === activeElement.value.nextElementSibling ?
      currentElement.value.nextElementSibling :
      currentElement.value;

  list.value.insertBefore(activeElement.value, nextElement);
  newCities.value = city_name.value.slice();
  [newCities.value[currentElement.value.id], newCities.value[activeElement.value.id]] = [newCities.value[activeElement.value.id], newCities.value[currentElement.value.id]];
})

const onDrop = (() => {
  localStorage.setItem('city_name', JSON.stringify(newCities.value));
})

onMounted(() => {
  city_name.value = JSON.parse(localStorage.getItem('city_name')) || [];
})

</script>

<template>
  <div class="settings-wrapper">
    <div class="settings-top">
      <div class="settings-name">Settings</div>
      <button class="settings-button" @click="$emit('onCloseSettings')">
        <close-icon class="close-icon icon"/>
      </button>
    </div>

    <div
      ref="list"
      class="city-list"
      @dragstart="dragStart($event)"
      @dragover.prevent="dragOver($event)"
      @drop="onDrop"
    >
      <div 
        class="city-inner" 
        v-for="city, id in city_name" 
        :key="id"
        :id="id"
        draggable="true" 
      >
        <div class="city-inner-left">
          <menu-icon class="menu-icon icon"/>
          <div class="city-name">{{ formalFirstLetter(city) }}</div>
        </div>
        <trash-icon 
          ref="trash_icon"
          class="trash-icon icon"
          @click="deleteCity(city, id)" 
        />
      </div>
    </div>


    <div class="add-new-city">
      <p class="add-new-city__text">Add Location:</p>
      <div class="add-new-city-inner">
        <input 
          type="text" 
          class="input" 
          v-model="city_input"
          @keypress="addNewCityByEnter"
        >
        <button class="input-button" @click="addNewCity">
          <enter-icon class="input-button-icon icon"/>
        </button>
      </div>
    </div>
  </div>
</template>