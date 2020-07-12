// 1.0 编写缓动函数
// var  index = 0; //这个方式可以记录某个值
// div.timer = 0;//这个方式也可以记录某个值
function animate(dom , option){// 把目标值存在对象 option
    // 2.0.1 先清除定时器
    clearInterval(dom.timer);
    // 2.0.2 定时器 
    dom.timer = setInterval(function(){
        // 2.0.3 定义一个字段 用于判断所有的属性是否达到目标值
        var isChange = true;//如果是true表示所有的属性都已经达到目标值
        // 2.0.4 遍历对象 option
        for(var k  in option){
            // 2.0.5 计算步长
            // 当前值getComputedStyle(dom,null)[k]
            var currentVal = parseInt(getComputedStyle(dom,null)[k]);
            // 目标值option[k]   不确定是否带px 
            var targetVal =  parseInt(option[k]);
            // 2.0.6 步长 ： (目标值 - 当前)/数字
            var speed = (targetVal - currentVal) / 5 ;
            // 2.0.7 步长带小数点  0.2 ===>  1 向上取整 :  -0.2 ===> -1 向下取整
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
            // 2.0.8 判断所有的属性是否到达目标值了 ，如果其中一个属性没达到
            if(currentVal != targetVal){
                isChange = false;
            }
            // 2.0.9设置dom的样式
            dom.style[k] = currentVal + speed + "px";
        }
        
        if(isChange){//2.0.10 所有的属性都已经到达目标值
            // 2.0.11 停止定时器
            clearInterval(dom.timer);
            // console.log('test')//判断定时器是否停止了
            // callback
            // 2.0.12 终止代码
            return;
        }
    }, 30);
}



// ======================================================================
// 2.0 编写缓动函数
// var  index = 0; //这个方式可以记录某个值
// div.timer = 0;//这个方式也可以记录某个值
function changeStyle(dom , option , callback){// 把目标值存在对象 option
    dom.timer = null;
    // 2.0.1 先清除定时器
    clearInterval(dom.timer);
    // 2.0.2 定时器 
    dom.timer = setInterval(function(){
        // 2.0.3 定义一个字段 用于判断所有的属性是否达到目标值
        var isChange = true;//如果是true表示所有的属性都已经达到目标值
        // 2.0.4 遍历对象 option
        for(var k  in option){
            // 2.0.5 计算步长
            // 当前值getComputedStyle(dom,null)[k]
            var currentVal = parseInt(getComputedStyle(dom,null)[k]);
            // 目标值option[k]   不确定是否带px 
            var targetVal =  parseInt(option[k]);
            // 2.0.6 步长 ： (目标值 - 当前)/数字
            var speed = (targetVal - currentVal) / 10 ;
            // 2.0.7 步长带小数点  0.2 ===>  1 向上取整 :  -0.2 ===> -1 向下取整
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
            // 2.0.8 判断所有的属性是否到达目标值了 ，如果其中一个属性没达到
            if(currentVal != targetVal){
                // 只要有其中的一个属性 没达到目标值 
                isChange = false;
            }
            // 2.0.9设置dom的样式
            // dom.style.width = dom.style['width']
            dom.style[k] = currentVal + speed + "px";
        }
        
        if(isChange){//2.0.10 所有的属性都已经到达目标值
            // 2.0.11 停止定时器
            clearInterval(dom.timer);
            console.log('test')//判断定时器是否停止了
            // callback 判断是否存在回调函数  存在 就调用
            if(callback){callback()}
            // 2.0.12 终止代码
            return;
        }
    }, 30);
}



// ======================================================================
 // 3.0 编写一个方法 获取兄弟元素
 function siblings(selector){
    // 2.0 获取指定元素
    var ele = selector || document.getElementsByClassName(selector)[0];
    // 3.0 获取指定元素的父节点 父节点的子元素 [数组]
    var children = ele.parentNode.children;
    //console.log(children);//子元素[数组]
    // 4.0 定义一个空数组 存放兄弟元素节点
    var arr = [];
    // 5.0 循环子元素[数组]
    for(var i = 0 ; i < children.length ; i++){
        // 6.0 把不是ele(li.active)标签 添加的空数组
        if(children[i]!=ele){
            //7.0 往空数组里 添加非ele的元素
            arr.push(children[i]);
            // ....
        }
    }
    // console.log(arr);
    return arr; //返回值 就是ele的兄弟元素[数组]
}

// ======================================================================
// 4.0 获取指定元素
function query(selector){
    // 字符串  indexOf()
    if(selector.indexOf("#") >-1){
        var str = selector.slice(1);
        // console.log(selector , '---->',str);
        // 获取指定id的元素
        return document.getElementById(str);
    }else if(selector.indexOf(".")>-1){
        //.btn
        var str = selector.slice(1);// 1是字符串的索引值 从1开始截取指定字符 btn
        // 获取指定类名的元素
        return  document.getElementsByClassName(str)[0];// 在IE低版本不支持这个方法
    }else {
        // 获取指定标签名的元素
        return document.getElementsByTagName(selector)[0];
    }
}
// 思考：既然IE低版本浏览器不支持 getElementsByClassName() 这个方法  
// 以后，我就是通过类名来获取指定元素 ，该如何封装这个一个方法 ?
// document.getElementsByTagName();
// document.getElementById();
// 获取class的值 ，字符串操作

// 5.0 获取指定元素的css属性值
// 读       获取属性值 window.getComputedStyle(dom , null)['width']
// 写 / 读  设置属性值 dom.style.width
function getStyleVal(dom,property ,demo){
    // 判断是否传伪类 
    var demo = demo || null;
    // 判断是否支持 getComputedStyle
    if(window.getComputedStyle){
        // console.log("getComputedStyle  方法")
        return window.getComputedStyle(dom ,demo)[property];
    }else {
        // console.log('currentStyle   属性')
        return dom.currentStyle[property];
    }
}



// ======================================================================
// 1.0 通过类名获取页面指定的元素
function byClassName(selector){
    // 2.0 定义空数组 记录指定获取的元素
    var AEle = [];
    // 3.0 获取页面所有的元素
    var aTag = document.body.getElementsByTagName("*");
    // 4.0 定义数组 存放所有标签的类名
    var aClassName = [];
    for(var i = 0 ; i < aTag.length ; i++){
        // 5.0 把每个元素的类名 [ box , active ]
        aClassName.push(aTag[i].className.split(" "));
        // 6.0 循环类名数组  
        for(var k = 0 ; k < aClassName[i].length ; k++){
            // 7.0 判断传进的类名  和数组的类名是否一致
            if(selector === aClassName[i][k] ){
                // 8.0 如果是一致的 ， 说明该元素就是我们指定获取的元素
                AEle.push(aTag[i]);
            }
        }
    }
    // 返回值数组
    return  AEle;
}
