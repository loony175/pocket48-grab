/* 对话卡片 用于房间内容 CardDia */
<style scoped>
img {
  max-width: 300px;
}
</style>
<style>
.c-card-dia {
  display: flex;
  width: 100%;
  word-break: break-all;
  margin: 0.5rem 0;
}
.c-card-avatar {
  flex: 0 1 45px;
}
.c-card-main {
  flex: 1;
}
.c-card-avatar-img {
  width: 45px;
  height: 45px;
  overflow: hidden;
  border-radius: 50%;
}
.c-card-avatar img {
  width: 45px;
}
.c-card-header {
  margin-left: 0.5rem;
  font-size: 0.8rem;
}
.c-card-content {
  margin-left: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.8rem;
  line-height: 1.3rem;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 5px;
}
.c-card-content img {
  max-width: 10rem;
}
.c-card-reply {
  margin: 0.5rem 0 0.5rem 1rem;
  padding-left: 1rem;
  border-left: 3px solid #f0f0f0;
}
.c-card-replyid {
  font-size: 0.6rem;
  color: #3f3f3f;
}
</style>

<template>
  <div class="c-card-dia">
    <div class="c-card-avatar">
      <div class="c-card-avatar-img">
        <img :src="GLOBAL.getPicPath(extInfo.user.avatar)">
      </div>
    </div>
    <div class="c-card-main">
      <div class="c-card-header">
        {{ extInfo.user.nickName }} {{ new Date(item.msgTime).Format("yyyy-MM-dd HH:mm:ss")}}
        {{ extInfo.config?('@'+extInfo.config.phoneName):('') }}
      </div>
      <div class="c-card-content">
        <!-- 文本信息 TEXT -->
        <div v-if="item.msgType=='TEXT'">
          <!-- 消息墙 -->
          <!-- <div
            v-if="extInfo.messageObject=='messageBoard'"
          >{{(extInfo.text)?(extInfo.text):(item.bodys)}}</div>-->
          <!-- 普通文本 -->
          <div v-if="extInfo.messageType=='TEXT'">{{extInfo.text}}</div>
          <!-- 普通翻牌信息 -->
          <div v-else-if="extInfo.messageType=='REPLY'">
            <div class="c-card-reply">
              <div class="c-card-replyid" :rid="extInfo.replyMessageId">{{extInfo.replyName}}</div>
              {{extInfo.replyText}}
            </div>
            {{extInfo.text}}
          </div>
          <!-- 视频直播信息 -->
          <div v-else-if="extInfo.messageType=='LIVEPUSH'">
            <img
              style="max-width:30px; max-height:30px"
              :src="GLOBAL.getPicPath(extInfo.liveCover)"
            >
            【视频直播】{{extInfo.liveTitle}}
            <a
              :href="GLOBAL.memberLiveUrl+extInfo.liveId"
              target="_blank"
            >{{GLOBAL.memberLiveUrl+extInfo.liveId}}</a>
          </div>
          <!-- 电台直播信息 -->
          <div v-else-if="extInfo.messageType=='diantai'">
            <img
              style="max-width:30px; max-height:30px"
              :src="GLOBAL.getPicPath(extInfo.referencecoverImage)"
            >【电台直播】
            <a
              :href="GLOBAL.memberLiveUrl+extInfo.referenceObjectId"
              target="_blank"
            >{{GLOBAL.memberLiveUrl+extInfo.referenceObjectId}}</a>
          </div>
          <!-- 翻牌问题 -->
          <div v-else-if="extInfo.messageType=='FLIPCARD'">
            <p>Q:{{ extInfo.question }}</p>
            <p>A:{{ extInfo.answer }}</p>
          </div>
          <!-- 礼物信息 -->
          <div v-else-if="extInfo.messageType=='PRESENT_TEXT'">
            送出
            {{extInfo.giftInfo.giftNum}}个
            {{extInfo.giftInfo.giftName}}
            <img
              style="max-width: 1rem;"
              :src="GLOBAL.getPicPath(extInfo.giftInfo.picPath)"
            >
          </div>
          <!-- 其他信息 -->
          <div v-else>未知文本: {{ JSON.stringify(item) }}</div>
        </div>
        <!-- 图片信息 -->
        <div v-else-if="item.msgType=='IMAGE'">
          <img :src="GLOBAL.getPicPath(JSON.parse(item.bodys).url)">
        </div>
        <!-- 语音信息 -->
        <div v-else-if="item.msgType=='AUDIO'">
          <a :href="GLOBAL.getPicPath(JSON.parse(item.bodys).url)">语音</a>
        </div>
        <!-- 视频信息 -->
        <div v-else-if="item.msgType=='VIDEO'">
          <a :href="GLOBAL.getPicPath(JSON.parse(item.bodys).url)">视频</a>
        </div>
        <!-- 表情 -->
        <div v-else-if="item.msgType=='EXPRESS'">【暂不支持的表情: {{ extInfo.emotionName }}】</div>
        <!-- 其它信息 -->
        <div v-else>未知信息: {{ JSON.stringify(item) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "CardDia",
  data() {
    return {
    };
  },
  props: {
    item: {
      type: Object,
      default: {
        extInfo: ""
      }
    },
    index: {
      type: Number
    }
  },
  methods: {  },
  computed: {
    extInfo() {
      return JSON.parse(this.item.extInfo);
    }
  }
};
</script>