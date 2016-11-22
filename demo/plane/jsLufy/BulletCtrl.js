/**
 * 弹药类 
 * */
function BulletCtrl(params){
	base(this,LSprite,[]);
	var self = this;
	//出现位置
	self.x = params.x;
	self.y = params.y;
	//xy轴速度
	self.xspeed = params.xspeed;
	self.yspeed = params.yspeed;
	self.bulletIndex = params.bulletIndex;
	self.bitmap = new LBitmap(params.bitmapData);
	//显示
	self.addChild(self.bitmap);
}

/**
 * 循环
 * */
BulletCtrl.prototype.onframe = function (){
	var self = this;
	//移动
	self.x += self.xspeed;
	self.y += self.yspeed;
	//位置检测
	if(self.x < 0 || self.x > LGlobal.width || self.y < 0 || self.y > LGlobal.height){
		//从屏幕移除
		bulletCtrlLayer.removeChild(self);
	}
	if(LGlobal.hitTestArc(self,player)){
		player.setBullet(self.bulletIndex);
		self.parent.removeChild(self);
	}
};