<template>
	<div id="notes-list">
		<div id="list-header">
			<h2>Notes | coligo</h2>
			<div class="btn-group btn-group-justified" role="group">
				<div class="btn-group" role="group">
					<button type="button" class="btn btn-default" :class="{active:isAllList}" @click="changeStatus('isAll')"> All Notes </button>
				</div>
				<div class="btn-group" role="group">
					<button type="button" class="btn btn-default" :class="{active:!isAllList}" @click="changeStatus('isFavorite')"> Favorites </button>
				</div>
			</div>
		</div>
		<div id="container">
			<div class="list-group">
				<a class="list-group-item" href="javascript:;" v-for="(v,k) in list" :class="{active: v['_rm']==activeNote['_rm']}" @click="setActiveNote({note:v})">
					<h4 class="list-group-item-heading">{{  v['text'].length>10 ? v['text'].substring(0,10) + "..." : v['text'] }}</h4>
				</a>
			</div>
		</div>
	</div>
</template>

<script>
	import {mapState, mapGetters, mapActions} from "Vuex";
	
	export default {
		data(){
			return {
				list: [],
			}
		},
		computed: {
			...mapState({
				isAllList: state => state.isAllList,
				notes: state => state.notes,
				activeNote: state => state.activeNote,
			}),
			...mapGetters({
				favoriteNotes: 'favoriteNotes',
			}),
		},
		methods: {
			...mapActions({
				setActiveNote: 'setActiveNote',
				changeListStatus: 'changeListStatus',
			}),
			changeStatus(s){
				if( s == 'isAll' ){
					this.changeListStatus({bool: true});
				}else if( s == 'isFavorite' ){
					this.changeListStatus({bool: false});
				}
			},
			changeList(){
				if( this.isAllList ){
					this.$data.list = this.notes;
				}else{
					this.$data.list = this.favoriteNotes;
				}
			},
		},
		watch: {
			notes: function(){
				this.changeList();
			},
			isAllList: function(){
				this.changeList();
			},
		},
		mounted: function(){
			this.$nextTick(function(){
				this.$data.list = this.notes;
			});
		}
	}
</script>