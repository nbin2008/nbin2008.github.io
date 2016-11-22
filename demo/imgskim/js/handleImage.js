(function(window,$){
	function HandleImage(e){
		this.init(e);
	};
	var proto = {
		init: function(e){
			this.nb = {};
			this.nb.$box = e.box;
			this.nb.$img = e.img;
			this.setBoxWH();
			this.imgMouseEvent();
		},
		//对外提供，重置盒子的宽高，resize事件需要调用
		setBoxWH: function(){
			this.nb.bWidth = this.nb.$box.width();
			this.nb.bHeight = this.nb.$box.height();
		},
		getImgWH: function(src,isNormal,callback){
			var self = this;
			var img = new Image();
			img.onload = function(){
				self.nb.mWidth = img.width;
				self.nb.mHeight = img.height;
				self.setStartPosition(isNormal);
				callback && callback();
			};
			img.src = src;
		},
		//对外提供，输入图片地址,isNormal：true（初始不缩放）
		setImg: function(src,isNormal,callback){
			this.getImgWH(src,isNormal,callback);
			this.nb.$img.attr('src',src);
		},
		//初始化图片位置
		setStartPosition: function(isNormal){
			var self = this;
			var bW = self.nb.bWidth = self.nb.$box.width();
				bH = self.nb.bHeight = self.nb.$box.height();
				mW = self.nb.mWidth,
				mH = self.nb.mHeight;
			var sScale = self.nb.nScale = Math.min(bW/mW,bH/mH);
			if( sScale>=1 || isNormal ){
				self.nb.nScale = 1;
				self.nb.left = (bW-mW)/2;
				self.nb.top = (bH-mH)/2;
				self.nb.$img.css({
					'width': mW,
					'height': mH,
					'left': (bW-mW)/2,
					'top': (bH-mH)/2
				})
			}else{
				self.nb.left = (bW-mW*sScale)/2;
				self.nb.top = (bH-mH*sScale)/2;
				self.nb.$img.css({
					'width': mW*sScale,
					'height': mH*sScale,
					'left': (bW-mW*sScale)/2,
					'top': (bH-mH*sScale)/2
				})
			};
			this.setCenter();
		},
		setCenter: function(){
			var self = this;
			this.nb.centerX = self.nb.left + self.nb.mWidth*self.nb.nScale/2;
			this.nb.centerY = self.nb.top + self.nb.mHeight*self.nb.nScale/2;
		},
		//对外提供，改变图片大小
		setScale: function(str,callback){
			var self = this;
			if( str == 'plus'){
				self.nb.nScale += 0.1;
			}else if( str == 'reduce' ){
				self.nb.nScale -= 0.1;
			};
			self.nb.nScale = self.nb.nScale>=10?10:self.nb.nScale;
			self.nb.nScale = self.nb.nScale<=0.1?0.1:self.nb.nScale;
			self.nb.left = self.nb.centerX - self.nb.mWidth*self.nb.nScale/2;
			self.nb.top = self.nb.centerY - self.nb.mHeight*self.nb.nScale/2;
			self.nb.$img.css({
				'width': self.nb.mWidth*self.nb.nScale,
				'height': self.nb.mHeight*self.nb.nScale,
				'left': self.nb.left,
				'top': self.nb.top
			});
			callback && callback();
		},
		//对外提供，获取缩放比例
		getScale: function(){
			return this.nb.nScale;
		},
		imgMouseEvent: function(){
			var self = this;
			var sX,sY,disX,disY,sImgX,sImgY,b;
			self.nb.$img.on('mousedown',function(e){
				b = true;
				sX = e.pageX;
				sY = e.pageY;
				sImgX = self.nb.left;
				sImgY = self.nb.top;
			});
			$(document).on('mousemove',function(e){
				if( !b ) return;
				self.nb.$img.css({
					'left': sImgX + e.pageX - sX,
					'top': sImgY + e.pageY - sY
				});
				return false;
			});
			$(document).on('mouseup',function(){
				b = false;
				self.nb.left = parseInt(self.nb.$img.css('left'));
				self.nb.top = parseInt(self.nb.$img.css('top'));
				self.setCenter();
			});
		}
	};
	HandleImage.prototype = proto;
	window.HandleImage = HandleImage;
})(window,jQuery);
