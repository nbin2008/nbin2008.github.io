/*
 * flipOver效果
 */
function FlipOver(e){
	this.init(e);
};
var proto = {
	init: function(e){
		this.before(e);
		this.fnHide();
		this.fnClick();
	},
	before: function(e){
		this.nb = {};
		this.nb.$prevBtn = e.$prevBtn;
		this.nb.$nextBtn = e.$nextBtn;
		this.nb.$btn = e.$btn;
		this.nb.line = e.line;	//一列多少个
		this.nb.src = e._src;
		this.nb.index = 0;	//按钮索引
		this.nb.page = 1;
		this.nb.onClickCallBack = e.onClickCallBack;
	},
	fnHide: function(){
		var self = this;
		self.nb.$prevBtn.hide();
		self.nb.$nextBtn.hide();
		self.nb.$btn.hide().removeClass("active disabled");
	},
	fnClick: function(){
		var self = this,
			$btn = self.nb.$btn,
			$prevBtn = self.nb.$prevBtn,
			$nextBtn = self.nb.$nextBtn;
		$btn.eq(0).attr("page",1);
		$btn.each(function(i,v){
			$(this).on("click", function(){
				if( $(this).hasClass("active") || $(this).hasClass("disabled") ){
					return;
				};
				self.nb.page = $(this).attr("page");
				self.fnSort();
			});
		});
		$btn.eq(0).trigger("click");
		$prevBtn.on("click", function(){
			self.nb.index = --self.nb.index<0?0:self.nb.index;
			$btn.eq(self.nb.index).trigger("click");
		});
		$nextBtn.on("click", function(){
			self.nb.index = ++self.nb.index>6?6:self.nb.index;
			$btn.eq(self.nb.index).trigger("click");
		});
	},
	fnSort: function(){
		//ajax，发送{page,line}，获取{max，page，数据}
		var self = this,
			$btn = self.nb.$btn,
			$prevBtn = self.nb.$prevBtn,
			$nextBtn = self.nb.$nextBtn;
		/*$.post(self.nb.src,{page:self.nb.page,line:self.nb.line},function(data){
			var data = JSON.data;
			if( data.success ){
				self.nb.max = 110;//总数量
				self.nb.page = 1;	//当前页面，索引从1开始
				self.nb.data = data;	//返回的数据
				go();
			};
		});*/
		self.nb.max = 88;
		self.fnHide();
		setTimeout(go,10);
		function go(){
			self.nb.onClickCallBack(self.nb.data);
			var	pages = self.nb.pages = Math.ceil(self.nb.max/self.nb.line);	//pages为总页数
			if( pages<=7 ){
				for( var i=1; i<pages+1; i++ ){
					$btn.eq(i-1).attr("page",i).show().text(i);
				};
				if( self.nb.max <= self.nb.line ) $btn.eq(0).hide();
				$btn.filter("[page="+ self.nb.page +"]").addClass("active");
				self.nb.index = $btn.filter("[page="+ self.nb.page +"]").index();
			}else{
				self.fnSort2();
			};
		};
	},
	fnSort2: function(){
		//复杂排序
		var self = this,
			page = self.nb.page,
			pages = self.nb.pages,
			$btn = self.nb.$btn;
		//显示所有按钮
		showAll();
		function showAll(){
			self.nb.$prevBtn.show();
			self.nb.$nextBtn.show();
			$btn.show();
			$btn.eq(0).attr("page",1).text(1);
			$btn.eq(-1).attr("page",pages).text(pages);
		};
		//fnBefore
		if( page-1>=4 && pages-page<4 ){
			fnBefore();
		};
		//fnAfter
		if( page-1<4 && pages-page>=4 ){
			fnAfter();
		};
		//fnAll
		if( page-1>=4 && pages-page>=4 ){
			fnAll();
		};
		//前有...
		function fnBefore(){
			$btn.eq(1).addClass("disabled").text("...");
			for(var i=6,j=0; i>=2; i--){
				$btn.eq(i).attr("page",pages-j).text(pages-j);
				j++;
			};
		};
		//后有...
		function fnAfter(){
			$btn.eq(5).addClass("disabled").text("...");
			for( var i=1; i<5; i++ ){
				$btn.eq(i).attr("page",i+1).text(i+1);
			};
		};
		//前后都有...
		function fnAll(){
			$btn.eq(1).addClass("disabled").text("...");
			$btn.eq(5).addClass("disabled").text("...");
			$btn.eq(3).text(page).attr("page",page);
			$btn.eq(2).text(page-1).attr("page",page-1);
			$btn.eq(4).text(+page+1).attr("page",+page+1);
		};
		$btn.filter("[page="+ page+"]").addClass("active");
		self.nb.index = $btn.filter("[page="+ page+"]").index();
	}
};
FlipOver.prototype = proto;