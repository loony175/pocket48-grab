var $$ = $$ || mdui.JQ; //引入mdui.JQ
var c = c || {};
if (!c.pocket48) {
    throw '未加载c.pocket48.js';
}
c.pocket48.page = c.pocket48.page || {}
c.pocket48.page.print = c.pocket48.page.print || {};
c.pocket48.page.init = function(){
    //打印版本号
    c.pocket48.page.print.version(c.pocket48.version);
    //跨域检测
    c.pocket48.page.crossCheck();
    //更新成员信息
    if(!c.d(5)){
    c.pocket48.page.updateInfo();
    }
    //加载page控件
    for (var i in c.pocket48.page.switch) {
        c.pocket48.page.switch[i]();
    }
    //设置表单提交方式
    c.pocket48.page.form();
    //设置token功能
    c.pocket48.page.token2();
    //更新token
    c.pocket48.page.updateToken();
    //设置翻牌
    c.pocket48.page.flipButton();
    //设置打卡
    c.pocket48.page.checkIn2();
    //设置获取用户信息
    c.pocket48.page.userInfo2();
    //设置弹出直播按钮 liveplay
    c.pocket48.page.liveplay();
    //显示提示
    console.log('页面功能加载完毕',c.pocket48.version);
    console.log("%c请保护好Cookies和token"," text-shadow: 0 1px 0 #ccc,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15);font-size:5em");
};
//切换功能
c.pocket48.page.switch={};
//更新成员信息
c.pocket48.page.ifUpdateInfo = false;
c.pocket48.page.updateInfo = function(){
    if(c.d(1)){console.log('c.pocket48.page.updateInfo');}
    //先读取缓存，如果有直接设置更新完毕
    if (localStorage.getItem('info')) {
        try{
            c.pocket48.info = new c.pocket48.newInfo(JSON.parse(localStorage.getItem('info')));
            c.pocket48.page.print.info(c.pocket48.info);
            c.pocket48.page.ifUpdateInfo = true;
        } catch(e) {
            console.error(e);
            localStorage.removeItem('info');
        }
    }
    var callback = function(res,e){
        if (!e&&!(JSON.stringify(res)=="{}")){
            if(c.d(1)){console.log('Response:',JSON.parse(res),e)}
            //处理信息
            c.pocket48.info=new c.pocket48.newInfo(JSON.parse(res));
            //打印
            c.pocket48.page.print.info(c.pocket48.info);
            //设置成员信息更新完毕
            c.pocket48.page.ifUpdateInfo = true;
            //储存至localStorage
            localStorage.setItem('info', res);
            //显示消息
            c.pocket48.page.snackbar('成员信息更新完毕!');
        } else {
            //显示消息
            c.pocket48.page.snackbar('成员信息加载失败> <请尝试刷新页面');
        }
    };
    c.pocket48.getInfo('',callback);
};
//打印成员信息
c.pocket48.page.print.info = function(info){
    c.pocket48.page.progress(0);
    if(c.d(1)){console.log('c.pocket48.page.print.info')}
    //先清空group和成员信息
    $$('#c-cgroup').html('');
    $$('#c-memberchoose').html('');
    //打印团体信息
    for (var i in info.group){
        let groupId = info.group[i].group_id;
        let fTId = info.groupId2firstTeamId(groupId);
        let groupName = info.group[i].group_name;
        $$(`<a id="c-cgroup-${groupId}" value="${groupId}" href="#group-${groupId}" class="mdui-ripple c-team-${fTId}">${groupName}</a>`).appendTo('#c-cgroup');
        $$(`<div id="group-${groupId}"></div>`).appendTo('#c-memberchoose');
    };
    var inst = new mdui.Tab('#c-cgroup');
    var hasPrinted0 = false;
    //打印队伍信息
    for (var i in info.team){
        let teamId = info.team[i].team_id;
        let teamName = info.team[i].team_name;
        let groupId = info.team[i].group_id;
        if (teamId==0) {
            if (hasPrinted0) {continue;} else {hasPrinted0 = true};
            groupId = 0;
        }
        //content头部
        var content=`<div class="mdui-row c-team-${teamId}">【${teamName}】`;
        //当成员在被挑选的队伍中时
        for (var m in info.memberInfo){
            let memberId = info.memberInfo[m].member_id;
            let memberName = info.memberInfo[m].real_name;
            let memberTeam = info.memberInfo[m].team;
            let memberStatus = info.memberInfo[m].status;
            //当成员信息status==1,且teamId满足筛选时
            if(memberTeam==teamId){
                content=content+`<label class="mdui-radio ${(memberStatus==1)?(''):('c-member-inactive')}"><input type="radio" name="member" value="${memberId}"><i class="mdui-radio-icon"></i>${memberName}</label>`;
            }
        };
        content=content+'</div>';
        //console.debug(teamId, teamName, groupId);
        $$(content).appendTo('#group-'+groupId);//加入到对应的group div中
    };
    //导入队伍样式
    var content='.c-team-0,.c-team-0 td,.c-team-0 a{color: #90CCEA;} a.c-team-0{background-color: #000000!important;} ';
    var css=document.getElementById('c-team-color-css');
    for (var i in info.team) {
        //模板： .c-team-1001,.c-team-1001 td,.c-team-1001 a{color: #90CCEA;} a.c-team-1001{background-color: #90CCEA!important;}
        //当team不为全团，即teamId不为0或'0'时
        let teamId = info.team[i].team_id;
        let teamColor = info.team[i].color;
        if (!((teamId==0)||(teamId=='0'))){
        content=content+`/*${teamId}*/ .c-team-${teamId},.c-team-${teamId} td,.c-team-${teamId} a{color: #${teamColor};} a.c-team-${teamId}{background-color: #${teamColor}!important;}`
        }
    }
    css.innerHTML=content;
    
};

//打印成员直播
c.pocket48.page.print.live = function (data,e) {
    c.pocket48.page.progress(0);
    data=JSON.parse(data);if(c.d(0)){console.log('Response:',data)}
    if(!e){
        
        //先清空成员直播区域
        $$('#function-cyzb tbody').html(' ');
        //打印成表格一行的函数
        var printRow=function(row,type){
            return `
            <tr class="c-team-${c.pocket48.info.memberId2teamId(row.memberId)}" timestamp="${row.startTime}" roomid="${row.roomId}" type="${row.liveType}" url="${row.streamPath}" membername="${c.pocket48.info.memberId2name(row.memberId)}" liveid="row.liveId">
            <td>${c.pocket48.info.memberId2name(row.memberId)}</td><td>${row.subTitle}</td>
            <td>
            ${(function(){
                switch(row.liveType) {
                    case 1: return "视频";
                    case 2: return "电台";
                    default: return row.liveType;
                }
            })()}
            ${type?('<button class="c-live-button mdui-btn mdui-btn-icon mdui-btn-dense mdui-color-theme-accent mdui-ripple"><i class="mdui-icon material-icons">play_arrow</i></button>'):('')}
            </td>
            <td>${(function(){
                return new Date(row.startTime).format('yyyy-MM-dd hh:mm:ss');
            })()}</td>
            <td class="c-img">${(function(){
                var a="";
                var b=3; //最多显示3张图片,3张图片以后自动隐藏
                row.picPath.split(",").forEach(function(picUrl){
                    b--;
                    if (b>=0) {a=a+`<img src="${((picUrl.slice(0,4)=='http')?(''):(c.pocket48.url.livePic))+picUrl}" style="max-width:30px; max-height:30px" />`;}
                    else {
                        a=a+`<img class="c-img-more" src="${((picUrl.slice(0,4)=='http')?(''):(c.pocket48.url.livePic))+picUrl}" style="max-width:30px; max-height:30px" />`;
                    }
                })
                return a;
            })()}</td>
            <td class="c-link"><a href="${c.pocket48.url.liveShare+row.liveId}" target="_blank">${c.pocket48.url.liveShare+row.liveId}</a></td>
            <td class="c-link"><a href="${row.streamPath}" target="_blank">${row.streamPath}</a></td>
            <td class="c-link"><a href="${c.pocket48.url.livePic+row.lrcPath}" target="_blank">${c.pocket48.url.livePic+row.lrcPath}.lrc</a></td>
            </tr>`;
        }
        //先打印直播
        var content = '';
        if(data.content.liveList.length!=0) {
            $$('<tr><td  colspan="8"><span style="color:Red">----------   分界线，以下为直播----------</span></td></tr>').appendTo('#function-cyzb tbody');
            data.content.liveList.forEach(function (row,index,array){
                content=printRow(row,1);
                $$(content).appendTo('#function-cyzb tbody')  ;
            });
        }
        //再打印录播
        if(data.content.reviewList.length!=0) {
            $$('<tr><td colspan="8"><span style="color:Red">----------分界线，以下为录播----------</span></td></tr>').appendTo('#function-cyzb tbody');
            data.content.reviewList.forEach(function (row,index,array){
            content=printRow(row,0);
            $$(content).appendTo('#function-cyzb tbody')  ;
            });
        }
    } else {
        if(c.d(0)){console.log(e);}
        c.pocket48.page.snackbar(e);
    }
};
//打印公演直播/录播
c.pocket48.page.print.liveOpen = function (data,e,isReview) {
    c.pocket48.page.progress(0);
    data=JSON.parse(data);if(c.d(0)){console.log('Response:',data)}
    if(!e){
        //预览数据打印模板
        var printRow = function (row) {
            return '<tr id="c-live-'+row.liveId+'" class="c-team-'+c.pocket48.info.groupId2firstTeamId(row.groupId)+'" timestamp="'+row.startTime+'" ><td>'+row.title+'</td><td>'+row.subTitle+'</td><td>'+(function(){
                if(isReview) {
                    return "录播";
                } else if(row.isOpen) {
                    return "直播中";
                } else {
                    return "直播";
                }
            })()+'</td><td>'+(function(){
                return new Date(row.startTime).format('yyyy-MM-dd hh:mm:ss');
            })()+'</td><td><img src="'+c.pocket48.url.livePic+row.picPath+'" style="max-width:30px; max-height:30px"></td></tr>';
        }
        //清空公演直播/录播表格
        $$('#function-gy'+(isReview?("lb"):("zb"))+' tbody').html(' ');
        //对每条公演信息
        if(data.content.liveList) {
            data.content.liveList.forEach(function(row,index,array){
                //打印预览数据
                $$(printRow(row)).appendTo('#function-gy'+(isReview?("lb"):("zb"))+' tbody');
                //每条信息请求一次详情
                c.pocket48.getLiveOpenInfo({'liveId': row.liveId,'isReview': isReview}, c.pocket48.page.print.liveOpenInfo);
            });
        }
    } else {
        if(c.d(0)){console.log(e);}
        c.pocket48.page.snackbar(e);
    }
}
//打印公演详情
c.pocket48.page.print.liveOpenInfo = function (data,e) {
    //data={res,liveId,isReview}
    var res=JSON.parse(data.res);if(c.d(0)){console.log('Response:',res)}
    if(!e){
        var printRow= function(row){
            return '<td class="c-link"><a href="'+row.streamPathHd+'" target="_blank">'+row.streamPathHd+'</a></td><td class="c-link"><a href="'+row.streamPathLd+'" target="_blank">'+row.streamPathLd+'</a></td><td class="c-link"><a href="'+row.streamPath+'">'+row.streamPath+'</a></td>';
        };
        var content=printRow(res.content);
        $$(content).appendTo('#c-live-'+data.liveId);
        mdui.updateTables(`#function-gy${((data.isReview)?("lb"):("zb"))} table`);
    } else {
        if(c.d(0)){console.log(e);}
        c.pocket48.page.snackbar(e);
    }
}
//打印房间基本信息，转化请求
c.pocket48.page.print.roomInfo = function (data,e) {
    //data={res,liveId,isReview}
    var res=JSON.parse(data.res);if(c.d(0)){console.log('Response:',res)}
    if(!e){
        var printRow = function (row) {
            //修改房间头像
            $$('#c-room-avatar').attr('src',c.pocket48.url.livePic+row.roomAvatar);
            //修改标题为房间名
            $$('#c-room-title').html(row.creatorName+' #'+row.roomName);
            //修改副标题为房间话题
            $$('#c-room-subtitle').html(row.roomTopic);
            //修改背景图片
            if(row.bgPath){
                $$('#c-room-content').css('background','url("'+c.pocket48.url.livePic+row.bgPath+'") repeat-y');
            }
        };
        //返回为400时，没有token
        if(res.status==400){
            c.pocket48.page.snackbar('400 需要token，请点击【提交】按钮右边的钥匙图标获取token');
            return;
        }
        if(res.status==401){
            c.pocket48.page.snackbar('401 授权验证失败，请尝试点击【提交】按钮右边的钥匙图标重新获取token');
            return;
        }
        //打印房间基本信息
        printRow(res.content[0]);
        //请求房间内容和右墙数据
        if(res.content[0].hasOwnProperty("roomId")){
            //请求房间内容
            c.pocket48.getRoomMain({
                'roomId': res.content[0].roomId,
                'lastTime': data.lastTime,
                'limit': data.limit,
            },c.pocket48.page.print.roomMain);
            //请求房间右墙
            c.pocket48.getRoomBoard({
                'roomId': res.content[0].roomId,
                'lastTime': data.lastTime,
                'limit': data.limit,
            },c.pocket48.page.print.roomBoard);
            /*
            ajaxRequestJSON(formTrans({
                "func": 6,
                "limit": cData.limit,
                "lastTime": cData.lastTime,
                "roomId": response.content[0].roomId
            }),6);
            ajaxRequestJSON(formTrans({
                "func": 7,
                "limit": cData.limit,
                "lastTime": cData.lastTime,
                "roomId": response.content[0].roomId
            }),7);
            */
        }
        
    } else {
        if(c.d(0)){console.log(e);}
        c.pocket48.page.snackbar(e);
    }
};
//打印房间内容
c.pocket48.page.print.roomMain = function (data,e) {
    c.pocket48.page.progress(0);
    data=JSON.parse(data);if(c.d(0)){console.log('Response:',data)}
    if(!e){
        //每条信息的打印模板
        var printRow = function(row){
            
            //console.log('[print3] row=',row);
            var ext=JSON.parse(row.extInfo);
            //console.log('[extInfo] ext=',ext);
            //显示名称、时间、客户端
            var content='<div class="mdui-card mdui-shadow-0 c-message mdui-typo" timestamp="'+row.msgTime+'" ><div class="mdui-card-primary-subtitle">'+ext.senderName+' @'+row.msgTimeStr+((ext.phoneName)?(' 来自'+ext.phoneName):(' '))+'</div>';
            //调试模式2下打印原始信息
            if(c.d(2)){content=content+`<div class="mdui-hidden c-raw">${JSON.stringify(row)}</div>`}
            
            //根据不同信息打印内容
            switch(row.msgType){
                //文本信息
                case 0:
                    switch(ext.messageObject){
                        //普通文本
                        case "text":
                            content=content+ext.text;
                        break;
                        //翻牌信息
                        case "faipaiText":
                            content=content+'<blockquote><p>'+ext.faipaiContent+'</p><footer>ID:'+ext.faipaiUserId+'<span class="c-pro"><a class="mdui-btn mdui-btn-icon mdui-ripple mdui-btn-dense c-pro-user" userid="'+ext.faipaiUserId+'"><i class="mdui-icon material-icons mdui-text-color-theme-accent">search</i></a></span>'+'</footer></blockquote>'+ext.messageText;
                        break;
                        //视频直播信息
                        case "live":
                            content=content+'<img style="max-width:30px; max-height:30px" src='+c.pocket48.url.livePic+ext.referencecoverImage+' />【视频直播】<a href="'+c.pocket48.url.liveShare+ext.referenceObjectId+'" target="_blank">'+c.pocket48.url.liveShare+ext.referenceObjectId+'</a>'
                        break;
                        
                        //电台直播信息
                        case "diantai":
                            content=content+'<img style="max-width:30px; max-height:30px" src='+c.pocket48.url.livePic+ext.referencecoverImage+' />【电台直播】<a href="'+c.pocket48.url.liveShare+ext.referenceObjectId+'" target="_blank">'+c.pocket48.url.liveShare+ext.referenceObjectId+'</a>'
                        break;
                        //翻牌问题
                        case "idolFlip":
                            content=content+`${ext.idolFlipTitle}<br/>${ext.idolFlipContent}<br/><div class="c-idolflip" id="c-idolflip-${ext.idolFlipQuestionId}-${ext.idolFlipAnswerId}"><button class="mdui-btn mdui-btn-block mdui-color-theme-accent mdui-ripple">点此打开</button></div>`;
                        break;
                        //其他信息
                        default:
                        content=content+'未知信息:'+JSON.stringify(row);
                        break;
                    }
                break;
                //图片信息
                case 1:
                    var body=JSON.parse(row.bodys);
                    content=content+'<img src='+body.url+' />';
                break;
                //语音信息
                case 2:
                    var body=JSON.parse(row.bodys);
                    content=content+'音频：<a href="'+body.url+'" target="_blank">'+body.url+'</a><audio src='+body.url+' />';
                break;
                
                //视频信息
                case 3:
                    var body=JSON.parse(row.bodys);
                    content=content+'视频：<a href="'+body.url+'" target="_blank">'+body.url+'</a><video src='+body.url+' />';
                break;
                
                //其他信息
                default:
                    content=content+'未知信息:'+JSON.stringify(row);
                break;
            }
            //分割线
            content=content+'</div><div class="mdui-divider"></div>'
            return content;
        };
        //清空房间内容板块
        $$('#c-room-content').html(' ');
        //对每一条 打印内容
        for (var key in data.content.data) {
            var content=printRow(data.content.data[key]);
            //插入内容
            $$(content).appendTo('#c-room-content');
        }
    } else {
        if(c.d(0)){console.log(e);}
        c.pocket48.page.snackbar(e);
    }
};
//打印房间右墙
c.pocket48.page.print.roomBoard = function (data,e) {
    c.pocket48.page.progress(0);
    data=JSON.parse(data);if(c.d(0)){console.log('Response:',data)}
    if(!e){
        var printRow = function (row) {
            var ext=JSON.parse(row.extInfo);
            if(c.d(2)){console.log('c.pocket48.page.print.roomBoard printRow[ext=JSON.parse(row.extInfo)]',ext);}
            //内容
            var content='<li class="mdui-list-item" timestamp="'+row.msgTime+'" senderId="'+ext.senderId+'" contentType="'+ext.contetType+'"><div class="mdui-list-item-avatar"><img src="'+c.pocket48.url.livePic+ext.senderAvatar+'"/></div><div class="mdui-list-item-content"> <div class="mdui-list-item-title">'+ext.senderName+'<span class="c-pro"><a class="mdui-btn mdui-btn-icon mdui-ripple mdui-btn-dense c-pro-user" userid="'+ext.senderId+'"><i class="mdui-icon material-icons mdui-text-color-theme-accent">search</i></a></span>'+' <small>@'+row.msgTimeStr+((ext.phoneName)?(' 来自'+ext.phoneName):(' '))+'</small></div><div class="mdui-list-item-text">'+((ext.text)?(ext.text):(ext.content))+'</div></div></li>';
            //分割线
            content=content+'<li class="mdui-divider-inset mdui-m-y-0"></li>';
            return content;
        };
        //清空
        $$('#c-room-board').html(' ');
        //console.log('[board] response=',response);
        //对每一条打印内容
        for (var key in data.content.data){
            var content=printRow(data.content.data[key]);
            $$(content).appendTo('#c-room-board');
        }
    } else {
        if(c.d(0)){console.log(e);}
        c.pocket48.page.snackbar(e);
    }
};
//打印翻牌消息
c.pocket48.page.print.flip = function (data,e) {
    //data={res,questionId,answerId}
    res=JSON.parse(data.res) ;if(c.d(0)){console.log('Response:',res)}
    if(!e){
        //#c-idolflip-123-456
        var str=`#c-idolflip-${data.questionId}-${data.answerId}`;
        //内容为answer
        var content=`<span>&gt;&gt;&gt; ${res.content.answer}</span>`;
        //如果没有被点击过(隐藏)
        if(!$$(str).hasClass('mdui-hidden')){
            //在#c-idolflip前面插入内容
            $$(str).before(content);
            //设为不可见
            $$(str).addClass('mdui-hidden');
        } else {
            c.pocket48.page.snackbar('已打开');
        }
    } else {
        if(c.d(0)){console.log(e);}
        c.pocket48.page.snackbar(e);
    }
};

/**
 * 打印打卡信息
 * @param data 返回的内容
 * @param e 返回的错误信息
 */
c.pocket48.page.print.checkIn = function (data,e) {
    c.pocket48.page.progress(0);
    data=JSON.parse(data);if(c.d(0)){console.log('Response:',data)}
    if(!e){
        if (data.status==200) {
            var message=`打卡成功！经验+${data.content.addEx}，鸡腿+${data.content.addMoney}，连续打卡${data.content.days}天。`;
            c.pocket48.page.snackbar(message);
        } else {
            c.pocket48.page.snackbar('打卡失败: '+data.message);
        }
    } else {
        if(c.d(0)){console.log(e);}
        c.pocket48.page.snackbar(e);
    }
};
/**
 * 设置打卡功能，需要init
 */
c.pocket48.page.checkIn2 = function () {
    if(c.d(2)){console.log('c.pocket48.page.checkIn2');}
    $$('#c-pro-checkin').on('click', function(e){
        //传递给c.pocket48.checkIn->c.pocket48.page.print.checkIn
        c.pocket48.page.progress();
        c.pocket48.checkIn({},c.pocket48.page.print.checkIn);
    });
};
/**
 * 打印用户信息
 * @param data 返回的内容
 * @param e 返回的错误信息
 */
c.pocket48.page.print.userInfo = function (data,e) {
    c.pocket48.page.progressPro(0);
    data=JSON.parse(data);if(c.d(0)){console.log('Response:',data)}
    if(!e){
        if (data.status==200) {
            var row=`<div class="mdui-card-header mdui-color-theme-50">
            <img class="mdui-card-header-avatar" src="${c.pocket48.url.livePic+data.content.userInfo.avatar}"/>
            <div class="mdui-card-header-title">${data.content.userInfo.nickName}</div>
            <div class="mdui-card-header-subtitle">id:${data.content.userInfo.userId}</div>
          </div>
          <div class="mdui-card-content">
              <p>等级：LV${data.content.userInfo.level} 经验值：${data.content.userInfo.experience} 关注：${data.content.friendsNum} ${(data.content.userInfo.starwo)?'[星沃卡用户]':''}</p>
              <p>性别：${(function(g){if(g==0){return '保密'}if(g==1){return '女'}if(g==2){return '男'}})(data.content.userInfo.gender)} 生日：${(data.content.userInfo.birthday)?(data.content.userInfo.birthday):'无'} 地区码：${(data.content.userInfo.city)}</p>
              <p>首推：${(data.content.userRecommend.first.memberId)?c.pocket48.info.memberId2name(data.content.userRecommend.first.memberId):'无'} 贡献：${data.content.userRecommend.first.money}</p>
              <p>二推：${(data.content.userRecommend.second.memberId)?c.pocket48.info.memberId2name(data.content.userRecommend.second.memberId):'无'} 贡献：${data.content.userRecommend.second.money}</p>
              <p>三推：${(data.content.userRecommend.third.memberId)?c.pocket48.info.memberId2name(data.content.userRecommend.third.memberId):'无'} 贡献：${data.content.userRecommend.third.money}</p>
          </div>`;
            //清空
            $$('#c-pro-ui').html(' ');
            //显示
            $$('#c-pro-ui').html(row);
            //刷新
            c.pocket48.page.proUpdate();
        } else {
            c.pocket48.page.snackbar('获取用户信息错误: '+data.message);
        }
    } else {
        if(c.d(0)){console.log(e);}
        c.pocket48.page.snackbar(e);
    }
}
/**
 * 设置获取用户信息功能，需要init
 */
c.pocket48.page.userInfo2 = function () {
    if(c.d(2)){console.log('c.pocket48.page.userInfo2');}
    $$('#c-pro-getuserinfo').on('click', function(e){
        //传递给c.pocket48.getUserInfo->c.pocket48.page.print.userInfo
        c.pocket48.page.progressPro();
        var data={userId: $$('#c-pro-userid').val()};
        c.pocket48.getUserInfo(data,c.pocket48.page.print.userInfo);
    });
    $$(document).on('click', '.c-pro-user', function (e) {
        //<span.c-pro><a userid="123456"></a></span>
        var id = $$(this).attr('userid');
        var data ={userId: id};
        //弹出对话框
        c.pocket48.page.pro.open();
        c.pocket48.page.progressPro();
        c.pocket48.getUserInfo(data,c.pocket48.page.print.userInfo);
    });
};

/**
 * 跨域检测，需要init
 */
c.pocket48.page.crossCheck = function () {
    $$.ajax({
        method: 'GET',
        async: false,
        url: c.pocket48.apiCross.sync,
        headers: new c.pocket48.headers(),
        contentType: 'application/json',
        data: '',
        success: function (res) {
            //允许跨域
            console.log('已设置跨域');
            c.pocket48.api = c.pocket48.apiCross;
        },
        error: function (xhr, textStatus) {
            //不允许跨域
            console.log('不允许跨域, 使用代理');
            c.pocket48.api = c.pocket48.apiProxy;
        }
    });
}

/**
 * 设置liveplay功能，需要init
 */
c.pocket48.page.liveplay = function () {
    $$(document).on('click', 'button.c-live-button', function (e) {
        var live = {
            type: $$(this).parent().parent().attr('type'), //1视频 2电台
            room: $$(this).parent().parent().attr('roomid'), //roomId
            url: $$(this).parent().parent().attr('url'), //flvUrl
            name: $$(this).parent().parent().attr('membername'), //直播间名
        };
        if(c.d(1)){console.log('liveplay',live);}
        var url =`./liveplay.html?${window.btoa(encodeURIComponent(JSON.stringify(live)))}`;
        window.open (url, "_blank", "height=660, width=375, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no");
    });
}

//设置翻牌按钮 需要init
c.pocket48.page.flipButton = function () {
    $$(document).on('click', '.c-idolflip button', function (e) {
        //c-idolflip-123-456
        var id = $$(this).parent().attr('id');
        var s = id.split('-');
        var data = {}
        //123
        data.questionId = s[2];
        //456
        data.answerId = s[3];
        c.pocket48.getFlip(data,c.pocket48.page.print.flip);
    });
};
//获取token的Callback
c.pocket48.page.token = function (data,e) {
    data=JSON.parse(data);if(c.d(0)){console.log('Response:',data)}
    if(!e){
        if (data.status==200) {
            c.pocket48.setToken(data.content.token);
            c.pocket48.page.updateToken();
            c.pocket48.page.snackbar('获取token成功: [隐藏,可以通过c.pocket48.token()查看]');
            //清除用户名和密码
            $$('#c-login-user').val('');
            $$('#c-login-pass').val('');
        } else {
            c.pocket48.page.snackbar('获取token失败: '+data.message);
        }
    } else {
        if(c.d(0)){console.log(e);}
        c.pocket48.page.snackbar(e);
    }
};
//更新保存的token信息
c.pocket48.page.updateToken = function (){
    //显示已有或无token
    $$('#c-token').html((c.pocket48.token())?('有token:[隐藏,可以通过c.pocket48.token()查看]'):('无token'));
};
//设置token功能 需要init
c.pocket48.page.token2 = function () {
    //获取token
    $$('#c-login-get').on('click', function(e){
        //获取用户名和密码
        var d={
            'username': $$('#c-login-user').val(),
            'password': $$('#c-login-pass').val()
        }
        //传递给c.pocket48.getToken->c.pocket48.page.token
        c.pocket48.page.progress();
        c.pocket48.getToken(d,c.pocket48.page.token);
    });
    //删除token
    $$('#c-login-del').on('click', function(e){
        c.pocket48.delToken();
        c.pocket48.page.updateToken();
        c.pocket48.page.snackbar('清除token成功');
    });
    //设置token
    $$('#c-login-set').on('click', function(e){
        c.pocket48.setToken($$('#c-token-input').val());
        c.pocket48.page.updateToken();
        c.pocket48.page.snackbar('设置token成功: '+$$('#c-token-input').val());
    });
};
/**
 * 使用snackbar显示信息
 * @param message 需要显示的信息
 */
c.pocket48.page.snackbar = function (info) {
    mdui.snackbar(info);
};
/**
 * 显示/隐藏进度条
 * @param show true显示,false不显示
 */
c.pocket48.page.progress = function (show=true) {
    if (show) {
        $$('#c-progress').show();
    } else {
        $$('#c-progress').hide();
    }
};
c.pocket48.page.progressPro = function (show=true) {
    if (show) {
        $$('#c-pro-progress').show();
    } else {
        $$('#c-pro-progress').hide();
    }
};
/**
 * 提交页面表单
 */
c.pocket48.page.submit = function(){
    //成员信息还未更新，返回false
    if(c.pocket48.page.ifUpdateInfo==false) {
        c.pocket48.page.snackbar('请等待成员数据更新完毕...');
        return false;
    }
    //对不同的功能，提交到不同的c.pocket48.函数处理
    var data={};
    //lastTime
    if ($$('#c-ctime-now').prop('checked')) {
        data.lastTime=0;
    } else {
        stringTime=$$('#c-year').val()+'-'+$$('#c-month').val()+'-'+$$('#c-day').val()+' '+$$('#c-hour').val()+':0:0';
        data.lastTime=Date.parse(new Date(stringTime));
    }
    //limit
    data.limit=parseInt($$('#c-cnumber').val());
    //groupId
    data.groupId=(c.pocket48.page.switch.memberNow==1)?(c.pocket48.page.switch.groupNow || 0):0;
    //memberId
    if(c.pocket48.page.switch.memberNow==1){
        data.memberId=$$("input[name='member']:checked").val() || 0;
    } else {
        //没有选择成员时，为0
        data.memberId=0;
    }
    //isReview
    if (c.pocket48.page.switch.tabNow==1) {
        data.isReview=1;
    }
    if (c.pocket48.page.switch.tabNow==2) {
        data.isReview=0;
    }
    switch(c.pocket48.page.switch.tabNow) {
        case 0: //成员直播
            c.pocket48.page.progress();
            c.pocket48.getLive(data,c.pocket48.page.print.live);
        break;
        case 1: //公演录播
        c.pocket48.page.progress();
            c.pocket48.getLiveOpen(data,c.pocket48.page.print.liveOpen);
        break;
        case 2: //公演直播
            c.pocket48.page.progress();
            c.pocket48.getLiveOpen(data,c.pocket48.page.print.liveOpen);
        break;
        case 3: //口袋房间
            if (data.memberId==0||c.pocket48.page.switch.memberNow==0){
                c.pocket48.page.snackbar('口袋房间功能必须选择成员');
                return false;
            }
            c.pocket48.page.progress();
            c.pocket48.getRoomId(data,c.pocket48.page.print.roomInfo);
        break;
    }
    //不提交原始表单
    return false;
};
//设置表单提交方式 需要在init中执行
c.pocket48.page.form = function () {
    $$('#c-form').attr('onsubmit','return c.pocket48.page.submit()');
};
/**
 * 切换高级功能
 */
c.pocket48.page.switch.premium = function () {
    c.pocket48.page.switch.premiumNow = 0;
    if(c.cookie.get('premium')==1) {
        c.pocket48.page.switch.premiumNow = 1;
        $$('#c-premium-switch').attr('checked','checked');
    }
    //对话框对象
    c.pocket48.page.pro = new mdui.Dialog('#c-premium');
    //刷新显示/关闭显示
    c.pocket48.page.proUpdate = function () {
        if (c.pocket48.page.switch.premiumNow) {
            //如果开启高级功能
            $$('#c-premium-css').html(' ');
        } else {
            //未开启
            $$('#c-premium-css').html('.c-pro {display:none;}');
        }
        //刷新对话框
        c.pocket48.page.pro.handleUpdate();
    };
    c.pocket48.page.proUpdate();
    document.getElementById('c-premium-switch').addEventListener('change', function (event) {
        if (this.checked) {
            c.pocket48.page.switch.premiumNow = 1;
            c.cookie.set('premium',1,30);
        } else {
            c.pocket48.page.switch.premiumNow = 0;
            c.cookie.set('premium',0,30);
        }
        c.pocket48.page.proUpdate();
    });
}
//切换tab 成员直播 公演录播 公演直播 口袋房间
c.pocket48.page.switch.tab = function () {
    c.pocket48.page.switch.tabNow = 0;
    document.getElementById('c-cfunc').addEventListener('change.mdui.tab', function (event) {
        c.pocket48.page.switch.tabNow = event.detail.index;
        //切换为口袋房间时，显示钥匙图标
        if (c.pocket48.page.switch.tabNow==3){
            $$('#login').show();
        } else {
            $$('#login').hide();
        }
        //切换为成员直播和口袋房间时，显示成员选择
        if (c.pocket48.page.switch.tabNow==0||c.pocket48.page.switch.tabNow==3){
            $$('#c-member-choose').show();
        } else {
            $$('#c-member-choose').hide();
        }
    });
};
//切换 打开选择成员/团体选项栏
c.pocket48.page.switch.member = function (){
    c.pocket48.page.switch.memberNow = 0;
    document.getElementById('c-cmember').addEventListener('change', function (event) {
        if (this.checked) {
            c.pocket48.page.switch.memberNow=1;
            $$('#c-member').show();
        } else {
            c.pocket48.page.switch.memberNow=0;
            $$('#c-member').hide();
        }
    });
};
//切换 选择团体时，显示对应成员
c.pocket48.page.switch.group = function () {
    c.pocket48.page.switch.groupNow = 0;
    document.getElementById('c-cgroup').addEventListener('change.mdui.tab', function (event) {
        c.pocket48.page.switch.groupNow = $$('#c-c'+event.detail.id).attr('value');
    });
};
//切换 显示完整内容
c.pocket48.page.switch.link = function () {
    c.pocket48.page.switch.linkNow = 0;
    document.getElementById('c-clink').addEventListener('change', function (event) {
        if (this.checked) {
            c.pocket48.page.switch.linkNow=1;
            $$("#c-link-switch").attr('href',   './css/link-show.css');
        } else {
            c.pocket48.page.switch.linkNow=0;
            $$("#c-link-switch").attr('href',   './css/link-hide.css');
        }
    });
};
//打印版本号
c.pocket48.page.print.version = function(version){
    if(c.d(1)){console.log('c.pocket48.page.print.version')}
    //加入v2.*.*
    $$('#c-version').html(`v${version}`);
    //标题后加入 v2.*.*
    $$('title').html($$('title').html()+` v${version}`);
};
//日期转换
Date.prototype.format = function (format) {
    var timeZone=8; //设置时区,UTC+8
    this.setTime(this.getTime()+timeZone*60*60*1000); 
    var date = {
           "M+": this.getUTCMonth() + 1,
           "d+": this.getUTCDate(),
           "h+": this.getUTCHours(),
           "m+": this.getUTCMinutes(),
           "s+": this.getUTCSeconds(),
           "q+": Math.floor((this.getUTCMonth() + 3) / 3),
           "S+": this.getUTCMilliseconds()
    };
    if (/(y+)/i.test(format)) {
           format = format.replace(RegExp.$1, (this.getUTCFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
           if (new RegExp("(" + k + ")").test(format)) {
                  format = format.replace(RegExp.$1, RegExp.$1.length == 1
                         ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
           }
    }
    return format;
};

//执行初始化函数
c.pocket48.page.init();