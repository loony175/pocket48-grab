<template>
  <div>
    <div class="mdui-appbar mdui-appbar-fixed">
      <div class="mdui-toolbar mdui-color-light-blue-700">
        <span
          class="mdui-btn mdui-btn-icon mdui-ripple mdui-ripple-white"
          mdui-drawer="{target: '#main-drawer', swipe: true}"
        >
          <i class="mdui-icon material-icons">menu</i>
        </span>
        <a href="./" class="mdui-typo-headline">口袋48视频、房间、信息获取 v{{ GLOBAL.version }}</a>
        <div class="mdui-toolbar-spacer"></div>
        <!--         <a
          href="./about"
          class="mdui-btn mdui-btn-icon mdui-ripple mdui-ripple-white"
          mdui-tooltip="{content: '关于&更多工具'}"
        >
          <i class="mdui-icon material-icons">more</i>
        </a>-->
      </div>
    </div>
    <div class="mdui-drawer" id="main-drawer">
      <div class="mdui-list" mdui-collapse="{accordion: false}">
        <div
          class="mdui-collapse-item mdui-collapse-item-open"
          :key="item.title"
          v-for="item in menu"
        >
          <div class="mdui-collapse-item-header mdui-list-item mdui-ripple">
            <i
              class="mdui-list-item-icon mdui-icon material-icons mdui-text-color-pink"
            >{{ item.icon }}</i>
            <div class="mdui-list-item-content">{{ item.title }}</div>
            <i class="mdui-collapse-item-arrow mdui-icon material-icons">keyboard_arrow_down</i>
          </div>
          <div class="mdui-collapse-item-body mdui-list">
            <router-link
              v-for="to in item.children"
              :key="to.title"
              :to="to.link"
              class="mdui-list-item mdui-ripple"
            >{{to.title}}</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "menuNav",
  data() {
    return {
      menu: [
        {
          title: "开始",
          icon: "dashboard",
          children: [
            { title: "成员直播&录播", link: "/live" },
            { title: "公演直播&录播", link: "/openlive" },
            { title: "口袋房间", link: "/room" }
          ]
        },
        {
          title: "工具",
          icon: "build",
          children: [
            { title: "成员信息(支持缩写)", link: "/member" },
            { title: "用户查询", link: "/user" },
            { title: "屏蔽词查询", link: "/banlist" }
          ]
        }, {
          title: "配置",
          icon: "settings",
          children: [
            { title: "设置", link: "/setting" },
            { title: "账户", link: "/account" },
            { title: "关于&说明", link: "/readme" }
          ]

        }
      ]
    };
  }
};
</script>