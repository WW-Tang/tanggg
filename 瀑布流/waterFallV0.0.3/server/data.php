<?php
    header('Content-Type:text/html;charset=utf-8');
    // 接收前端参数 page  页码
    $page  = $_GET['page'];
    // 接收前端参数 pageSize 数量
    $pageSize = $_GET['pageSize'];
    // 定义数组
    $data = array();
    // 循环创建数据
    for($i = 1 ; $i < 99 ; $i++){
        array_push($data,array('src'=>'http://127.0.0.1/www/day07/static/images/'.$i.'.jpg','text'=>'第'.$i.'张图片'));
    }
    // 数据切割的开始索引值
    $start  = ($page-1) * $pageSize;
    // 数组切割 参数：1.数组 2.开始索引值 3.数量
    $res = array_slice($data, $start ,$pageSize);
    // 延迟函数
    sleep(1);
    //页码 +1
    $page++ ;
    // JSON_UNESCAPED_UNICODE
    // 返回数组（响应给前端的文档文本）
    echo json_encode(array('page'=>$page,'result'=>$res));
?>