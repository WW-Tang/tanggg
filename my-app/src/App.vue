<template>
  <div id="app" :class="{on:flag}">
    
    <keep-alive>
      <router-view @onPlayer="currentSongId=$event[0],currentSongList=$event[1]"/>
    </keep-alive>
    <player @onPlayer="$emit('onPlayer',$event)" @toggle="handleChange($event)" v-if="currentSongId" :SongId="currentSongId" :currentSongList="currentSongList"></player>

    <div class="">

    </div>
  </div>
  
</template>
<script>
import Player from './views/Player.vue'
export default {
  data() {
    return {
      currentSongId: null,
      flag:false,
      currentSongList:null,
    };
  },
    methods: {
      handleChange(state){

        this.flag=state
      }
    },
  components:{
    Player
  }
};
</script>
<style lang="less">
#app.on{
  padding-bottom:10vh;
}

a {
  text-decoration: none;
  color: #333333;
}
body,
html {
  width: 100%;
  height: 100%;
  height: 50px;
  width: 100%;
}
</style>
