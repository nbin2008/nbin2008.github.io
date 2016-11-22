/*
 * 俄罗斯方块
 */
$(document).ready(function(){
	function Game(){
		this.init();
	};
	var proto = {
		init: function(){
			this.before();
			this.start();
			this.mouseEvent();
		},
		mouseEvent: function(b){
			var myKey = this.key;
			document.addEventListener("keydown", onkeydown, false);
			document.addEventListener("keyup", onkeyup, false);
			//键盘按下事件
			function onkeydown(event){
				if(myKey.keyControl != null)return;
				if(event.keyCode == 37){//left
					myKey.keyControl = "left";
				}else if(event.keyCode == 38){//up
					myKey.keyControl = "up";
				}else if(event.keyCode == 39){//right
					myKey.keyControl = "right";
				}else if(event.keyCode == 40){//down
					myKey.keyControl = "down";
				}
			}
			//键盘弹起事件
			function onkeyup(event){
				myKey.keyControl = null;
				myKey.stepindex = 0;
			};
			if(b){
				document.removeEventListener("keydown", onkeydown, false);
				document.removeEventListener("keyup", onkeyup, false);
				alert("GameOver,3s后重新开始");
				setTimeout(function(){
					window.location.href = window.location.href;
				},3000)
			};
		},
		start: function(){
			var This = this;
			var myKey = this.key = {
				keyControl:null,
				step:1,
				stepindex:0
			};
			var nowBox,
				del = 0,
				nextBox,
				point = 0,
				map = this.map,
				getIndex = this.getIndex,
				getBox = this.getBox,
				$mDiv = this.$mDiv,
				$nDiv = this.$nDiv,
				speed=15,speedMax=15,speedText,speedIndex = 0;
				timer = null,
				$score = $(".score"),
				$remove = $(".remove"),
				$speed = $(".speed"),
				pointBox = {};
			getNext();
			plusBox();
			
			timer = setInterval(onframe,20);
			//循环播放
			function onframe(){
				//首先，将当前下落方块移除画面
				minusBox();
				if(myKey.keyControl != null && myKey.stepindex-- < 0){
					myKey.stepindex = myKey.step;
					switch(myKey.keyControl){
						case "left":
							if(checkPlus(-1,0)){
								pointBox.x -= 1;
							}
							break;
						case "right":
							if(checkPlus(1,0)){
								pointBox.x += 1;
							}
							break;
						case "down":
							if(checkPlus(0,1)){
								pointBox.y += 1;
							}
							break;
						case "up":
							changeBox();
							break;
					}
				}
				if(speedIndex++ > speed){
					speedIndex = 0;
					if (checkPlus(0,1)){
						pointBox.y++;
					}else{
						plusBox();
						if(pointBox.y < 0){
							This.mouseEvent(1);
							clearInterval(timer);
							return;
						}
						removeBox();
						getNext();
					}
				}
				plusBox();
				drawMap();
			};
			//显示数据
			function showText(){
				$score.text(point);
				$remove.text(del);
				$speed.text(speedMax - speed + 1);
			};
			//消除指定层的方块
			function moveLine(line){
				var i;
				for(i=line;i>1 ;i--){
					for(j=0;j<map[0].length;j++){
						 map[i][j]=map[i-1][j];
					}
				}
				for(j=0;j<map[0].length;j++){
					 map[0][j]=0;
				}
			}
			//消除可消除的方块
			function removeBox(){
				var i,j,count = 0;
				for(i=pointBox.y;i<(pointBox.y+4);i++){
					if(i < 0 || i >= map.length)continue;
					for(j=0;j<map[0].length;j++){
						if(map[i][j]==0){
							break;
						}
						if(j==map[0].length - 1){
							moveLine(i);
							count++;
						}
					}
				}
				if(count == 0)return;
				del += count;
				if(count == 1){
					point += 1;
				}else if(count == 2){
					point += 3;
				}else if(count == 3){
					point += 6;
				}else if(count == 4){
					point += 10;
				}
				if(speed > 1 && del / 100 >= (speedMax - speed + 1)){
					speed--;
				};
				showText();
			}
			//方块变形
			function changeBox(){
				var saveBox = nowBox;
				nowBox = [
				[0,0,0,0],
				[0,0,0,0],
				[0,0,0,0],
				[0,0,0,0]
				];
				var i,j;
				for(i=0;i<saveBox.length;i++){
					for(j=0;j<saveBox[1].length;j++){
						nowBox[i][j]=saveBox[(3-j)][i];
					}
				}
				if (!checkPlus(0,0)){
					nowBox = saveBox;
				}
			}
			//绘制所有方块
			function drawMap(){
				var i,j;
				$mDiv.each(function(i,v){
					$(this).removeClass();
				});
				for(i=0;i<map.length;i++){
					for(j=0;j<map[0].length;j++){
						if(map[i][j] > 0){
							var index = getIndex(i,j,'m');
							$mDiv.eq(index).addClass( 'r'+map[i][j] );
						};
					}
				}
			}
			//移除方块
			function minusBox(){
				var i,j;
				for(i=0;i<nowBox.length;i++){
					for(j=0;j<nowBox[i].length;j++){
						if(i+pointBox.y < 0 || i+pointBox.y >= map.length || j+pointBox.x < 0 || j+pointBox.x >= map[0].length){
							continue;
						}
						map[i+pointBox.y][j+pointBox.x]=map[i+pointBox.y][j+pointBox.x]-nowBox[i][j];
					};
				}
			};
			//添加方块
			function plusBox(){
				var i,j;
				for( i=0; i<nowBox.length; i++){
					for(j=0;j<nowBox[i].length;j++){
						if(i+pointBox.y < 0 || i+pointBox.y >= map.length || j+pointBox.x < 0 || j+pointBox.x >= map[0].length){
						continue;
					}
						map[i+pointBox.y][j+pointBox.x]=nowBox[i][j]+map[i+pointBox.y][j+pointBox.x];
					};
				};
			};
			
			//获取下一个方块
			function getNext(){
				if(nextBox == null){
					nextBox = getBox();
				};
				nowBox = nextBox;
				pointBox.x = 3;
				pointBox.y = -4;
				nextBox = getBox();
				getBox();
				getBox();
				$nDiv.each(function(i,ele){
					$(ele).removeClass();
				});
				for( var i=0; i<nextBox.length; i++ ){
					for( var j=0; j<nextBox[0].length; j++ ){
						if( nextBox[i][j] == 0 ){
							continue;
						};
						var index = getIndex(i,j,'n');
						$nDiv.eq(index).addClass( 'r'+nextBox[i][j] );
					};
				};
			};
			//判断是否可移动
			function checkPlus(nx,ny){
				var i,j;
				if(pointBox.y < 0){
					//防止方块下落之前，就已向左或向右移到屏幕之外
					if(pointBox.x + nx < 0 || pointBox.x + nx > map[0].length - 4){
						return false;
					}
				}
				for(i=0;i<nowBox.length;i++){
					for(j=0;j<nowBox[i].length;j++){
						if(i+pointBox.y + ny < 0){
							continue;
						}else if(i+pointBox.y + ny >= map.length || j+pointBox.x + nx < 0 || j+pointBox.x + nx >= map[0].length){
							if(nowBox[i][j] == 0){
								continue;
							}else{
								return false;
							}
						}
						if(nowBox[i][j] > 0 && map[i+pointBox.y + ny][j+pointBox.x + nx] > 0){
							return false;
						}
					}			
				}
				return true;
			};
		},
		before: function(){
			this.$main = $(".main");
			this.$next = $(".next");
			this.map = [
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0]
			];
			this.create();
		},
		create: function(){
			var $main = this.$main,
				$next = this.$next;
			for( var i=0; i<200; i++ ){
				$main.append("<div></div>");
			};
			for( var i=0; i<16; i++ ){
				$next.append("<div></div>");
			};
			this.$mDiv = $main.find("div");
			this.$nDiv = $next.find("div");
		},
		getIndex: function(i,j,type){
			if( type == 'm'){
				return i*10 + j%10;
			}else if( type == 'n' ){
				return i*4 + j%4;
			}
		},
		getBox: function(){
			if( !this.shape ){
				var box1=[[0,0,0,0],
					  [0,0,0,0],
					  [1,1,1,1],
					  [0,0,0,0]],
					box2=[[0,0,0,0],
					  [0,1,1,0],
					  [0,1,1,0],
					  [0,0,0,0]],
					box3=[[0,0,0,0],
					  [1,1,1,0],
					  [0,1,0,0],
					  [0,0,0,0]],
					box4=[[0,1,1,0],
					  [0,1,0,0],
					  [0,1,0,0],
					  [0,0,0,0]],
					box5=[[0,1,1,0],
					  [0,0,1,0],
					  [0,0,1,0],
					  [0,0,0,0]],
					box6=[[0,0,0,0],
					  [0,1,0,0],
					  [0,1,1,0],
					  [0,0,1,0]];
					box7=[[0,0,0,0],
					  [0,0,1,0],
					  [0,1,1,0],
					  [0,1,0,0]];
				this.shape = [box1,box2,box3,box4,box5,box6,box7];
			};
			var r1 = Math.floor(Math.random()*7);	//随机形状
			var	r2 = Math.floor(Math.random()*4) + 1;	//随机图形
			var box = JSON.parse(JSON.stringify(this.shape[r1]));
			box.forEach(function(v,i){
				v.forEach(function(z,j){
					if( z != 0 ){
						box[i][j] = z*r2;
					};
				});
			});
			return box;
		}
	};
	Game.prototype = proto;
	
	var g = new Game();
});
