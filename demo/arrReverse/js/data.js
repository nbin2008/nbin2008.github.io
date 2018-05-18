var dataJson = [{
    "id": 1,
    "parent_id": 0,
    "permission_name": "基础办公",
    "router": "*",
    "icon_name": "bullseye",
    "menu_name": "基础办公",
    "is_show": 1,
    "slug": "admin.basic.work.*",
    "created_at": "2018-04-04 06:33:21",
    "updated_at": "2018-04-04 06:33:21",
    "pivot": {
        "education_id": 2,
        "menu_id": 1
    },
    "is_check": false,
    "children": [{
        "id": 2,
        "parent_id": 1,
        "permission_name": "公文管理",
        "router": "notice",
        "icon_name": "circle-o",
        "menu_name": "公文管理",
        "is_show": 1,
        "slug": "admin.basic.work.noticmanage",
        "created_at": "2018-04-04 06:34:13",
        "updated_at": "2018-04-04 06:34:13",
        "pivot": {
            "education_id": 2,
            "menu_id": 2
        },
        "is_check": false,
        "children": [{
            "id": 212,
            "parent_id": 1,
            "permission_name": "公文管理",
            "router": "notice",
            "icon_name": "circle-o",
            "menu_name": "公文管理",
            "is_show": 1,
            "slug": "admin.basic.work.noticmanage",
            "created_at": "2018-04-04 06:34:13",
            "updated_at": "2018-04-04 06:34:13",
            "pivot": {
                "education_id": 2,
                "menu_id": 2
            },
            "is_check": false
        }, {
            "id": 131,
            "parent_id": 1,
            "permission_name": "公告管理",
            "router": "inform",
            "icon_name": "desktop",
            "menu_name": "公告管理",
            "is_show": 1,
            "slug": "admin.basic.work.inform",
            "created_at": null,
            "updated_at": null,
            "pivot": {
                "education_id": 2,
                "menu_id": 13
            },
            "is_check": false
        }]
    }, {
        "id": 13,
        "parent_id": 1,
        "permission_name": "公告管理",
        "router": "inform",
        "icon_name": "desktop",
        "menu_name": "公告管理",
        "is_show": 1,
        "slug": "admin.basic.work.inform",
        "created_at": null,
        "updated_at": null,
        "pivot": {
            "education_id": 2,
            "menu_id": 13
        },
        "is_check": false,
        "children": [{
            "id": 213,
            "parent_id": 1,
            "permission_name": "公文管理",
            "router": "notice",
            "icon_name": "circle-o",
            "menu_name": "公文管理",
            "is_show": 1,
            "slug": "admin.basic.work.noticmanage",
            "created_at": "2018-04-04 06:34:13",
            "updated_at": "2018-04-04 06:34:13",
            "pivot": {
                "education_id": 2,
                "menu_id": 2
            },
            "is_check": false
        }, {
            "id": 132,
            "parent_id": 1,
            "permission_name": "公告管理",
            "router": "inform",
            "icon_name": "desktop",
            "menu_name": "公告管理",
            "is_show": 1,
            "slug": "admin.basic.work.inform",
            "created_at": null,
            "updated_at": null,
            "pivot": {
                "education_id": 2,
                "menu_id": 13
            },
            "is_check": false
        }]
    }]
}, {
    "id": 3,
    "parent_id": 0,
    "permission_name": "系统设置",
    "router": "*",
    "icon_name": "certificate",
    "menu_name": "系统设置",
    "is_show": 1,
    "slug": "admin.system.*",
    "created_at": "2018-04-04 06:35:03",
    "updated_at": "2018-04-04 06:35:03",
    "pivot": {
        "education_id": 2,
        "menu_id": 3
    },
    "is_check": false,
    "children": [{
        "id": 17,
        "parent_id": 3,
        "permission_name": "权限设置",
        "router": "role",
        "icon_name": "address-book-o",
        "menu_name": "权限设置",
        "is_show": 1,
        "slug": "admin.system.permission",
        "created_at": null,
        "updated_at": null,
        "pivot": {
            "education_id": 2,
            "menu_id": 17
        },
        "is_check": false
    }]
}, {
    "id": 5,
    "parent_id": 0,
    "permission_name": "数据统计",
    "router": "*",
    "icon_name": "certificate",
    "menu_name": "数据统计",
    "is_show": 1,
    "slug": "admin.data.statistics.*",
    "created_at": "2018-04-12 09:14:24",
    "updated_at": "2018-04-12 09:14:24",
    "pivot": {
        "education_id": 2,
        "menu_id": 5
    },
    "is_check": false,
    "children": [{
        "id": 6,
        "parent_id": 5,
        "permission_name": "学校基础信息统计",
        "router": "data\/edu",
        "icon_name": "hand-rock-o",
        "menu_name": "学校基础信息统计",
        "is_show": 1,
        "slug": "admin.data.statistics.school",
        "created_at": "2018-04-12 09:15:20",
        "updated_at": "2018-04-12 09:15:20",
        "pivot": {
            "education_id": 2,
            "menu_id": 6
        },
        "is_check": false
    }, {
        "id": 7,
        "parent_id": 5,
        "permission_name": "学校平台情况统计",
        "router": "history\/data",
        "icon_name": "hand-rock-o",
        "menu_name": "学校平台情况统计",
        "is_show": 1,
        "slug": "admin.data.statistics.platform",
        "created_at": "2018-04-18 10:49:27",
        "updated_at": "2018-04-18 10:49:27",
        "pivot": {
            "education_id": 2,
            "menu_id": 7
        },
        "is_check": false
    }]
}, {
    "id": 15,
    "parent_id": 0,
    "permission_name": "部门管理",
    "router": "*",
    "icon_name": "address-book-o",
    "menu_name": "部门管理",
    "is_show": 1,
    "slug": "admin.department.*",
    "created_at": null,
    "updated_at": null,
    "pivot": {
        "education_id": 2,
        "menu_id": 15
    },
    "is_check": false,
    "children": [{
        "id": 16,
        "parent_id": 15,
        "permission_name": "组织架构",
        "router": "department",
        "icon_name": "desktop",
        "menu_name": "组织架构",
        "is_show": 1,
        "slug": "admin.department.manage",
        "created_at": null,
        "updated_at": null,
        "pivot": {
            "education_id": 2,
            "menu_id": 16
        },
        "is_check": false
    }]
}, {
    "id": 18,
    "parent_id": 0,
    "permission_name": "控制台",
    "router": "*",
    "icon_name": "desktop",
    "menu_name": "控制台",
    "is_show": 1,
    "slug": "admin.console.*",
    "created_at": null,
    "updated_at": null,
    "pivot": {
        "education_id": 2,
        "menu_id": 18
    },
    "is_check": false,
    "children": [{
        "id": 19,
        "parent_id": 18,
        "permission_name": "教育局管理",
        "router": "education",
        "icon_name": "address-book-o",
        "menu_name": "教育局管理",
        "is_show": 1,
        "slug": "admin.console.edumanage",
        "created_at": null,
        "updated_at": null,
        "pivot": {
            "education_id": 2,
            "menu_id": 19
        },
        "is_check": false
    }, {
        "id": 20,
        "parent_id": 18,
        "permission_name": "目录管理",
        "router": "menus",
        "icon_name": "certificate",
        "menu_name": "目录管理",
        "is_show": 1,
        "slug": "admin.console.menumanage",
        "created_at": null,
        "updated_at": null,
        "pivot": {
            "education_id": 2,
            "menu_id": 20
        },
        "is_check": false
    }]
}]