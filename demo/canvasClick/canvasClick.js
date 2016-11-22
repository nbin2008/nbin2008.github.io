(function(window,$){
	var proto = {
		init: function(e){
			this.before(e);
			this.setArea();
			this.getXY();
			this.movePoint();
		},
		before: function(e){
			var This = this;
			this.canvas = e.canvas;
			this.points = [];
			var img = new Image;
			img.src = "a4.jpg";
			img.onload = function(){
				This.img = img;
			};
		},
		setArea: function(){
			var canvas = this.canvas;
			canvas.width = $(document).width();
			canvas.height = $(document).height();
		},
		getXY: function(){
			var This = this;
			$(document).click(function(e){
				This.pageX = e.pageX;
				This.pageY = e.pageY;
				This.createPoint();
			});
		},
		createPoint: function(){
			var x = this.pageX;
			var y = this.pageY;
			this.points.push( [[x,y], [x,y], [x,y], [x,y]] );	//上右下左
		},
		movePoint: function(){
			var This = this;
			var myCanvas = this.canvas;
			var myc = myCanvas.getContext('2d');
			var points = this.points;
			setInterval(data,20);
			function data(){
				if( !points.length ){
					return;
				};
				for( var i=points.length-1; i>=0; i-- ){
					var tmp = points[i];
					if( !tmp ){
						continue;
					};
					var sp = Math.round(Math.random()*1+1);
					for( var j=0; j<tmp.length; j++ ){
						switch(j){
							case 0:
								tmp[0][1] -= sp;
								break;
							case 1:
								tmp[1][0] += sp;
								break;
							case 2: 
								tmp[2][1] += sp;
								break;
							case 3:
								tmp[3][0] -= sp;
						}
						if( !tmp[j][2] ){
							var size = Math.round(Math.random()*20 + 60);
							var x = Math.round(Math.random()*This.img.width);
							var y = Math.round(Math.random()*This.img.height);
							tmp[j][2] = function(){
								var canvas = document.createElement("canvas");
									canvas.width = canvas.height = size;
								var mc = canvas.getContext("2d");
									x = x>= (This.img.width-size) ? (This.img.width - size) : x;
									y = y>= (This.img.height-size) ? (This.img.height - size) : y;
								mc.drawImage(This.img, x, y, size, size, 0, 0, size, size);
								return canvas;
							};
						}
					};
					if( tmp[0][1]<=0 && tmp[1][0]>=myCanvas.width && tmp[2][1]>=myCanvas.height && tmp[3][0]<=0 ){
						points.splice(i,1);
					};
				};
			};
			setInterval(draw,20);
			myc.fillRect(0, 0, myCanvas.width, myCanvas.height);
			function draw(){
				if( !points.length ){
					return;
				};
				myc.fillRect(0, 0, myCanvas.width, myCanvas.height);
				$.each(points, function(i, val) {
					$.each(val, function(i2,val2) {
						var x = val2[0];
						var y = val2[1];
						var bg = val2[2]();
						myc.beginPath();
						myc.save();
						myc.moveTo(x, y);
						myc.arc(x, y, bg.width/2, 0, 2*Math.PI);
						myc.clip();
						myc.drawImage(bg, x-bg.width/2, y-bg.height/2, bg.width, bg.height);
						myc.restore();
					});
				});
			};
		}
	};
	function CanvasClick(e){
		this.init(e);
		return this;
	};
	CanvasClick.prototype = proto;
	window.CanvasClick = CanvasClick;
})(window,jQuery);













