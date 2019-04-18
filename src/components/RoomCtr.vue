/** 房间+留言控制器 控制器来完成请求及数据传递
 */
<style>
.c-layout-80 {
  max-height: 80vh;
  overflow: scroll;
}
.c-room-cardlayout {
  display: flex;
  flex-direction: column;
}
</style>
<template>
  <el-row :gutter="10">
    <el-col :xs="24" :md="dBoard?(12):(24)">
      <!-- main内容 -->
      <div v-if="main.roominfo.roomId&&dMain">
        <h3>房间</h3>
        <ConMain :roominfo="main.roominfo" :list="main.list"/>
        <div style="display: flex; justify-content:center">
          <el-button style v-show="boardNext" @click="getMore(true)" size="small">加载更多</el-button>
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :md="dMain?(12):(24)">
      <!-- board内容 -->
      <div v-if="boardList.length>0&&dBoard">
        <h3>留言</h3>
        <ConBoard :list="boardList"/>
        <div style="display: flex; justify-content:center">
          <el-button style v-show="boardNext" @click="getMore(false)" size="small">加载更多</el-button>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import ConBoard from "@/components/ConBoard";
import ConMain from "@/components/ConMain";
import cDivider from "@/components/cDivider";
import axios from "axios";
export default {
  name: "RoomCtr",
  data() {
    return {
      main: {
        roominfo: {},
        list: []
      },
      boardList: [],
      mainNext: "0",
      mainReq: {},
      boardNext: "0",
      boardReq: {}
    };
  },
  props: {
    dMain: {
      //显示内容
      type: Boolean,
      default: true
    },
    dBoard: {
      //显示留言
      type: Boolean,
      default: true
    }
  },
  methods: {
    getAll(req = { nextTime: 20, memberId: 5777248 }) {
      /* 统计room */
      this.GLOBAL.sta("roomREQ", req);
      this.getInfo({ sourceId: req.memberId + "", type: "0" }, (res2, req2) => {
        if (this.dMain) {
          this.getMain({
            ownerId: req.memberId + "",
            needTop1Msg: "false",
            nextTime: req.nextTime + "",
            roomId: res2.content.roomInfo.roomId + ""
          });
        }
        if (this.dBoard) {
          this.getBoard({
            ownerId: req.memberId + "",
            needTop1Msg: "false",
            nextTime: req.nextTime + "",
            roomId: res2.content.roomInfo.roomId + ""
          });
        }
      });
    },
    getInfo(req = { sourceId: "63558", type: "0" }, callback) {
      /* 请求 获取房间信息 */
      axios({
        url: this.GLOBAL.api.roomid,
        method: "post",
        headers: new this.GLOBAL.headers(),
        data: req
      })
        .then(response => {
          this.upInfo(response.data, req, callback);
        })
        .catch(e => {
          console.log(e);
        });
    },
    upInfo(res, req, callback) {
      /* 回调 获取房间信息 */
      if (res.status == 401004) {
        this.$message.error(`登录口袋失败,请重新登录账户!`);
      } else if (res.status == 400) {
        this.$message.error(`需要登录才能访问房间!${res.message}`);
      } else if (res.status == 404) {
        this.$message.error(`未获取到房间!`);
      } else {
        //写入main.roominfo
        this.main.roominfo = res.content.roomInfo;
        callback(res, req);
      }
      console.log(res, req);
    },
    getMain(
      req = {
        ownerId: "63558",
        needTop1Msg: "false",
        nextTime: "0",
        roomId: "67313743",
        loadMore: false
      }
    ) {
      /* 请求 获取房间内容 */
      this.mainReq = req;
      axios({
        url: this.GLOBAL.api.roomlio,
        method: "post",
        headers: new this.GLOBAL.headers(),
        data: {
          ownerId: req.ownerId + "",
          needTop1Msg: req.needTop1Msg + "",
          nextTime: req.nextTime || "0" + "",
          roomId: req.roomId + ""
        }
      })
        .then(response => {
          this.upMain(response.data, req);
        })
        .catch(e => {
          console.log(e);
        });
    },
    upMain(res, req) {
      /* 回调 获取房间内容 */
      if (res.status == 400) {
        this.$message.error(`需要登录才能访问房间!${res.message}`);
      } else {
        //是否加载更多
        if (req.loadMore) {
          if (res.content.message.length == 0) {
            // 无更多数据
            this.$message("已无更多数据...");
          }
          //去重合并
          this.main.list = this.GLOBAL.concatuni(
            [this.main.list, res.content.message],
            "serverId"
          );
        } else {
          this.main.list = res.content.message;
        }
        //记录NextTime
        this.mainNext = res.content.nextTime + "";
      }
      console.log(res, req);
    },
    getBoard(
      req = {
        ownerId: "63558",
        needTop1Msg: "false",
        nextTime: "0",
        roomId: "67313743",
        loadMore: false
      }
    ) {
      /* 请求 获取房间all */
      this.boardReq = req;
      axios({
        url: this.GLOBAL.api.roomlia,
        method: "post",
        headers: new this.GLOBAL.headers(),
        data: {
          ownerId: req.ownerId + "",
          needTop1Msg: req.needTop1Msg + "",
          nextTime: req.nextTime || "0" + "",
          roomId: req.roomId + ""
        }
      })
        .then(response => {
          this.upBoard(response.data, req);
        })
        .catch(e => {
          console.log(e);
        });
    },
    upBoard(res, req) {
      /* 回调 获取房间留言 */
      if (res.status == 400) {
        this.$message.error(`需要登录才能访问房间!${res.message}`);
      } else {
        //是否加载更多
        if (req.loadMore) {
          if (res.content.message.length == 0) {
            // 无更多数据
            this.$message("已无更多数据...");
          }
          //去重合并
          this.boardList = this.GLOBAL.concatuni(
            [this.boardList, res.content.message],
            "serverId"
          );
        } else {
          this.boardList = res.content.message;
        }
        //记录NextTime
        this.boardNext = res.content.nextTime + "";
      }
      console.log(res, req);
    },
    getMore(isMain) {
      if (isMain) {
        if (this.mainNext) {
          this.mainReq.loadMore = true;
          this.mainReq.nextTime = this.mainNext;
          this.getMain(this.mainReq);
        }
      } else {
        if (this.boardNext) {
          this.boardReq.loadMore = true;
          this.boardReq.nextTime = this.boardNext;
          this.getBoard(this.boardReq);
        }
      }
    }
  },
  components: { ConBoard, ConMain, cDivider }
};
</script>