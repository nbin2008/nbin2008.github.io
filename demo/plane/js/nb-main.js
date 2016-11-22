/*
 * 灰机大战
 */
//全局变量
var env = {};
function callParent(obj,name,args){
//	obj.constructor.prototype.onframe.apply(obj,args);
//	obj.constructor.prototype[name].apply(obj,args)
//	var str = "obj.constructor.prototype[name]";
	var tmp = {
		s1: "obj.constructor.prototype",
		s2: "obj.constructor.prototype[name]"
	};
	var back = null;
	while( !eval(tmp.s2) ){
		tmp.s1 += ".constructor.prototype";
		tmp.s2 = tmp.s1 + "[name]";
		if( eval(tmp.s1) == back ){
			return;
		}
		back = eval(tmp.s1);
	};
	var str = tmp.s2 + ".apply(obj,args)";
	eval(str);
};
//碰撞检测
function crashTest(a,b){
	var aWidth = a.w,
		aHeight = a.h,
		aLeft = a.x,
		aTop = a.y;
	var bWidth = b.w,
		bHeight = b.h,
		bLeft = b.x,
		bTop = b.y;
	if( aLeft+aWidth<bLeft || aLeft>bLeft+bWidth || aTop+aHeight<bTop || aTop>bTop+bHeight ){
		return false
	}else{
		return true;
	};
};
//敌机
var ctrlList=[
//	{"frames":10,"bullet":3,"move":[-1,0],cName:"enemy03",x:800,y:180,hp:100,isboss:true}
	{"frames":10,"bullet":4,"move":[-1,1,-1,-1],cName:"enemy01",x:800,y:0,hp:3,isboss:false},
	{"frames":15,"bullet":4,"move":[-1,1,-1,-1],cName:"enemy01",x:800,y:0,hp:3,isboss:false},
	{"frames":20,"bullet":4,"move":[-1,1,-1,-1],cName:"enemy01",x:800,y:0,hp:3,isboss:false},
	{"frames":25,"bullet":4,"move":[-1,1,-1,-1],cName:"enemy01",x:800,y:0,hp:3,isboss:false},
	{"frames":30,"bullet":4,"move":[-1,1,-1,-1],cName:"enemy01",x:800,y:0,hp:3,isboss:false},
	{"frames":50,"bullet":5,"move":[0,-1,-1,1],cName:"enemy02",x:600,y:400,hp:5,isboss:false},
	{"frames":55,"bullet":5,"move":[0,-1,-1,1],cName:"enemy02",x:600,y:400,hp:5,isboss:false},
	{"frames":60,"bullet":5,"move":[0,-1,-1,1],cName:"enemy02",x:600,y:400,hp:5,isboss:false},
	{"frames":65,"bullet":5,"move":[0,-1,-1,1],cName:"enemy02",x:600,y:400,hp:5,isboss:false},
	{"frames":70,"bullet":5,"move":[0,-1,-1,1],cName:"enemy02",x:600,y:400,hp:5,isboss:false},
	{"frames":90,"bullet":4,"move":[-1,-1,-1,1],cName:"enemy01",x:800,y:400,hp:3,isboss:false},
	{"frames":95,"bullet":4,"move":[-1,-1,-1,1],cName:"enemy01",x:800,y:400,hp:3,isboss:false},
	{"frames":100,"bullet":4,"move":[-1,-1,-1,1],cName:"enemy01",x:800,y:400,hp:3,isboss:false},
	{"frames":105,"bullet":4,"move":[-1,-1,-1,1],cName:"enemy01",x:800,y:400,hp:3,isboss:false},
	{"frames":110,"bullet":4,"move":[-1,-1,-1,1],cName:"enemy01",x:800,y:400,hp:3,isboss:false},
	{"frames":130,"bullet":5,"move":[0,1,-1,-1],cName:"enemy02",x:600,y:0,hp:5,isboss:false},
	{"frames":135,"bullet":5,"move":[0,1,-1,-1],cName:"enemy02",x:600,y:0,hp:5,isboss:false},
	{"frames":140,"bullet":5,"move":[0,1,-1,-1],cName:"enemy02",x:600,y:0,hp:5,isboss:false},
	{"frames":145,"bullet":5,"move":[0,1,-1,-1],cName:"enemy02",x:600,y:0,hp:5,isboss:false},
	{"frames":150,"bullet":5,"move":[0,1,-1,-1],cName:"enemy02",x:600,y:0,hp:5,isboss:false},
	{"frames":180,"bullet":3,"move":[-1,0],cName:"enemy03",x:800,y:180,hp:100,isboss:true},
	{"frames":200,"bullet":4,"move":[-1,1,-1,-1],cName:"enemy01",x:800,y:0,hp:3,isboss:false},
	{"frames":220,"bullet":5,"move":[0,1,-1,-1],cName:"enemy02",x:600,y:0,hp:5,isboss:false},
	{"frames":230,"bullet":4,"move":[-1,1,-1,-1],cName:"enemy01",x:800,y:0,hp:3,isboss:false},
	{"frames":250,"bullet":4,"move":[-1,1,-1,-1],cName:"enemy01",x:800,y:0,hp:3,isboss:false}
];
//子弹
var bulletList = [
	{startAngle:0,angle:20,step:10,speed:4,count:1},//1发
	{startAngle:-20,angle:20,step:10,speed:4,count:3},//3发
	{startAngle:-40,angle:20,step:10,speed:4,count:5},//5发
	{startAngle:0,angle:20,step:10,speed:4,count:18},//环发
	{startAngle:180,angle:20,step:50,speed:4,count:1},//1发
	{startAngle:160,angle:20,step:50,speed:4,count:3},//3发
	{startAngle:140,angle:20,step:50,speed:4,count:5}//5发
];
//全局变量
var env = {};

$(document).ready(function(){
	env = {
		width: $(".container").width(),
		height: $(".container").height(),
		bulletCache: [],
		enemyCache: [],
		bulletCtrlCache: [],
		$container: $(".container"),
		$plainLayer: $(".plainLayer"),
		$bulletLayer: $(".bulletLayer"),
		$ammoLayer: $(".ammoLayer"),
		$txtLayer: $(".txtLayer"),
		gameOver: function(){
			clearInterval(env.timer);
			$(".gameover").show();
			$(".gameover").on("click", function(){
				window.location.href = window.location.href
			});
		}
	};
	var $contaniner = env.$container,
		$plainLayer = env.$plainLayer,
		$bulletLayer = env.$bulletLayer,
		$ammoLayer = env.$ammoLayer,
		$txtLayer = env.$txtLayer;
	
	function Game(){
		this.init();
	};
	var proto = {
		init: function(){
			this.before();
			this.createSelfPlain();
			this.mouseEvent();
			this.start();
		},
		before: function(){
			var nb = this.nb = {};
				nb.MOVE_STEP = 5;
		},
		createSelfPlain: function(){
			var This = this,
				nb = this.nb;
			nb.player = new Player();
			env.player = nb.player;
			nb.player.create(100,150,50,25,$plainLayer,"self",30);
			nb.player.setBullet(0);
		},
		mouseEvent: function(){
			var This = this;
				nb = this.nb;
				player = nb.player;
			$contaniner.on("mousedown", function(event){
				player.canShoot = true;
				setCoordinate(event.pageX,event.pageY);
			});
			$contaniner.on("mousemove", function(e){
				if( !player.canShoot ) return;
				nb.mouseNowX = e.pageX;
				nb.mouseNowY = e.pageY;
			});
			$contaniner.on("mouseup", function(){
				player.canShoot = false;
			});
			function setCoordinate(x,y){
				nb.mouseStartX = nb.mouseNowX = x;
				nb.mouseStartY = nb.mouseNowY = y;
				player.downX = player.x;
				player.downY = player.y;
			};
		},
		start: function(){
			var This = this,
				nb = this.nb,
				player = nb.player;
				MOVE_STEP = nb.MOVE_STEP,
				ctrlIndex = 0,
				frame = 0,
				frames = 0;
			env.timer = nb.timer = setInterval(function(){
				start();
			},20);
			function start(){
				//已机
				player.onframe();
				//敌机
				for( var i=env.enemyCache.length-1; i>=0; i-- ){
					if( env.enemyCache[i].onframe() ){
						env.enemyCache.splice(i,1);
					};
				};
				//子弹
				for( var i=env.bulletCache.length-1; i>=0; i-- ){
					if( env.bulletCache[i].onframe() ){
						env.bulletCache.splice(i,1);
					};
				};
				//弹药
				for( var i=env.bulletCtrlCache.length-1; i>=0; i-- ){
					if( env.bulletCtrlCache[i].onframe() ){
						env.bulletCtrlCache.splice(i,1);
					};
				};
				//设置敌机
				setObject();
				//显示血量
				showText();
				//己机移动
				if( !player.canShoot ) return;
				if(player.x - player.downX > nb.mouseNowX - nb.mouseStartX){
					player.x -= MOVE_STEP;
					if(player.x - player.downX < nb.mouseNowX - nb.mouseStartX){
						player.x = nb.mouseNowX - nb.mouseStartX + player.downX;
					}
				}else if(player.x - player.downX < nb.mouseNowX - nb.mouseStartX){
					player.x += MOVE_STEP;
					if(player.x - player.downX > nb.mouseNowX - nb.mouseStartX){
						player.x = nb.mouseNowX - nb.mouseStartX + player.downX;
					}
				}
				if(player.y - player.downY > nb.mouseNowY - nb.mouseStartY){
					player.y -= MOVE_STEP;
					if(player.y - player.downY < nb.mouseNowY - nb.mouseStartY){
						player.y = nb.mouseNowY - nb.mouseStartY + player.downY;
					}
				}else if(player.y - player.downY < nb.mouseNowY - nb.mouseStartY){
					player.y += MOVE_STEP;
					if(player.y - player.downY > nb.mouseNowY - nb.mouseStartY){
						player.y = nb.mouseNowY - nb.mouseStartY + player.downY;
					}
				}
				if(player.x < 0){
					player.x = 0;
					nb.mouseStartX = nb.mouseNowX;
					nb.mouseStartY = nb.mouseNowY;
					player.downX = player.x;
					player.downY = player.y;
				}
			};
			//显示血量
			function showText(){
				$txtLayer.text("");
				var str = "";
				for( var i=0; i<player.hp; i++ ){
					str += "■";
				};
				$txtLayer.text(str);
			};
			//设置敌机
			function setObject(){
				if(frame++ < 10)return;
				frame = 0;
				frames++;
				//弹药包
				if(frames % 50 == 0){
					var bulletIndex = Math.random()>0.5?1:2;
					var attr = {
						x: 790,
						y: 100+Math.random()*200,
						xspeed: -1,
						yspeed: 0,
						bulletIndex: bulletIndex,
						cName: "ammo0" + bulletIndex,
					};
					var ammo = new BulletCtrl(attr);
					env.bulletCtrlCache.push(ammo);
				};
				//敌机
				var ctrlObject = ctrlList[ctrlIndex];
				if( !ctrlObject ) return;
				if(ctrlObject["frames"] == frames){
					ctrlIndex++;
					
					var cName = ctrlObject["cName"];
					var enemy;
					if(ctrlObject.isboss){
						enemy = new Boss();
						enemy.create(ctrlObject.x,ctrlObject.y,0,66,$plainLayer,cName,ctrlObject["hp"]);
					}else{
						enemy = new Enemy();
						enemy.create(ctrlObject.x,ctrlObject.y,0,22,$plainLayer,cName,ctrlObject["hp"]);
					}
					env.enemyCache.push(enemy);
					enemy.setBullet(ctrlObject.bullet);
					enemy.move = ctrlObject.move;
					enemy.canShoot=true;
				}
			}
		}
	};
	Game.prototype = proto;
	var g = new Game();
});
