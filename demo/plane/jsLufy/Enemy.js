/**
 * 敌机类
 * */
function Enemy(x,y,shootX,shootY,bitmapData,hp){
	base(this,Plain,[x,y,shootX,shootY,bitmapData,hp]);
	var self = this;
	self.belong = "enemy";
	self.bulletBitmapData=new LBitmapData(imglist["bullet02"]);
}

/**
 * 循环
 * */
Enemy.prototype.onframe = function (){
	var self = this;
	self.callParent("onframe",arguments);
	var isOut = false;
	if(self.x < -self.getWidth() || self.x > LGlobal.width || 
		self.y < -self.getHeight() || self.y > LGlobal.height){
		isOut = true;
	}
	if(isOut)self.whenOut();
	if(self.isdie || self.hp <= 0){
		plainLayer.removeChild(self);
	}else if(LGlobal.hitTestArc(self,player)){
		player.hp--;
		if(player.x < self.x){
			player.x -= player.getWidth();
		}else{
			player.x += player.getWidth();
		}
	}
};

Enemy.prototype.whenOut = function (){
	var self = this;
	if(self.move.length > 0)self.move.splice(0,2);
	if(self.move.length == 0)self.isdie = true;
};