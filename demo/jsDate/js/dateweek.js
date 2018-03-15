/*
*   日历控件
var Dw = new DateWeek(),
    dt = new Date();
Dw.setDate(dt.getFullYear(),dt.getMonth()-0+1);
var list = Dw.getDayList(bool); //bool:true，自适应长度，会删除首/尾不是当月的一周。bool:false，固定7行*6列=42条数据
list = [
    {
        date:"2018-1-28"
        day:28
        siblings:true   //上月或者下月的日期，用于区分本月和非本月的日期
        week:0  //0:星期一，1:星期二。。。
    }
    ...
]
*/
(function(window){
    var proto = {
        getDay: function(y, m) {
            var mday = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
            if ((y % 4 == 0 && y % 100 != 0) || y % 400 == 0) //判断是否是闰月 
                mday[1] = 29;
            return mday[m - 1];
        },
        getWeek: function(y, m, d) {
            var wk;
            if (m <= 12 && m >= 1) {
                for (var i = 1; i < m; ++i) {
                    d += this.getDay(y, i);
                }
            }
            /*根据日期计算星期的公式*/
            wk = (y - 1 + (y - 1) / 4 - (y - 1) / 100 + (y - 1) / 400 + d) % 7;
            //0对应星期天，1对应星期一 
            return parseInt(wk);
        },
        getName: function(year,month,day){
            return year + "-" + month + "-" + day;
        },
        getPrev: function(y,m){
            if( m-1 == 0){
                return {
                    y: y-1,
                    m: 12,
                    d: this.getDay(y-1, 12)
                };
            }else{
                return {
                    y: y,
                    m: m-1,
                    d: this.getDay(y, m-1)
                };
            }
        },
        getNext: function(y,m){
            if( m+1 > 12 ){
                return {
                    y: y+1,
                    m: 1,
                    d: this.getDay(y+1, 1)
                };
            }else{
                return {
                    y: y,
                    m: m+1,
                    d: this.getDay(y, m+1)
                };
            };
        },
        setDay: function(date,day,siblings){
            var tmp = date.match(/\d+/gi);
            this.dayList.push({
                date: date,
                day: day,
                week: this.getWeek(+tmp[0],+tmp[1],+tmp[2]),
                siblings: !!siblings,
            })
        },
        clear: function(){
            this.dayList = [];
        },
        setDate: function(year, month){
            var cache_name = year + "-" + month;
            if (this.cache[cache_name]) {
                this.dayList = this.cache[cache_name];
                return this;
            }
            //
            this.clear();
            var name = null,
                index = 0,
                year = parseInt(year),
                month = parseInt(month),
                dayTotal = this.getDay(year, month),
                weekFirst = this.getWeek(year,month,1),
                weekLast = this.getWeek(year,month,dayTotal);
            //上月的数据
            var prev = this.getPrev(year, month),
                prevDate = prev.d - weekFirst + 1;
            for (var i=0; i<weekFirst; i++) {
                name = this.getName(prev.y, prev.m, prevDate);
                this.setDay(name,prevDate,1);
                prevDate++;
                index++;
            }
            //本月数据
            for (var i=1; i<=dayTotal; i++) {
                name = this.getName(year, month, i);
                this.setDay(name,i);
                index++;
            }
            //下月数据
            var next = this.getNext(year, month),
                day = 1;
            while (index<this.maxLen) {
                name = this.getName(next.y, next.m, day);
                this.setDay(name,day,1);
                index++;
                day++;
            };
            //缓存
            this.cache[cache_name] = JSON.parse(JSON.stringify(this.dayList));
            return this;
        },
        getDayList: function(bool) {
            var list = JSON.parse(JSON.stringify(this.dayList));
            if (bool) {
                var len = 7;
                    count = 0;
                for (var i=list.length-1; len>=1; i--,len--) {
                    if (list[i]['siblings']) {
                        count++;
                    }
                }
                if (count==7) {
                    len = 7;
                    while (len) {
                        list.pop();
                        len--;
                    }
                }
            }
            return list;
        },
        init: function(){
            this.cache = {};
            this.dayList = [];
            this.maxLen = 42;
            return this;
        }
    }
    function DateWeek(){
        return this.init();
    };
    DateWeek.prototype = proto;
    DateWeek.prototype.constructor = DateWeek;
    window.DateWeek = DateWeek;
})(window);