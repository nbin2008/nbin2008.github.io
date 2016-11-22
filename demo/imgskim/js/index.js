
$(document).ready(function(){
	var $win = $(window),
		$con1 = $('.container1'),
		$main1 = $('.main1'),
		$showImg1 = $('.showImg1'),
		$showImg1_btnLeft = $('.showImg1_btnLeft'),
		$showImg1_btnRight = $('.showImg1_btnRight'),
		$imgBox1 = $('.imgBox1'),
		$img1 = $('.img1'),
		$showImg1_btnLeft = $('.showImg1_btnLeft'),
		$showImg1_btnRight = $('.showImg1_btnRight'),
		$chooseImg1_btnLeft = $('.chooseImg1_btnLeft'),
		$chooseImg1_btnRight = $('.chooseImg1_btnRight'),
		$chooseImg1_box = $('.chooseImg1_box'),
		$scale1 = $('.scale1'),
		$btnImgInit1 = $('.btnImgInit1'),
		$btnImgFullScreen = $('.btnImgFullScreen'),
		
		$sider1 = $('.sider1'),
		$imgListBox1 = $('.imgListBox1'),
		$imgList1 = $('.imgList1');
	//container2-fullscreen对象
	var $con2 = $('.container2'),
		$select = $('.select'),
		$btnStart = $('.btnStart'),
		$btnStop = $('.btnStop'),
		$btnExitFullScreen = $('.btnExitFullScreen'),
		$imgBox2 = $('.imgBox2'),
		$img2 = $('.img2'),
		$showImg2_btnLeft = $('.showImg2_btnLeft'),
		$showImg2_btnRight = $('.showImg2_btnRight'),
		$chooseImg2_btnLeft = $('.chooseImg2_btnLeft'),
		$chooseImg2_btnRight = $('.chooseImg2_btnRight'),
		$imgListBox2 = $('.imgListBox2'),
		$imgList2 = $('.imgList2');
		
	var winW = $win.width(),
		winH = $win.height();
	//图片处理事件
	var h1;
	var handle = {
		init1: function(){
			h1 = new HandleImage({
				box: $imgBox1,
				img: $img1
			});
		},
		setImg1: function(src,isNormal){
			h1.setImg(src,isNormal,function(){
				imgListEvent.setScaleText();
			});
		}
	};
	
	//窗口改变事件
	var envFunc = {
		fnSize: function(){
			$(window).on('resize',function(){
				winW = $win.width(),
				winH = $win.height();
				containEvent.setCon();
				containEvent.setShowImg1_height();
				imgListEvent.imgList1_position();
				h1.setBoxWH();
			});
		}
	};
	envFunc.fnSize();
	
	//cantanier事件
	var containEvent = {
		init: function(){
			this.setCon();
			this.setShowImg1_height();
			handle.init1();
		},
		//设置container宽高
		setCon: function(){
			$con1.css({
				'width': winW,
				'height': winH
			});
			$con2.css({
				'width': winW,
				'height': winH
			});
		},
		//设置图片控制区高
		setShowImg1_height: function(){
			$showImg1.css({
				'height': $main1.height() - $chooseImg1_box.height()
			})
		},
		showText: function(data){
			$('.pTroTit1').text(data['src']);
			$('.pTroName1').text(data['title']);
		}
	};
	containEvent.init();
	
	//图片选择	普通的width：70+10, 选中active：80+10
	var $liActive_1;
	var index = 0;
	var imgListEvent = {
		init: function(){
			this.imgList1_add();
			this.imgList1_click();
			this.scaleEvent();
			this.mouseWheelEvent();
			this.fnClick();
		},
		imgList1_add: function(){
			var str = ''
			for( var i=0; i<imgData.length; i++ ){
				var tmp = imgData[i];
				str += '<li style="background-image:url('+ tmp.src +')" ></li>'
			};
			$imgList1.append(str);
			$imgList1.css({
				'width': (70+10)*imgData.length + 10
			});
		},
		imgList1_click: function(){
			var self = this;
			$imgList1.find('li').on('click',function(){
				if( $liActive_1 ) $liActive_1.removeClass('active');
				index = $(this).index();
				$(this).addClass('active');
				$liActive_1 = $(this);
				self.imgList1_position();
				handle.setImg1( imgData[index]['src'] );
				containEvent.showText( imgData[index] );
			});
			$imgList1.find('li').eq(0).trigger('click');
		},
		imgList1_position: function(){
			var boxWidth1 = $imgListBox1.width();
			var le = (boxWidth1/2 - index*80);
			le = Math.floor(le/80)*80;
			le = le>=0?0:le;
			var maxLe = (boxWidth1-$imgList1.width())+10;
			le = le<maxLe?maxLe:le;
			$imgList1.css({
				'left': le
			})
		},
		scaleEvent: function(){
			var timer = null;
			var btnPos = {
				x: null,
				y: null
			};
			var fnCallback = function(){
				imgListEvent.setScaleText();
			};
			$('.scaleAdd1').on('mousedown',function(e){
				h1.setScale('plus',fnCallback);
				checkBtnPos(e);
				timer = setTimeout(function(){
					fnAnimate('plus');
				},500);
			});
			$('.scaleReduce1').on('mousedown',function(e){
				h1.setScale('reduce',fnCallback);
				checkBtnPos(e);
				timer = setTimeout(function(){
					fnAnimate('reduce');
				},500);
			});
			$('.scaleAdd1').add($('.scaleReduce1')).on('mouseup',function(){
				clearInterval(timer);
				return false;
			});
			$('.scaleAdd1').add($('.scaleReduce1')).on('mousemove',function(e){
				if( Math.abs(e.pageX-btnPos.x)>=5 || Math.abs(e.pageY-btnPos.y)>=5 ){
					clearInterval(timer);
				};
				return false;
			});
			function checkBtnPos(e){
				btnPos.x = e.pageX;
				btnPos.y = e.pageY;
			};
			function fnAnimate(str){
				if( str == 'plus' ){
					timer = setInterval(function(){
						h1.setScale('plus',fnCallback);
					},30);
				}else if( str == 'reduce'){
					timer = setInterval(function(){
						h1.setScale('reduce',fnCallback);
					},30)
				};
			};
		},
		mouseWheelEvent: function(){
			var imgBox1 = $imgBox1.get(0);
			if( document.attachEvent ){
				imgBox1.attachEvent('onmousewheel',move)
			};
			if( document.addEventListener ){
				imgBox1.addEventListener('mousewheel',move,false);
				imgBox1.addEventListener('mousewheel',move,false);
			};
			var fnCallback = function(){
				imgListEvent.setScaleText();
			};
			function move(e){
				var up = true;
				if( e.wheelDelta ){
					up = e.wheelDelta > 0 ? true : false;
				};
				if( e.detail ){
					up = e.detail < 0 ? true : false;
				};
				if( up ){
					h1.setScale('plus',fnCallback);
				}else{
					h1.setScale('reduce',fnCallback);
				};
				if( e.preventDefault ){
					e.preventDefault();
				}else{
					e.returnValue = false;
				}
			};
		},
		setScaleText: function(){
			var scale = Math.round(h1.getScale()*100);
			$scale1.text(scale+'%');
		},
		fnClick: function(){
			$showImg1_btnRight.on('click',function(){
				$liActive_1.next().trigger('click');
			});
			$showImg1_btnLeft.on('click',function(){
				$liActive_1.prev().trigger('click');
			});
			$chooseImg1_btnLeft.on('click',function(){
				var w = $imgListBox1.width();
				var le = parseInt($imgList1.css('left')) + w;
				if( le > 0 ) le = 0;
				$imgList1.css({
					'left': le
				})
			});
			$chooseImg1_btnRight.on('click',function(){
				var w = $imgListBox1.width();
				var minLe = w - $imgList1.width();
				var le = parseInt($imgList1.css('left')) - w;
				if( le <  minLe ) le = minLe;
				$imgList1.css({
					'left': le
				})
			});
			$btnImgInit1.on('click',function(){
				handle.setImg1( imgData[index]['src'], true );
			});
			$btnImgFullScreen.on('click',function(){
				fullScreen.enterFull();
			});
		}
	};
	imgListEvent.init();
	
	/*
	 * container2
	 */
	var $liActive_2;
	var timer2;
	function setImg2(src){
		$imgBox2;
		$img2;
		var bW,bH,mW,mH;
		var img = new Image();
		$img2.attr('src',src);
		img.onload = function(){
			mW = img.width;
			mH = img.height;
			bW = $imgBox2.width();
			bH = $imgBox2.height();
			setPosition();
		};
		img.src = src;
		function setPosition(){
			var sScale = Math.min(bW/mW,bH/mH);
			if( sScale>=1 ){
				$img2.css({
					'width': mW,
					'height': mH,
					'left': (bW-mW)/2,
					'top': (bH-mH)/2
				});
			}else{
				$img2.css({
					'width': mW*sScale,
					'height': mH*sScale,
					'left': (bW-mW*sScale)/2,
					'top': (bH-mH*sScale)/2
				});
			};
		};
	};
	var fullScreen = {
		init: function(){
			this.addImg();
			this.addClick();
		},
		addImg: function(){
			var str = ''
			for( var i=0; i<imgData.length; i++ ){
				var tmp = imgData[i];
				str += '<li style="background-image:url('+ tmp.src +')" ></li>'
			};
			$imgList2.append(str);
			$imgList2.css({
				'width': 115*imgData.length
			});
		},
		addClick: function(){
			var self = this;
			$imgList2.find('li').on('click',function(){
				if( $liActive_2 ) $liActive_2.removeClass('active');
				index = $(this).index();
				$(this).addClass('active');
				$liActive_2 = $(this);
				self.imgList2_position();
				setImg2( imgData[index]['src'] );
			});
			$showImg2_btnRight.on('click',function(){
				$liActive_2.next().trigger('click');
			});
			$showImg2_btnLeft.on('click',function(){
				$liActive_2.prev().trigger('click');
			});
			$chooseImg2_btnLeft.on('click',function(){
				var w = $imgListBox2.width();
				var le = parseInt($imgList2.css('left')) + w;
				if( le > 0 ) le = 0;
				$imgList2.css({
					'left': le
				})
			});
			$chooseImg2_btnRight.on('click',function(){
				var w = $imgListBox2.width();
				var minLe = w - $imgList2.width();
				var le = parseInt($imgList2.css('left')) - w;
				if( le <  minLe ) le = minLe;
				$imgList2.css({
					'left': le
				})
			});
			$btnExitFullScreen.on('click',function(){
				self.exitFull();
			});
		},
		imgList2_position: function(){
			var boxWidth2 = $imgListBox2.width();
			var le = (boxWidth2/2 - index*115);
			le = Math.floor(le/115)*115;
			le = le>=0?0:le;
			var maxLe = (boxWidth2-$imgList2.width());
			le = le<maxLe?maxLe:le;
			$imgList2.css({
				'left': le
			});
		},
		enterFull: function(){
			var self = this;
			enterFullscreen();
			$con1.css('opacity','0');
			$con2.show();
			setTimeout(function(){
				$imgList2.find('li').eq(index).trigger('click');
			},500);
			//esc keyCode:27
			$(document).on('keyup.a',function(e){
				if( e.keyCode == 27 ){
					self.exitFull();
				};
			});
		},
		exitFull: function(){
			clearInterval(timer2);
			$(document).off('keyup.a');
			$con1.css('opacity','1');
			$con2.hide();
			animateEvent.showStart();
			setTimeout(function(){
				$imgList1.find('li').eq(index).trigger('click');
			},500);
			exitFullscreen();
		}
	};
	fullScreen.init();
//	fullScreen.enterFull();
	
	//定时器
	var animateEvent = {
		init: function(){
			var self = this;
			$btnStart.on('click',function(){
				self.start();
			});
			$btnStop.on('click',function(){
				self.stop();
			});
			$select.on('change',function(){
				self.start();
			});
		},
		start: function(){
			this.showStop();
			var intervalTime = parseInt($select.val())*1000;
			clearInterval(timer2);
			timer2 = setInterval(function(){
				$liActive_2.next().trigger('click');
			},intervalTime);
		},
		stop: function(){
			clearInterval(timer2);
			this.showStart();
		},
		showStart: function(){
			clearInterval(timer2);
			$select.show().val('2');
			$select.hide();
			$btnStop.hide();
			$btnStart.show();
		},
		showStop: function(){
			$btnStart.hide();
			$btnStop.show();
			$select.show();
		}
	};
	animateEvent.init();
	
	/*
	 * 全屏事件
	 */
	// 判断各种浏览器
	function enterFullscreen() {
		var element = document.documentElement;
		if (element.requestFullscreen) {
			element.requestFullscreen();
		} else if (element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		} else if (element.webkitRequestFullscreen) {
			element.webkitRequestFullscreen();
		} else if (element.msRequestFullscreen) {
			element.msRequestFullscreen();
		}
	}
	// 判断浏览器种类
	function exitFullscreen() {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
	}
});

















