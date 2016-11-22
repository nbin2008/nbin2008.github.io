(function(window){
	var proto = {
		init: function(e){
			this.before(e);
			this.start();
		},
		before: function(e){
			this.canvas = e.canvas;
		},
		start: function(){
			var This = this;
			var mycanvas = this.canvas;
			var width = mycanvas.width;
			var height = mycanvas.height;
			var myc = mycanvas.getContext("2d");
			var coords = [];
			setcoords();
			draw();
			setInterval(draw,1000);
			function draw(){
				//绘制点
				myc.clearRect(0, 0, width, height);
				myc.lineCap = 'round';
				myc.beginPath();
				myc.fillStyle = "#000";
				myc.arc(width/2, height/2, height/2, 0, 2*Math.PI);
				myc.fill();
				myc.beginPath();
				myc.fillStyle = "#fff";
				myc.arc(width/2, height/2, height/2*0.9, 0, 2*Math.PI);
				myc.fill();
				for( var i=0; i<coords.length; i++ ){
					myc.beginPath();
					var tmp = coords[i];
					myc.moveTo(tmp[0], tmp[1]);
					myc.lineTo(tmp[2], tmp[3]);
					myc.strokeStyle = "#000";
					myc.lineWidth = tmp[4]?width*0.02:width*0.01;
					myc.stroke();
				};
				//绘制指针
				var tmp = getPoint();
				for( var i=0, l=tmp.length; i<l; i++ ){
					myc.beginPath();
					myc.moveTo(tmp[i][0],tmp[i][1]);
					myc.lineTo(tmp[i][2],tmp[i][3]);
					if( i == 0 ){
						myc.lineWidth = width*0.03;
					}else if( i==1 ){
						myc.lineWidth = width*0.02;
					}else if( i==2 ){
						myc.lineWidth = width*0.01;
					}
					myc.strokeStyle = "#000";
					myc.shadowBlur = 4;
					myc.shadowColor = "#fff";
					myc.stroke();
					//指针圆
					if( i==2 ){
						myc.beginPath();
						var x = tmp[i][4];
						var y = tmp[i][5];
						myc.arc(x, y, width*0.03, 0 , 2*Math.PI);
						myc.fillStyle = "#fff";
						myc.fill();
						myc.strokeStyle = "#000";
						myc.stroke();
					};
				};
				//绘制中心圆
				myc.beginPath();
				myc.arc(width/2, height/2, width*0.03/2, 0 ,2*Math.PI);
				myc.fillStyle = "#fff";
				myc.fill();
				myc.beginPath();
				myc.arc(width/2, height/2, width*0.018/2, 0 ,2*Math.PI);
				myc.fillStyle = "#000";
				myc.fill();
				myc.beginPath();
				myc.arc(width/2, height/2, width*0.005/2, 0 ,2*Math.PI);
				myc.fillStyle = "#fff";
				myc.fill();
			};
			function setcoords(){
				var r1 = height/2*0.85;
				var r2 = height/2*0.8;
				var r3 = height/2*0.75;
				for( var i=1; i<61; i++ ){
					var angle = i*6*Math.PI/180;
					var x1 = width/2 + r1*Math.sin(angle);
					var y1 = height/2 - r1*Math.cos(angle);
					var x2 = width/2 + r2*Math.sin(angle);
					var y2 = height/2 - r2*Math.cos(angle);
					var tmp = [x1, y1, x2, y2];
					if( i%5 == 0 ){
						x2 = width/2 + r3*Math.sin(angle);
						y2 = height/2 - r3*Math.cos(angle);
						tmp.splice(2,1,x2);
						tmp.splice(3,1,y2);
						tmp.push(1);
					};
					coords.push(tmp);
				};
			};
			function getPoint(){
				var angle = getTimeAngle();
				var bLength = 0.05*width;
				var hX1 = width/2 + bLength*Math.sin( (angle.h+180)*Math.PI/180 );
				var hY1 = width/2 - bLength*Math.cos( (angle.h+180)*Math.PI/180 );
				var hX2 = width/2 + 0.15*width*Math.sin( angle.h*Math.PI/180 );
				var hY2 = height/2 - 0.15*width*Math.cos( angle.h*Math.PI/180 );
				var mX1 = width/2 + bLength*Math.sin( (angle.m+180)*Math.PI/180 );
				var mY1 = width/2 - bLength*Math.cos( (angle.m+180)*Math.PI/180 );
				var mX2 = width/2 + 0.28*width*Math.sin( angle.m*Math.PI/180 );
				var mY2 = height/2 - 0.28*width*Math.cos( angle.m*Math.PI/180 );
				var sX1 = width/2 + bLength*Math.sin( (angle.s+180)*Math.PI/180 );
				var sY1 = width/2 - bLength*Math.cos( (angle.s+180)*Math.PI/180 );
				var sX2 = width/2 + 0.35*width*Math.sin( angle.s*Math.PI/180 );
				var sY2 = height/2 - 0.35*width*Math.cos( angle.s*Math.PI/180 );
				var rX1 = width/2 + 0.28*width*Math.sin( angle.s*Math.PI/180 );
				var rY1 = height/2 - 0.28*width*Math.cos( angle.s*Math.PI/180 );
				return [
					[hX1, hY1, hX2, hY2],
					[mX1, mY1, mX2, mY2],
					[sX1, sY1, sX2, sY2, rX1, rY1]
				];
			};
			function getTimeAngle(){
				var now = new Date();
				var s = now.getSeconds();
				var m = now.getMinutes() + s/60;
				var h = (now.getHours()>=12?now.getHours()-12:now.getHours()) + m/60;
				return {
					h: h*30,
					m: m*6,
					s: s*6
				};
			};
		}
	};
	function Clock(e){
		this.init(e)
	};
	Clock.prototype = proto;
	Clock.prototype.constructor = Clock;
	window.Clock = Clock;
})(window);
