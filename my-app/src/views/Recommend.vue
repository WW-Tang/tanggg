<template>
  <div class="recommend">
    <home-title @onPlayer="$emit('onPlayer',$event)">推荐歌单</home-title>
    <ul class="list-card">
    <Home-song-card @onPlayer="$emit('onPlayer',$event)" :item="item" v-for="(item, index) in SongList" :key="index"></Home-song-card>
    </ul>
    <home-title @onPlayer="$emit('onPlayer',$event)">最新音乐</home-title>
    <ul>
      <single-song :one="true" @onPlayer="$emit('onPlayer',$event)" v-for="(item, index) in newSong" :key="index" :flag="false" :index="index+1" :item="item" :songList="newSong"></single-song>
    </ul>
  </div>
</template>

<script>
import HomeTitle from "../components/HomeTitle.vue";
import HomeSongCard from "../components/HomeSongCard.vue";
import singleSong from "../components/singleSong.vue";
export default {
  name: "HomeRecommend",
  components: {
    HomeTitle,
    HomeSongCard,
    singleSong
  },
  data(){
      return {
          SongList:[],
          newSong:[]
      }
  },
  created() {
    this.getSongList()
    this.getNewSong()
  },
  methods: {
    getSongList:function(){
      this.axios.get("http://musicapi.leanapp.cn/personalized?limit=6").then(response=>{
        ({result:this.SongList}=response.data)
      })
    },
    getNewSong(){
      this.axios.get("http://musicapi.leanapp.cn/personalized/newsong").then(response=>{
        ({result:this.newSong}=response.data)
        window.console.log("那新歌")
      })
    }
  },
};
</script>

<style lang="less">
.list-card {
  display: flex;
  overflow: hidden;
  flex-wrap: wrap;
  li {
    flex: 1 0 30%;
    float: left;
    position: relative;
    margin-bottom: 15px;
    img {
      width: 100%;
      vertical-align: middle;
    }
    span {
      position: absolute;
      top: 5px;
      right: 5px;
      color: white;
      font-size: 12px;
    }
    &:nth-child(3n-1){
     margin: 0 3px;
    }
    p{
      font-size: 14px;
      display: -webkit-box;
      -webkit-line-clamp:2;
      overflow: hidden;
      -webkit-box-orient: vertical;
      line-height: 18px;
      padding: 2px 0 0 3px;
    }
  }
}
</style>