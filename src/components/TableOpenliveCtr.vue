/** 公演直播表格控制器
 *  两个组件Openlive, 需要控制器来完成请求及数据传递
 */
<template>
  <div>
    <!-- OpenLive表格 -->
    <div v-show="reviewList.length>0&&dReview">
      <h3>录播</h3>
      <TableOpenlive :list="reviewList" :isCol="GLOBAL.config.isCol"/>
      <cDivider/>
    </div>
    <!-- OpenLiveReview表格 -->
    <div v-show="liveList.length>0&&dLive">
      <h3>直播</h3>
      <TableOpenlive :list="liveList" :isCol="GLOBAL.config.isCol"/>
      <cDivider/>
    </div>
  </div>
</template>

<script>
import TableOpenlive from "@/components/TableOpenlive";
import cDivider from "@/components/cDivider";
import axios from "axios";
export default {
  name: "TableOpenliveCtr",
  data() {
    return {
      reviewList: [],
      liveList: []
    };
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
        isReview: 1,
        groupId: 0,
        userId: 0,
        lastGroupId: 0,
        lastTime: 0,
        type: 0,
        giftUpdTime: 1498211389003,
        limit: 50
      }
    ) {
      /* 请求 获取公演 */
      axios({
        url: this.GLOBAL.api.liveOpen,
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
      /* 回调 获取公演 */
      if (req.isReview == 1) {
        this.reviewList = res.content.liveList;
      } else {
        this.liveList = res.content.liveList;
      }
      res.content.liveList.forEach(item => {
        this.getOne({
          type: 0,
          liveId: item.liveId
        });
      });
      console.log(res, req);
    },
    getOne(
      req = {
        type: 0,
        liveId: "59b68e240cf206c8d3b5b42e"
      }
    ) {
      /* 请求 单条直播 */
      axios({
        url: this.GLOBAL.api.liveInfo,
        method: "post",
        headers: new this.GLOBAL.headers(),
        data: req
      })
        .then(response => {
          this.upOne(response.data, req);
        })
        .catch(e => {
          console.log(e);
        });
    },
    upOne(res, req) {
      /* 回调 单条直播 */
      this.addOne(res.content, req.liveId);
    },
    addOne(liveOne, liveId) {
      //将单条数据添加至list中
      for (var i in this.liveList) {
        if (this.liveList[i].liveId == liveId) {
          this.liveList[i].streamPathLd = liveOne.streamPathLd;
          this.liveList[i].streamPath = liveOne.streamPath;
          this.$set(this.liveList[i],'streamPathHd',liveOne.streamPathHd)
          return;
        }
      }
      for (var i in this.reviewList) {
        if (this.reviewList[i].liveId == liveId) {
          this.reviewList[i].streamPathLd = liveOne.streamPathLd;
          this.reviewList[i].streamPath = liveOne.streamPath;
          this.$set(this.reviewList[i],'streamPathHd',liveOne.streamPathHd)
          return;
        }
      }
      console.log(liveOne, liveId);
    }
  },
  components: { TableOpenlive, cDivider }
};
</script>