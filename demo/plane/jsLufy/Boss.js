/**
 * 敌机类
 * */
function Boss(x,y,shootX,shootY,bitmapData,hp){
	base(this,Enemy,[x,y,shootX,shootY,bitmapData,hp]);
	this.shootIndex = 0;
}

/**
 * 循环
 * */
Boss.prototype.onframe = function (){
	var self = this;
	self.callParent("onframe",arguments);
	if(self.isdie || self.hp <= 0)gameClear();
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
/**
 * 射击
 * */
Boss.prototype.shoot = function (){
	var self = this;
	self.shootIndex++;
	if(self.shootIndex>100 && self.shootIndex < 150){
		return;
	}else if(self.shootIndex >= 150){
		self.shootIndex = 0;
	}
	self.callParent("shoot",arguments);
};