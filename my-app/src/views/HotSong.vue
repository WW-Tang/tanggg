<template>
  <div class="hot-song" v-if="HotSong" >
    <div class="hotsong-head" :style="{backgroundImage:BgImg}">
      <div class="hot-word" :style="{backgroundImage:BgImg2}">
        <p class="upTime">更新时间:{{updateTime}}</p>
      </div>
      
    </div>
    <ul class="song-list">
      <song @onPlayer="$emit('onPlayer',$event)" v-for="(item, index) in HotSong.tracks" :index="index" :item="item" :key="index" :flag="flag" :songList="HotSong.tracks"></song>
    </ul>
  </div>
</template>

<script>
import Song from '../components/singleSong.vue'
export default {
  data() {
    return {
      HotSong: null,
      updateTime: null,
      flag:true,
    };
  },
  created() {
    this.getHotSong();
  },
  methods: {
    getHotSong() {
      this.axios
        .get("https://music.kele8.cn/top/list?idx=1")
        .then(response => {
          ({ playlist: this.HotSong } = response.data);
          let time = response.data.playlist.updateTime;
          let d = new Date(time);
          let month = d.getMonth();
          let day = d.getDate();
          this.updateTime = month + 1 + "月" + day + "日";
          window.console.log(response);
        });
    }
  },
  components:{
    Song,
  },
  computed: {
    BgImg() {
      return "url(./images/HotBg.jpg)";
    },
    BgImg2() {
      return "url(./images/HotBg2.png)";
    }
  }
};
</script>

<style lang="less">
.hot-song {
  li{
    padding: 6px 10px;
    padding-right: 0;
  }
  .hotsong-head {
    padding: 20px 10px;
    height: 140px;
    padding-right: 0;
    background-size: cover;
    background-position: center;
    display: flex;
    .hot-word {
  position: relative;
      align-items: center;
      height: 63%;
      width: 45%;
      background-size: 178px 92px;
      margin: auto 0;
      background-position: -18px -29px;
    }
    p {
      position: absolute;
      left: 15px;
      bottom: -20px;
    color: hsla(0,0%,100%,.8);
    font-size: 12px;
    }
  }
}
</style>
