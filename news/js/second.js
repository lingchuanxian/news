mui.init({
	preloadPages: [{ //预加载目标页面
		'url': '../page/detail.html',
		'id': 'detail'
	}],
	pullRefresh: {
		container: '#pullrefresh',
		down: {
			style: 'circle', //必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
			color: '#2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
			height: '50px', //可选,默认50px.下拉刷新控件的高度,
			range: '100px', //可选 默认100px,控件可下拉拖拽的范围
			offset: '44px', //可选 默认0px,下拉刷新控件的起始位置
			callback: pulldownRefresh //根据具体业务来编写，比如通过ajax从服务器获取新数据；
		},
		up: {
			auto: true,
			contentrefresh: '正在加载...',
			callback: pullupRefresh
		}
	}
});

mui.plusReady(function() {
	initData(1);
	mui(".mui-table-view").on('tap', '.mui-table-view-cell', function() {
		//获取id
		var id = this.getAttribute("id");
		//传值给详情页面，通知加载新数据
		var detailPage = null;
		//获得详情页面  
		if(!detailPage) {
			detailPage = plus.webview.getWebviewById('detail');
		}
		mui.fire(detailPage, 'getDetail', {
			id: id
		});
		//打开新闻详情
		mui.openWindow({
			id: 'detail'
		});
	});

	mui('.mui-off-canvas-wrap').offCanvas('show');
});

function initData(flag) {
	mui.ajax('http://v.juhe.cn/weixin/query', {
		data: {
			pno: 1,
			ps: 20,
			key: 'd975b5fe029c0691fe5d683cb68b86ac'
		},
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		timeout: 10000, //超时时间设置为10秒；
		beforeSend: function() {
			if(flag == 1) {
				plus.nativeUI.showWaiting();
			}
		},
		complete: function() {
			if(flag == 1) {
				plus.nativeUI.closeWaiting();
			}
		},
		success: function(data) {
			var obj = eval(data);
			var table = document.body.querySelector('.mui-table-view');
			mui.each(obj.result.list, function(idx, item) {
				var li = document.createElement('li');
				li.className = 'mui-table-view-cell mui-media';
				li.id = item.url;
				var a = document.createElement('a');
				a.href = "javascript:;";
				var img = document.createElement("img");
				img.className = "mui-media-object mui-pull-right";
				img.src = item.firstImg;
				var div = document.createElement("div");
				div.className = "mui-media-body";
				div.innerHTML = item.title + '<p class="mui-ellipsis">' + item.title + '</p>';
				a.appendChild(img);
				a.appendChild(div);
				li.appendChild(a);
				table.appendChild(li);
			});
		},
		error: function(xhr, type, errorThrown) {
			console.log(type);
			mui.toast(type);
		}
	});

}

/**
 * 下拉刷新具体业务实现
 */
function pulldownRefresh() {
	setTimeout(function() {
		initData(0);
		mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
	}, 1500);
}
/**
 * 上拉加载具体业务实现
 */
var pno = 1;

function pullupRefresh() {
	pno = pno + 1;
	console.log("pno:" + pno);
	mui.ajax('http://v.juhe.cn/weixin/query', {
		data: {
			pno: pno,
			ps: 20,
			key: 'd975b5fe029c0691fe5d683cb68b86ac'
		},
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		timeout: 10000, //超时时间设置为10秒；
		success: function(data) {
			var obj = eval(data);
			var table = document.body.querySelector('.mui-table-view');
			mui.each(obj.result.list, function(idx, item) {
				var li = document.createElement('li');
				li.className = 'mui-table-view-cell mui-media';
				li.id = item.url;
				var a = document.createElement('a');
				a.href = "javascript:;";
				var img = document.createElement("img");
				img.className = "mui-media-object mui-pull-right";
				img.src = item.firstImg;
				var div = document.createElement("div");
				div.className = "mui-media-body";
				div.innerHTML = item.title + '<p class="mui-ellipsis">' + item.title + '</p>';
				a.appendChild(img);
				a.appendChild(div);
				li.appendChild(a);
				table.appendChild(li);
			});
			mui('#pullrefresh').pullRefresh().endPullupToRefresh();
		},
		error: function(xhr, type, errorThrown) {
			console.log(type);
			mui.toast(type);
		}
	});
}

