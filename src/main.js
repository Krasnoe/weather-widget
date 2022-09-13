import { defineCustomElement } from 'vue';
import WeatherWidget from './WeatherWidget.ce.vue';
import 'document-register-element/build/document-register-element';

const element = defineCustomElement(WeatherWidget);
customElements.define('weather-widget', element);

