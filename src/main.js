import { createApp } from 'vue'
import App from './App.vue'
import {router} from "./router/index.js"
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import './style.css'
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons'


library.add(fas)

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, setUserProperties } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD5ZOEkcaN_a-RI3t398_-yC7cLz8guhqs",
    authDomain: "aim-mvp-6dea5.firebaseapp.com",
    projectId: "aim-mvp-6dea5",
    storageBucket: "aim-mvp-6dea5.appspot.com",
    messagingSenderId: "343297636275",
    appId: "1:343297636275:web:56b3a9e5a9bf84bce8fdc6",
    measurementId: "G-ZEVVQLBFM8"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const vapp = createApp(App)

vapp.use(router)

vapp.component('font-awesome-icon', FontAwesomeIcon).mount('#app')