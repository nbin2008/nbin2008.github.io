import Vue from "Vue";
import Vuex from "Vuex";

Vue.use(Vuex);

const changeListStatus = "changeListStatus";
const addNote = "addNote";
const editNote = "editNote";
const deleteNote = "deleteNote";
const toggleFavorite = "toggleFavorite";
const setActiveNote = "setActiveNote";

const state = {
	isAllList: true,
	notes: [],
	activeNote: {},
}

const mutations = {
	[changeListStatus](state,bool){
		state.isAllList = bool;
	},
	[addNote](state) {
		const newNote = {
	    	text: 'New note',
	      	favorite: !state.isAllList,
	      	_rm: Math.random(),
	    }
	    state.notes.push(newNote);
	    state.activeNote = newNote;
	},
	[editNote](state, text) {
		state.activeNote.text = text;
	},
	[deleteNote](state){
		let rm = state.activeNote['_rm'];
		let index = state.notes.findIndex(function(v,i){
			if( rm == v['_rm'] ) return true;
			return false;
		});
		if(index >= 0) state.notes.splice(index, 1);
		state.activeNote = state.notes[0] || {};
	},
	[toggleFavorite](state){
		state.activeNote['favorite'] = !state.activeNote['favorite']
	},
	[setActiveNote](state,note){
		state.activeNote = note;
	},
}

const actions = {
	[changeListStatus]({commit},{bool}){
		commit('changeListStatus', bool);
	},
	[addNote]({commit}) {
		commit('addNote');
	},
	[editNote]({commit},{text}){
		commit('editNote',text);
	},
	[deleteNote]({commit}){
		commit('deleteNote');
	},
	[toggleFavorite]({commit}){
		commit('toggleFavorite');
	},
	[setActiveNote]({commit},{note}){
		commit('setActiveNote',note);
	},
}

const getters = {
	favoriteNotes: state => {
		return state.notes.filter( (v,i) => v['favorite'] );
	},
}

export default new Vuex.Store({
	state,
	mutations,
	actions,
	getters,
})


