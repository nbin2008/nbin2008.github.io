define(function(require,exports,module){
    function ajaxEvent(url,param,callback,errCallback){
        $.ajax({
            type: 'post',
            url: url,
            data: param,
            success: function(data){
                console.log(url);
                console.log(data);
                if( data['code'] == 0 ){
                    callback && callback(data);
                }else{
                    errCallback && errCallback(data);
                };
            }
        });
    };
    function newObj(obj){
        return JSON.parse(JSON.stringify(obj));
    };
//检测val，只能为正数字
    function testVal(val){
        return  val=='' || (!isNaN(val) && val>=0) ? true : false;
    };
//用于过滤生成isChooseData
    function filterData(){
        var tj = {};
        for( var k in unChooseData ){
            if( !Array.isArray(unChooseData[k]) ) continue;
            if( !tj[k] ) tj[k] = [];
            if( k == specialType ){
                for( var i= 0,len=unChooseData[k].length; i<len; i++ ){
                    var v = unChooseData[k][i];
                    if( v['checkNums'] == 1 && v['isAllCheck'] == 1 ){
                        //全选
                        var v2 = v['childList'];
                        for( var j= 1,len2=v2.length; j<len2; j++ ){
                            tj[k].push({
                                dictName: v2[j]['dictName'],
                                profileType: v2[j]['profileType'],
                                id: v2[j]['id'],
                                dictCode: v2[j]['dictCode'],
                                i: i,
                                i2: j,
                                tgiStart: v2[j]['tgiStart'],
                                tgiEnd: v2[j]['tgiEnd'] || ''
                            });
                        };
                    }else if( v['checkNums'] > 0 && v['isAllCheck'] == null ){
                        //非全选
                        var v2 = v['childList'];
                        for( var j= 1,len2=v2.length; j<len2; j++ ){
                            if( v2[j]['checked'] == 1 ){
                                tj[k].push({
                                    dictName: v2[j]['dictName'],
                                    profileType: v2[j]['profileType'],
                                    id: v2[j]['id'],
                                    dictCode: v2[j]['dictCode'],
                                    i: i,
                                    i2: j,
                                    tgiStart: v2[j]['tgiStart'],
                                    tgiEnd: v2[j]['tgiEnd'] || ''
                                });
                            };
                        };
                    };
                };
            }else{
                for( var i= 0,len=unChooseData[k].length; i<len; i++ ){
                    var v = unChooseData[k][i];
                    if( i == 0 && v['checkNums'] == 1 ){
                        //判断总全选
                        tj[k].push({
                            dictName: typeNames[k],
                            profileType: v['profileType'],
                            id: v['id'],
                            dictCode: v['dictCode'],
                            isAllCheck: v['isAllCheck'] || null,
                            i: i
                        });
                        break;
                    }else if( v['checkNums'] > 0 && v['isAllCheck'] == null && Array.isArray(v['childList']) ){
                        //判断2级
                        var v2 = v['childList'];
                        for( var j=1,len2=v2.length; j<len2; j++ ){
                            if( v2[j]['checked'] == 1 ){
                                tj[k].push({
                                    dictName: v2[j]['dictName'],
                                    profileType: v2[j]['profileType'],
                                    id: v2[j]['id'],
                                    dictCode: v2[j]['dictCode'],
                                    isAllCheck: v2[j]['isAllCheck'] || null,
                                    i: i,
                                    i2: j
                                });
                            };
                        };
                    }else if( v['checkNums'] > 0 ){
                        //全选，单选
                        tj[k].push({
                            dictName: v['dictName'],
                            profileType: v['profileType'],
                            id: v['id'],
                            dictCode: v['dictCode'],
                            isAllCheck: v['isAllCheck'] || null,
                            i: i
                        });
                    }
                };
            };
        };
        return tj;
    };
//检测全部选中，如果全部选中了，1级按钮为全选状态，1级和2级点击都要调用,没有全部按钮的不调用
    function fnCheckData(){
        var data = unChooseData[unChooseType];
        if( data[0]['dictCode'] != allChoose ) return false;
        var re = true;
        for( var i= 1, len=data.length; i<len; i++ ){
            if( Array.isArray(data[i]['childList']) && data[i]['isAllCheck'] == null ){
                re = false;
                break;
            }else if( data[i]['checkNums'] != 1 ){
                re = false;
                break;
            };
        };
        if( !re ) return false;
        fnAllChoose1();
    };
//1级全选共用
    function fnAllChoose1(){
        var data = unChooseData[unChooseType];
        for( var i= 0,len=data.length; i<len; i++ ){
            if( i == 0 ){
                data[i]['isAllCheck'] = 1;
                data[i]['checkNums'] = 1;
            }else{
                data[i]['isAllCheck'] = null;
                data[i]['checkNums'] = 0;
                if( Array.isArray(data[i]['childList']) ){
                    for( var j= 0,len2=data[i]['childList'].length; j<len2; j++ ){
                        data[i]['childList'][j]['checked'] = 0;
                    };
                };
            };
        };
        hideDetail();
    };
//获取position位置
    function getPosition(self){
        var $parent = $('#people-pop-unChoose-box');
        getPosition.pLeft = $parent.offset()['left'];
        getPosition.pTop = $parent.offset()['top']
        var selfLeft = $(self).offset()['left'],
            selfTop = $(self).offset()['top'],
            disLeft = selfLeft - getPosition.pLeft + $(self).outerWidth() + 10 ,
            disTop = selfTop - getPosition.pTop + $(self).outerHeight() - 30;
        positionMsg = {left: disLeft, top: disTop};
    };
//设置提交ajax数据
    function getAjaxData(){
        var tj = {};
        for( var k in isChooseData ){
            if( !tj[k] ){
                tj[k] = {
                    profileType: [],
                    id: [],
                    code: []
                };
            };
            var data = isChooseData[k];
            if( k == specialType ){
                for( var j = 0,len=data.length; j<len; j++ ){
                    tj[k]['profileType'].push( data[j]['profileType'] );
                    tj[k]['id'].push( data[j]['id'] + '|' + data[j]['tgiStart'] + '-' + data[j]['tgiEnd'] );
                    tj[k]['code'].push( data[j]['dictCode'] );
                };
            }else{
                for( var j= 0,len=data.length; j<len; j++ ){
                    if( data[j]['isAllCheck'] == 1 ){
                        //全选，需要遍历unChooseData数据看是否有childList
                        if( unChooseData[k][data[j]['i']]['childList'] == null ){
                            tj[k]['profileType'].push( data[j]['profileType'] );
                            tj[k]['id'].push( data[j]['id'] );
                            tj[k]['code'].push( data[j]['dictCode'] );
                        }else{
                            for( var z= 1, len2=unChooseData[k][data[j]['i']]['childList'].length; z<len2; z++ ){
                                tj[k]['profileType'].push( unChooseData[k][data[j]['i']]['childList'][z]['profileType'] );
                                tj[k]['id'].push( unChooseData[k][data[j]['i']]['childList'][z]['id'] );
                                tj[k]['code'].push( unChooseData[k][data[j]['i']]['childList'][z]['dictCode'] );
                            };
                        };
                    }else{
                        tj[k]['profileType'].push( data[j]['profileType'] );
                        tj[k]['id'].push( data[j]['id'] );
                        tj[k]['code'].push( data[j]['dictCode'] );
                    };
                };
            };
            if( len > 0 ){
                tj[k]['profileType'] = tj[k]['profileType'][0];
            }else{
                delete tj[k];
            };
        };
        return tj;
    };
    /* END 方法函数 */

    var queryAllProfileUrl = 'http://localhost:8085/profileDict/queryAllProfile',
    //editMyProfile = 'http://localhost:8085/profileDict/editMyProfile?crowId=10';
        editMyProfileUrl = 'http://localhost:8085/profileDict/editMyProfile',
        saveMyCrowdUrl = 'http://localhost:8085/myCrowds/saveMyCrowd',
        updateMyCrowdUrl = 'http://localhost:8085/myCrowds/updateMyCrowd';

    var $obj,
        vmPop,
        address = 'http://www.hui12.com/', //提交后成功后跳转地址
        $detailBox,
        specialType = 'behavior', //特殊参考
        typeNames = {
            gender: '全部性别',
            region: '全部地域',
            brand: '全部设备',
            operator: '全部运营商'
        },
        textErr = '只能输入正数字',
        positionMsg = {
            left: 0,
            top: 0
        },
        isAgainVisit = false, //判断是否回填
        unChooseType, //点击按钮的类型
        index1, //一级按钮的index
        index2, //二级按钮的index
        allChoose = '-999', //全部按钮的dictCode
        unChooseData, //当前待选标签数据
        isChooseData, //已选标签数据
        cacheDataOriginal; //填写数据备份

    $.get('peoplePop.html',function(data){
        $obj = $(data);
        $('body').append($obj);
        $detailBox = $('#people-pop-detail-box');
        getHtmlCallback();
    });
    function getHtmlCallback(){
        vmPop = avalon.define({
            $id: 'vmPeoplePop',
            toggleShade: false,
            toggleDetail: false,
            togglePeopleBox: true,
            toggleNameBox: false,
            allChoose: allChoose,
            unChooseData: {
                gender: [],
                region: [],
                brand: [],
                operator: [],
                behavior: []
            },
            isChooseData: {
                gender: [],
                region: [],
                brand: [],
                operator: [],
                behavior: []
            },
            childList: [],
            nameVal: '',
            hidePeopleBox: function(){
                vmPop.toggleShade = false;
            },
            showNameBox: function(){
                vmPop.togglePeopleBox = false;
                vmPop.toggleNameBox = true;
            },
            hideNameBox: function(){
                vmPop.nameVal = '';
                vmPop.togglePeopleBox = true;
                vmPop.toggleNameBox = false;
            },
            fnSubmit: function(){
                var crowdName = $.trim(vmPop.nameVal);
                if( crowdName == '' ){
                    alert('请输入姓名');
                    return false;
                }
                var msg = getAjaxData();
                var url, param;
                if( isAgainVisit ){
                    url = updateMyCrowdUrl;
                    param = {
                        crowdName: crowdName,
                        crowId: unChooseData['crowId'],
                        crowdRef: JSON.stringify(msg)
                    }
                }else{
                    url = saveMyCrowdUrl;
                    param = {
                        crowdName: crowdName,
                        crowdRef: JSON.stringify(msg)
                    }
                };
                vmPop.hidePeopleBox();
            },
            //滚轮事件
            fnScroll: function(){
                hideDetail();
            },
            //一级按钮
            unChooseClick: function(e){
                getPosition(this);
                unChooseType = $(this).closest('li[unChooseType]').attr('unChooseType');
                index1 = $(this).attr('index');
                unChooseClickCallback();
            },
            //二级按钮
            unChooseDetailClick: function(){
                index2 = $(this).attr('index');
                unChooseDetailClickCallback();
            },
            //已选标签删除
            removeTag: function(){
                removeTagCallback({
                    isChooseType: $(this).attr('isChooseType'),
                    i: $(this).attr('i'),
                    i2: $(this).attr('i2')
                });
            },
            //针对行为偏好，tgi改变调用
            tgiChange: function(){
                tgiChangeCallback.call(this);
            },
            //关闭detailBox
            detailClose: function(){
                hideDetail();
            },
            detailReset: function(){
                detailResetCallback();
            },
            resetData: function(){
                resetData();
            }
        });
        avalon.scan();
        getCacheDataOriginal();
    };

//tgi改变回调
    function tgiChangeCallback(){
        var $input1,
            $input2,
            val1,
            val2,
            $this = $(this),
            thisIndex = $this.index(),
            $siblings = $this.siblings('input'),
            siblingsIndex = $siblings.index(),
            val = $this.val(),
            siblingsVal = $siblings.val(),
            $a = $this.prevAll('a[ischoosetype]'),
            i = $a.attr('i'),
            i2 = $a.attr('i2'),
            type = $a.attr('isChooseType');
        if( !testVal(val) ){
            alert(textErr);
            $this.val('');
            val = '';
        };
        val = val===''?'':parseFloat(val);
        siblingsVal = siblingsVal===''?'':parseFloat(siblingsVal);
        //给input标识顺序
        if( thisIndex < siblingsIndex ){
            $input1 = $this;
            $input2 = $siblings;
        }else{
            $input1 = $siblings;
            $input2 = $this;
        };
        //给val排序
        if( val==='' && (siblingsVal === '') ){
            val1 = siblingsVal;
            val2 = val;
        }else if( !(val==='') && siblingsVal==='' ){
            val1 = val;
            val2 = siblingsVal;
        }else if( val < siblingsVal && !(val === '') ){
            val1 = val;
            val2 = siblingsVal;
        }else{
            val1 = siblingsVal;
            val2 = val;
        };
        $input1.val(val1);
        $input2.val(val2);
        unChooseData[type][i]['childList'][i2]['tgiStart'] = val1;
        unChooseData[type][i]['childList'][i2]['tgiEnd'] = val2;
        refreshData();
    };
//已选标签删除回调
    function removeTagCallback(param){
        //hideDetail();
        var type = param['isChooseType'],
            i = param['i'],
            i2 = param['i2'];
        if( type == specialType ){
            resetTgi({type: type, i: i, i2: i2});
            var data = unChooseData[type][i];
            var num = 0,
                v2 = data['childList'];
            if( data['isAllCheck'] == 1 ){
                //从全选状态开始
                data['isAllCheck'] = null;
                v2[0]['checked'] = 0;
                for( var j= 1,len=v2.length; j<len; j++ ){
                    if( j == i2 ){
                        v2[j]['checked'] = 0;
                    }else{
                        v2[j]['checked'] = 1;
                        num++;
                    };
                };
                data['checkNums'] = num;
            }else{
                v2[i2]['checked'] = 0;
                for( var j= 1,len=v2.length; j<len; j++ ){
                    if( v2[j]['checked'] == 1 ) num++;
                };
                data['checkNums'] = num;
            };
        }else{
            if( i2 == null ){
                //单选，2级全选
                unChooseData[type][i]['checkNums'] = 0;
                unChooseData[type][i]['isAllCheck'] = null;
                if( Array.isArray(unChooseData[type][i]['childList']) ){
                    unChooseData[type][i]['childList'].forEach(function(v,i){
                        v['checked'] = 0;
                    });
                };
            }else{
                //2级单选,并且要更新1级的checkNums
                unChooseData[type][i]['childList'][i2]['checked'] = 0;
                var num = 0;
                for( var j= 1,len=unChooseData[type][i]['childList'].length; j<len; j++ ){
                    if( unChooseData[type][i]['childList'][j]['checked'] == 1 ) num++;
                };
                unChooseData[type][i]['checkNums'] = num;
            };
        };

        refreshDetailData();
        refreshData();
    };
//一级按钮点击回调
    function unChooseClickCallback(){
        var data = unChooseData[unChooseType];
        if( data[index1]['dictCode'] == allChoose && data[index1]['isAllCheck'] == null ){
            //全选
            fnAllChoose1();
        }else if( data[index1]['dictCode'] == allChoose && data[index1]['isAllCheck'] == 1 ){
            //取消全选
            data[index1]['isAllCheck'] = null;
            data[index1]['checkNums'] = 0;
        }else if( !Array.isArray(data[index1]['childList']) && data[index1]['checkNums'] == 0 ){
            //普通的，没有2级,选中,并且取消对应全选状态,并且隐藏2级窗口
            data[index1]['checkNums'] = 1;
            data[0]['isAllCheck'] = null;
            data[0]['checkNums'] = 0;
            hideDetail();
        }else if( !Array.isArray(data[index1]['childList']) && data[index1]['checkNums'] == 1 ){
            //普通的，没有2级，取消选中，并且隐藏2级窗口
            data[index1]['checkNums'] = 0;
            hideDetail();
        }else if( Array.isArray(data[index1]['childList']) ){
            //有2级菜单
            showDetail();
        };

        fnCheckData();
        refreshData();
    };
//二级按钮点击回调
    function unChooseDetailClickCallback(){
        //只要有点击，就是取消1级的全选状态，行为偏好没有全选不调用
        if( unChooseType != specialType ){
            unChooseData[unChooseType][0]['isAllCheck'] = null;
            unChooseData[unChooseType][0]['checkNums'] = 0;
        };
        //如果是行为偏好的，需要重置对应的tgi
        var dataP = unChooseData[unChooseType][index1],
            dataC = dataP['childList'];
        if( dataC[index2]['dictCode'] == allChoose && dataP['isAllCheck']==null ){
            //全选
            fnAllChoose2();
        }else if( dataC[index2]['dictCode'] == allChoose && dataP['isAllCheck']==1 ){
            //取消全选
            resetTgi({type: unChooseType,i:index1});
            dataP['checkNums'] = 0;
            dataP['isAllCheck'] = null;
            dataC[index2]['checked'] = 0;
        }else if( dataC[index2]['dictCode'] != allChoose && dataC[index2]['checked'] == 0 ){
            //单选,会取消全选,并且要统计选中的个数 dataP['checkNums'],如果全部全中，则全选状态
            dataP['isAllCheck'] = null;
            dataC[0]['checked'] = 0;
            dataC[index2]['checked'] = 1;
            var num = 0;
            var total = 0;
            for( var i= 1,len=dataC.length; i<len; i++ ){
                total++;
                if( dataC[i]['checked'] == 1 ) num++;
            };
            if( num == total ){
                //全选
                fnAllChoose2();
            }else{
                //非全选
                dataP['checkNums'] = num;
            };
        }else if( dataC[index2]['dictCode'] != allChoose && dataC[index2]['checked'] == 1 ){
            //取消单选, 并且要统计选中的个数 dataP['checkNums']
            resetTgi({type: unChooseType, i: index1, i2: index2});
            dataC[index2]['checked'] = 0;
            var num = 0;
            for( var i= 1,len=dataC.length; i<len; i++ ){
                if( dataC[i]['checked'] == 1 ) num++;
            };
            dataP['checkNums'] = num;
        };

        //2级全选共用
        function fnAllChoose2(){
            dataP['checkNums'] = 1;
            dataP['isAllCheck'] = 1;
            for( var i= 0,len=dataC.length; i<len; i++ ){
                if( i == 0 ){
                    dataC[i]['checked'] = 1;
                }else{
                    dataC[i]['checked'] = 0;
                };
            };
        };
        fnCheckData();
        refreshData();
        refreshDetailData();
    };
//重置tgi
    function resetTgi(param){
        //param = {type: type, i: i, i2: i2}
        //type,i为必填参数，如果只存在i，重置一例，存在i2，则重置对应的
        //1、点击全选按钮，全选状态，不做任何处理
        //2、点击全选按钮，取消全选状态，重置这一例的tgi
        //3、点击单个按钮，取消选中状态，对应重置tgi
        //4、点击detailbox的重置按钮，重置这一例的tgi
        //5、从已选标签中删除，重置对应的tgi
        var type = param['type'],
            i = param['i'],
            i2 = param['i2'];
        var data = unChooseData[type][i]['childList'];
        if( i2 == null ){
            data.forEach(function(v,i){
                v['tgiStart'] = 1;
                v['tgiEnd'] = '';
            });
        }else{
            data[i2]['tgiStart'] = 1;
            data[i2]['tgiEnd'] = '';
        };
    };
//点击detailbox上的重置按钮
    function detailResetCallback(){
        var data = unChooseData[unChooseType][index1];
        data['isAllCheck'] = null;
        data['checkNums'] = 0;
        data['childList'].forEach(function(v,i){
            v['checked'] = 0;
        });
        resetTgi({type: unChooseType, i: index1});
        refreshDetailData();
        refreshData();
    };
//显示2级菜单，刷新数据，更新位置
    function showDetail(){
        refreshDetailData();
        $detailBox.css({
            left: positionMsg['left'],
            top: positionMsg['top']
        });
        vmPop.toggleDetail = true;
    };
//隐藏2级菜单
    function hideDetail(){
        vmPop.toggleDetail = false;
    };
//获取原始数据结构
    function getCacheDataOriginal(){
        require('./4aData');
        cacheDataOriginal = newObj(JSON.parse(a1));
        unChooseData = newObj(cacheDataOriginal);
        refreshData();
    };
//获取填充的数据结构
    function getCacheDataFill(param){
        //var param = {crowId: 10};
        unChooseData = newObj(JSON.parse(a2));
        vmPop.nameVal = unChooseData['crowName'] || '';
        refreshData();
    };

//刷新view
    function refreshDetailData(){
        if( !unChooseType ) return false;
        vmPop.childList = newObj( unChooseData[unChooseType][index1]['childList'] );
    };
    function refreshData(){
        vmPop.unChooseData = newObj(unChooseData);
        isChooseData = filterData();
        vmPop.isChooseData = newObj(isChooseData);
    };
//重置view
    function resetData(){
        if( !cacheDataOriginal ) return false;
        unChooseData = newObj(cacheDataOriginal);
        vmPop.unChooseData = newObj(unChooseData);
        isChooseData = filterData();
        vmPop.isChooseData = newObj(isChooseData);
        hideDetail();
        vmPop.hideNameBox();
    };
    module.exports = {
        openPop: function(param){
            if( !$obj ){
                var caller = arguments.callee;
                setTimeout(function(){
                    caller(param);
                },50);
                return false;
            };
            resetData();
            isAgainVisit = false;
            vmPop.toggleShade = true;
            if( param && param['address'] ) address = param['address'];
            if( param && param['crowId'] ){
                isAgainVisit = true;
                getCacheDataFill({crowId: param['crowId']});
            };
        }
    };
});
/*
 * param参数
 * {
 *   address: 保存成功后的跳转地址
 *   crowId: 33
 * }
 * */