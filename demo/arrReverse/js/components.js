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
            this.pleft = "padding-left:"+ num*20 +"px;";
        },
        changeToggleOpen() {
            this.itemData.toggleOpen = !this.itemData.toggleOpen;
        },
        changeCheck(d) {
            this.$nextTick(function() {
                this.$emit("change-check", d)
            });
        },
    },
    mounted() {
        this.$nextTick(function() {
            this.countPleft();
        });
    },
})