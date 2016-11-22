<template>
	<div id="note-editor">
		<textarea class="form-control" v-model="textVal" @change="editNote({text: textVal})"></textarea>
	</div>
</template>

<script>
	import {mapState, mapGetters, mapActions} from "Vuex";

	export default {
		data(){
			return {
				textVal: ""
			}
		},
		computed: {
			...mapState({
				activeNote: state => state.activeNote,
			})
		},
		methods: {
			...mapActions({
				editNote: 'editNote',
			}),
		},
		watch: {
			activeNote: function(){
				this.$data.textVal = this.activeNote['text'];
			},
		}
	}
</script>