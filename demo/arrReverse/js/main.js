var dlist = dataJson;

var app = new Vue({
    el: "#app",
    data: {
        dlist: [],
    },
    methods: {
        changeCheck(d) {
            var dlist = this.dlist,
                cid = d.id,
                cCheck = d.is_check;
            if (cCheck) {
                d.children && setChildCheck(d.children);
                setParentCheck(cid);
            } else {
                d.children && setChildUncheck(d.children);
                setParentUncheck(cid);
            }
            // 设置父级选择
            function setParentCheck(id) {
                var parent = getParent(id);
                if (parent) {
                    parent.is_check = true;
                    setParentCheck(parent.id);
                }
            }
            // 设置父级取消，如果父级的子集有选择，则不取消
            function setParentUncheck(id) {
                var childHasCheck = false,
                    parent = getParent(id);
                if (parent) {
                    var childlist = parent.children;
                    childlist.forEach(function(v,i) {
                        if (v.is_check)
                            childHasCheck = true;
                    });
                    if (!childHasCheck) {
                        parent.is_check = false;
                        setParentUncheck(parent.id);
                    }
                }
            }
            // 获取当前对象的父级
            function getParent(id) {
                for (var i=0; i<dlist.length; i++) {
                    if (dlist[i].id==id) {
                        return null;
                    }
                }
                return _getParent(dlist);
                function _getParent(list) {
                    var childlist,
                        isExist = false;
                    for (var i=0; i<list.length; i++) {
                        if (childlist=list[i].children) {
                            childlist.forEach(function(v,i2) {
                                if (v.id==id)
                                    isExist = true;
                            });
                            if (isExist) {
                                return list[i];
                            }
                            if (_getParent(childlist)) {
                                return _getParent(childlist);
                            }
                        }
                    };
                }
            }
            // 设置child全选
            function setChildCheck(list) {
                list.forEach(function(v,i) {
                    v.is_check = true;
                    v.children && setChildCheck(v.children);
                });
            }
            // 设置child取消
            function setChildUncheck(list) {
                list.forEach(function(v,i) {
                    v.is_check = false;
                    v.children && setChildUncheck(v.children);
                });
            }
        },
    },
    mounted() {
        function setIsOpen(list) {
            list.forEach(function(v,i) {
                v.toggleOpen = true;
                v.children && setIsOpen(v.children);
            });
        }
        setIsOpen(dlist);
        this.$nextTick(function() {
            this.dlist = dlist;
        });
    },
})