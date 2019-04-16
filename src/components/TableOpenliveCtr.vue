/** 公演直播表格控制器
 *  两个组件Openlive, 需要控制器来完成请求及数据传递
 */
<template>
  <div>
    <!-- OpenLive表格 -->
    <div v-show="reviewList.length>0&&dReview">
      <h3>录播</h3>
      <TableOpenlive :list="reviewList" :isRecord="true" :isCol="GLOBAL.config.isCol"/>
      <cDivider/>
    </div>
    <!-- OpenLiveReview表格 -->
    <div v-show="liveList.length>0&&dLive">
      <h3>直播</h3>
      <TableOpenlive :list="liveList" :isRecord="false" :isCol="GLOBAL.config.isCol"/>
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
        next: "0",
        record: "false",
        groupId: "0",
        teamId: "0",
        userId: "0",
        loadMore: true
      }
    ) {
      /* 统计openlive */
      // this.GLOBAL.sta('openREQ',req);
      /* 请求 获取公演 */
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
          this.reviewList = this.reviewList.concat(res.content.liveList);
        } else {
          this.reviewList = res.content.liveList;
        }
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
    }
  },
  components: { TableOpenlive, cDivider }
};
</script>