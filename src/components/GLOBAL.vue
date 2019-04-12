/* 全局变量定义 Global.vue */
<script>
import axios from "axios";
var GLOBAL = {};
GLOBAL.version = "2.6.0.10";
GLOBAL.debug = false;

//配置缓存
(GLOBAL.configInit = function() {
  // 默认配置
  GLOBAL.config = {
    isCol: true, //是否收起表格
    isColor: true, //是否开启队伍颜色
    isAutoSync: true, //是否自动更新数据
    version: GLOBAL.version //版本号
  };
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
    GLOBAL.configInit();
  }
})();
GLOBAL.accountSave = function() {
  localStorage.setItem("account", JSON.stringify(GLOBAL.account));
};

//api设置
GLOBAL.api = {
  sync: "https://psync.48.cn/syncsystem/api/cache/v1/update/overview",
  live: "https://plive.48.cn/livesystem/api/live/v1/memberLivePage",
  liveOpen: "https://plive.48.cn/livesystem/api/live/v1/openLivePage",
  liveInfo: "https://plive.48.cn/livesystem/api/live/v1/getLiveOne",
  login: "https://puser.48.cn/usersystem/api/user/v1/login/phone",
  roomId: "https://pjuju.48.cn/imsystem/api/im/room/v1/login/user/list",
  roomMain:
    "https://pjuju.48.cn/imsystem/api/im/v1/member/room/message/mainpage",
  roomBoard:
    "https://pjuju.48.cn/imsystem/api/im/v1/member/room/message/boardpage",
  flip:
    "https://ppayqa.48.cn/idolanswersystem/api/idolanswer/v1/question_answer/detail",
  checkIn: "https://puser.48.cn/usersystem/api/user/v1/check/in",
  userInfo: "https://puser.48.cn/usersystem/api/user/v1/show/info/"
};

//生产环境api
GLOBAL.apiProd = {
  sync: "./static/proxy.php?f=sync",
  live: "./static/proxy.php?f=live",
  liveOpen: "./static/proxy.php?f=liveOpen",
  liveInfo: "./static/proxy.php?f=liveInfo",
  login: "./static/proxy.php?f=login",
  roomId: "./static/proxy.php?f=roomId",
  roomMain: "./static/proxy.php?f=roomMain",
  roomBoard: "./static/proxy.php?f=roomBoard",
  flip: "./static/proxy.php?f=flip",
  checkIn: "./static/proxy.php?f=checkIn",
  userInfo: "./static/proxy.php?f=userInfo&i="
};
//开发环境api
GLOBAL.apiDev = {
  sync: "http://xsaiting.cn/pocket48/proxy.php?f=sync",
  live: "http://xsaiting.cn/pocket48/proxy.php?f=live",
  liveOpen: "http://xsaiting.cn/pocket48/proxy.php?f=liveOpen",
  liveInfo: "http://xsaiting.cn/pocket48/proxy.php?f=liveInfo",
  login: "http://xsaiting.cn/pocket48/proxy.php?f=login",
  roomId: "http://xsaiting.cn/pocket48/proxy.php?f=roomId",
  roomMain: "http://xsaiting.cn/pocket48/proxy.php?f=roomMain",
  roomBoard: "http://xsaiting.cn/pocket48/proxy.php?f=roomBoard",
  flip: "http://xsaiting.cn/pocket48/proxy.php?f=flip",
  checkIn: "http://xsaiting.cn/pocket48/proxy.php?f=checkIn",
  userInfo: "http://xsaiting.cn/pocket48/proxy.php?f=userInfo&i="
};

//使用代理
if (process.env.NODE_ENV == "development") {
  GLOBAL.api = GLOBAL.apiDev;
} else if (process.env.NODE_ENV == "production") {
  GLOBAL.api = GLOBAL.apiProd;
}

//headers设置
GLOBAL.headers = function() {
  this.version = "5.3.2";
  this.os = "Android";
  this.build = 0;
  this.token = GLOBAL.account.token;
  this.imei = Math.ceil(Math.random() * 1e6);
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
  var req = {
    videoTypeUtime: "2010-03-24 15:59:11",
    musicAlbumUtime: "2010-04-18 14:45:37",
    functionUtime: "2010-10-17 15:00:00",
    groupUtime: "2010-10-17 17:27:00",
    memberInfoUtime: "2010-10-20 11:55:09",
    talkUtime: "2010-05-05 18:04:52",
    videoUtime: "2010-05-17 18:36:32",
    musicUtime: "2010-05-05 15:56:11",
    urlUtime: "2010-07-19 12:10:59",
    teamUtime: "2010-10-20 10:39:00",
    memberPropertyUtime: "2010-02-20 18:57:48",
    periodUtime: "2010-10-14 14:45:00"
  };
  /* 请求 获取同步信息 */
  axios({
    url: GLOBAL.api.sync,
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
GLOBAL.memberId2name = function(memberId) {
  for (var i in GLOBAL.info.memberInfo) {
    if (GLOBAL.info.memberInfo[i].member_id == memberId) {
      return GLOBAL.info.memberInfo[i].real_name;
    }
  }
  return false;
};
/**
 * 队伍id转队伍名
 */
GLOBAL.teamId2name = function(teamId) {
  for (var i in GLOBAL.info.team) {
    if (GLOBAL.info.team[i].team_id == teamId) {
      return GLOBAL.info.team[i].team_name;
    }
  }
  return false;
};
/**
 * 团体id转团体名
 */
GLOBAL.groupId2name = function(groupId) {
  for (var i in GLOBAL.info.group) {
    if (GLOBAL.info.group[i].group_id == groupId) {
      return GLOBAL.info.group[i].group_name;
    }
  }
  return false;
};
/**
 * 期数id转期数名
 */
GLOBAL.periodId2name = function(periodId) {
  for (var i in GLOBAL.info.period) {
    if (GLOBAL.info.period[i].period_id == periodId) {
      return GLOBAL.info.period[i].period_name;
    }
  }
  return false;
};

/**
 * 成员id转队伍id
 */
GLOBAL.memberId2teamId = function(memberId) {
  for (var i in GLOBAL.info.memberInfo) {
    if (GLOBAL.info.memberInfo[i].member_id == memberId) {
      return GLOBAL.info.memberInfo[i].team;
    }
  }
  return false;
};

/**
 * 团体id转首个队伍id
 */
GLOBAL.groupId2firstTeamId = function(groupId) {
  for (var i in GLOBAL.info.team) {
    if (
      GLOBAL.info.team[i].team_id != 0 &&
      GLOBAL.info.team[i].group_id == groupId
    ) {
      return GLOBAL.info.team[i].team_id;
    }
  }
  return 0;
};

/**
 * 队伍id转颜色
 */
GLOBAL.teamId2color = function(teamId) {
  for (var i in GLOBAL.info.team) {
    if (GLOBAL.info.team[i].team_id == teamId) {
      return GLOBAL.info.team[i].color;
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
    _hmt.push(['_trackEvent', category, action, opt_label, opt_value]);
    */
    var index, value, action;
    if (name == "liveREQ") {
      index = 1;
      value = `${data.groupId}(${GLOBAL.groupId2name(data.groupId)});${
        data.memberId
      }(${GLOBAL.memberId2name(data.memberId)});${data.lastTime};${data.limit}`;
      if (data.memberId == 0) {
        action = `${data.groupId}(${GLOBAL.groupId2name(data.groupId)})`;
      } else {
        action = `${data.memberId}(${GLOBAL.memberId2name(data.memberId)})`;
      }
    }
    if (name == "openREQ") {
      index = 2;
      value = `${data.groupId}(${GLOBAL.groupId2name(data.groupId)});${
        data.isReview
      };${data.lastTime};${data.limit}`;
      action = `${data.groupId}(${GLOBAL.groupId2name(data.groupId)})`;
    }
    if (name == "roomREQ") {
      index = 3;
      value = `${data.memberId}(${GLOBAL.memberId2name(data.memberId)});${
        data.lastTime
      };${data.limit}`;
      action = `${data.memberId}(${GLOBAL.memberId2name(data.memberId)})`;
    }
    if (name == "loginRES") {
      index = 4;
      value = `${data.content.userInfo.userId}(${
        data.content.userInfo.nickName
      });${data.content.userInfo.experience}`;
      action = `${data.content.userInfo.userId}(${
        data.content.userInfo.nickName
      })`;
    }
    //console.log(index, name, value, opt_scope);
    //_hmt.push(['_trackEvent', category, action, opt_label, opt_value]);
    _hmt.push(["_trackEvent", name, action, value]);
  }
};

GLOBAL.source = "https://source.48.cn"; //图片及资源前缀
GLOBAL.liveUrl = "https://h5.48.cn/2017appshare/memberLiveShare/index.html?id="; //直播在线观看前缀
GLOBAL.getPicPath = function(picUrl) {
  return (picUrl.slice(0, 4) == "http" ? "" : GLOBAL.source) + picUrl;
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