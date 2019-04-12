<style>
.c-member-content {
  display: flex;
  width: 100%;
  word-break: break-all;
}
.c-member-avatar {
  display: flex;
  align-items: center;
  flex: 0 1;
  max-width: 40vw;
}
.c-member-avatar img {
  max-height: 18rem;
}
.c-member-info {
  flex: 1;
}
.c-member-info-in {
  margin: 1rem;
  padding: 1.5rem 1.5rem 1.5rem 2.5rem;
  border-left: 1px solid #cccccc;
}
</style>

<template>
  <div v-if="item.userInfo">
    <div class="c-member-content">
      <div class="c-member-avatar">
        <img :src="GLOBAL.getPicPath(item.userInfo.avatar) ">
      </div>
      <div class="c-member-info">
        <div class="c-member-info-in">
          <p>{{ item.userInfo.nickName }} id:{{ item.userInfo.userId }}</p>
          <p>
            【等级】 {{item.userInfo.level}} 【经验】 {{item.userInfo.experience}}
            <span
              v-if="item.friendsNum"
            >【关注】 {{item.friendsNum}}</span>
          </p>
          <p>【性别】 {{item.userInfo.gender==0?('保密'):(item.userInfo.gender==1?('女'):('男'))}} 【生日】 {{item.userInfo.birthday}} 【地区】 {{item.userInfo.city}}</p>
          <div v-if="item.userReconmmend">
            <p>【首推】 {{GLOBAL.memberId2name(item.userRecommend.first.memberId)}} 贡献 {{ item.userRecommend.first.money }}</p>
            <p>【二推】 {{GLOBAL.memberId2name(item.userRecommend.second.memberId)}} 贡献 {{ item.userRecommend.second.money }}</p>
            <p>【三推】 {{GLOBAL.memberId2name(item.userRecommend.third.memberId)}} 贡献 {{ item.userRecommend.third.money }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "InfoUser",
  props: ["item"]
};
</script>