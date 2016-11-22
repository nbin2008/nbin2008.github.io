//声明变量
//游戏主层，进度条显示层，背景层，障碍层
var backLayer,loadingLayer,background,stageLayer;
var stageSpeed = 0,hero,layers = 0,layersText,hpText;
var MOVE_STEP = 2, STAGE_STEP = 1;
var g=0.08;
var imglist = {};
var imgData = new Array(
		{name:"back",path:"images/bg.jpg"},
		{name:"hero",path:"images/hero.png"},
		{name:"wheel",path:"images/wheel.png"},
		{name:"floor0",path:"images/floor01.png"},
		{name:"floor1",path:"images/floor1.png"},
		{name:"floor2",path:"images/floor2.png"},
		{name:"floor3",path:"images/floor3.png"}
		);

function main(){	
	//游戏主层初始化
	backLayer = new LSprite();	
	//在主层上绘制黑色背景
	backLayer.graphics.drawRect(1,"#000000",[0,0,320,480],true,"#000000");
	addChild(backLayer);	
	//进度条读取层初始化
	loadingLayer = new LoadingSample2(50);
	backLayer.addChild(loadingLayer);	
	LLoadManage.load(
		imgData,
		function(progress){
			loadingLayer.setProgress(progress);
		},gameInit
	);
}
//读取完所有图片，进行游戏标题画面的初始化工作
function gameInit(result){
	//取得图片读取结果
	imglist = result;
	//移除进度条层
	backLayer.removeChild(loadingLayer);
	loadingLayer = null;
	//显示游戏标题
	var title = new LTextField();
	title.y = 100;
	title.size = 30;
	title.color = "#ffffff";
	title.text = "是男人就下100层";
	title.x = (LGlobal.width - title.getWidth())/2;
	backLayer.addChild(title);
	//显示说明文
	backLayer.graphics.drawRect(1,"#ffffff",[50,240,220,40]);
	var txtClick = new LTextField();
	txtClick.size = 18;
	txtClick.color = "#ffffff";
	txtClick.text = "点击页面开始游戏";
	txtClick.x = (LGlobal.width - txtClick.getWidth())/2;
	txtClick.y = 245;
	backLayer.addChild(txtClick);
	//添加点击事件，点击画面则游戏开始
	backLayer.addEventListener(LMouseEvent.MOUSE_UP,function(event){
		gameStart(false);
	});
}
function wallInit(){
	var bitmapDataUp = new LBitmapData(imglist["floor3"]);
	var bitmapUp;
	bitmapUp = new LBitmap(bitmapDataUp);
	bitmapUp.rotate = 180;
	addChild(bitmapUp);
	bitmapUp = new LBitmap(bitmapDataUp);
	bitmapUp.x = 90;
	bitmapUp.rotate = 180;
	addChild(bitmapUp);
	bitmapUp = new LBitmap(bitmapDataUp);
	bitmapUp.x = 90*2;
	bitmapUp.rotate = 180;
	addChild(bitmapUp);
	bitmapUp = new LBitmap(bitmapDataUp);
	bitmapUp.x = 90*3;
	bitmapUp.rotate = 180;
	addChild(bitmapUp);
	
}
//游戏画面初始化
function gameStart(restart){
	//背景层清空
	backLayer.die();
	backLayer.removeAllChild();
	
	background = new Background();
	backLayer.addChild(background);
	
	hero = new Chara();
	hero.x = 140;
	hero.y = 100;
	hero.hp = hero.maxHp;
	backLayer.addChild(hero);
	
	stageInit();
	
	showInit();
	wallInit();
	backLayer.addEventListener(LEvent.ENTER_FRAME,onframe);
	backLayer.addEventListener(LMouseEvent.MOUSE_DOWN,mousedown);
	backLayer.addEventListener(LMouseEvent.MOUSE_UP,mouseup);

	if(!LGlobal.canTouch && !restart){
		LEvent.addEventListener(window,LKeyboardEvent.KEY_DOWN,down);
		LEvent.addEventListener(window,LKeyboardEvent.KEY_UP,up);
	}
}
function showInit(){
	layersText = new LTextField();
	layersText.x = 10;
	layersText.y = 20;
	layersText.size = 20;
	layersText.weight = "bolder";
	layersText.color = "#ffff00";
	backLayer.addChild(layersText);
	
	hpText = new LTextField();
	hpText.x = 10;
	hpText.y = 50;
	hpText.size = 20;
	hpText.weight = "bolder";
	hpText.color = "#ffffff";
	backLayer.addChild(hpText);
}
function showView(){
	layersText.text = (layers / LGlobal.height) >>> 0;
	if(!hero)return;
	hpText.text = hero.hp==3?"★★★":hero.hp==2?"★★":hero.hp==1?"★":"";
}
function mouseup(event){
	if(!hero)return;
	hero.moveType = null;
	hero.changeAction();
}
function mousedown(event){
	if(event.offsetX <= LGlobal.width*0.5){
		down({keyCode:37});
	}else{
		down({keyCode:39});
	}
}
function up(event){
	if(!hero)return;
	hero.moveType = null;
	hero.changeAction();
}
function down(event){
	if(!hero || hero.moveType)return;
	if(event.keyCode == 37){
		hero.moveType = "left";
	}else if(event.keyCode == 39){
		hero.moveType = "right";
	}
	hero.changeAction();
}
function onframe(){
	background.run();
	if(stageSpeed-- < 0){
		stageSpeed = 100;
		addStage();
	}
	if(!hero)return;
	var key = null,found = false;
	hero.isJump = true;
	for(key in stageLayer.childList){
		var _child = stageLayer.childList[key];
		if(_child.y < -_child.getHeight()){
			stageLayer.removeChild(_child);
		}

		if(!found &&
		   hero.x + 30 >= _child.x && hero.x <= _child.x + 90 && 
		   hero.y + 50 >= _child.y+_child.hy && hero._charaOld + 50 <= _child.y+_child.hy+1){
				hero.isJump = false;
				hero.changeAction();
				_child.child = hero;
				hero.speed = 0;
				hero.y = _child.y - 49 + _child.hy;
				_child.hitRun();
				found = true;
		}else{
			_child.child = null;
		}
		_child.onframe();
	}
	if(hero.isJump)hero.anime.setAction(1,0);
	if(hero){
		hero.onframe();
		if(hero.hp <= 0){
			backLayer.removeChild(hero);
			hero = null;
			gameOver();
		}
	}
	showView();
}
function gameOver(){
	backLayer.die();
	var overLayer = new LSprite();
	backLayer.addChild(overLayer);
	overLayer.graphics.drawRect(4,'#ff8800',[0,0,200,100],true,'#ffffff');
	overLayer.x = (LGlobal.width - overLayer.getWidth())*0.5;
	overLayer.y = (LGlobal.height - overLayer.getHeight())*0.5;
	var txt;
	txt = new LTextField();
	txt.text = "成绩："+layersText.text;
	txt.x = 20;
	txt.y = 20;
	overLayer.addChild(txt);
	txt = new LTextField();
	txt.text = "继续加油！！";
	txt.x = 20;
	txt.y = 50;
	overLayer.addChild(txt);
	backLayer.addEventListener(LMouseEvent.MOUSE_DOWN,function(event){
		gameStart(true);
	});
}
function stageInit(){
	stageLayer = new LSprite();
	backLayer.addChild(stageLayer);
	layers = 0;
	var mstage;
	mstage = new Floor01();
	mstage.x = 110;
	mstage.y = 300;
	stageLayer.addChild(mstage);
}
function addStage(){
	var mstage;
	var index = Math.random() * 6;
	if(index < 1){
		mstage = new Floor06();
	}else if(index < 2){
		mstage = new Floor05();
	}else if(index < 3){
		mstage = new Floor04();
	}else if(index < 4){
		mstage = new Floor03();
	}else if(index < 5){
		mstage = new Floor02();
	}else if(index < 6){
		mstage = new Floor01();
	}
	mstage.y = 480;
	mstage.x = Math.random()*280;
	stageLayer.addChild(mstage);
}