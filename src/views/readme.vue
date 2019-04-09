<style>
.c-readme {
  padding-left: 2rem;
  margin: 2rem 0;
}
.c-readme span {
  margin-right: 1rem;
}
</style>

<template>
  <div>
    <h1># 关于&说明</h1>
    <cDivider/>
    <div class="c-readme">
      <img src="static/img/xsaiting.jpg" style="width: 80px" />
      <h3>点击左侧菜单来使用...</h3>
      <p>
        <span>当前版本: v{{ sharedState.version }}</span>
        <span>
          稳定版:
          <a href="https://xsaiting.com/pocket48">点此</a>
        </span>
        <span>
          开发版:
          <a href="http://xsaiting.cn/pocket48">点此</a>
        </span>
      </p>
      <p>
        <span>程序作者: 小赛艇</span>
        <span>联系方式: xsaiting@qq.com</span>
        <span>
          GitHub项目:
          <a target="_blank" href="http://github.com/xsaiting/pocket48">pocket48-grab</a>
        </span>
      </p>
    <cDivider/>
      <p>1. 使用遇到任何问题/有任何建议请联系xsaiting@qq.com</p>
      <p>
        2. 成员直播可以使用本站播放器播放(对于xiaoka.tv的视频源不可播放，Chrome解决方法：
        <a
          target="_blank"
          href="https://github.com/xsaiting/pocket48-grab/wiki/Chrome-Chromium%E8%B7%A8%E5%9F%9F%E6%8F%92%E4%BB%B6%E5%AE%89%E8%A3%85(%E7%9C%8B%E6%9C%89%E4%BA%9B%E6%97%A0%E6%B3%95%E4%BD%BF%E7%94%A8%E6%B5%8F%E8%A7%88%E5%99%A8%E7%9C%8B%E7%9A%84%E7%9B%B4%E6%92%AD)"
        >点此</a>)，支持弹幕互动。
        <b>请勿滥用！</b> 成员录播+弹幕播放方法参考：
        <a
          target="_blank"
          href="https://github.com/xsaiting/pocket48-grab/wiki/%E5%A6%82%E4%BD%95%E6%92%AD%E6%94%BE%E5%BD%95%E6%92%AD%E8%A7%86%E9%A2%91-%E5%BC%B9%E5%B9%95%EF%BC%9F"
        >点此</a>。弹幕lrc文件转ass视频字幕文件：
        <a target="_blank" href="./barrage.html">点此</a>。
      </p>
      <p>
        3. 在线播放说明：任何格式均可使用VLC media player【<a target="_blank" href="http://www.videolan.org/">下载</a>】或KMPlayer【<a target="_blank" href="http://kmplayer.com/">下载</a>】在线播放，移动端可以使用MXPlayer的网络串流功能播放。
      </p>
      <p>
        4. 下载说明：mp4格式或flv格式可以直接用下载工具(迅雷、idm、浏览器)下载/录制，公演回放和小部分成员直播为m3u8格式，下载/录制m3u8视频的方法参考：
        <a
          target="_blank"
          href="https://github.com/xsaiting/pocket48-grab/wiki/%E5%A6%82%E4%BD%95%E7%94%A8VLC%E6%89%93%E5%BC%80m3u8%E6%96%87%E4%BB%B6%E5%B9%B6%E4%B8%8B%E8%BD%BD%EF%BC%88%E5%BD%95%E5%88%B6%EF%BC%89%3F"
        >点此</a>
      </p>
      <p>5. 口袋房间功能需要token，可通过账号密码获取，本程序保证不会储存您的账号、密码及token，但也不保证您的账户安全问题，建议使用小号</p>
    </div>
    <cDivider/>
  </div>
</template>
<script>
import cDivider from "@/components/cDivider";
export default {
  name: "readme",
  data() {
    return {
      sharedState: this.GLOBAL
    }
  },
  components: { cDivider }
};
</script>