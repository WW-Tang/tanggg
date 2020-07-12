<template>
  <div class="home">
    <div class="home-header">
     网易云音乐
    </div>
    <ul class="nav">
      <li><router-link to="/recommend">推荐音乐</router-link></li>
      <li><router-link to="/HotSong">热歌榜</router-link></li>
      <li><router-link to="/HomeSearch"  @onPlayer="$emit('onPlayer',$event)">搜索</router-link></li>
    </ul>
    <keep-alive>
    <router-view @onPlayer="$emit('onPlayer',$event)"></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: "home",
  components: {}
};
</script>
<style lang="less">
.home-header{
  text-align: center;
background: #e4393c;
box-sizing: border-box;
font-size: 22px;
color: #eeeeee;
padding: 15px 20px;
i{
  font-style: normal;
  font-size: 16px;
}
}
.nav{
  display: flex;
  li{
    flex: 1;
    text-align: center;
    height: 41px;
    a{
    line-height: 40px;
    display:inline-block;
    &.router-link-exact-active{
      color: #e4393c;
      font-size: 16px;
      border-bottom:2px solid #e4393c;
    }
  }
  }
  border: 1px solid #eeeeee9e;
}
.hl{
      color: #507daf;
      font-style: normal;
}
</style>
