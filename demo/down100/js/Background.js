function Background(){
	base(this,LSprite,[]);
	var self = this;
	self.bitmapData = new LBitmapData(imglist["back"]);
	self.bitmap1 = new LBitmap(self.bitmapData);
	self.addChild(self.bitmap1);
	self.bitmap2 = new LBitmap(self.bitmapData);
	self.bitmap2.y = self.bitmap1.getHeight();
	self.addChild(self.bitmap2);
	self.bitmap3 = new LBitmap(self.bitmapData);
	self.bitmap3.y = self.bitmap1.getHeight()*2;
	self.addChild(self.bitmap3);
}
Background.prototype.run = function(){
	var self = this;
	layers += STAGE_STEP;
	self.bitmap1.y -= STAGE_STEP;
	self.bitmap2.y -= STAGE_STEP;
	self.bitmap3.y -= STAGE_STEP;
	if(self.bitmap1.y < -self.bitmap1.getHeight()){
		self.bitmap1.y = self.bitmap2.y;
		self.bitmap2.y = self.bitmap1.y + self.bitmap1.getHeight();
		self.bitmap3.y = self.bitmap1.y + self.bitmap1.getHeight()*2;
	}
}
