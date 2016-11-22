<template>
	<div id="app">
		<toolbar></toolbar>
		<notes-list></notes-list>
		<notes-editor></notes-editor>
	</div>
</template>

<script>
	import Toolbar from "./Toolbar.vue";
	import NotesList from "./NotesList.vue";
	import NotesEditor from "./NotesEditor.vue";

	export default {
		components: {
			Toolbar,
			NotesList,
			NotesEditor,
		}
	}
</script>
