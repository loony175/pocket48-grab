/* 全局变量定义 Global.vue */
<script>
import axios from "axios";
var GLOBAL = {};
GLOBAL.version = "2.6.1.2";
GLOBAL.debug = false;

//配置缓存
(GLOBAL.configInit = function() {
  // 默认配置
  GLOBAL.config = {
    isCol: true, //是否收起表格
    isColor: true, //是否开启队伍颜色
    isAutoSync: true, //是否自动更新数据
    version: GLOBAL.version, //版本号
    isShowTip: false //是否查看过提示
  };
  // console.log('init')
})();
(GLOBAL.readConfig = function() {
  try {
    /* 尝试获取localStorage中的config项 */
    GLOBAL.config = JSON.parse(localStorage.getItem("config")) || {};
  } catch (e) {
    console.log(e);
  }
  //如果版本号不相同，重置设置。
  if (typeof GLOBAL.config.version === "undefined") {
    GLOBAL.configInit();
    return;
  }
  if (GLOBAL.config.version != GLOBAL.version) {
    GLOBAL.configInit();
  }
  // console.log(GLOBAL.config);
})();
GLOBAL.saveConfig = function() {
  localStorage.setItem("config", JSON.stringify(GLOBAL.config));
};

//配置账户
(GLOBAL.accountInit = function() {
  // 默认配置
  GLOBAL.account = {
    token: 0
  };
})();
(GLOBAL.accountLoad = function() {
  try {
    /* 尝试获取localStorage中的account项 */
    GLOBAL.account = JSON.parse(localStorage.getItem("account")) || {};
  } catch (e) {
    console.log(e);
  }
  //如果没有token，则重置
  if (
    GLOBAL.account.token == "" ||
    typeof GLOBAL.account.token === "undefined"
  ) {
    GLOBAL.accountInit();
  }
})();
GLOBAL.accountSave = function() {
  localStorage.setItem("account", JSON.stringify(GLOBAL.account));
};

//api设置
GLOBAL.api = {
};

//生产环境api
GLOBAL.apiProd = {
  update: "./static/proxy.php?f=update",
  livelist: "https://pocketapi.48.cn/live/api/v1/live/getLiveList",
  openlivelist: "https://pocketapi.48.cn/live/api/v1/live/getOpenLiveList",
  liveone: "https://pocketapi.48.cn/live/api/v1/live/getLiveOne",
  openliveone: "https://pocketapi.48.cn/live/api/v1/live/getOpenLiveOne",

  roomid: "https://pocketapi.48.cn/im/api/v1/im/room/info/type/source",
  roomlio: "https://pocketapi.48.cn/im/api/v1/chatroom/msg/list/homeowner",
  roomlia: "https://pocketapi.48.cn/im/api/v1/chatroom/msg/list/all",

  login: "./static/proxy.php?f=login",
  userhome: "https://pocketapi.48.cn/user/api/v1/user/info/home"
};

//开发环境api
GLOBAL.apiDev = {
  update: "http://xsaiting.cn/pocket48/proxydev.php?f=update",
  livelist: "https://pocketapi.48.cn/live/api/v1/live/getLiveList",
  openlivelist: "https://pocketapi.48.cn/live/api/v1/live/getOpenLiveList",
  liveone: "https://pocketapi.48.cn/live/api/v1/live/getLiveOne",
  openliveone: "https://pocketapi.48.cn/live/api/v1/live/getOpenLiveOne",

  roomid: "https://pocketapi.48.cn/im/api/v1/im/room/info/type/source",
  roomlio: "https://pocketapi.48.cn/im/api/v1/chatroom/msg/list/homeowner",
  roomlia: "https://pocketapi.48.cn/im/api/v1/chatroom/msg/list/all",

  login: "http://xsaiting.cn/pocket48/proxydev.php?f=login",
  userhome: "https://pocketapi.48.cn/user/api/v1/user/info/home"
};

//使用代理
if (process.env.NODE_ENV == "development") {
  GLOBAL.api = GLOBAL.apiDev;
} else if (process.env.NODE_ENV == "production") {
  GLOBAL.api = GLOBAL.apiProd;
}

//headers设置
GLOBAL.headers = function() {
  if (GLOBAL.account.token) {
    this.token = GLOBAL.account.token;
  }
};

//基本信息缓存
GLOBAL.info = {};
GLOBAL.infoLoaded = false;
(GLOBAL.readInfo = function() {
  try {
    /* 尝试获取localStorage中的info项 */
    GLOBAL.info = JSON.parse(localStorage.getItem("info"));
    GLOBAL.infoLoaded = true;
  } catch (e) {
    console.log(e);
    GLOBAL.info = {};
  }
})();
GLOBAL.saveInfo = function() {
  localStorage.setItem("info", JSON.stringify(GLOBAL.info));
};
//更新数据
GLOBAL.getInfo = function() {
  var req = {};
  /* 请求 获取同步信息 update */
  axios({
    url: GLOBAL.api.update,
    method: "post",
    headers: new GLOBAL.headers(),
    data: req
  })
    .then(response => {
      GLOBAL.upInfo(response.data, req);
    })
    .catch(e => {
      console.log(e);
    });
};
GLOBAL.upInfo = function(res, req) {
  GLOBAL.info = res.content;
  GLOBAL.saveInfo();
  console.log(res, req);
};
if (GLOBAL.config.isAutoSync) {
  GLOBAL.getInfo();
}

/**
 * 成员id转成员名
 */
GLOBAL.memberId2name = function(userId) {
  for (var i in GLOBAL.info.starInfo) {
    if (GLOBAL.info.starInfo[i].userId == userId) {
      return GLOBAL.info.starInfo[i].realName;
    }
  }
  return false;
};
/**
 * 队伍id转队伍名
 */
GLOBAL.teamId2name = function(teamId) {
  for (var i in GLOBAL.info.teamInfo) {
    if (GLOBAL.info.teamInfo[i].teamId == teamId) {
      return GLOBAL.info.teamInfo[i].teamName;
    }
  }
  return false;
};
/**
 * 团体id转团体名
 */
GLOBAL.groupId2name = function(groupId) {
  for (var i in GLOBAL.info.groupInfo) {
    if (GLOBAL.info.groupInfo[i].groupId == groupId) {
      return GLOBAL.info.groupInfo[i].groupName;
    }
  }
  return false;
};
/**
 * 期数id转期数名
 */
GLOBAL.periodId2name = function(periodId) {
  for (var i in GLOBAL.info.periodInfo) {
    if (GLOBAL.info.periodInfo[i].periodId == periodId) {
      return GLOBAL.info.periodInfo[i].periodName;
    }
  }
  return false;
};

/**
 * 成员id转队伍id
 */
GLOBAL.memberId2teamId = function(userId) {
  for (var i in GLOBAL.info.starInfo) {
    if (GLOBAL.info.starInfo[i].userId == userId) {
      return GLOBAL.info.starInfo[i].teamId;
    }
  }
  return false;
};

/**
 * 团体id转首个队伍id
 */
GLOBAL.groupId2firstTeamId = function(groupId) {
  for (var i in GLOBAL.info.teamInfo) {
    if (
      GLOBAL.info.teamInfo[i].teamId != 0 &&
      GLOBAL.info.teamInfo[i].groupId == groupId
    ) {
      return GLOBAL.info.teamInfo[i].teamId;
    }
  }
  return 0;
};

/**
 * 队伍id转颜色
 */
GLOBAL.teamId2color = function(teamId) {
  for (var i in GLOBAL.info.teamInfo) {
    if (GLOBAL.info.teamInfo[i].teamId == teamId) {
      return GLOBAL.info.teamInfo[i].teamColor;
    }
  }
  return false;
};

/**
 * 成员id转颜色
 */
GLOBAL.memberId2color = function(memberId) {
  return GLOBAL.teamId2color(GLOBAL.memberId2teamId(memberId));
};

/**
 * 成员id颜色渲染
 * @returns 颜色代码 '#xxxxxx'
 */
GLOBAL.renderColor = function(memberId) {
  if (GLOBAL.config.isColor) {
    var color = GLOBAL.memberId2color(memberId);
    //避免白色
    if (color.toUpperCase() == "FFFFFF") {
      color = "000000";
    }
    return "#" + color;
  } else {
    return "inherit";
  }
};

/**
 * 团体id颜色渲染
 *
 */
GLOBAL.renderColorG = function(groupId) {
  if (GLOBAL.config.isColor) {
    var teamId = GLOBAL.groupId2firstTeamId(groupId);
    var color = GLOBAL.teamId2color(teamId);
    //避免白色
    if (color.toUpperCase() == "FFFFFF") {
      color = "000000";
    }
    return "#" + color;
  } else {
    return "inherit";
  }
};

/**
 * 统计
 */
GLOBAL.sta = function(name, data) {
  if (_hmt) {
    /* 百度事件统计
    _hmt.push(["_trackEvent", name, action, value]);
    */
   /**
    * action memberId(memberName) / groupId(groupName) / userId(userName)
    * value groupId|teamId|userId|record|next
    */
    var action, value;
    if (name == "liveREQ") {
      if (data.memberId == 0) {
        action = `${data.groupId}(${GLOBAL.groupId2name(data.groupId)})`;
      } else {
        action = `${data.userId}(${GLOBAL.memberId2name(data.userId)})`;
      }
      value = `${data.groupId}(${GLOBAL.groupId2name(data.groupId)}) | ${data.teamId}(${GLOBAL.teamId2name(data.teamId)}) | ${data.userId}(${GLOBAL.memberId2name(data.userId)}) | ${data.record} | ${data.next}`;
    }
    if (name == "openREQ") {
      action = `${data.groupId}(${GLOBAL.groupId2name(data.groupId)})`;
      value = `${data.groupId}(${GLOBAL.groupId2name(data.groupId)}) | ${data.teamId}(${GLOBAL.teamId2name(data.teamId)}) | ${data.userId}(${GLOBAL.memberId2name(data.userId)}) | ${data.record} | ${data.next}`;
    }
    if (name == "roomREQ") {
      action = `${data.memberId}(${GLOBAL.memberId2name(data.memberId)})`;
      value = `${data.groupId}(${GLOBAL.groupId2name(data.groupId)}) | ${data.teamId}(${GLOBAL.teamId2name(data.teamId)}) | ${data.memberId}(${GLOBAL.memberId2name(data.memberId)}) | ${data.nextTime}`;
    }
    if (name == "loginRES") {
      action = `${data.content.userInfo.userId}(${
        data.content.userInfo.nickname
      })`;
      value = `${data.content.userInfo.userId}(${
        data.content.userInfo.nickname
      }) | ${data.content.userInfo.exp}`;
    }
    //console.log(name, action, value);
    //_hmt.push(['_trackEvent', category, action, opt_label, opt_value]);
    _hmt.push(["_trackEvent", name, action, value]);
  }
};

/**
 * 去重合并
 */
GLOBAL.concatuni = function(arrs = [], id) {
  var temp = {}, //用于id判断重复
    result = [], //最后的新数组
    isU = false; //返回是否有重复
  //去重(唯一id: id)
  arrs.forEach(arr => {
    arr.map((item, index) => {
      if (!temp[item[id]]) {
        result.push(item);
        temp[item[id]] = true;
      } else {
        isU = true;
      }
    });
  });
  return result;
};

GLOBAL.source = "https://source.48.cn"; //图片及资源前缀
GLOBAL.liveUrl = "https://h5.48.cn/2019appshare/liveshare/?id="; //公演直播在线观看前缀
GLOBAL.memberLiveUrl = "https://h5.48.cn/2019appshare/memberLiveShare/?id="; //
GLOBAL.getPicPath = function(picUrl) {
  try {
    return (picUrl.slice(0, 4) == "http" ? "" : GLOBAL.source) + picUrl;
  } catch (e) {
    console.log(picUrl,e);
  }
};

Date.prototype.Format = function(fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "H+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return fmt;
};
export default GLOBAL;
</script>