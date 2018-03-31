<?php
ini_set('display_errors',1);            //错误信息  
ini_set('display_startup_errors',1);    //php启动错误信息
$f=$_GET['f'];
$api=[
    "live"=> "https://plive.48.cn/livesystem/api/live/v1/memberLivePage",
    "liveOpen" => "https://plive.48.cn/livesystem/api/live/v1/openLivePage",
    "liveInfo" => "https://plive.48.cn/livesystem/api/live/v1/getLiveOne",
    "login"=> "https://puser.48.cn/usersystem/api/user/v1/login/phone",
    "roomId" => "https://pjuju.48.cn/imsystem/api/im/room/v1/login/user/list",
    "roomMain" => "https://pjuju.48.cn/imsystem/api/im/v1/member/room/message/mainpage",
    "roomBoard" => "https://pjuju.48.cn/imsystem/api/im/v1/member/room/message/boardpage",
];
foreach($_POST as $key => $value) {
    $post=$key;
}
var_dump($post);
//var_dump(getallheaders());
$headers=getallheaders();
//var_dump($headers);
$header=array();
if (isset($headers['os'])) array_push($header,'os: '.$headers['os']);
if (isset($headers['version'])) array_push($header,'version: '.$headers['version']);
if (isset($headers['token'])) array_push($header,'token: '.$headers['token']);
if (isset($headers['imei'])) array_push($header,'imei: '.$headers['imei']);
array_push($header, 'Content-type: application/json');
$ch = curl_init($api[$f]);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
$result = curl_exec($ch);
echo $result;
?>