var $$ = $$ || mdui.JQ; //引入mdui.JQ
var c = c || {};
if (!c.pocket48) {
    throw '未加载c.pocket48.js';
}
c.pocket48.page = c.pocket48.page || (function(){
    c=c||{};c.pocket48=c.pocket48||{};c.pocket48.page={};c.pocket48.page.print={};
    //初始化
    c.pocket48.page.init = function(){
        //打印版本号
        c.pocket48.page.print.version(c.pocket48.version);
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
        //显示提示
        console.log('页面功能加载完毕');
        console.log("%c请勿分享Cookies给其他人"," text-shadow: 0 1px 0 #ccc,0 2px 0 #c9c9c9,0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1),0 0 5px rgba(0,0,0,.1),0 1px 3px rgba(0,0,0,.3),0 3px 5px rgba(0,0,0,.2),0 5px 10px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.2),0 20px 20px rgba(0,0,0,.15);font-size:5em");
    };

    //更新成员信息
    c.pocket48.page.updateInfo = function(){
        if(c.d(1)){console.log('c.pocket48.page.updateInfo')}
        var callback = function(res,e){
            if(c.d(1)){console.log('Response:',res,e)}
            //处理信息
            c.pocket48.info=new c.pocket48.newInfo(JSON.parse(res));
            //打印
            c.pocket48.page.print.info(c.pocket48.info);
        };
        c.pocket48.getInfo('',callback);
    };
    //打印成员信息
    c.pocket48.page.print.info = function(info){
        if(c.d(1)){console.log('c.pocket48.page.print.info')}
        //先清空group和成员信息
        $$('#c-cgroup').html('');
        $$('#c-memberchoose').html('');
        //打印团体信息
        for (var index in info.group){
            $$(`<a id="c-cgroup-${index}" value="${index}" href="#group-${index}" class="mdui-ripple c-team-${info.groupId2firstTeamId(index)}">${info.group[index]}</a>`).appendTo('#c-cgroup');
            $$(`<div id="group-${index}"></div>`).appendTo('#c-memberchoose');
        };
        var inst = new mdui.Tab('#c-cgroup');
        //打印队伍信息
        for (var index in info.team){
            //content头部
            var content=`<div class="mdui-row c-team-${index}">【${info.team[index][1]}】`;
            //当成员在被挑选的队伍中时
            for (var index0 in info.member){
                //当成员信息status==1,且teamId满足筛选时
                if((info.member[index0][4]==1)&&(info.member[index0][2]==index)){
                    content=content+`<label class="mdui-radio"><input type="radio" name="member" value="${index0}"><i class="mdui-radio-icon"></i>${info.member[index0][0]}</label>`;
                }
            };
            content=content+'</div>';
            $$(content).appendTo('#group-'+info.team[index][0]);//加入到对应的group div中
        };
        //导入队伍样式
        var content='.c-team-0,.c-team-0 td,.c-team-0 a{color: #90CCEA;} a.c-team-0{background-color: #000000!important;} ';
        var css=document.getElementById('c-team-color-css');
        for (var index in info.team) {
            //模板： .c-team-1001,.c-team-1001 td,.c-team-1001 a{color: #90CCEA;} a.c-team-1001{background-color: #90CCEA!important;}
            //当team不为全团，即index不为0或'0'时
            if (!((index==0)||(index=='0'))){
            content=content+`/*${index}*/ .c-team-${index},.c-team-${index} td,.c-team-${index} a{color: #${info.team[index][2]};} a.c-team-${index}{background-color: #${info.team[index][2]}!important;}`
            }
        }
        css.innerHTML=content;
        
    };
    
    //打印成员直播
    c.pocket48.page.print.live = function (data,e) {
        data=JSON.parse(data);if(c.d(0)){console.log('Response:',data)}
        if(!e){
            
            //先清空成员直播区域
            $$('#function-cyzb tbody').html(' ');
            //打印成表格一行的函数
            var printRow=function(row){
                return `
                <tr class="c-team-${c.pocket48.info.memberId2teamId(row.memberId)}" timestamp="${row.startTime}">
                <td>${c.pocket48.info.memberId2name(row.memberId)}</td><td>${row.subTitle}</td>
                <td>${(function(){
                    switch(row.liveType) {
                        case 1: return "视频";
                        case 2: return "电台";
                        default: return row.liveType;
                    }
                })()}</td>
                <td>${(function(){
                    return new Date(row.startTime).format('yyyy-MM-dd hh:mm:ss');
                })()}</td>
                <td>${(function(){
                    var a="";
                    var b=3; //最多显示3张图片
                    row.picPath.split(",").forEach(function(picUrl){
                        b--;
                        if (b>=0) {a=a+`<img src="${((picUrl.slice(0,4)=='http')?(''):(c.pocket48.url.livePic))+picUrl}" style="max-width:30px; max-height:30px" />`;}
                    })
                    return a;
                })()}</td>
                <td class="c-link"><a href="${c.pocket48.url.liveShare+row.liveId}" target="_blank">${c.pocket48.url.liveShare+row.liveId}</a></td>
                <td class="c-link"><a href="${row.streamPath}" target="_blank">${row.streamPath}</a></td>
                <td class="c-link"><a href="${c.pocket48.url.livePic+row.lrcPath}" target="_blank">${c.pocket48.url.livePic+row.lrcPath}.lrc</a></td>
                </tr>`;
            }

            //先打印直播
            if(data.content.liveList.length!=0) {
                $$('<tr><td  colspan="8"><span style="color:Red">----------   分界线，以下为直播----------</span></td></tr>').appendTo('#function-cyzb tbody');
                data.content.liveList.forEach(function (row,index,array){
                    content=printRow(row);
                    $$(content).appendTo('#function-cyzb tbody')  ;
                });
            }
            //再打印录播
            if(data.content.reviewList.length!=0) {
                $$('<tr><td colspan="8"><span style="color:Red">----------分界线，以下为录播----------</span></td></tr>').appendTo('#function-cyzb tbody');
                data.content.reviewList.forEach(function (row,index,array){
                content=printRow(row);
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
        data=JSON.parse(data);if(c.d(0)){console.log('Response:',data)}
        if(!e){
            var printRow= function(row){
                return '<td class="c-link"><a href="'+row.streamPathHd+'" target="_blank">'+row.streamPathHd+'</a></td><td class="c-link"><a href="'+row.streamPathLd+'" target="_blank">'+row.streamPathLd+'</a></td><td class="c-link"><a href="'+row.streamPath+'">'+row.streamPath+'</a></td>';
            };
            var content=printRow(data.res.content);
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
        data=JSON.parse(data);if(c.d(0)){console.log('Response:',data)}
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
            if(data.status==400){
                c.pocket48.page.snackbar('400 需要token，请点击【提交】按钮右边的钥匙图标获取token');
                return;
            }
            if(data.status==401){
                c.pocket48.page.snackbar('401 授权验证失败，请尝试点击【提交】按钮右边的钥匙图标重新获取token');
                return;
            }
            //打印房间基本信息
            printRow(data.res.content[0]);
            //请求房间内容和右墙数据
            if(data.res.content[0].hasOwnProperty("roomId")){
                //请求房间内容
                c.pocket48.getRoomMain({
                    'roomId': data.res.content[0].roomId,
                    'lastTime': data.lastTime,
                    'limit': data.limit,
                },c.pocket48.page.print.roomMain);
                //请求房间右墙
                c.pocket48.getRoomBoard({
                    'roomId': data.res.content[0].roomId,
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
                                content=content+'<blockquote><p>'+ext.faipaiContent+'</p><footer>ID:'+ext.faipaiUserId+'</footer></blockquote>'+ext.messageText;
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
                                content=content+`${ext.idolFlipTitle}<br/>${ext.idolFlipContent}<br/><div class="mdui-hidden c-idolflip" id="c-idolflip-${ext.idolFlipQuestionId}-${ext.idolFlipAnswerId}"><button class="mdui-btn mdui-btn-block mdui-color-theme-accent mdui-ripple">点此打开</button></div>`;
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
        data=JSON.parse(data);if(c.d(0)){console.log('Response:',data)}
        if(!e){
            var printRow = function (row) {
                var ext=JSON.parse(row.extInfo);
                if(c.d(2)){console.log('c.pocket48.page.print.roomBoard printRow[ext=JSON.parse(row.extInfo)]',ext);}
                //内容
                var content='<li class="mdui-list-item mdui-ripple" timestamp="'+row.msgTime+'" senderId="'+ext.senderId+'" contentType="'+ext.contetType+'"><div class="mdui-list-item-avatar"><img src="'+c.pocket48.url.livePic+ext.senderAvatar+'"/></div><div class="mdui-list-item-content"> <div class="mdui-list-item-title">'+ext.senderName+' <small>@'+row.msgTimeStr+((ext.phoneName)?(' 来自'+ext.phoneName):(' '))+'</small></div><div class="mdui-list-item-text">'+((ext.text)?(ext.text):(ext.content))+'</div></div></li>';
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


    //使用snackbar显示信息
    c.pocket48.page.snackbar = function (info) {
        mdui.snackbar(info);
    };

    //提交表单
    c.pocket48.page.submit = function(){
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
        data.groupId=c.pocket48.page.switch.groupNow || 0;
        //memberId
        data.memberId=$$("input[name='member']:checked").val() || 0;

        //isReview
        if (c.pocket48.page.switch.tabNow==1) {
            data.isReview=1;
        }
        if (c.pocket48.page.switch.tabNow==2) {
            data.isReview=0;
        }

        switch(c.pocket48.page.switch.tabNow) {
            case 0: //成员直播
                c.pocket48.getLive(data,c.pocket48.page.print.live);
            break;
            case 1: //公演录播
                c.pocket48.getLiveOpen(data,c.pocket48.page.print.liveOpen);
            break;
            case 2: //公演直播
                c.pocket48.getLiveOpen(data,c.pocket48.page.print.liveOpen);
            break;
            case 3: //口袋房间
                c.pocket48.getRoomId(data,c.pocket48.page.print.roomInfo);
            break;
        }
        //不提交原始表单
        return false;
    };
    //设置表单提交方式
    c.pocket48.page.form = function () {
        $$('#c-form').attr('onsubmit','return c.pocket48.page.submit()');
    }

    //切换功能
    c.pocket48.page.switch={};
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

    //切换 显示完整连接
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
    return c.pocket48.page;
})();

//执行初始化函数
c.pocket48.page.init();