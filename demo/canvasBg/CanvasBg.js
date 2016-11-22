(function(window){
	function CanvasBg(e){
		this.init(e);
	};
	var proto = {
		init: function(e){
			this.before(e);
			this.ddraw();
		},
		before: function(e){
			var This = this;
			this.mycanvas = e.mycanvas;
			this.width = this.mycanvas.width;
			this.height = this.mycanvas.height;
			this.bgNum = e.bgNum || 0;
			this.cache = [];
			var mycanvas = this.mycanvas;
			var myc = mycanvas.getContext('2d');
			var bg = e.bg;
			if( bg ){
				var img = new Image();
				img.src = bg;
				this.bg = img;
				img.onload = function(){
					This.create();
				};
			}else{
				this.bg = false;
				this.create();
			};
		},
		create: function(){
			var This = this,	
				width = this.width,
				height = this.height,
				distance = Math.sqrt((width/2)*(width/2)+(height/2)*(height/2)),
				cache = this.cache;
			this.distance = Math.round(distance);
				
			setInterval(function(){
				fnCreate();
			},50);
			function fnCreate(){
				var angle = getAngle(),
					speed = getSpeed(),
					sScale = scale12(),
					bgIndex = getBg(This.bgNum);
				
				for( var i=0, len=cache.length; i<len; i++){
					if( cache[i]["isEnd"] ){
						cache[i] = {
								angle: angle,
								distanceNow: Math.round(distance),
								speed: speed,
								sScale: sScale,
								bgIndex: bgIndex,
								isEnd: false,
						};
						return;
					};
				};
				cache.push({
					angle: angle,
					distanceNow: Math.round(distance),
					speed: speed,
					sScale: sScale,
					bgIndex: bgIndex,
					isEnd: false,
				});
			};
			function getBg(n){
				return Math.round(Math.random()*(n-1));
			};
			function getSpeed(){
				return Math.round(Math.random()*5+10);
			};
			function scale12(){
				return (Math.random()+1);
//				return 1;
			}
			function getAngle(){
				var n = Math.round(Math.random()*360);
				return n;
			};
		},
		ddraw: function(){
			var This = this,
				bg = this.bg,
				width = this.width,
				height = this.height,
				mycanvas = this.mycanvas,
				myc = mycanvas.getContext('2d'),
				bgCanvasJson = {},	//用来存放背景canvas
				cache = this.cache;
			
			setInterval(draw, 40);
			function draw(){
				myc.clearRect(0,0,width,height);
				myc.globalCompositeOperation = 'lighter';
				var i = cache.length-1;
				var distance = This.distance;
				while(i>= 0){
					var mycbg = createBg(i);
					var distanceNow = cache[i]["distanceNow"];
					var angle = cache[i]["angle"];
					myc.save();
					myc.translate(width/2, height/2);
					myc.rotate(angle*Math.PI/180);
					myc.drawImage(mycbg,distanceNow,0);
					myc.restore();
					i--;
				};
			};
			function createBg(i){
				var bgCanvas;
				if( bgCanvasJson[i] ){
					bgCanvas = bgCanvasJson[i]
				}else{
					var c = document.createElement('canvas');
					c.width = 100;
					c.height = 100;
					bgCanvasJson[i] = c;
					bgCanvas = bgCanvasJson[i];
				};
				var smyc = bgCanvas.getContext('2d');
				smyc.save();
				smyc.clearRect(0,0,100,100);
				var distance = This.distance;
				mScale = cache[i]["distanceNow"]/distance,
				smyc.scale(cache[i]['sScale'],cache[i]['sScale']);
				smyc.scale(mScale,mScale);
				mScale *= 1.2;
				mScale = mScale<=0.2?0.2:mScale;
				smyc.globalAlpha = mScale;
				if( bg ){
					smyc.drawImage(bg, 50*cache[i]['bgIndex'], 0, 50, 50, 0, 0, 50, 50 );
				}else{
					if( cache[i]['crisp'] ){
						cache[i]['crisp'](smyc);
					}else{
						cache[i]['crisp'] = createCrisp(smyc);
					};
				};
				smyc.restore();
				return bgCanvas;
			};
			function createCrisp(smyc){
				var tmpArr = [],
					i = 0,
					n = gShape();
				smyc.beginPath()
				while( i<=n ){
					tmpArr.push([gCoord(), gCoord()])
					i++;
				};
				tmpArr.push([gColor(),gColor(),gColor()]);
				function gShape(){
					return Math.round(Math.random()*1+3);
				};
				function gCoord(){
					return Math.round(Math.random()*50);
				};
				function gColor(){
					return Math.round(Math.random()*255);
				};
				
				var tmpFn = function(smyc){
					for( var z=0,l=tmpArr.length; z<l; z++ ){
						var tmp = tmpArr[z];
						if( tmp.length == 2 ){
							if(z==0){
								smyc.beginPath();
								smyc.moveTo(tmp[0], tmp[1]);
							}else{
								smyc.lineTo(tmp[0], tmp[1]);
							};
							if( z==l-2 ){
								smyc.closePath();
							}
						}else{
							smyc.fillStyle = "rgb("+ tmp[0] +","+ tmp[1] +","+ tmp[2] +")";
							smyc.fill();
						}
					};
				};
				tmpFn(smyc);
				return tmpFn;
			};
			
			setInterval(change,40);
			function change(){
				var i=cache.length-1;
				var distance = This.distance;
				while( i>=0 ){
//					cache[i]["distanceNow"] -= cache[i]['speed'];
					var s  = cache[i]["distanceNow"]/distance;
					if( s< 0.2) s=0.2; 
					cache[i]["distanceNow"] -= s*cache[i]['speed'];
					
					if( cache[i]['distanceNow']<=0 ){
						cache[i]["isEnd"] = true;
					};
					i--;
				};
			};
		}
	};
	CanvasBg.prototype = proto;
	window.CanvasBg = CanvasBg;
})(window);

/*
 * canvas背景
 */
$(document).ready(function(){
	var canvasEvent = {
		start: function(){
			var $mycanvas = $(".myCanvas");
			if( !$mycanvas[0].getContext ) return;
			var $parent = $mycanvas.parent();
			if( $parent[0].nodeName.toLowerCase() == 'body' ){
				$mycanvas[0].width = document.documentElement.clientWidth;
				$mycanvas[0].height = document.documentElement.clientHeight;
			}else{
				$mycanvas[0].width = $parent.width();
				$mycanvas[0].height = $parent.height();
			};
			var bg = "images/canvasBg/bg.png"
			var c = new CanvasBg({
				mycanvas: $mycanvas[0],
				bg: bg,
				bgNum: 40
			});		
		}
	};
	canvasEvent.start();
});