<template>
	<div id="toolbar">
		<i class="glyphicon glyphicon-plus" @click="addNote"></i>
		<i class="glyphicon glyphicon-star" :class="{starred: activeNote['favorite']}" @click="toggleFavorite"></i>
		<i class="glyphicon glyphicon-remove" @click="deleteNote"></i>
	</div>
</template>

<script>
	import { mapState, mapGetters, mapActions } from "Vuex";

	export default {
		computed: {
			...mapState({
				activeNote: state => state.activeNote,
			})
		},
		methods: {
			...mapActions({
				addNote: 'addNote',
				toggleFavorite: 'toggleFavorite',
				deleteNote: 'deleteNote',
			})
		},
	}
</script>