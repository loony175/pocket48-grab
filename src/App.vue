<style>
body {
  background-color: #fcfcfc;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  line-height: 1.5;
}
</style>

<template>
  <div>
    <menuNav/>
    <div class="mdui-container">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
      <div class="mdui-row">
        <p style="text-align: center">@小赛艇 xsaiting.com</p>
      </div>
    </div>
  </div>
</template>

<script>
import mdui from "mdui";
/* import "mdui/dist/css/mdui.css"; */
import menuNav from "@/components/menuNav";
export default {
  name: "App",
  data() {
    return { hideSider: false };
  },
  components: { menuNav },
/*     methods: {
    openDrawer() {
      var drawer = new mdui.Drawer("#main-drawer");
      drawer.open();
    }
  }, */
  mounted: function() {
    this.GLOBAL.mdui = mdui;
  }
};
</script>