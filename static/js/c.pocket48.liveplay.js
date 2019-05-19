//ChatRoom界面
if (typeof c === 'undefined') {
    c = {};
}
if (typeof c.pocket48 === 'undefined') {
    c.pocket48 = {};
}
if (typeof c.pocket48.liveplay === 'undefined') {
    c.pocket48.liveplay = {};
}

//调试
c.debug = 1;
c.d = function (level) {
    if (level <= c.debug) {
        return true
    } else {
        return false
    }
};

c.pocket48.liveplay.version = '1.0.1';

//初始化
c.pocket48.liveplay.init = function () {
    //设置标题
    document.querySelector('title').innerHTML = `${(c.pocket48.liveplay.video.name) ? (c.pocket48.liveplay.video.name) : ('小可爱')}的直播间 - 直播播放器 v${c.pocket48.liveplay.version}`;
    //载入播放器
    c.pocket48.liveplay.playVideo();
    //连接房间
    setTimeout(c.pocket48.liveplay.loadChatroom(), 100);
};

c.pocket48.liveplay.video = (function () {
    var url = window.document.location.href.toString();
    var u = url.split('?');
    if (typeof (u[1]) == 'string') {
        return JSON.parse(decodeURIComponent(window.atob(u[1])));
    } else {
        return {};
    }
})();

/* c.pocket48.liveplay.video = {
    type: $_GET['type'], //1视频 2电台
    room: $_GET['room'], //roomId
    url: $_GET['url'], //flvUrl
    name: decodeURIComponent($_GET['name']), //直播间名
}; */

if (c.d(1)) { console.log(c.pocket48.liveplay.video); }

//设置基本元素变量
c.pocket48.liveplay.videoDiv = document.querySelector('#c-video');
c.pocket48.liveplay.videoEle = document.querySelector('#c-flv-player');
c.pocket48.liveplay.danmu = document.querySelector('#c-danmu');

//视频高度适应窗口
c.pocket48.liveplay.reloadWindow = function () {
    var h = window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight;
    c.pocket48.liveplay.videoEle.setAttribute('height', h);
}
window.addEventListener('resize', function () {
    c.pocket48.liveplay.reloadWindow();
});

//载入视频
c.pocket48.liveplay.playVideo = function () {
    //flvjs
    if (flvjs.isSupported() && (c.pocket48.liveplay.video.url)) {
        c.pocket48.liveplay.flvPlayer = flvjs.createPlayer({
            type: 'flv',
            isLive: true,
            hasVideo: c.pocket48.liveplay.video.type==1,
            url: c.pocket48.liveplay.video.url,
        });
        c.pocket48.liveplay.flvPlayer.attachMediaElement(c.pocket48.liveplay.videoEle);
        c.pocket48.liveplay.flvPlayer.load();
        c.pocket48.liveplay.flvPlayer.play();
        //c.pocket48.liveplay.danmu.style.marginLeft = - c.pocket48.liveplay.videoEle.width;
        setTimeout(c.pocket48.liveplay.reloadWindow(), 500);
    } else {
        console.error('播放失败, 地址有误或不支持');
    }

}

//打印消息函数
c.pocket48.liveplay.print = function (msgs) {
    for (let i in msgs) {
        let danmu = c.pocket48.liveplay.danmu;
        let s = (danmu.scrollTop + danmu.offsetHeight + 3 >= danmu.scrollHeight); //滚动至底部时锁定
        let msg = msgs[i];
        if (c.d(1)) { console.debug('msg', msg); }
        if (typeof msg.custom === 'undefined') {
            if (c.d(0)) { console.debug('undefinedmsg:', msg); }
            continue;
        }
        let custom = JSON.parse(msg.custom);
        let html
        if (custom.messageType == "PRESENT_NORMAL") {
            //Alice送给Bob 7个x
            html = `
            <div class="c-danmu-content" timestamp="${msg.time}" userid="${custom.user.userId}"><span class="c-danmu-text">
            ${custom.user.nickName} 送给${custom.giftInfo.acceptUser.userName} ${custom.giftInfo.giftNum}个 ${custom.giftInfo.giftName}<img class="c-gift" src="${c.pocket48.getPicUrl(custom.giftInfo.picPath)}" />
            </span></div>
            `;
        } else if (custom.messageType == "BARRAGE_NORMAL") {
            html = `
            <div class="c-danmu-content ${(custom.inTop) ? ('c-danmu-top') : ('')}" timestamp="${msg.time}" userid="${custom.user.userId}"><span class="c-danmu-text">
            <b>${custom.user.nickName}</b>
            ${custom.text}
            </span></div>
            `;
        } else {
            html = ``;
        }
        danmu.insertAdjacentHTML("beforeend", html);
        if (s) { danmu.scrollTop = danmu.scrollHeight; }
    }
}


//连接房间
c.pocket48.liveplay.loadChatroom = function () {
    let cookieUrl = 'https://live.48.cn/Server/do_ajax_setcookie';
    if (c.pocket48.liveplay.video.room) {
        c.pocket48.liveplay.video.room = parseInt(c.pocket48.liveplay.video.room);
        //setcookie
        let cookie_val = Math.random().toString(36).substr(2);
        let html = `
            <div class="c-danmu-content" timestamp="${new Date().getTime()}" userid="0"><span class="c-danmu-text c-danmu-system">
            <b>连接弹幕服务器中...</b>
            </span></div>
            `;
        c.pocket48.liveplay.danmu.insertAdjacentHTML("beforeend", html);
        try {
            xmlhttp = new XMLHttpRequest();
            xmlhttp.onerror = xmlhttp.onload = xmlhttp.ontimeout = function () {
                xmlhttp2 = new XMLHttpRequest();
                xmlhttp2.onerror = xmlhttp2.onload = xmlhttp2.ontimeout = function () {
                    c.pocket48.cr.account = c.pocket48.cr.token = cookie_val;
                    c.pocket48.liveplay.video.cr = c.pocket48.cr.connect(c.pocket48.liveplay.video.room, c.pocket48.liveplay.print, c.pocket48.liveplay.status);
                };
                xmlhttp2.open('POST', cookieUrl, true);
                xmlhttp2.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                xmlhttp2.send(`timestamp=1542977135000&cookie_val=${cookie_val}&type=2`);
            };
            xmlhttp.open('POST', cookieUrl, true);
            xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xmlhttp.send(`timestamp=1542977135000&cookie_val=${cookie_val}&type=2`);
        }
        catch (e) {
            //console.log(e);
        }
    } else {
        console.error('连接房间失败, 未输入roomid');
    }
}

c.pocket48.liveplay.status = function (status, error, obj) {
    let html = '';
    switch (status) {
        case 0:
            html = `
            <div class="c-danmu-content" timestamp="${new Date().getTime()}" userid="0"><span class="c-danmu-text c-danmu-system">
            <b>已断开弹幕服务器连接</b>
            </span></div>
            `;
            break;
        case 1:
            html = `
            <div class="c-danmu-content" timestamp="${new Date().getTime()}" userid="0"><span class="c-danmu-text c-danmu-system">
            <b>连接弹幕服务器成功</b>
            </span></div>
            `;
            break;
        case 2:
            html = `
            <div class="c-danmu-content" timestamp="${new Date().getTime()}" userid="0"><span class="c-danmu-text c-danmu-system">
            <b>正在重新连接弹幕服务器...</b>
            </span></div>
            `;
            break;
    }
    c.pocket48.liveplay.danmu.insertAdjacentHTML("beforeend", html);
};


//发送消息
c.pocket48.liveplay.sendText = function (name, text) {
    let isBarrage = false;
    //单反斜杠发送弹幕，双反斜杠取消。
    if (text.substr(0, 1) == `\\`) {
        text = text.substr(1);
        if (text.substr(0, 1) != `\\`) {
            isBarrage = true;
        }
    }
    //弹幕内容
/*     let content = {
        "module": "live",
        "config": { "build": "190415", "phoneName": "Row b7", "version": "6.0.0", "mobileOperators": "中国电信", "ip": "10.10.10.10", "phoneSystemVersion": "9.0.1" },
        "roomId": c.pocket48.liveplay.video.room + "",
        "user": { "roleId": 1, "vip": true, "nickName": name, "level": "7", "userId": 0, "avatar": "/mediasource/avatar/20181203/1543794435621s90c95F844.png" },
        "sourceId": c.pocket48.liveplay.video.liveId, "text": text + "",
        "messageType": "BARRAGE_NORMAL",
        "fromApp": "201811",
        "inTop": isBarrage
    } */

/*      let content = {
        "sourceId":  c.pocket48.liveplay.video.liveId,
        "sessionRole": 0,
        "messageType": "BARRAGE_NORMAL",
        "fromApp": "201811",
        "module": "session",
        "bubbleId": "0",
        "inTop": isBarrage,
        "text": text + "",
        "moudule": "live",
        "user": { "gender": 0, "sessionRole": 0, "level": 2, "nickName": name, "roleId": 1, "avatar": "/mediasource/avatar/20181203/1543794435621s90c95F844.png", "badgeCount": 0, "userId": 0, "friends": 0, "badge": [], "followers": 0, "isStar": false, "money": 0, "isOwener": false, "exp": 0, "vip": true, "support": 0, "card": 0, "verification": false },
        "config": { "build": "190415", "phoneName": "Row b7", "version": "6.0.0", "mobileOperators": "中国电信", "ip": "10.10.10.10", "phoneSystemVersion": "9.0.1" },
        "roomId": c.pocket48.liveplay.video.room + ""
    } */

    let content = {
        "module":"live",
        "config":{ "build": "190415", "phoneName": "Row b7", "version": "6.0.1", "mobileOperators": "中国电信", "ip": "10.10.10.10", "phoneSystemVersion": "9.0.1" },
        "roomId":c.pocket48.liveplay.video.room + "",
        "inTop": isBarrage,
        "sourceId": c.pocket48.liveplay.video.liveId,
        "text":text + "",
        "messageType":"BARRAGE_NORMAL",
        "fromApp":"201811",
        "user":{"roleId":1,"userId":0,"badge":["/mediasource/badge/small/mzsnh_1_s.png"],"avatar":"/mediasource/avatar/20181203/1543794435621s90c95F844.png","level":"2","vip":isBarrage,"nickName":name}
    }

    try {
        c.pocket48.liveplay.video.cr.sendText({
            text: text,
            custom: JSON.stringify(content),
            done: function (e, o) {
                c.pocket48.liveplay.print([o]);
                document.querySelector('#c-text').value = '';
                if (c.d(1)) { console.log('发送:', o); }
            }
        });
    } catch (e) { console.debug(e); }
}

c.pocket48.liveplay.sendSubmit = function () {
    c.pocket48.liveplay.sendText(document.querySelector('#c-name').value, document.querySelector('#c-text').value);
    return false;
};

c.pocket48.liveplay.init();