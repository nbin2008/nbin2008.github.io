/**
 * Main
 * */
//设定游戏速度，屏幕大小，回调函数
init(20,"mylegend",800,400,main);

/**层变量*/
//显示进度条所用层
var loadingLayer;
//游戏层
var gameLayer,plainLayer,bulletLayer,bulletCtrlLayer;
var textLayer,hpText;
//图片path数组
var imgData = new Array(
	{name:"bullet01",path:"./images/bullet01.png"},
	{name:"bullet02",path:"./images/bullet02.png"},
	{name:"item1",path:"./images/item01.png"},
	{name:"item2",path:"./images/item02.png"},
	{name:"player",path:"./images/player.png"},
	{name:"remove",path:"./images/remove.png"},
	{name:"enemy1",path:"./images/enemy1.png"},
	{name:"enemy2",path:"./images/enemy2.png"},
	{name:"enemy3",path:"./images/enemy3.png"}
);
//读取完的图片数组
var imglist;
//子弹速度数组
var barrageSpeed = 10;

var player;
var ctrlIndex = 0;
var ctrlList=[
{"frames":10,"bullet":4,"move":[-1,1,-1,-1],img:"enemy1",x:800,y:0,hp:3,isboss:false},
{"frames":15,"bullet":4,"move":[-1,1,-1,-1],img:"enemy1",x:800,y:0,hp:3,isboss:false},
{"frames":20,"bullet":4,"move":[-1,1,-1,-1],img:"enemy1",x:800,y:0,hp:3,isboss:false},
{"frames":25,"bullet":4,"move":[-1,1,-1,-1],img:"enemy1",x:800,y:0,hp:3,isboss:false},
{"frames":30,"bullet":4,"move":[-1,1,-1,-1],img:"enemy1",x:800,y:0,hp:3,isboss:false},
{"frames":50,"bullet":5,"move":[0,-1,-1,1],img:"enemy2",x:600,y:400,hp:5,isboss:false},
{"frames":55,"bullet":5,"move":[0,-1,-1,1],img:"enemy2",x:600,y:400,hp:5,isboss:false},
{"frames":60,"bullet":5,"move":[0,-1,-1,1],img:"enemy2",x:600,y:400,hp:5,isboss:false},
{"frames":65,"bullet":5,"move":[0,-1,-1,1],img:"enemy2",x:600,y:400,hp:5,isboss:false},
{"frames":70,"bullet":5,"move":[0,-1,-1,1],img:"enemy2",x:600,y:400,hp:5,isboss:false},
{"frames":90,"bullet":4,"move":[-1,-1,-1,1],img:"enemy1",x:800,y:400,hp:3,isboss:false},
{"frames":95,"bullet":4,"move":[-1,-1,-1,1],img:"enemy1",x:800,y:400,hp:3,isboss:false},
{"frames":100,"bullet":4,"move":[-1,-1,-1,1],img:"enemy1",x:800,y:400,hp:3,isboss:false},
{"frames":105,"bullet":4,"move":[-1,-1,-1,1],img:"enemy1",x:800,y:400,hp:3,isboss:false},
{"frames":110,"bullet":4,"move":[-1,-1,-1,1],img:"enemy1",x:800,y:400,hp:3,isboss:false},
{"frames":130,"bullet":5,"move":[0,1,-1,-1],img:"enemy2",x:600,y:0,hp:5,isboss:false},
{"frames":135,"bullet":5,"move":[0,1,-1,-1],img:"enemy2",x:600,y:0,hp:5,isboss:false},
{"frames":140,"bullet":5,"move":[0,1,-1,-1],img:"enemy2",x:600,y:0,hp:5,isboss:false},
{"frames":145,"bullet":5,"move":[0,1,-1,-1],img:"enemy2",x:600,y:0,hp:5,isboss:false},
{"frames":150,"bullet":5,"move":[0,1,-1,-1],img:"enemy2",x:600,y:0,hp:5,isboss:false},
{"frames":180,"bullet":3,"move":[-1,0],img:"enemy3",x:800,y:180,hp:100,isboss:true},
{"frames":200,"bullet":4,"move":[-1,1,-1,-1],img:"enemy1",x:800,y:0,hp:3,isboss:false},
{"frames":220,"bullet":5,"move":[0,1,-1,-1],img:"enemy2",x:600,y:0,hp:5,isboss:false},
{"frames":230,"bullet":4,"move":[-1,1,-1,-1],img:"enemy1",x:800,y:0,hp:3,isboss:false},
{"frames":250,"bullet":4,"move":[-1,1,-1,-1],img:"enemy1",x:800,y:0,hp:3,isboss:false}
];
var frame = 0;
var frames = 0;
/**
 * 子弹类型数组
 * 【开始角度，增加角度，子弹速度，角度加速度，子弹总数，发动频率，枪口旋转】
 * */
var bulletList = new Array(
		{startAngle:0,angle:20,step:10,speed:5,count:1},//1发
		{startAngle:-20,angle:20,step:10,speed:5,count:3},//3发
		{startAngle:-40,angle:20,step:10,speed:5,count:5},//5发
		{startAngle:0,angle:20,step:10,speed:5,count:18},//环发
		{startAngle:180,angle:20,step:50,speed:5,count:1},//1发
		{startAngle:160,angle:20,step:50,speed:5,count:3},//3发
		{startAngle:140,angle:20,step:50,speed:5,count:5}//5发
);
function main(){
	loadingLayer = new LoadingSample3();
	addChild(loadingLayer);	
	LLoadManage.load(
		imgData,
		function(progress){
			loadingLayer.setProgress(progress);
		},
		gameInit
	);
}
function gameInit(result){
	LGlobal.setDebug(true);
	imglist = result;
	removeChild(loadingLayer);
	loadingLayer = null;
	
	//游戏底层实例化
	gameLayer = new LSprite();
	addChild(gameLayer);
	gameLayer.graphics.drawRect(1,"#000000",[0,0,800,400],true,"#000000");
	
	plainLayer = new LSprite();
	gameLayer.addChild(plainLayer);
	bulletLayer = new LSprite();
	gameLayer.addChild(bulletLayer);
	bulletCtrlLayer = new LSprite();
	gameLayer.addChild(bulletCtrlLayer);
	textLayer = new LSprite();
	gameLayer.addChild(textLayer);
	hpText = new LTextField();
	hpText.color="#ffffff";
	hpText.x = hpText.y = 10;
	textLayer.addChild(hpText);
	
	var bitmapData = new LBitmapData(imglist["player"]);
	player = new Player(100,150,bitmapData.width,bitmapData.height*0.5,bitmapData,30);
	plainLayer.addChild(player);
	player.setBullet(0);
	
	
	gameLayer.addEventListener(LEvent.ENTER_FRAME,onframe);
	gameLayer.addEventListener(LMouseEvent.MOUSE_DOWN,ondown);
	gameLayer.addEventListener(LMouseEvent.MOUSE_MOVE,onmove);
	gameLayer.addEventListener(LMouseEvent.MOUSE_UP,onup);
}
/**
 * 循环
 * */
function onframe(){
	var key;
	for(key in plainLayer.childList){
		plainLayer.childList[key].onframe();
	}
	for(key in bulletLayer.childList){
		bulletLayer.childList[key].onframe();
	}
	for(key in bulletCtrlLayer.childList){
		bulletCtrlLayer.childList[key].onframe();
	}
	
	setObject();
	showText();
	if(!player.canshoot)return;
	if(player.x - player.downX > mouseNowX - mouseStartX){
		player.x -= MOVE_STEP;
		if(player.x - player.downX < mouseNowX - mouseStartX){
			player.x = mouseNowX - mouseStartX + player.downX;
		}
	}else if(player.x - player.downX < mouseNowX - mouseStartX){
		player.x += MOVE_STEP;
		if(player.x - player.downX > mouseNowX - mouseStartX){
			player.x = mouseNowX - mouseStartX + player.downX;
		}
	}
	if(player.y - player.downY > mouseNowY - mouseStartY){
		player.y -= MOVE_STEP;
		if(player.y - player.downY < mouseNowY - mouseStartY){
			player.y = mouseNowY - mouseStartY + player.downY;
		}
	}else if(player.y - player.downY < mouseNowY - mouseStartY){
		player.y += MOVE_STEP;
		if(player.y - player.downY > mouseNowY - mouseStartY){
			player.y = mouseNowY - mouseStartY + player.downY;
		}
	}
	if(player.x < 0){
		player.x = 0;
		setCoordinate(mouseNowX,mouseNowY);
	}
}
function showText(){
	hpText.text = "";
	for(var i=0;i<player.hp;i++){
		hpText.text += "■";
	}
}
function gameClear(){
	gameLayer.die();
	gameLayer.graphics.drawRect(1,"#000000",[0,0,800,400],true,"#000000");
	var overLayer = new LSprite();
	gameLayer.addChild(overLayer);
	overLayer.graphics.drawRect(4,'#ff8800',[0,0,200,100],true,'#ffffff');
	overLayer.x = (LGlobal.width - overLayer.getWidth())*0.5;
	overLayer.y = (LGlobal.height - overLayer.getHeight())*0.5;
	
	txt = new LTextField();
	txt.text = "游戏通关！！";
	txt.size = 20;
	txt.x = 20;
	txt.y = 40;
	overLayer.addChild(txt);
}
function gameOver(){
	gameLayer.die();
	gameLayer.graphics.drawRect(1,"#000000",[0,0,800,400],true,"#000000");
	var overLayer = new LSprite();
	gameLayer.addChild(overLayer);
	overLayer.graphics.drawRect(4,'#ff8800',[0,0,200,100],true,'#ffffff');
	overLayer.x = (LGlobal.width - overLayer.getWidth())*0.5;
	overLayer.y = (LGlobal.height - overLayer.getHeight())*0.5;
	
	txt = new LTextField();
	txt.text = "游戏结束！！";
	txt.size = 20;
	txt.x = 20;
	txt.y = 40;
	overLayer.addChild(txt);
}

function setObject(){
	if(frame++ < 10)return;
	frame = 0;
	frames++;
	if(frames % 50 == 0){
		var bulletIndex = Math.random()>0.5?1:2;
		var obj = new BulletCtrl({
			x:790,y:100+Math.random()*200,xspeed:-1,yspeed:0,
			bulletIndex:bulletIndex,bitmapData:new LBitmapData(imglist["item"+bulletIndex])
		});
		bulletCtrlLayer.addChild(obj);
	}
	var ctrlObject = ctrlList[ctrlIndex];
	if(ctrlObject["frames"] == frames){
		ctrlIndex++;
		
		bitmapData = new LBitmapData(imglist[ctrlObject.img]);
		var enemy;
		if(ctrlObject.isboss){
			enemy = new Boss(ctrlObject.x,ctrlObject.y,0,bitmapData.height*0.5,bitmapData,ctrlObject["hp"]);
		}else{
			enemy = new Enemy(ctrlObject.x,ctrlObject.y,0,bitmapData.height*0.5,bitmapData,ctrlObject["hp"]);
		}
		plainLayer.addChild(enemy);
		enemy.setBullet(ctrlObject.bullet);
		enemy.move = ctrlObject.move;
		enemy.canshoot=true;
	}
}
var mouseStartX,mouseStartY,mouseNowX,mouseNowY;
var MOVE_STEP = 5;
function ondown(event){
	player.canshoot=true;
	setCoordinate(event.offsetX,event.offsetY);
}
function setCoordinate(x,y){
	mouseStartX = mouseNowX = x;
	mouseStartY = mouseNowY = y;
	player.downX = player.x;
	player.downY = player.y;
}
function onmove(event){
	if(!player.canshoot)return;
	mouseNowX=event.offsetX;
	mouseNowY = event.offsetY;
}
function onup(event){
	player.canshoot=false;
}
