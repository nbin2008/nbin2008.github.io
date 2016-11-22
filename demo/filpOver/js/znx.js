/*
 * 站内信
 */
$(document).ready(function(){
	var $list = $(".list"),	//1列最多11个
		$showContent = $(".show-content"),
		$btnRemove = $(".btnRemove"),
		$prevBtn = $(".listPrevBtn"),
		$nextBtn = $(".listNextBtn"),
		$btn = $(".bLeftBox p a"),	//放小图标的盒子
		//回复邮件标签
		$showContent2 = $(".show-content2"),
		$btnConfirm = $(".btnConfirm"),
		$btnCancel = $(".btnCancel"),
		$replyTitle = $(".replyTitle"),
		$replyTextarea = $(".replyTextarea");
//	加载隐藏，调试用
//	fnHide();
	function fnHide(){
		$list.html("");
		$showContent.html("");
		$btnSend.hide();
		$btnRemove.hide();
		$prevBtn.hide();
		$nextBtn.hide();
		$btn.each(function(i,v){
			$(this).hide();
		});
	};
	//调用fipOver参数
	var attr = {
		$prevBtn: $prevBtn,
		$nextBtn: $nextBtn,
		$btn: $btn,
		line: 11,
		_src: ".php",	//ajax地址
		onClickCallBack: function(data){
			//点击后返回的数据,data数据结构
			var data = [
				/*{
					text: "通知标题",
					unread: true,
					callId: "callId"
				},*/
			];
			//模拟数据
			for( var i=0; i<11; i++ ){
				data.push({
					text:"通知"+i,
					unread: Math.random()>0.5?true:false,
					callId: "callId"+i
				});
			};
			$list.html("");
			$(data).each(function(i,v){
				var $a = $('<a href="javascript:;" callid="'+ v.callId +'">'+ v.text +'</a>');
				if( v.unread ) $a.addClass("unread");
				$list.append($a);
			});
			listEvent.init();
		}
	};
	var g = new FlipOver(attr);
//	g.fnSort();	手动刷新方法
	
	var listEvent = {
		init: function(){
			this.callId = null;
			this.addClick();
			this.btnEvents();
		},
		addClick: function(){
			var self = this;
			$showContent.html("");
			var $a = $list.find("a");
			$a.each(function(i,v){
				$(this).on("click", function(){
					$(this).removeClass("unread").addClass("active").siblings().removeClass("active");
					self.fnHideContent2();
					self.ajaxEvent(this);
				});
			});
		},
		ajaxEvent: function(obj){
			var self = this;
			var callId = this.callId = $(obj).attr("callId");
			//点击左侧刷新右边部分
			/*$.post(".php",{callId:callId},function(data){
				var data = JSON.parse(data);
				if( data.success ){
					go(data.data);
				};
			});*/
			var data = [
				{
					type: 1,	//普通型
					title: "广播标题",
					content: "广播内容"
				},
				{
					type: 1,
					title: "广播标题",
					content: "广播内容",
					download: 1,
				},
				{
					type: 2,	//textarea
					title: "广播标题",
					content: "广播内容",
					btnApply:1,
					btnReply:1
				}
			];
			go(data);
			function go(data){
				$showContent.html("");
				$(data).each(function(i,v){
					var $gg = $('<div class="gg"></div>');
					var $gbox = $('<div class="gbox"></div>');
					$gg.append('<div class="gs">'+ v["title"] +'</div>');
					if( v["type"]==1 ){
						$gg.append('<div class="gd">'+ v["content"] +'</div>');
					}else if( v["type"]==2 ){
						$gg.append('<textarea class="gd-textarea" readonly="readonly">'+ v["content"] +'</textarea>');
					};
					$gg.append($gbox);
					v["download"] && $gbox.append('<a href="javascript:;" class="btnType1 download">下载</a>');
					v["btnApply"] && $gbox.append('<a href="javascript:;" class="btnType1 btnApply">申请</a>');
					v["btnReply"] && $gbox.append('<a href="javascript:;" class="btnType1 btnReply">回复</a>');
					$showContent.append($gg);
				});
				go2(data);
			};
			//按钮事件
			function go2(data){
				var $btnApply = $showContent.find(".btnApply");
				var $btnReply = $showContent.find(".btnReply");
				var $download = $showContent.find(".download");
				$btnApply.off();
				$btnReply.off();
				$download.off();
				$btnReply.on("click", function(){
					self.fnShowContent2(data);
				});
				$btnApply.on("click", function(){
					
				});
				$download.on("click", function(){
					
				});
			};
		},
		//回复和删除按钮事件
		btnEvents: function(){
			var self = this;
			$btnRemove.off();
			$btnRemove.on("click", function(){
				if( !self.callId ) return;
				fnRemove();
			});
			function fnRemove(){
				//删除ajax请求
				/*$.post(".php",{callId:callId},function(data){
					var data = JSON.parse(data);
					if( data.success ){
						g.fnSort();
					};
				});*/
				self.fnHideContent2();
				g.fnSort();
			};
			
		},
		fnShowContent2: function(data){
			var self = this;
			var $emailTitle = $(".show-content .gd").eq(0);
			$showContent2.show();
			$btnConfirm.off();
			$btnCancel.off();
			fnWrite();
			function fnWrite(){
				$replyTitle.val(" RE: " + data[0]["content"]);
				var str = "\n\n\n\n\n\n- - - - - - - - - -\n";
				for( var i=1; i<data.length; i++ ){
					str += data[i]["title"] + ": " + data[i]["content"] + "\n";
				};
				$replyTextarea.val(str);
			};
			//邮件回复确认
			$btnConfirm.on("click", function(){
				//ajax请求，回复邮件确认
				var attr = {
					callId: self.callId,
					title: $replyTitle.val(),
					content: $replyTextarea.val()
				};
				/*$.post(".php",attr,function(data){
					var data = JSON.parse(data);
					if( data.success ){
						self.fnHideContent2();
					};
				});*/
				self.fnHideContent2();
			});
			//邮件回复取消
			$btnCancel.on("click", function(){
				self.fnHideContent2();
			});
		},
		fnHideContent2: function(){
			$showContent2.hide();
			$replyTitle.val("");
			$replyTextarea.val("");
		}
	};
});












