/* 房间内容 Main */
<style>
.c-room-info {
  background-color: rgb(102, 177, 255);
  color: white;
  padding: 0.5rem 1rem 1rem 1rem;
  border-radius: 5px 5px 0 0;
}
.c-room-main {
  padding: 0.5rem;
}
</style>

<template>
  <div class="c-layout-80">
    <div class="c-room-info">
      <p>{{ roominfo.creatorName }} #{{ roominfo.roomName }}</p>
      <small>{{ roominfo.roomTopic }}</small>
    </div>
    <div class="c-room-main" :style="{background:'url('+GLOBAL.getPicPath(roominfo.bgPath)+')'}">
      <div class="c-room-cardlayout">
        <CardDia
          v-for="(item, index) in list"
          :item="item"
          :index="index"
          :key="item.msgidClient+item.msgTime"
        />
      </div>
    </div>
  </div>
</template>
<script>
import CardDia from "@/components/CardDia";
export default {
  name: "ConMain",
  data() {
    return {};
  },
  props: {
    roominfo: {
      type: Object,
      default: {}
    },
    list: {
      type: Array,
      default: []
    }
  },
  methods: {},
  components: { CardDia }
};
</script>