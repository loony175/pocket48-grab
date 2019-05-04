/* 
加载更多按钮
props:
  ling 是否在加载中
  disable 禁止自动加载
methods: loadmore 加载更多
 */
<style>
</style>
<template>
  <div ref="loadmore" style="display: inline-flex; justify-content:center;">
    <el-button :disabled="Boolean(ling)" @click="$emit('loadmore')" size="small">
      <i class="el-icon-loading" v-show="Boolean(ling)"></i>
      加载更多
    </el-button>
  </div>
</template>
<script>
export default {
  methods: {
    bottomVisible(ref) {
      /* 判断加载更多是否滚动到底部 */
      // 1. 窗口高度 wH
      var wH =
        window.innerHeight ||
        document.body.clientHeight ||
        document.documentElement.clientHeight;
      // 2. 滚动条下降的距离 wS
      var wS = window.scrollY;
      // 3. 元素到顶部的距离 eO
      var eO = this.$refs[ref].offsetTop;
      // 4. 元素的高度 eH
      var eH = this.$refs[ref].clientHeight;
      // 当 eO == 0 时，元素不在页面上
      // 当 wH + wS > eO + eH 时，已经在页面显示，即滚动到底部
      // console.log(wH, wS, eO, eH, eO && wH + wS > eO + eH);
      return eO && wH + wS > eO + eH;
    }
  },
  created() {
    /* 监听窗口滚动 */
    window.addEventListener("scroll", () => {
      /* 判断是否滚动到底部 */
      if (
        this.bottomVisible("loadmore") && //可见性
        !this.ling && //不在加载中
        !this.disable && //不禁止加载更多
        this.GLOBAL.config.isAutoLoad //全局设置
      ) {
        /* 如果不在加载中，则加载更多 */
        this.$emit("loadmore");
      }
    });
  },
  props: {
    ling: {
      type: [Boolean, Number],
      default: false
    },
    disable: {
      type: Boolean,
      default: false
    }
  }
};
</script>
