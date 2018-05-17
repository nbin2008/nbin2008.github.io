Vue.component('item-li', {
    template: '#item-template',
    props: ['itemData'],
    data: function() {
        return {
            pleft: "padding-left:0px;",
        }
    },
    methods: {
        countPleft() {
            var num = $(this.$el).parents(".item").length;
            this.pleft = "padding-left:"+ num*10 +"px;";
        },
        changeToggleOpen() {
            this.itemData.toggleOpen = !this.itemData.toggleOpen;
        },
        changeActive(d) {
            this.$emit('change-active', d);
        }
    },
    mounted() {
        this.$nextTick(function() {
            this.countPleft();
        });
    },
})