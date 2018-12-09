if (typeof c === 'undefined') {
    c = {};
}
if (typeof c.pocket48 === 'undefined') {
    c.pocket48 = {};
}
if (typeof c.pocket48.cr === 'undefined') {
    c.pocket48.cr = {};
}

c.pocket48.getPicUrl = c.pocket48.getPicUrl || function (url) {
    if (url.substring(0,4)!='http'){
        return 'https://source.48.cn'+url;
    }
};

c.pocket48.cr.account = '48webAdfgrhtr';
c.pocket48.cr.token = '48webAdfgrhtr';
c.pocket48.cr.connect = function (crId,crPrint,crStatus) {
    let chatroom = new Chatroom ({
        appKey:'632feff1f4c838541ab75195d1ceb3fa',
        account: c.pocket48.cr.account,
        token: c.pocket48.cr.token,
        chatroomId: crId,
        chatroomAddresses: [
            'weblink03.netease.im:443',
            'weblink04.netease.im:443'
        ],
        onconnect: function(obj){ //连接成功
            chatroom.getChatroom({
                done: function(error, obj){
                    return; //获取成功
                }
            });
            crStatus(1,{},obj);
        },
        onerror: function(error,obj){ //连接失败
            crStatus(0,error,obj);
        },
        onwillreconnect: function(obj){ //断线重连
            crStatus(2,{},obj);
        },
        ondisconnect: function(error){//断开
            crStatus(0,{});
        },
        // 消息
        onmsgs: crPrint //接收消息  
    });
    return chatroom;
};