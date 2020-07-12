window.onload=function(){
    var banner = document.getElementsByClassName("banner")[0];
var wrapper = document.getElementsByClassName("wrapper")[0];
console.log(wrapper);

var ulBox = wrapper.getElementsByTagName("ul")[0];
var lis = ulBox.getElementsByTagName("li");

var pagation = document.getElementsByClassName("pagation")[0];
var points = pagation.getElementsByTagName("li");

var leftBtn = document.getElementsByClassName("left-btn")[0];
var rightBtn = document.getElementsByClassName("right-btn")[0];

var index=0;
var key=0;
var count=lis.length;
var width=900;
var timer=null;
function setPoints(){
    for(var i=0;i<points.length;i++){
        points[i].classList.remove("active");
    }
    points[key].classList.add("active");
}
function autoPlay(){
    index ++;
    key ++;
    if(index>count-1){
        index=1;
        ulBox.style.marginLeft=0+"px";
    }
    animate(ulBox,{
        marginLeft:-index*width
    })
    key=key>4?0:key;
    setPoints();
}
timer=setInterval(autoPlay,2000);
banner.addEventListener('mouseenter',function(){
    clearInterval(timer);
})
banner.addEventListener('mouseleave',function(){
    clearInterval (timer)
    timer=setInterval(autoPlay,2000);
})
leftBtn.onclick=function(){
    index--;
    key--;
    if(index<0){
        index=count-2;
        ulBox.style.marginLeft=-(count-1)*width+"px";
    }
    animate(ulBox,{
        marginLeft:-index*width
    })
    key=key<0?4:key;
    setPoints();
}
rightBtn.onclick = function(){
    //
    index ++;
    key ++; 
    if(index > count-1){
        index = 1 ;
        ulBox.style.marginLeft = "0px";
    }
    // 设置ul标签位置
    animate(ulBox , {
        marginLeft:-index * width
    })
    // 设置导航点
    key = key > 4 ? 0 : key ;
    setPoints();
}
for(var j=0;j<points.length;j++){
    points[j].index=j;
    points[j].onclick=function(){
        key.index=this.index;
        animate(ulBox,{
            marginLeft:-index*width
        })
        setPoints();
    }
}
}