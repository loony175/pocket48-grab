/** 直播+录播表格控制器
 *  由于LiveList和ReviewList共用组件TableLive, 需要控制器来完成请求及数据传递
 */
<template>
  <div>
    <!-- Live表格 -->
    <div v-show="liveList.length>0&&dLive">
      <h3>直播</h3>
      <TableLive :list="liveList" :isLive="true" :isCol="GLOBAL.config.isCol"/>
    </div>

    <!-- Review表格 -->
    <div v-show="reviewList.length>0&&dReview">
      <h3>录播</h3>
      <TableLive :list="reviewList" :isLive="false" :isCol="GLOBAL.config.isCol"/>
      <div style="display: flex; justify-content:center">
        <el-button style="" v-show="reviewNext" @click="getLiveMore(true)" size="small">加载更多</el-button>
      </div>
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
      reviewNext: "",
      liveNext: "",
      reviewReq: {},
      liveReq: {}
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
        next: "0",
        record: "false",
        groupId: "0",
        teamId: "0",
        userId: "0",
        loadMore: true
      }
    ) {
      /* 统计live */
      this.GLOBAL.sta("liveREQ", req);
      /* 提交表单 获取直播 */
      if (req.record == "false" || req.record == false) {
        this.liveReq = req;
      } else {
        this.reviewReq = req;
      }
      axios({
        url: this.GLOBAL.api.livelist,
        method: "post",
        headers: new this.GLOBAL.headers(),
        data: {
          next: req.next || "0" + "",
          record: req.record || "false" + "",
          groupId: req.groupId || "0" + "",
          teamId: req.teamId || "0" + "",
          userId: req.userId || "0" + ""
        }
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
      /* 插入表格 */
      //判断种类
      if (req.record == "true" || req.record == true) {
        //录播
        //判断是否加载更多
        if (req.loadMore) {
          this.reviewList = this.reviewList.concat(res.content.liveList);
        } else {
          this.reviewList = res.content.liveList;
        }
        this.reviewNext = res.content.next;
      } else {
        //直播
        //判断是否加载更多
        if (req.loadMore) {
          this.liveList = this.liveList.concat(res.content.liveList);
        } else {
          this.liveList = res.content.liveList;
        }
      }
      /* 获取详情(roomId和streamPath) */
      res.content.liveList.forEach(row => {
        this.getLiveOne({ liveId: row.liveId });
      });
      console.log(res, req);
    },
    getLiveOne(
      req = {
        liveId: "324482120818692098"
      }
    ) {
      axios({
        url: this.GLOBAL.api.liveone,
        method: "post",
        headers: {},
        data: {
          liveId: req.liveId || "0" + ""
        }
      })
        .then(response => {
          this.upLiveOne(response.data, req);
        })
        .catch(e => {
          console.log(e);
        });
    },
    upLiveOne(res, req) {
      console.debug(res, req);
      //将单条数据添加至list中
      for (var i in this.liveList) {
        if (this.liveList[i].liveId == res.content.liveId) {
          this.liveList[i].playStreamPath = res.content.playStreamPath;
          this.liveList[i].msgFilePath = res.content.msgFilePath;
          this.$set(this.liveList[i], "roomId", res.content.roomId);
          return;
        }
      }
      for (var i in this.reviewList) {
        if (this.reviewList[i].liveId == res.content.liveId) {
          this.reviewList[i].playStreamPath = res.content.playStreamPath;
          this.reviewList[i].msgFilePath = res.content.msgFilePath;
          this.$set(this.reviewList[i], "roomId", res.content.roomId);
          return;
        }
      }
    },
    getLiveMore(isRecord) {
      if (isRecord) {
        if (this.reviewNext) {
          this.reviewReq.loadMore = true;
          this.reviewReq.next = this.reviewNext;
          this.getLive(this.reviewReq);
        }
      } else {
      }
    }
  },
  components: { TableLive, cDivider }
};
</script>