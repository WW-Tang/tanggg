// $(function(){
var data = [
    {
        src: "./music/Joel Adams - Please Don't Go.mp3",
        name: "???"
    },
    {
        src: "./music/去年夏天.mp3",
        name: "王大毛"
    },
    {
        src: "./music/银临,Aki阿杰 - 牵丝戏.mp3",
        name: "银临/aki阿杰"
    },
    {
        src: "./music/周杰伦 - 说好不哭 [mqms2].flac",
        name: "周杰伦"
    },
    {
        src: "./music/不变的音乐-王绎龙.mp3",
        name: "王绎龙"
    },
    {
        src: "./music/seegeqiu.mp3",
        name: "Wiz Khalifa"
    },
    {
        src: "./music/hktk.mp3",
        name: "???"
    },
    {
        src: "./music/王绎龙-不变的音乐.mp3",
        name: "王绎龙"
    }
];


function Music(data, audio) {
    // 数据
    this.MusicData = data;
    // 原生h5播放器
    this.audio = audio;
    // 整个音乐列表的索引
    this.index = 0;
    // 音乐列表ul
    this.MusicList = document.getElementsByClassName("MusicList")[0];
    // li
    this.lis = this.MusicList.getElementsByTagName("li");

    // 前一首按钮
    this.parent = document.getElementsByClassName("btn-parent")[0];
    // 后一首按钮
    this.next = document.getElementsByClassName("btn-next")[0];
    // 播放按钮
    this.play = document.getElementsByClassName("play")[0];
    // 暂停按钮
    this.pause = document.getElementsByClassName("pause")[0];
    // 当前时间元素
    this.currentTimeElement = document.getElementsByClassName("current")[0];
    // 总时间元素
    this.totalTimeElement = document.getElementsByClassName("total")[0];
    // 添加总时长变量
    this.totalTime = 0;
    // 当前时间变量
    this.currentTime = -1;

    // 音量进度条
    this.volumeProgressBar = document.getElementsByClassName("volumeProgressBar")[0];
    // 音量进度条的点
    this.volume_dot = this.volumeProgressBar.getElementsByClassName("dot")[0];
    // 当前音量的进度条
    this.volume_xian = this.volumeProgressBar.getElementsByClassName("xian")[0];

    // 音乐时间进度条
    this.MyprogressBarTime = document.getElementsByClassName("MyprogressBarTime")[0];
    // 音乐时间进度条的点
    this.volumeTime_dot = this.MyprogressBarTime.getElementsByClassName("dot")[0];
    // 当前已播放音乐时间的进度条
    this.volumeTime_xian = this.MyprogressBarTime.getElementsByClassName("xian")[0];

    // 歌名
    this.songName = document.getElementsByClassName("songName")[0];
    // 歌手名字
    this.singerName = document.getElementsByClassName("singerName")[0];
}
Music.prototype = {
    constructor: Music,
    init: function () {
        // 绑定前一首按钮事件
        this.parentClick();
        // 绑定后一首按钮事件
        this.nextClick();
        // 绑定播放按钮事件
        this.playClick();
        // 绑定暂停按钮事件
        this.pauseClick();
        // 绑定点击进度条事件
        this.progressBarClick();
        // 绑定点击dot拖动事件
        this.dotClick();
        // 绑定缓冲完后获取总时间,并且实时更新进度条
        this.timeFunc();
        // 获取歌曲/歌手名字
        this.getText();
        // 第一次页面渲染，默认载入第一首歌曲
        this.audio.src = this.MusicData[this.index].src;
        // 载入歌曲列表
        var html = "";
        for (var i = 0; i < this.MusicData.length; i++) {
            html += "<li>";
            html += "    <div class='left'></div>";
            html += "    <div class='right'>";
            html += "        <h3>"+this.decodePath(this.MusicData[i].src)+"</h3>";
            html += "        <h5>"+this.MusicData[i].name+"</h5> <i class='glyphicon glyphicon-music'></i>";
            html += "    </div>";
            html += "</li>";
        }
        this.MusicList.innerHTML = html;
        this.MusicList.onclick = function(event){
            var _this = event.target;
            console.log(_this);
        }
        
    },
    // 绑定前一首按钮事件
    parentClick: function () {
        var _this = this;

        this.parent.onclick = this.beforeVolume.bind(this);
    },
    // 绑定下一首按钮事件
    nextClick: function () {
        var _this = this;

        this.next.onclick = this.afterVolume.bind(this);
    },
    // 上一首方法
    beforeVolume: function () {
        this.index--;
        if (this.index < 0) {
            this.index = this.MusicData.length - 1;
        }
        this.audio.src = this.MusicData[this.index].src;
        this.playFn(this.index);
    },
    // 下一首方法
    afterVolume: function () {
        // 索引自增
        this.index++;
        // 防止溢出
        if (this.index > this.MusicData.length - 1) {
            this.index = 0;
        }
        // 替换歌曲路径
        this.audio.src = this.MusicData[this.index].src;
        // 调用播放方法
        this.playFn(this.index);
    },

    // 播放按钮
    playClick: function () {
        // 播放或继续播放
        this.play.onclick = this.playFn.bind(this);
    },
    // 暂停按钮
    pauseClick: function () {
        // 暂停
        this.pause.onclick = this.pauseFn.bind(this);
    },
    // 播放方法
    playFn: function (index) {
        $(this.play).css("display", "none");
        $(this.pause).css("display", "block");
        this.audio.play();
    },
    // 暂停方法
    pauseFn: function () {
        $(this.play).css("display", "block");
        $(this.pause).css("display", "none");
        this.audio.pause();
    },
    // 获取歌名和歌手
    getText: function () {
        // 歌曲名字
        var volumeName = this.decodePath(this.MusicData[this.index].src);
        // 获取歌手名字
        var singer = this.MusicData[this.index].name;

        // 渲染到页面  this.songName.innerHTML = this.getText();
        this.songName.innerText = volumeName;
        this.singerName.innerText = singer;
    },
    // 点击dot拖动
    dotClick: function () {
        var _this = this;
        // volume改变音量,范围0-1
        // 音量的dot
        $(this.volume_dot).mousedown(function () {
            console.log(this);
            // _this.currentLeft0 = $(this).css("left");
            $(document).on("mousemove", function (event) {
                var moveX = event.pageX - $(_this.volumeProgressBar).offset().left;

                // 最大限制
                if (moveX > $(_this.volumeProgressBar).width() - $(_this.volume_dot).width()) {
                    moveX = $(_this.volumeProgressBar).width() - $(_this.volume_dot).width();
                }
                // 最小限制
                if (moveX < 0) {
                    moveX = 0;
                }

                $(_this.volume_dot).css("left", moveX);
                
                $(_this.volume_xian).css("width", moveX);
                // 比例计算
                var demo = moveX / $(_this.volumeProgressBar).width();
                
                if(demo){
                    _this.audio.volume = demo;
                }
                
            });
            $(document).mouseup(function () {
                $(this).off("mousemove");
            });
        });
        // 拖动音乐时间的dot
        $(_this.volumeTime_dot).mousedown(function () {
            // console.log("2按下事件触发");
            // _this.currentLeft1 = parseInt($(this).css("left"));

            // 鼠标按下，鼠标改变时间和点的位置比自动刷新优先级高
            _this.audio.ontimeupdate = null;

            $(document).on("mousemove", function (event) {
                event.preventDefault();//preventDefault
                // console.log("移动事件触发2");
                var moveX = event.pageX - $(_this.MyprogressBarTime).offset().left;
                // 最大限制
                if (moveX > $(_this.MyprogressBarTime).width() - $(_this.volumeTime_dot).width()) {
                    moveX = $(_this.MyprogressBarTime).width() - $(_this.volumeTime_dot).width();
                }
                // 最小限制
                if (moveX < 0) {
                    moveX = 0;
                }
                console.log(moveX);
                $(_this.volumeTime_dot).css("left", moveX);
                $(_this.volumeTime_xian).css("width", moveX);
                // 比例计算
                var demo = moveX / $(_this.MyprogressBarTime).width();
                var tempTime = _this.totalTime * demo;
                _this.currentTimeElement.innerHTML = _this.fromatTime(tempTime);

            });
            $(document).one("mouseup", function () {
                $(this).off("mousemove");

                // 松开后改变原生h5标签的实际时间
                _this.audio.currentTime = _this.decodeTime(_this.currentTimeElement.innerText);
                // 鼠标松开回复自动刷新时间和点的位置
                _this.audio.ontimeupdate = _this.UpdateTime.bind(_this);
                // _this.currentLeft1 = parseInt($(".MyprogressBarTime .dot").css("left"));
            });
        });
    },
    // 点进度条，改变当前时间，改变已播放进度条的width，改变点的left
    progressBarClick: function () {
        var _this = this;
        $(".dot").click(function (event) {
            event.stopPropagation();
        });
        // 时间的点
        $(_this.MyprogressBarTime).click(function (event) {
            // 点击后的鼠标位置 - 起点 = 移动距离
            var moveX = event.pageX - $(this).offset().left - $(_this.volumeTime_dot).width() / 2;
            if (moveX > $(this).width() - $(_this.volumeTime_dot).width() + $(_this.volumeTime_dot).width() / 2) {
                moveX = $(this).width() - $(_this.volumeTime_dot).width() + $(_this.volumeTime_dot).width() / 2;
            }
            // 改变点的left
            $(_this.volumeTime_dot).css("left", moveX + "px");
            // 改变已播放进度条的width
            $(_this.volumeTime_xian).css("width", moveX + "px");
            // 计算比例，改变当前时间
            var demo = moveX / $(this).width();
            _this.currentTime = _this.totalTime * demo;
            _this.currentTimeElement.innerHTML = _this.fromatTime(_this.currentTime);
            _this.audio.currentTime = _this.currentTime;
        });
        // 音乐的点
        // $(_this.volumeProgressBar).click(function (event) {
        //     console.log("音乐进度条被点击了");
        //     // 点击后的鼠标位置 - 起点 = 移动距离
        //     var moveX = event.pageX - $(this).offset().left - $(_this.volume_dot).width();
        //     if (moveX > $(this).width() - $(_this.volume_dot).width()) {
        //         moveX = $(this).width() - $(_this.volume_dot).width();
        //     }
        //     // 改变点的left
        //     $(_this.volume_dot).css("left", moveX + "px");
        //     // 改变已播放进度条的width
        //     $(_this.volume_xian).css("width", moveX + "px");
        //     // 计算比例
        //     var demo = moveX / $(_this.volumeProgressBar).width();
        //     // console.log(demo, moveX);
        //     // if(demo){
        //     //     _this.audio.volume = demo;
        //     // }
            
        // });
    },
    timeFunc: function () {
        var _this = this;


        // 获取总时长要等缓冲可播放状态
        this.audio.oncanplay = function () {
            // 读取原生h5播放标签的总时长属性
            _this.totalTime = _this.audio.duration;
            // 格式化后在渲染到页面
            _this.totalTimeElement.innerHTML = _this.fromatTime(_this.totalTime);
            // 获取歌曲名字
            _this.getText();
        }
        // 绑定每播放一秒就触发的事件,实现实时更新当前时间与时间进度条
        this.audio.ontimeupdate = _this.UpdateTime.bind(this);

    },
    // 每播放一秒就触发的事件,实现实时更新当前时间与时间进度条
    UpdateTime: function () {
        // 读取原生h5播放标签的当前已播放的时长
        this.currentTime = this.audio.currentTime;
        // console.log(this.currentTime);
        // 格式化后再渲染页面
        this.currentTimeElement.innerHTML = this.fromatTime(this.currentTime);

        // 计算比例,并渲染进度条
        var demo = this.currentTime / this.totalTime;
        // console.log(demo, this.currentTime, this.totalTime);
        // dot可移动的总范围 * 比例
        // console.log(this.MyprogressBar.offsetWidth, this.dot.offsetLeft, $(this.dot).offset().left);
        var max = this.MyprogressBarTime.offsetWidth - this.volumeTime_dot.offsetWidth;
        // console.log(max, demo);
        $(this.volumeTime_dot).css("left", max * demo + "px");
        $(this.volumeTime_xian).css("width", $(this.volumeTime_dot).position().left);

        // 判断是否已经播放完当前歌曲
        // 第一种方式：当前时间 大于等于 总时长, 有bug，因为当前时间和总时间的初始值一样的时候，会一直下一首，死循环
        // console.log(this.currentTime, this.totalTime);
        // console.log(this.currentTime >= this.totalTime);
        // if (this.currentTime > this.totalTime) {

        // 第二种：根据原生属性返回的布尔值，为真时则播放完毕，为假则还在继续播放
        // 原生h5标签属性返回布尔值
        // console.log(this.audio.ended);

        if (this.audio.ended) {//可调用下一首函数
            this.afterVolume();
        }

    },
    // 格式化时间
    fromatTime: function (time) {
        // 毫秒转换小时
        // var h = Math.floor(time / 3600);
        // h = h < 10? "0" + h : h;
        // 秒转换成分种
        var m = Math.floor(time / 60);
        m = m < 10 ? "0" + m : m;
        // 毫秒转换成分钟之后的余数就是秒数
        var s = Math.floor(time % 60);
        s = s < 10 ? "0" + s : s;
        return m + ":" + s;
    },
    // 解析格式化后的时间,将分秒转换成秒
    decodeTime: function (str) {
        // 03:12  01:05
        var arr = str.split(":");
        var m = parseInt(arr[0]);
        m = m * 60;//秒数
        var s = parseInt(arr[1]);
        // s = (s+m) * 1000;
        // console.log(str, s+m);
        return s + m;
    },
    // 处理路径，提取歌曲名
    decodePath : function(str){
        var startIndex = str.indexOf("./music/");
        var endIndex = str.indexOf(".mp3");
        str = str.slice(8, endIndex);
        return str;
    }
};


// 运行代码
console.log($("audio"));
var m1 = new Music(data, $("audio")[0]);
console.log(m1);
m1.init();
// })