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
      <div v-if="main.roominfo.creatorName&&dMain">
        <h3>房间</h3>
        <ConMain :roominfo="main.roominfo" :list="main.list"/>
      </div>
    </el-col>
    <el-col :xs="24" :md="dMain?(12):(24)">
      <!-- board内容 -->
      <div v-if="boardList.length>0&&dBoard">
        <h3>留言</h3>
        <ConBoard :list="boardList"/>
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
      boardList: []
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
    getAll(req = { lastTime: 1532695747872, limit: 20, memberId: 5777248 }) {
      /* 统计room */
      this.GLOBAL.sta('roomREQ',req);
      this.getInfo({ friends: [req.memberId] }, (res2, req2) => {
        if (this.dMain) {
          this.getMain({
            roomId: res2.content[0].roomId,
            chatType: 0,
            lastTime: req.lastTime,
            limit: req.limit
          });
        }
        if (this.dBoard) {
          this.getBoard({
            roomId: res2.content[0].roomId,
            lastTime: req.lastTime,
            limit: req.limit,
            isFirst: false
          });
        }
      });
    },
    getInfo(req = { friends: [407126] }, callback) {
      /* 请求 获取房间信息 */
      axios({
        url: this.GLOBAL.api.roomId,
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
      if (res.status == 401) {
        this.$message.error(`登录口袋失败,请重新登录账户!`);
      } else if (res.status == 400) {
        this.$message.error(`需要登录才能访问房间!${res.message}`);
      } else if (req.friends[0] != res.content[0].creatorId) {
        this.$message.error(`未获取到房间!`);
      } else {
        this.main.roominfo = res.content[0];
        callback(res, req);
      }
      console.log(res, req);
    },
    getMain(
      req = { roomId: 5777248, chatType: 0, lastTime: 1532695747872, limit: 20 }
    ) {
      /* 请求 获取房间内容 */
      axios({
        url: this.GLOBAL.api.roomMain,
        method: "post",
        headers: new this.GLOBAL.headers(),
        data: req
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
        this.main.list = res.content.data;
      }
      console.log(res, req);
    },
    getBoard(
      req = { roomId: 5777242, lastTime: 0, limit: 10, isFirst: false }
    ) {
      /* 请求 获取房间留言 */
      axios({
        url: this.GLOBAL.api.roomBoard,
        method: "post",
        headers: new this.GLOBAL.headers(),
        data: req
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
        this.boardList = res.content.data;
      }
      console.log(res, req);
    }
  },
  components: { ConBoard, ConMain, cDivider }
};
</script>