
import 'babel-polyfill';
import Vue from "Vue";
import store from "./vuex/store.js";
import App from "./components/App.vue";

let app = new Vue({
	el: '#app',
	store,
	render: h => h(App),
})

