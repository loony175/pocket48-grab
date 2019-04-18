/** 公演直播表格控制器
 *  两个组件Openlive, 需要控制器来完成请求及数据传递
 */
<template>
  <div>
    <!-- OpenLive表格 -->
    <div v-show="reviewList.length>0&&dReview">
      <h3>录播</h3>
      <TableOpenlive :list="reviewList" :isRecord="true" :isCol="GLOBAL.config.isCol"/>
      <div style="display: flex; justify-content:center">
        <el-tooltip class="item" effect="light" :content="reviewNext" placement="bottom">
          <el-button style v-show="reviewNext" @click="getLiveMore(true)" size="small">加载更多</el-button>
        </el-tooltip>
      </div>
      <cDivider/>
    </div>
    <!-- OpenLiveReview表格 -->
    <div v-show="liveList.length>0&&dLive">
      <h3>直播</h3>
      <TableOpenlive :list="liveList" :isRecord="false" :isCol="GLOBAL.config.isCol"/>
      <div style="display: flex; justify-content:center">
        <el-tooltip class="item" effect="light" :content="reviewNext" placement="bottom">
          <el-button style v-show="liveNext" @click="getLiveMore(false)" size="small">加载更多</el-button>
        </el-tooltip>
      </div>
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
      liveList: [],
      liveNext: "0",
      reviewNext: "0",
      liveReq: {},
      reviewReq: {}
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
      /* 统计openlive */
      this.GLOBAL.sta('openREQ',req);
      /* 请求 获取公演 */
      if (req.record == "false" || req.record == false) {
        this.liveReq = req;
      } else {
        this.reviewReq = req;
      }
      axios({
        url: this.GLOBAL.api.openlivelist,
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
      /* 回调 获取公演 */
      /* 插入表格 */
      //判断种类
      if (req.record == "true" || req.record == true) {
        //录播
        //判断是否加载更多
        if (req.loadMore) {
          if (res.content.liveList.length == 0) {
            // 无更多数据
            this.$message("已无更多数据...");
          }
          this.reviewList = this.GLOBAL.concatuni(
            [this.reviewList, res.content.liveList],
            "liveId"
          );
        } else {
          this.reviewList = res.content.liveList;
        }
        //记录Next
        this.reviewNext = res.content.next;
      } else {
        //直播
        //判断是否加载更多
        if (req.loadMore) {
          if (res.content.liveList.length == 0) {
            // 无更多数据
            this.$message("已无更多数据...");
          }
          this.liveList = this.GLOBAL.concatuni(
            [this.liveList, res.content.liveList],
            "liveId"
          );
        } else {
          this.liveList = res.content.liveList;
        }
        //记录Next
        this.liveNext = res.content.next;
      }
      /* 获取详情(roomId和streamPath) */
      res.content.liveList.forEach(row => {
        this.getOpenLiveOne({ liveId: row.liveId });
      });
      console.log(res, req);
    },
    getOpenLiveOne(
      req = {
        liveId: "0"
      }
    ) {
      /* 请求 单条直播 */
      axios({
        url: this.GLOBAL.api.openliveone,
        method: "post",
        headers: {},
        data: {
          liveId: req.liveId || "0" + ""
        }
      })
        .then(response => {
          this.upOpenLiveOne(response.data, req);
        })
        .catch(e => {
          console.log(e);
        });
    },
    upOpenLiveOne(res, req) {
      console.debug(res, req);
      //将单条数据添加至list中
      for (var i in this.liveList) {
        if (this.liveList[i].liveId == res.content.liveId) {
          this.$set(this.liveList[i], "playStreams", res.content.playStreams);
          return;
        }
      }
      for (var i in this.reviewList) {
        if (this.reviewList[i].liveId == res.content.liveId) {
          this.$set(this.reviewList[i], "playStreams", res.content.playStreams);
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
        if (this.liveNext) {
          this.liveReq.loadMore = true;
          this.liveReq.next = this.liveNext;
          this.getLive(this.liveReq);
        }
      }
    }
  },
  components: { TableOpenlive, cDivider }
};
</script>