(function(window,$){
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
		getLast: function(y,m){
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
		setDay: function(name,day,index,siblings){
			var $div = this.$obj.find("div");
			$div.eq(index).text(day).attr("name",name);
			siblings && $div.eq(index).addClass("siblings");
		},
		clearDiv: function(){
			var $div = this.$obj.find("div");
			$div.removeAttr("name").removeClass().text('');
		},
		setDate: function(year, month){
			this.clearDiv();
			var year = parseInt(year);
			var month = parseInt(month);
			var $div = this.$obj.find("div");
			var dayNumber = this.getDay(year, month);
			var firstNumber = this.getWeek(year,month,1);
			var lastNumber = this.getWeek(year,month,dayNumber);
			var weekNumber = (dayNumber - (7 - (firstNumber==0?7:firstNumber) ) - (lastNumber + 1)) / 7;
			var day = 1;
			var index = 0;
			var name;
			var last = this.getLast(year, month);
			var lastDay = last.d - firstNumber + 1;
			for( var i=0; i<firstNumber; i++ ){
				name = this.getName(last.y, last.m, lastDay);
				this.setDay(name,lastDay,index,1);
				lastDay++;
				index++;
			};
			if( firstNumber == 0 ){
				lastDay = last.d - 7 + 1;
				for( var i=0; i<7; i++ ){
					name = this.getName(last.y, last.m, lastDay);
					this.setDay(name,lastDay,index,1);
					lastDay++;
					index++;
				};
				weekNumber--;
			};
			for( i= firstNumber; i<7; i++ ){
				name = this.getName(year,month,day);
				this.setDay(name,day,index);
				index++;
				day++;
			};
			for( i=0; i<weekNumber; i++ ){
				for( var k=0; k<7; k++){
					name = this.getName(year,month,day);
					this.setDay(name,day,index);
					day++;
					index++;
				};
			};
			for( i=0; i<lastNumber+1; i++ ){
				name = this.getName(year,month,day);
				this.setDay(name,day,index);
				index++;
				day++;
			};
			var next = this.getNext(year,month);
			day = 1;
			while( $div[index] ){
				name = this.getName(next.y, next.m, day);
				this.setDay(name,day,index,1);
				day++;
				index++;
			};
			return this;
		},
		init: function($obj){
			this.$obj = $obj;
			return this;
		}
	}
	function DateWeek($obj){
		return this.init($obj);
	};
	DateWeek.prototype = proto;
	DateWeek.prototype.constructor = DateWeek;
	window.DateWeek = DateWeek;
})(window,jQuery);
