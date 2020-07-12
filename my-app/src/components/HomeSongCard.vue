<template>
  <li @click="SkipDetail(item.id)">
    <div class="item-img">
      <img :src="item.picUrl" alt />
      <span>
        <i class="fa fa-headphones"></i>
        {{NumCount(this.item.playCount)}}
      </span>
    </div>
    <p>{{item.name}}</p>
  </li>
</template>
<!-- 这个是声明式导航 上面是在函数中调用编程式导航
  <li @click="SkipDetails()">
    <router-link to="/SongDetails">
      <div class="item-img">
        <img :src="item.picUrl" alt />
        <span>
          <i class="fa fa-headphones"></i>
          {{NumCount(this.item.playCount)}}
        </span>
      </div>
      <p>{{item.name}}</p>
      <router-view></router-view>
    </router-link>
  </li> -->
<script>
export default {
  props: {
    item: Object
  },
  methods: {
    NumCount(num) {
      if (num <= 10000) {
        return (num / 1000).toFixed(2) + "千";
      } else if (num <= 100000000) {
        return (num / 10000).toFixed(2) + "万";
      } else {
        return (num / 100000000).toFixed(2) + "亿";
      }
    },
    SkipDetail(id){
      this.$router.push({
        path:"/SongDetails",
        query:{
          id
        }
      })
    }
    
  },
};
</script>

<style lang="less">
</style>