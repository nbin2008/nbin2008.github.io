/*
 * 灰机构造函数
 */
function Plain(){};
Plain.prototype.create = function(x,y,sx,sy,$parent,cName,hp){
	this.x = x;
	this.y = y;
	this.sx = sx;
	this.sy = sy;
	this.$parent = $parent;
	this.cName = cName;
	this.canShoot = false;
	this.move = [0,0];
	this.speed = 1;
	this.hp = hp;
	this.isdie = false;
	this.shoopIndex = 0;
	this.obj = $("<div class='"+ this.cName +"'></div>");
	this.obj.css("transform","translate3d("+ this.x +"px,"+ this.y +"px,0px)")
	this.$parent.append(this.obj);
};
Plain.prototype.onframe = function(){
	this.x += this.move[0]*this.speed;
	this.y += this.move[1]*this.speed;
	this.obj.css("transform","translate3d("+ this.x +"px,"+ this.y +"px,0px)")
	if( this.canShoot ) this.shoot();
};
Plain.prototype.shoot = function(){
	var self = this;
	var bullet = bulletList[self.bullet];
	if(self.shoopIndex++ < bullet.step)return;
	self.shoopIndex=0;
	//开始发射
	for(var i=0;i<bullet.count;i++){
		//发射角度
		var angle = i*bullet.angle + bullet.startAngle;
		//子弹xy轴速度
		xspeed = bullet.speed*Math.cos(angle * Math.PI / 180);
		yspeed = bullet.speed*Math.sin(angle * Math.PI / 180);
		var params = {
			bulletName: self.bulletName,
			x:self.x+self.sx,
			y:self.y+self.sy,
			xspeed:xspeed,
			yspeed:yspeed,
			belong:self.belong
		};
		//子弹实例化
		obj = new Bullet(params);
		//显示
		env.bulletCache.push(obj);
	}
};
Plain.prototype.setBullet = function(bulletIndex){
	this.bullet = bulletIndex;
};

/*
 * 己方飞机
 */
function Player(){
	this.belong = "self";
	this.downX = this.downY = 0;
	this.bulletName = "self";
};
Player.prototype = new Plain();
Player.prototype.create = function(x,y,sx,sy,$parent,cName,hp){
	callParent(this,"create",arguments);
};
Player.prototype.onframe = function(){
	callParent(this,"onframe",arguments);
	if( this.hp<0 ){
		env.gameOver();
	};
};

/*
 * 敌机类
 */
function Enemy(){};
Enemy.prototype = new Plain();
Enemy.prototype.create = function(x,y,sx,sy,$parent,cName,hp){
	this.belong = "enemy";
	this.bulletName = "enemy"
	callParent(this,"create",arguments);
};
Enemy.prototype.onframe = function(){
	var self = this;
	callParent(self,"onframe",arguments);
	var isOut = false;
	if(self.x < -self.obj.width() || self.x > env.width || self.y < -self.obj.height() || self.y > env.height){
		isOut = true;
	}
	if(isOut)self.whenOut();
	if(self.isdie || self.hp <= 0){
		self.obj.remove();
		return true;
	}
};
Enemy.prototype.whenOut = function (){
	var self = this;
	if(self.move.length > 0)self.move.splice(0,2);
	if(self.move.length == 0)self.isdie = true;
};

/*
 * boss
 */
function Boss(){};
Boss.prototype = new Plain();
Boss.prototype.create = function(){
	this.belong = "enemy";
	this.bulletName = "enemy"
	this.shootIndex = 0;
	callParent(this,"create",arguments);
};
Boss.prototype.onframe = function(){
	var self = this;
	callParent(self,"onframe",arguments);
	var isOut = false;
	if(self.x < -self.obj.width() || self.x > env.width || self.y < -self.obj.height() || self.y > env.height){
		isOut = true;
	};
	if(isOut)self.whenOut();
	if(self.isdie || self.hp <= 0){
		self.obj.remove();
		env.gameOver();
		return true;
	};
};
Boss.prototype.whenOut = function (){
	var self = this;
	if(self.x < 400){
		self.move[0]=1;
		self.move[1]=Math.random()>0.5?1:-1;
	}else{
		self.move[0]=-1;
		self.move[1]=Math.random()>0.5?1:-1;
	}
};
Boss.prototype.shoot = function (){
	var self = this;
	self.shootIndex++;
	if(self.shootIndex>100 && self.shootIndex < 150){
		return;
	}else if(self.shootIndex >= 150){
		self.shootIndex = 0;
	}
	callParent(self,"shoot",arguments);
};











