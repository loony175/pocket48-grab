/** 直播+录播表格控制器
 *  由于LiveList和ReviewList共用组件TableLive, 需要控制器来完成请求及数据传递
 */
<template>
  <div>
    <!-- Live表格 -->
    <div v-show="liveList.length>0&&dLive">
      <h3>直播</h3>
      <TableLive :list="liveList" :isCol="isCol"/>
    </div>

    <!-- Review表格 -->
    <div v-show="reviewList.length>0&&dReview">
      <h3>录播</h3>
      <TableLive :list="reviewList" :isCol="isCol"/>
    </div>
  </div>
</template>

<script>
import TableLive from "@/components/TableLive";
import cDivider from "@/components/cDivider";
import axios from "axios";
export default {
  name: "TableLiveCtr",
  data() {
    return {
      reviewList: [],
      liveList: [],
    };
  },computed:{
    isCol(){return this.GLOBAL.config.isCol}
  },
  props: {
    dLive: {
      //显示直播
      type: Boolean,
      default: true
    },
    dReview: {
      //显示录播
      type: Boolean,
      default: true
    }
  },
  methods: {
    getLive(
      req = {
        lastTime: 0,
        limit: 50,
        memberId: 0,
        groupId: 0
      }
    ) {
      /* 提交表单 获取直播 */
      axios({
        url: this.GLOBAL.api.live,
        method: "post",
        headers: new this.GLOBAL.headers(),
        data: req
      })
        .then(response => {
          this.upLive(response.data, req);
        })
        .catch(e => {
          console.log(e);
        });
    },
    upLive(res, req) {
      /* 获取的回调 */
      this.reviewList = res.content.reviewList;
      this.liveList = res.content.liveList;
      console.log(res, req);
    }
  },
  components: { TableLive, cDivider }
};
</script>