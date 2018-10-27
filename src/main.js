// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
import * as firebase  from 'firebase';


// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyD__QYnBz8upLVzeqRUZnw6nikP9aKQ7j4",
  authDomain: "memorycard-f4eec.firebaseapp.com",
  databaseURL: "https://memorycard-f4eec.firebaseio.com",
  projectId: "memorycard-f4eec",
  storageBucket: "",
  messagingSenderId: "72252333592"
});


Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
});
