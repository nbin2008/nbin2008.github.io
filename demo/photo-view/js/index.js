var list = [
	{src:"img/1.jpg", name: "Serenity Beach"},
	{src:"img/2.jpg", name: "Happy Days"},
	{src:"img/3.jpg", name: "Beautywood"},
	{src:"img/4.jpg", name: "Heaven of time"},
	{src:"img/5.jpg", name: "Speed Racer"},
	{src:"img/6.jpg", name: "Forever this"},
	{src:"img/7.jpg", name: "Lovely Green"},
	{src:"img/8.jpg", name: "Wonderful"},
	{src:"img/9.jpg", name: "Love Addict"},
	{src:"img/10.jpg", name: "Friendship"},
	{src:"img/11.jpg", name: "White Nights"},
	{src:"img/12.jpg", name: "Serendipity"},
	{src:"img/13.jpg", name: "Pure Soul"},
	{src:"img/14.jpg", name: "Winds of Peace"},
	{src:"img/15.jpg", name: "Shades of blue"},
	{src:"img/16.jpg", name: "Lightness"},
];

window.onload = function() {
	return;
	var listBox = document.getElementById("list-box"),
		viewBox = document.getElementById("view-box"),
		w = 320,
		h = 360,
		lis = null,
		index = 0;
	function setListData() {
		var str = "";
		list.forEach(function(v,i) {
			str += '<li><div><img src="'+ v.src +'" /><p>'+ v.name +'</p></div></li>';
		});
		listBox.innerHTML = str;
	};
	setListData();
	lis = listBox.getElementsByTagName("li");
	//
	function setCenterPosition(li) {
		li.style	 = 'left:50%;top:50%;transform:translate3d(-50%,-50%,0);z-index:100;';
	}
	function getRandomPosition(cX, nX, cY, nY) {
		// Math.floor(Math.random()*(max-min+1)+min);
		var x = Math.floor(Math.random()*(cX[1]-cX[0]+1)+cX[0]),
			y = Math.floor(Math.random()*(cY[1]-cY[0]+1)+cY[0]);
			if (x>nX[0] && x<nX[1]) {
				while (y>nY[0] && y<nY[1]) {
					y = Math.floor(Math.random()*(cY[1]-cY[0]+1)+cY[0]);
				}
			}
		return {x:x-w/2,y:y-h/2};
	}
	function setRandomPosition(li) {
		var vWidth = Number.parseInt( getComputedStyle(viewBox,null)["width"] ),
			vHeight = Number.parseInt( getComputedStyle(viewBox,null)["height"] ),
			dis = 20;
		var center = {
			x: Number.parseInt(vWidth)/2,
			y: Number.parseInt(vHeight)/2,
		}
		var rangeX = [-w/2, vWidth+w/2],
			rangeX_no = [center.x-w-dis, center.x+w+dis],
			rangeY = [-h/2, vHeight+h/2],
			rangeY_no = [center.y-h-dis, vHeight+h/2];
		var create = getRandomPosition(rangeX,rangeX_no,rangeY,rangeY_no);
		var rte = Math.floor(Math.random()*(30-(-30)+1)+(-30));
		li.style	 = 'left:'+ create.x +'px;top:'+ create.y +'px;z-index:1;transform:rotate('+ rte +'deg)';
	}
	// lis随机
	function liToRandom() {
		for (var i=0; i<lis.length; i++) {
			if (i==index) {
				setCenterPosition(lis[i]);
			} else {
				setRandomPosition(lis[i]);
			}
		}
	}
	liToRandom();
	// 按钮点击
	var libtns = document.getElementById("menu-box").getElementsByTagName("li");
	function clearClass() {
		for (var i=0; i<libtns.length; i++) {
			libtns[i].className = "";
		}
	}
	function liToClick() {
		for (var i=0; i<libtns.length; i++) {
			(function(i) {
				var li = libtns[i];
				li.onclick = function() {
					if (index!=i) {
						index = i;
						clearClass();
						li.className = "active";
						liToRandom();
					}
				}
			})(i)
		}
	}
	liToClick();
	// 窗口变化事件
	window.onresize = function() {
		liToRandom();
	}
}

$(document).ready(function(){
//	return;
	var w = 320,
		h = 360,
		index = 0;
	list.forEach(function(v,i) {
		$("#list-box").append($('<li><div><img src="'+ v.src +'" alt="" /><p>'+ v.name +'</p></div></li>'));
	});
	//
	function setCenterPosition($li) {
		$li.css({
			left: "50%",
			top: "50%",
			transform: "translate3d(-50%,-50%,0)", 
			"z-index": 100,
		});
	}
	setCenterPosition( $("#list-box li") );
	//
	function getRandomPosition(cX, nX, cY, nY) {
		// Math.floor(Math.random()*(max-min+1)+min);
		var x = Math.floor(Math.random()*(cX[1]-cX[0]+1)+cX[0]),
			y = Math.floor(Math.random()*(cY[1]-cY[0]+1)+cY[0]);
			if (x>nX[0] && x<nX[1]) {
				while (y>nY[0] && y<nY[1]) {
					y = Math.floor(Math.random()*(cY[1]-cY[0]+1)+cY[0]);
				}
			}
		return {x:x-w/2,y:y-h/2};
	}
	function setRandomPosition(li) {
		var vWidth = $("#view-box").width(),
			vHeight = $("#view-box").height(),
			dis = 20;
		var center = {
			x: Number.parseInt(vWidth)/2,
			y: Number.parseInt(vHeight)/2,
		}
		var rangeX = [-w/2, vWidth+w/2],
			rangeX_no = [center.x-w-dis, center.x+w+dis],
			rangeY = [-h/2, vHeight+h/2],
			rangeY_no = [center.y-h-dis, vHeight+h/2];
		var create = getRandomPosition(rangeX,rangeX_no,rangeY,rangeY_no);
		var rte = Math.floor(Math.random()*(30-(-30)+1)+(-30));
		li.css({
			left: create.x,
			top: create.y,
			"z-index": 1,
			transform: 'rotate('+ rte +'deg)',
		});
	}
	// lis随机
	function liToRandom() {
		$("#list-box li").each(function(i,v) {
			if (i==index) {
				setCenterPosition($(this));
			} else {
				setRandomPosition($(this));
			}
		});
	}
	liToRandom();
	//
	$("#menu-box li").on('click', function() {
		var i = $(this).index();
		if (i!=index) {
			index = i;
			$(this).siblings().removeClass("active");
			$(this).addClass("active");
			liToRandom();
		}
	});
	//
	$(window).on("resize", function() {
		liToRandom();
	});
});
