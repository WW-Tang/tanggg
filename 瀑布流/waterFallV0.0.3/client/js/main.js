(function(){
    // 1.0 定义函数
    function Page(){
        // 添加
        this.el = document.querySelector('.d-contain ul');
        this.loading = document.querySelector('.d-loading');
        this.width = 232;
        this.columnCount = 5;
        this.space = 10;
        this.data = [];
        this.arrHeight = [];
        this.path = 'http://127.0.0.1/www/day07/waterFallV0.0.3/server/data.php';
        this.bool = true;
        this.num = 0;
    }
    // 2.0 原型属性 初始化方法
    Page.prototype.init = function(){
         // 记录系统对象
        var _this = this;
        // 调用获取数据的方法  第一页
        this.dataFunc(1,15,function(data){
            // console.log(data)
            if(data.length == 0){
                return ;
            }
            // 隐藏正在加载盒子
            _this.loading.style.display = "none";
            // 渲染数据
            _this.render(data)
        })
        // 调用滚动加载
        this.scrollFunc();
    }
    // 3.0 获取数据并提前加载图片
    Page.prototype.dataFunc = function(page2,pageSize2,callback){
        // 记录系统对象
        var _this = this;
        // 调用ajax
        this.ajax({
            url:this.path,
            type:'get',
            data:{
                page:page2,
                pageSize:pageSize2
            },
            beforeSend:function(){
                // console.log(_this.loading)
                // 正在加载
                // _this.loading.classList.remove('active');
                // _this.loading.className="d-loading"
                _this.loading.style.display = "block";
                // 设置bool为false
                _this.bool = false;
            },
            success:function(res){
                // 判断res是否有值
                if(typeof res === 'undefined' || res === null) { return ;}
                // 记录页码 用于下一次请求数据
                _this.loading.setAttribute('data-page',res.page);

                // console.log(res)
                // if(callback)callback();
                // 获取图片尺寸信息
                // 定义一个计数器变量
                var count = 0;
                // 定义数组
                var newArr = [];
                // 图片数量
                var total = res.result.length;//10
                // 循环服务端响应的数据
                for(var i = 0 ; i < total; i++ ){
                    // 每循环一次获取一个图片的信息
                    var image = new Image();
                    // 请求图片资源
                    image.src = res.result[i].src;
                    // 加载图片
                    image.onload = function(){
                        // 该变量用于判断图片是否加载完毕
                        count ++;
                        // 
                        _this.num ++;
                        // 定义对象 存放图片信息
                        var obj = {width:this.width,height:this.height,text:'第'+_this.num+'张图片',src:this.src}
                        // 往数组里面添加每张图片信息
                        // _this.arrHeight.push(obj)
                        newArr.push(obj);
                        // 判断图片是否加载完毕
                        if(count === total){ 
                            // 调用回调函数
                            // if(callback)callback(_this.arrHeight);
                            if(callback)callback(newArr);
                            // bool
                        }
                    }
                }
            },
            error:function(err){
                console.log(err)
            }
        })
    }
    // 4.0 封装ajax
    Page.prototype.ajax = function(option){
        // 请求方式
        var type = option.type;
        // 请求数据地址
        var url = option.url;
        // 提交给服务端的参数
        var data = option.data; //{page:1,pageSize:5} --- > page=1&pageSize=5
        // 拼接参数
        var dataStr = '';
        // 循环
        for(var  k in data){
            dataStr += k+"="+data[k]+"&"
        }
        // page=1&pageSize=5&
        // dataStr = dataStr && dataStr.slice(0,-1);
        if(dataStr) {
            dataStr = dataStr.slice(0,-1);
        }
        // ajax XMLHttpRequest()
        var xhr ; //定义变量接收 异步对象的实例
        if(window.XMLHttpRequest){
            xhr = new XMLHttpRequest();
        }else {
            xhr = new ActiveXObject('Microsoft.XMLHTTP');// IE 678
        }
        // 监听请求响应状态
        xhr.onreadystatechange = function(){
            // console.log(xhr.readyState)
            // 请求之前
            if(xhr.readyState < 4){
                if(option.beforeSend){
                    option.beforeSend()
                }
            }
            // 请求完成
            if(xhr.readyState === 4){
                // 响应成功
                if (xhr.status == 200) {
                    // 响应报文
                    var res = xhr.responseText;
                    // 判断变量的数据类型  
                    res = typeof res === 'string' ? JSON.parse(res) : res;
                    if(option.success){
                        option.success(res)
                    }
                }else {
                    // 响应报文
                    var err = xhr.responseText;
                    if(option.error){
                        option.error(err)
                    }
                }
            }
        }
        // 发请求
        xhr.open(type,url+"?"+dataStr,true);
        // 发送请求主体
        xhr.send(null)
    }
    // .5.0 渲染数据
    Page.prototype.render = function(data){
        console.log(data);
        var html = '';
        for(var i = 0 ; i < data.length ; i++){
            html +='<li>'
            html +='    <a  style="height:'+data[i].height+'px;" href="javascript:;">'
            html +='        <span style="height:'+data[i].height+'px;" class="img-loading"></span>'
            html +='        <img style="height:'+data[i].height+'px;" src="'+data[i].src+'?'+(new Date().getTime())+'" alt="">';
            html +='    </a>'
            html +='    <p>'+data[i].text+'</p>'
            html +='</li>'
        }
        // 渲染字符串
        this.el.innerHTML = html;
        //获取指定的li并且
        var items = this.el.querySelectorAll('li');
        var icons = this.el.querySelectorAll('.img-loading');
        // 开始瀑布流布局
        this.waterfall(items);
        // 隐藏正在加载的图标
        this.loadHide(icons);
        // 设置bool为true
        this.bool = true;
    }
    // 6.0 实现瀑布流布局
    Page.prototype.waterfall = function(items){
        // console.log('test')
        // 定义空数组 一行放多少个
        var arr = [];
        // 循环li标签数组
        for(var i = 0 ; i < items.length;i++){
            // 获取li标签高度
            var h = items[i].offsetHeight;
            // 多少列 5列
            if(i < this.columnCount){
                // 第一行高度 总共5个高度
                arr.push(h)
                // 第一行li标签的位置
                items[i].style.left=(this.width + this.space)*i + "px";
                items[i].style.top = 0;
            }else {
                // 第六张开始
                var min = arr[0];
                var minIndex = 0;
                var max = 0;
                // 循环 寻找数组最小值
                for(var j = 0 ; j < arr.length ; j++){
                    // 判断假设值是否比下一个值大
                    if(min > arr[j]){
                        min = arr[j]; //把最小值赋给 min变量
                        minIndex = j; //数组中最小值的索引值
                    }
                    // 数组最大值
                    if(max < arr[j]){
                        max = arr[j]
                    }
                }
                 // 设置ul标签的高度
                this.el.style.height = max +"px";
                // 设置第六张li标签开始的位置
                items[i].style.left = (this.width + this.space) * minIndex +"px";
                items[i].style.top = (min + this.space) + "px";
                // 更新arr数组的最小值的高度
                arr[minIndex] += h + this.space;
            }
        }
    }
    // 7.0 隐藏加载图标
    Page.prototype.loadHide = function(icons){
        for(var i =  0 ; i< icons.length ; i++){
            icons[i].style.display = 'none';
        }
    }
    // 8.0 滚动加载
    Page.prototype.scrollFunc = function(){
        // 记录this对象
        var _this = this;
        // 滚动事件
        window.onscroll = function(){
             // 页面的高度  A 
            // var pageHeight = document.body.scrollHeight ;
            var pageHeight = document.body.offsetHeight ;
            // 浏览器可视区高度  B 
            var clientHeight = window.innerHeight;
             // 页面超出浏览器顶部高度  C
             var ttop = document.body.scrollTop || document.documentElement.scrollTop;
             // A - B - C
             var result =  pageHeight - clientHeight - ttop;
            //  console.log(pageHeight , clientHeight ,ttop ,result )
            //  判断页面剩余高度
            console.log(result,_this.bool)
            if(result <= 0){
                // 允许加载
                if(_this.bool){
                   
                    // 获取页码
                    var page = _this.loading.getAttribute('data-page');
                    console.log(page,'页码')
                    // 调用获取数据的方法
                    _this.dataFunc(page,15,function(data){
                        // console.log(data)
                        if(data.length == 0){
                            return ;
                        }
                        // 隐藏正在加载盒子
                        _this.loading.style.display = "none";
                        // 渲染数据
                        _this.render(data)
                    })
                }
            }
        }
      
        // A - (B + C )  
    }
    // 创建实例
    var page = new Page()
    // 初始化
    page.init();




    //
    function sleep(second){
        var start = new Date().getTime();
        while((new Date().getTime()-start) < second){
            continue;
        }
    }
    // console.log(1111)
    // sleep(1000)
    // console.log(2222)

})()