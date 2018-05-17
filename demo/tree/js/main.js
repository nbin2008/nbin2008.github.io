var dlist = dataJson;

var app = new Vue({
    el: "#app",
    data: {
        dlist: [],
        departmentId: "",
    },
    methods: {
        changeActive(d) {
            if (d.active) return;
            this.departmentId = d.id;
            this.resetActive(this.dlist);
            d.active = true;
        },
        resetActive(tlist) {
            var _self = this;
            tlist.forEach(function(v,i) {
                v.active = false;
                if (v.child) {
                    _self.resetActive(v.child);
                }
            });
        },
        render_department(list) {
            var _self = this,
                tmpObj = null;
            function setIsOpen(list) {
                list.forEach(function(v,i) {
                    v.toggleOpen = false;
                    v.active = false;
                    if (_self.departmentId==v.id) {
                        tmpObj = v;
                    }
                    if (v.child) {
                        if (_self.departmentId && checkOpen(v.child)) {
                            v.toggleOpen = true;
                        }
                        setIsOpen(v.child);
                    }
                });
            }
            // 更新后，要刷新原来的list，此方法用来保持原来的展开
            function checkOpen(list) {
                var childCheck = false;
                for (var i=0; i<list.length; i++) {
                    if (list[i].id==_self.departmentId) {
                        return true;
                    }
                    if (list[i].child && !childCheck) {
                        childCheck = checkOpen(list[i].child);
                    }
                }
                if (childCheck)
                    return true;
                else
                    return false;
            }
            setIsOpen(list);
            this.dlist = list;
            if (tmpObj) {
                this.changeActive(tmpObj);
            } else {
                this.dlist[0] && this.changeActive(this.dlist[0]);
            }
        },
        initBindSpop() {
            var _self = this;
            $('body').on('click.ss', function(e) {
                $target = $(e.target);
                if ($target.hasClass("fa-align-justify")) {
                    $('.anddelete').not( $target.parent().siblings(".anddelete") ).hide();
                    $target.parent().siblings(".anddelete").toggle();
                } else if ($target.parent().hasClass('anddelete')) {
                    var tp = $target.attr("data-tp"),
                        did = $target.parent().attr("did");
                    _self.did = did;
                    _self.sPopEvent(tp);
                    $('.anddelete').hide();
                } else {
                    $('.anddelete').hide();
                }
            });
        },
        sPopEvent(tp) {
            switch (tp) {
                case "1":
                    // this.popDeparOpen();
                    console.log("添加部门");
                    break;
                case "2":
                    console.log("重命名");
                    // this.popDeparUpdateOpen();
                    break;
                case "3":
                    console.log("删除");
                    // this.ajax_removeDepar();
                    break;
                default:
                    break;
            }
        },
    },
    mounted() {
        this.$nextTick(function() {
            this.initBindSpop();
            this.render_department( dlist );
        });
    },
})