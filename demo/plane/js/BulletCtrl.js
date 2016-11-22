/**
 * 弹药类 
 * */
function BulletCtrl(params){
	var self = this;
	//出现位置
	self.x = params.x;
	self.y = params.y;
	//xy轴速度
	self.xspeed = params.xspeed;
	self.yspeed = params.yspeed;
	self.bulletIndex = params.bulletIndex;
	self.obj = $("<div class='"+ params.cName +"'></div>");
	env.$ammoLayer.append(self.obj);
	self.obj.css("transform","translate3d("+ self.x +"px,"+ self.y +"px,0px)");
}

/**
 * 循环
 * */
BulletCtrl.prototype.onframe = function (){
	var self = this;
	//移动
	self.x += self.xspeed;
	self.y += self.yspeed;
	self.obj.css("transform","translate3d("+ self.x +"px,"+ self.y +"px,0px)")
	//位置检测
	if(self.x < 0 || self.x > env.width || self.y < 0 || self.y > env.height){
		//从屏幕移除
		self.obj.remove();
		return true;
	};
	var a={
		w: self.obj.width(),
		h: self.obj.height(),
		x: self.x,
		y: self.y
	};
	var player = env.player;
	var b={
		w: player.obj.width(),
		h: player.obj.height(),
		x: player.x,
		y: player.y
	};
	if( crashTest(a,b)){
		player.setBullet(self.bulletIndex);
		self.obj.remove();
		return true;
	}
};