
$(document).ready(function(){
	var $bgLayer = $(".bgLayer"),
		$floorLayer = $(".floorLayer"),
		$hero = $(".hero"),	//40*50
		$blood = $(".blood"),
		$txt = $(".txt"),
		$btn = $(".btn"),
		height = $(".box").height();
	function Game(){
		this.init();
	};
	var proto = {
		init: function(){
			var This = this;
			$btn.show();
			$btn.one("click",function(){
				$btn.text("Game Over").hide();
				This.before();
				This.start();
				This.keyBoardEvent();
			});
		},
		before: function(){
			var nb = this.nb = {};
			nb.stageSpeed = 1;	//背景和地板速度
			nb.g = 0.6;	//重力加速度
			nb.v = 0;	//英雄下落速
			nb.timer = null;	//总定时器
			nb.bgIndex = 0;	//背景移动时间
			nb.floorIndex = 0;	//地板出现间隔时间
			nb.cache = [];
			nb.keyCode = null;
			nb.moveSpeed = 4;
			nb.blood = 3;
			nb.count = 0;
			
			$hero.fadeIn();
			$txt.text("第0层");
			$hero.x = 140;
			$hero.oldY = $hero.y = 100;
		},
		gameOver: function(){
			var nb = this.nb;
			clearInterval(nb.timer);
			$floorLayer.html("");
			this.init();
		},
		bloodEvent: function(){
			var nb = this.nb;
			if( nb.blood>3 ) nb.blood = 3;
			var x = nb.blood == 3 ? "★★★" :
					nb.blood == 2 ? "★★☆" :
					nb.blood ==1 ? "★☆☆" : "☆☆☆";
			$blood.text(x);
			if( nb.blood <=0 ){
				this.gameOver();
			}
		},
		keyBoardEvent: function(){
			var nb = this.nb;
			$(document).off();
			$(document).on("keydown",function(e){
				if( e.keyCode == 37 ){
					nb.keyCode = "left";
				}else if( e.keyCode == 39 ){
					nb.keyCode = "right";
				};
			});
			$(document).on("keyup", function(){
				nb.keyCode = null;
			});
		},
		bgEvent: function(){
			var nb = this.nb;
			nb.bgIndex -= nb.stageSpeed;
			if( nb.bgIndex <= -320 ) nb.bgIndex = 0;
			$bgLayer.css("transform","translate3d(0,"+ nb.bgIndex +"px,0)");
		},
		floorEvent: function(){
			var This = this;
				nb = this.nb;
			nb.floorIndex++;
			if( nb.floorIndex > 140 ){
				nb.floorIndex = 0;
				var ran = Math.ceil(Math.random()*6);
				var f = ran == 1 ? new Floor01() :
						ran == 2 ? new Floor02() :
						ran == 3 ? new Floor03() :
						ran == 4 ? new Floor04() :
						ran == 5 ? new Floor05() :
						ran == 6 ? new Floor06() : "";
				nb.cache.push(f);
			};
			$(nb.cache).each(function(i,v){
				if( v.run(nb) || v.check(nb) ){
					v.f.remove();
					nb.cache.splice(i,1);
					nb.count++;
					This.countEvent();
				};
				v.hit(nb);
			});
		},
		countEvent: function(){
			var nb = this.nb;
			var t = $txt.text();
			$txt.text( "第"+Math.floor(nb.count/5)+"层" );
			if( t != $txt.text() ) nb.blood++;
		},
		heroEvent: function(){
			var This = this,
				nb = this.nb;
			nb.isJump = true;	//在空中为true
			for( var i=0; i<nb.cache.length; i++ ){
				var f= nb.cache[i];
				if( nb.v>=0 && $hero.y+50>=f.y+f.hy && $hero.oldY+40<=f.y+f.hy+1 && $hero.x + 30 >= f.x && $hero.x <= f.x + 90 ){
					nb.isJump = false;
					f.child = true;
					nb.v = 0;
				}else{
					f.child = false;
				};
				if( $hero.y <= 20 ){
					nb.blood--;
					$hero.y = 100;
					nb.isJump = true;
					f.child = false;
				};
			};
			
			$hero.oldY = $hero.y;
			if( nb.isJump ){
				$hero.removeClass("left right").addClass("up");
				nb.v += nb.g;
				nb.v = nb.v>=10 ? 10 : nb.v;
				$hero.y += nb.v;
			}else{
				if( nb.keyCode == "left" ){
					$hero.removeClass("up right").addClass("left");
				}else if( nb.keyCode == "right" ){
					$hero.removeClass("left up").addClass("right");
				}else{
					$hero.removeClass("left right up");
				};
			}
			
			if( nb.keyCode == "left" ){
				$hero.x -= nb.moveSpeed;
			}else if( nb.keyCode == "right" ){
				$hero.x += nb.moveSpeed;
			};
			heroPosition(nb);
		},
		start: function(){
			var This = this,
				nb = this.nb;
				
			
			nb.timer = setInterval(gg,20);
			function gg(){
				This.bgEvent();
				This.floorEvent();
				This.heroEvent();
				This.bloodEvent();
			};
			//第一次地板居中
			setTimeout(function(){
				var f =  new Floor01(1);
				nb.cache.push(f);
			},10)
		},
	};
	Game.prototype = proto;
	var g = new Game();

	/*
	 * hero位置
	 */
	function heroPosition(nb){
		$hero.x = $hero.x<=0 ? 0 : $hero.x;
		$hero.x = $hero.x>=280 ? 280 : $hero.x;
		if( $hero.y >= 480 ){
			nb.blood = 0;
		};
		$hero.css("transform","translate3d("+ $hero.x +"px,"+ $hero.y +"px,0px)")
	};
	/*
	 * 地板类型
	 */
	function Floor(){
		this.hy = 0;
	};
	Floor.prototype.create = function(){
		this.width = 100;
		this.height = 20;
		this.x = parseInt(Math.random()*320) - 50;
		this.y = height;
		this.f = $('<div class="'+ this.name +'"></div>');
		$floorLayer.append(this.f);
		this.f.css({
			"width": this.width,
			"height": this.height,
			"transform": "translate3d("+ this.x +"px,"+ this.y +"px,0)"
		});
	};
	Floor.prototype.run = function(nb){
		this.y -= nb.stageSpeed;
		this.f.css("transform","translate3d("+ this.x +"px,"+ this.y +"px,0)");
		if( this.child ){
			$hero.y = this.y+this.hy - 49;
		};
		if( this.y <= -20 ){	//如果超出屏幕，则返回true
			return true;
		}else{
			return false;
		};
	};
	Floor.prototype.hit = function(){};
	Floor.prototype.check = function(){};
	//地板1	普通型
	function Floor01(one){
		this.name = "floor01";
		one ? this.one() : this.create();
	};
	Floor01.prototype = new Floor();
	Floor01.prototype.one = function(){
		this.width = 100;
		this.height = 20;
		this.x = 110;
		this.y = 450;
		this.f = $('<div class="'+ this.name +'"></div>');
		$floorLayer.append(this.f);
		this.f.css({
			"width": this.width,
			"height": this.height,
			"transform": "translate3d("+ this.x +"px,"+ this.y +"px,0)"
		});
	};
	
	//地板2	会消失
	function Floor02(){
		this.sTime = 0;
		this.name = "floor02";
		this.create();
	};
	Floor02.prototype = new Floor();
	Floor02.prototype.check = function(){
		if( !this.child ) return;
		this.sTime++;
		if( this.sTime == 20 ){
			this.f.addClass("state");
		}else if( this.sTime>=40 ){
			return true;
		}
	};
	
	//地板3 有弹簧
	function Floor03(){
		this.name = "floor03";
		this.create();
	};
	Floor03.prototype = new Floor();
	Floor03.prototype.check = function(nb){
		if( this.child ){
			this.f.addClass("state");
			this.child = false;
			nb.v = -10;
		}else{
			this.f.removeClass("state");
		};
	};
	
	//地板4 扣血
	function Floor04(){
		this.name = "floor04";
		this.hy = 10;
		this.create();
	};
	Floor04.prototype = new Floor();
	Floor04.prototype.hit = function(nb){
		if( !this.first && this.child ){
			this.first = true;
			nb.blood--;
		};
	};
	
	//地板5 强制←移动
	function Floor05(){
		this.name = "floor05";
		this.create();
	};
	Floor05.prototype = new Floor();
	Floor05.prototype.hit = function(){
		if( this.child ){
			$hero.x -= 1;
		};
	};
	
	//地板6 强制→移动
	function Floor06(){
		this.name = "floor06";
		this.create();
	};
	Floor06.prototype = new Floor();
	Floor06.prototype.hit = function(){
		if( this.child ){
			$hero.x += 1;
		};
	};
});

