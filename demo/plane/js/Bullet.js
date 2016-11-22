/**
 * 子弹类 
 * */
function Bullet(params){
	var self = this;
	//出现位置
	self.x = params.x;
	self.y = params.y;
	//xy轴速度
	self.xspeed = params.xspeed;
	self.yspeed = params.yspeed;
	self.belong = params.belong;
	self.isdie = false;
	//子弹图片
	self.obj = $("<div class='"+ params.bulletName +"'></div>")
	env.$bulletLayer.append(self.obj);
	self.obj.css("transform","translate3d("+ self.x +"px,"+ self.y +"px,0px)")
}

/**
 * 循环
 * */
Bullet.prototype.onframe = function (){
	var self = this;
	if(self.isdie){
		self.removeRun();
		return true;
	};
	
	//子弹移动
	self.x += self.xspeed;
	self.y += self.yspeed;
	self.obj.css("transform","translate3d("+ self.x +"px,"+ self.y +"px,0px)")
	//子弹位置检测
	if(self.x < 0 || self.x > env.width || self.y < 0 || self.y > env.height){
		//从屏幕移除
		self.obj.remove();
		return true;
	};
	var key,plain,
		player = env.player;
		var a = {
			w: self.obj.width(),
			h: self.obj.height(),
			x: self.x,
			y: self.y
		};
	if(self.belong == player.belong){
		for( var i=0; i<env.enemyCache.length; i++ ){
			var enemy = env.enemyCache[i];
			var b = {
				w: enemy.obj.width,
				h: enemy.obj.height,
				x: enemy.x,
				y: enemy.y
			};
			if( crashTest(a,b) ){
				enemy.hp--;
				self.isdie = true;
				self.obj.addClass("die");
			};
		};
	}else{
		var b = {
			w: player.obj.width(),
			h: player.obj.height(),
			x: player.x,
			y: player.y
		};
		if( crashTest(a,b)){
			player.hp--;
			self.isdie=true;
			self.obj.addClass("die");
		}
	};
};
Bullet.prototype.removeRun = function (){
	var self = this;
	self.obj.addClass("die");
	self.obj.animate({"opacity":0},500,"linear");
};













