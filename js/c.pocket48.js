/*
功能
1>获得Token
    使用：
    c.pocket48.getToken(data,callback);
    参数：
    data={username:'',password=''}
    username 用户名
    password 密码
    callback 回调函数
    返回：
    callback(token,e);
    返回参数：
    token={token:''} 获得的token
2>成员信息 Info
    使用：
    c.pocket48.getInfo(data,callback);
    参数：
    data=null
    返回：
    callback(info,e);
    返回参数：
    info 团体、队伍、成员信息
3>成员直播 Live
    使用：
    c.pocket48.getLive(data,callback);
    参数：
    data={lastTime:'',limit:'',memberId:'',groupId:''};
    lastTime 截止时间
    limit 数量上限
    memberId 成员id
    groupId 团体id
    callback 回调函数
    返回：
    callback(liveInfo,e);
    返回参数：
    liveInfo 成员直播数据
4>公演录播/直播 LiveOpen
    使用：
    c.pocket48.getLiveOpen(data,callback);
    参数：
    data={lastTime:'',limit:'',groupId:'',isReview:''};
    lastTime 截止时间
    limit 数量上限
    groupId 团体id
    isReview 0直播 1录播
    callback 回调函数
    返回：
    callback(OpenLive,e,isReview);
    返回参数：
    Openlive 公演直播/录播数据
    isReview 是否为录播
5 公演详情 LiveOpenInfo
    使用
    c.pocket48.getLiveOpenInfo(data,callback);
    参数：
    data={liveId:''}
    liveId 公演id
    返回：
    callback(OpenLiveInfo,e);
    返回参数：
    OpenLiveInfo={res,liveId,isReview} 公演直播/录播详情
6>获取房间id和基本信息 RoomId
    使用：
    c.pocket48.getRoomId(data,callback);
    参数：
    data={memberId:'',token:''}
    memberId 成员Id
    token
    返回：
    callback(data,e);
    返回参数：
    data={res,lastTime,limit}
    res 含有房间id信息
7 获取房间内容 RoomMain
    使用：
    c.pocket48.getRoomMain(data,callback);
    参数：
    data={roomId:'',lastTime:'',limit:''}
    roomId 房间id
    lastTime 截止时间
    limit 数量上限
    返回：
    callback(roomMain,e);
8 获取房间右墙 RoomBoard
    使用：
    c.pocket48.getRoomBoard(data,callback);
    参数：
    data={roomId,lastTime,limit}
    roomId 房间id
    lastTime 截止时间
    limit 数量上限
    返回：
    callback(roomBoard,e);

内部功能
1 设置token
    c.pocket48.setToken(token);
2 获取cookie中的token
    c.pocket48.token();
3 删除cookie中的token
    c.pocket48.delToken();
*/

var $$ = $$ || mdui.JQ; //引入mdui.JQ
var c = c || {};
//通用功能
c.cookie = c.cookie || (function(){
    c=c||{};c.cookie={};
    //获取cookie值
    c.cookie.get=function(name){
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
        else
        return '';
    };
    //设置cookie
    c.cookie.set=function(name,value,expiredays){
        var exdate=new Date();
        exdate.setDate(exdate.getDate()+expiredays);
        document.cookie=name+ "=" +escape(value)+((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
    };
    //删除cookie
    c.cookie.del=function(name){ 
        var exp = new Date(); 
        exp.setTime(exp.getTime() - 1); 
        var cval=this.getCookie(name); 
        if(cval!=null) 
        document.cookie= name + "="+cval+";expires="+exp.toGMTString(); 
    };
    return c.cookie;
})();
//调试debug信息
//c.d(level),当level<=debug等级时，返回true
c.d = c.d || (function(){
    var debug=1;
    c=c||{};
    c.d=function(level){
        if (level<=debug){
            return true
        } else {
            return false
        }
    };
    return c.d;
})();
//核心功能
c.pocket48 = c.pocket48 || (function(){
    c=c||{};c.pocket48={};
    //版本号
    c.pocket48.version='2.4.0';

    //口袋48 api
    c.pocket48.api={
        sync: "https://psync.48.cn/syncsystem/api/cache/v1/update/overview",
        live: "https://plive.48.cn/livesystem/api/live/v1/memberLivePage",
        liveOpen: "https://plive.48.cn/livesystem/api/live/v1/openLivePage",
        liveInfo: "https://plive.48.cn/livesystem/api/live/v1/getLiveOne",
        login: "https://puser.48.cn/usersystem/api/user/v1/login/phone",
        roomId: "https://pjuju.48.cn/imsystem/api/im/room/v1/login/user/list",
        roomMain: "https://pjuju.48.cn/imsystem/api/im/v1/member/room/message/mainpage",
        roomBoard: "https://pjuju.48.cn/imsystem/api/im/v1/member/room/message/boardpage",
    };

    //跨域代理 api
    c.pocket48.apiProxy = c.pocket48.api = {
        sync: "./proxy.php?f=sync",
        live: "./proxy.php?f=live",
        liveOpen: "./proxy.php?f=liveOpen",
        liveInfo: "./proxy.php?f=liveInfo",
        login: "./proxy.php?f=login",
        roomId: "./proxy.php?f=roomId",
        roomMain: "./proxy.php?f=roomMain",
        roomBoard: "./proxy.php?f=roomBoard",
    };

    //url前缀
    c.pocket48.url = {
        liveShare: "https://h5.48.cn/2017appshare/memberLiveShare/index.html?id=",
        livePic: "https://source.48.cn",
    };

    //团体、成员、队伍信息处理
    c.pocket48.info = {};
    c.pocket48.newInfo = function(s){
        if(c.d(1)){console.log('c.pocket48.newInfo',s)}
        //groupId: groupName
        this.group={};
        //teamId: [groupId,groupName,color]
        this.team={};
        //memberId: [realName,groupId,teamId,periodId,status,firstTeam]
        this.member={};
        for (var i in s.content.group) {
            this.group[s.content.group[i].group_id]=s.content.group[i].group_name;
        }
        for (var i in s.content.team){
            this.team[s.content.team[i].team_id]=[
                s.content.team[i].group_id,
                s.content.team[i].team_name,
                s.content.team[i].color
            ];
        }
        for (var i in s.content.memberInfo){
            this.member[s.content.memberInfo[i].member_id]=[
                s.content.memberInfo[i].real_name,
                s.content.memberInfo[i].city,
                s.content.memberInfo[i].team,
                s.content.memberInfo[i].period,
                s.content.memberInfo[i].status,
                s.content.memberInfo[i].first_team
            ];
        }
        this.team['0']=[0,'官方','90CCEA'];
        this.groupId2name = function(groupId){
            if (this.group[groupId]){
                return this.group[groupId];
            }
        };
        this.groupId2firstTeamId = function(groupId){
            if (this.group[groupId]){
                for (var teamId in this.team){
                    if(this.team[teamId][0]==groupId){return teamId;}
                }
            }
        };
        this.teamId2name = function(teamId){
            if (this.team[teamId]){
                return this.team[teamId][1];
            }
        };
        this.teamId2color = function(teamId){
            if (this.team[teamId]){
                return this.team[teamId][2];
            }
        };
        this.memberId2name = function(memberId){
            if (this.member[memberId]){
                return this.member[memberId][0];
            }
        };
        this.memberId2teamId = function(memberId){
            if (this.member[memberId]){
                return this.member[memberId][2];
            }
        };
    }

    //通用headers
    c.pocket48.headers = function(){
        this['Content-Type'] = 'application/json';
        this.version = '5.3.2';
        this.os = 'Android';
        this.build = 0;
        this.token = c.pocket48.token();
        this.imei = c.pocket48.imei();
    };

    //1 登录并获取token
    c.pocket48.getToken = function(data,callback){
        var ajax={
            method: 'POST',
            url: c.pocket48.api.login,
            headers: new c.pocket48.headers(),
            data: JSON.stringify({
                "password": data.password,
                "account": data.username,
                "longitude":0,
                "latitude":0
            }),
            success: function(res){
                callback(res,0);
            },
            error: function(xhr, textStatus){
                callback({},textStatus);
            },
        };
        if(c.d(0)){console.log('Request:',ajax)}
        $$.ajax(ajax);
    };

    //2 更新成员信息
    c.pocket48.getInfo = function(data,callback){
        var ajax={
            method: 'POST',
            url: c.pocket48.api.sync,
            headers: new c.pocket48.headers(),
            data: JSON.stringify({
                "videoTypeUtime": "2010-03-24 15:59:11",
                "musicAlbumUtime": "2010-04-18 14:45:37",
                "functionUtime": "2010-10-17 15:00:00",
                "groupUtime": "2010-10-17 17:27:00",
                "memberInfoUtime": "2010-10-20 11:55:09",
                "talkUtime": "2010-05-05 18:04:52",
                "videoUtime": "2010-05-17 18:36:32",
                "musicUtime": "2010-05-05 15:56:11",
                "urlUtime": "2010-07-19 12:10:59",
                "teamUtime": "2010-10-20 10:39:00",
                "memberPropertyUtime": "2010-02-20 18:57:48",
                "periodUtime": "2010-10-14 14:45:00"
            }),
            success: function(res){
                callback(res,0);
            },
            error: function(xhr, textStatus){
                callback({},textStatus);
            },
        };
        if(c.d(0)){console.log('Request:',ajax)}
        $$.ajax(ajax);
    };

    //3 成员直播
    c.pocket48.getLive = function(data,callback){
        var ajax={
            method: 'POST',
            url: c.pocket48.api.live,
            headers: new c.pocket48.headers(),
            data: JSON.stringify({
                "lastTime": data.lastTime,
                "limit": data.limit,
                "memberId": data.memberId || 0,
                "groupId": data.groupId || 0,
            }),
            success: function(res){
                callback(res,0);
            },
            error: function(xhr, textStatus){
                callback({},textStatus);
            },
        };
        if(c.d(0)){console.log('Request:',ajax)}
        $$.ajax(ajax);
    };

    //4 公演
    c.pocket48.getLiveOpen = function(data,callback){
        var ajax={
            method: 'POST',
            url: c.pocket48.api.liveOpen,
            headers: new c.pocket48.headers(),
            data: JSON.stringify({
                "isReview": data.isReview,
                "lastTime": data.lastTime,
                "limit": data.limit,
                "groupId": data.groupId || 0,
            }),
            success: function(res){
                callback(res,0,data.isReview);
            },
            error: function(xhr, textStatus){
                callback({},textStatus);
            },
        };
        if(c.d(0)){console.log('Request:',ajax)}
        $$.ajax(ajax);
    };

    //5 公演详情
    c.pocket48.getLiveOpenInfo = function(data,callback){
        var ajax={
            method: 'POST',
            url: c.pocket48.api.liveInfo,
            headers: new c.pocket48.headers(),
            data: JSON.stringify({
                "liveId": data.liveId,
            }),
            success: function(res){
                var i={'res': res,'liveId': data.liveId,'isReview': data.isReview};
                callback(i,0);
            },
            error: function(xhr, textStatus){
                callback({},textStatus);
            },
        };
        if(c.d(0)){console.log('Request:',ajax)}
        $$.ajax(ajax);
    };

    //6 memberId获取房间id
    c.pocket48.getRoomId = function(data,callback){
        var ajax={
            method: 'POST',
            url: c.pocket48.api.roomId,
            headers: new c.pocket48.headers(),
            data: JSON.stringify({
                "friends": [data.memberId],
            }),
            success: function(res){
                var i={
                    'res': res,
                    'lastTime': data.lastTime,
                    'limit': data.limit,
                };
                callback(i,0);
            },
            error: function(xhr, textStatus){
                callback({},textStatus);
            },
        };
        if(c.d(0)){console.log('Request:',ajax)}
        $$.ajax(ajax);
    };

    //7 房间内容
    c.pocket48.getRoomMain = function(data,callback){
        var ajax={
            method: 'POST',
            url: c.pocket48.api.roomMain,
            headers: new c.pocket48.headers(),
            data: JSON.stringify({
                "roomId": data.roomId,
                "chatType": 0,
                "lastTime": data.lastTime,
                "limit": data.limit,
            }),
            success: function(res){
                callback(res,0);
            },
            error: function(xhr, textStatus){
                callback({},textStatus);
            },
        };
        if(c.d(0)){console.log('Request:',ajax)}
        $$.ajax(ajax);
    };

    //8 房间右墙
    c.pocket48.getRoomBoard = function(data,callback){
        var ajax={
            method: 'POST',
            url: c.pocket48.api.roomBoard,
            headers: new c.pocket48.headers(),
            data: JSON.stringify({
                "roomId": data.roomId,
                "isFirst": false,
                "lastTime": data.lastTime,
                "limit": data.limit,
            }),
            success: function(res){
                callback(res,0);
            },
            error: function(xhr, textStatus){
                callback({},textStatus);
            },
        };
        if(c.d(0)){console.log('Request:',ajax)}
        $$.ajax(ajax);
    };

    //1 设置token
    c.pocket48.setToken = function(token){
        c.cookie.set('token',token,30);
    };

    //2 获取cookie中的token
    c.pocket48.token = function(){
        c.cookie.get('token');
    };

    //3 删除cookie中的token
    c.pocket48.delToken = function(){
        c.cookie.del('token');
    };

    //4 生成imei
    c.pocket48.imei = function(){
        //生成从minNum到maxNum的随机数
        randomNum=function(minNum,maxNum){ 
            switch(arguments.length){ 
                case 1: 
                    return parseInt(Math.random()*minNum+1,10); 
                break; 
                case 2: 
                    return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
                break; 
                    default: 
                        return 0; 
                    break; 
            }
        } 
        var r1=1000000+randomNum(0,8999999);
        var r2=1000000+randomNum(0,8999999);
        var input=r1+""+r2;
        var a=0;
        var b=0;
        for(var i=0;i<input.length;i++){
            var tt=parseInt(input.slice(i,i+1));
            if (i % 2 == 0) {  
                a=a+tt;
            } else {
                var temp = tt * 2;
                b = b + temp / 10 + temp % 10;
            }
        }
        var last = Math.round((a + b) % 10);
        if (last == 0) {
            last = 0;
        } else {
            last = 10 - last;
        }
        return input+""+last;
    };
    return c.pocket48;
})();
