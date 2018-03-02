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
			$div.eq(index).attr("name",name).html("<span>"+ day +"</span>");
			siblings && $div.eq(index).addClass("siblings");
		},
		clearDiv: function(){
			var $div = this.$obj.find("div");
			$div.removeAttr("name").removeClass().html('');
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

/*
 * 针对项目的封装
 */
(function(window, $){
	function DateWeek2(e){
		this.init(e);
	};
	var proto = {
		init: function(e){
			this.before(e);
			this.createDom(e);
			this.main(e);
		},
		before: function(e){
			this.$parent = e.obj;
			var dayState = {};
			for( var k in e.dayState ){
				dayState[k] = {};
				dayState[k]['big'] = e.dayState[k][0];
				dayState[k]['small'] = e.dayState[k][1];
				dayState[k]['txt'] = e.dayState[k][2];
			};
			this.dayState = dayState;
			this.clickType = e.clickType;
			this.callbackGetDate = e.callbackGetDate;
			this.callbackGetMonthMsg = e.callbackGetMonthMsg;
			this.monthScope = e.monthScope;
		},
		//创建基本dom结构
		createDom: function(e){
			var $parent =  this.$parent;
			var dayState = this.dayState;
			$parent[0].innerHTML = '<div class="date-secBox"> \
									<select class="date-sec1"></select> \
									<select class="date-sec2"></select> \
									<button class="date-backBtn">返回</button>	\
								</div> \
								<div class="date-week"> \
									<div>日</div> \
									<div>一</div> \
									<div>二</div> \
									<div>三</div> \
									<div>四</div> \
									<div>五</div> \
									<div>六</div> \
								</div> \
								<div class="date-day"></div> \
								<div class="date-notice"></div>';
			this.sec1 = $parent.find('.date-sec1');
			this.sec2 = $parent.find('.date-sec2');
			this.backBtn = $parent.find(".date-backBtn");
			//补充day数字+扩充数字排列方法
			var $dateDay = $parent.find(".date-day");
			this.$dateDay = $dateDay;
			for( var i=0, len=42; i<len; i++ ){
				$dateDay.append("<div></div>");
			};
			var sd = new DateWeek($dateDay);
			this.sd = function(y,m){
				sd.setDate(y,m);
			};
			//设置状态说明
			var $dateNotice = $parent.find(".date-notice");
			for( var name in dayState ){
				$dateNotice.append('<span><img src='+ dayState[name]['small'] + ' />' + dayState[name]['txt'] + '</span>');
			};
			//设置样式
			function cssSet(){
				var c = [
					[$parent, "width: 350px; height: 600px; border: 1px solid #ccc; overflow: hidden;"],
					[$parent.find(".date-secBox select"), 'color: #3aa2c7; width: 80px; font-weight: bold;'],
					[$parent.find(".date-week"), 'height: 50px; margin: 30px 0; color: #848080; font-weight: bold; font-size: 24px;'],
					[$parent.find(".date-week div"), 'width: 42px; height: 36px; float: left; text-align: center; line-height: 36px; margin: 0 4px;'],
					[$parent.find(".date-day"), 'width: 100%; height: 415px;'],
					[$parent.find(".date-day div"), 'width: 42px; height: 36px; float: left; text-align: center; line-height: 36px; position: relative; margin: 0 4px 30px; cursor: pointer;'],
					[$parent.find(".date-notice"), 'padding-top: 5px;'],
					[$parent.find(".date-notice span"), 'float: left; margin: 0 10px 4px;'],
					[$parent.find(".date-notice img"), 'margin-right: 5px;']
				];
				for( var i=0; i<c.length; i++ ){
					cssErgodic(c[i][0], c[i][1]);
				};
				function cssErgodic($obj,styles){
					$obj.each(function(index,ele){
						ele.style.cssText = styles;
					});
				};
			};
			cssSet();
		},
		main: function(){
			var This = this;
			var nd = gDate();
			this.nd = nd;
			var monthScope = this.monthScope;
			this.djson = {}
			var djson = this.djson;
			djson[nd['y']] = [nd['m']];
			prevRange();
			nextRange();
			this.setOption();
			this.fnClicks();
			this.fnClicks2();
			
			//前年月
			function prevRange(){
				var mNow = nd.m;
				if( mNow > monthScope ){
					var dis = mNow - monthScope;
					for( var i=mNow-1; i>=dis; i-- ){
						djson[nd['y']].unshift(i);
					};
				}else{
					for( var i=mNow-1; i>0; i-- ){
						djson[nd['y']].unshift(i);
					};
					var oldm = mNow - 1;
					var newm = monthScope - oldm;
					var zs = Math.floor(newm/12);
					var ys = newm%12;
					for( var i=zs; i>0; i--){
						djson[nd['y']-i] = [1,2,3,4,5,6,7,8,9,10,11,12];
					};
					var tmp = []
					for( var i=12-ys+1; i<13; i++ ){
						tmp.push(i);
					};
					djson[nd['y']-zs-1] = tmp;
				};
			};
			//后年月
			function nextRange(){
				var mNow = nd.m;
				var mNext = mNow + monthScope;
				if( mNext >12 ){
					for( var i=nd['m']+1; i<13; i++ ){
						djson[nd['y']].push(i);
					};
					var zs = Math.floor(mNext/12);
					var ys = mNext%12;
					for( var i=1; i<zs; i++ ){
						djson[nd['y']+i] = [1,2,3,4,5,6,7,8,9,10,11,12];
					};
					var tmp = []
					for( var i=1; i<ys+1; i++ ){
						tmp.push(i);
					};
					djson[nd['y']+zs] = tmp;
				}else{
					for( var i=1; i<monthScope+1; i++){
						djson[nd['y']].push(nd['m']+i);
					};
				};
			};
			function gDate(){
				var d = new Date();
				return {
					y: d.getFullYear(),
					m: d.getMonth()+1,
					d: d.getDate(),
				};
			};
		},
		//设置选项
		setOption: function(){
			var This = this;
			var nd = this.nd;
			var djson = this.djson;
			var $sec1 = this.sec1;	//这是月
			var $sec2 = this.sec2;	//这是年
			This.one = false;
			for( var name in djson ){
				$sec2.append('<option value="'+ name +'">'+ name +'年</option>');
			};
			$sec2.on("change", function(){
				var val = $(this).val();
				$sec1.html('');
				for( var i=0; i<djson[val].length; i++ ){
					$sec1.append('<option value="'+ djson[val][i] +'">'+ djson[val][i] +'月</option>');
				};
				This.one ? This.fnOptionChange() : (This.one = true);
			}).val(nd['y']).trigger("change");
			$sec1.on("change", function(){
				This.fnOptionChange();
			}).val(nd['m']).trigger("change");
		},
		//option变化事件
		fnOptionChange: function(){
			var v1 = this.sec1.val();	//这是月值
			var v2 = this.sec2.val();	//这是年值
			var $dateDay = this.$dateDay;
			var dayState = this.dayState;
			var callbackGetMonthMsg = this.callbackGetMonthMsg
			var nd = this.nd;
			var ymd = nd['y'] + '-' + nd['m'] + '-' + nd['d'];
			var sendym = v2 + '-' + v1;
			this.cache = this.cache || {};
			var cache = this.cache;
			this.sd(v2,v1);
			$dateDay.find("div").css('color','#000');
			$dateDay.find(".siblings").css('color', '#ccc');
			$dateDay.find("div[name="+ymd+"]").append('<img src='+ dayState['today']['big'] +'>');
			var $span = $dateDay.find('span');
			$span.each(function(index,ele){
				ele.style.cssText = 'position: absolute; left: 0; top: 0; width: 42px; height: 36px; z-index: 999;';
			});
			
			//这里模拟ajax回调
			var backMsg;
			if( cache[sendym] ){
				backMsg = cache[sendym];
			}else{
				backMsg = callbackGetMonthMsg(sendym);
				cache[sendym] = backMsg;
			};
			backFn();
			function backFn(){
				for( var name in backMsg ){
					var tmp = backMsg[name];
					for( var i=0; i<tmp.length; i++ ){
						var d = v2 + '-' + v1 + '-' + tmp[i];
						$dateDay.find('div[name='+ d +']').append('<img src='+ dayState[name]['big'] +'>');
					};
				};
				fnSortState();
			};
			//状态排序
			function fnSortState(){
				$dateDay.find("div").each(function(index,ele){
					var $img = $(ele).find('img');
					$img.each(function(index2,ele2){
						var top = index2*5;
						var zIndex = 20 - index2;
						ele2.style.cssText = 'position: absolute; left: 0; width: 42px; height: 36px; top: '+ top +'px; z-index: '+ zIndex +';';
					});
				});
			};
		},
		//返回按钮点击事件
		fnClicks: function(){
			var This = this;
			var backBtn = this.backBtn;
			var $sec1 = this.sec1;	//这是月值
			var $sec2 = this.sec2;	//这是年值
			var nd = this.nd;
			//返回点击
			backBtn.click(function(){
				This.one = false;
				$sec2.val(nd['y']).trigger('change');
				$sec1.val(nd['m']).trigger('change');
			});
		},
		//选择当前点击事件
		fnClicks2: function(){
			var This = this;
			var callbackGetDate = this.callbackGetDate;
			var $dateDay = this.$dateDay;
			var $day = $dateDay.find("div");
			var nd = this.nd;
			var dayState = this.dayState;
			var clickType = this.clickType;	//-1过去的不可以点击，0所有可以点击，1以后的不可以点击
			$day.click(function(){
				var tmp = $(this).attr("name").split("-");
				var nowDay = new Date().getTime();
				var clickDay = new Date().setFullYear(tmp[0],tmp[1]-1,tmp[2]);
				switch(clickType){
					case -1:
						if( clickDay >= nowDay ){
							addBg($(this));
						}
						break;
					case 0:
						addBg($(this));
						break;
					case 1:
						if( clickDay <= nowDay ){
							addBg($(this));
						};
						break;
				};
			});
			//点击后事件
			function addBg($obj){
				$obj.siblings().find("span").css("background","none");
				$obj.find("span").css("background","url("+ dayState['now']['big'] +")");
				callbackGetDate($obj.attr("name"));
			};
		},
	};
	DateWeek2.prototype = proto;
	window.dDate = DateWeek2;
})(window,jQuery)































