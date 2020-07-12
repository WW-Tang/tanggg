<template>
  <!-- 第一种模版 -->
  <div class="SongList">
    <div
      class="SongListHead head-one"
      :style="{backgroundImage:Bgimgs2}"
      v-if="DetailsSong.backgroundCoverUrl"
    >
      <h4>{{DetailsSong.name}}</h4>
      <p>
        <span>{{DetailsSong.updateFrequency}}</span>
      </p>
      <div class="SongListContent" v-if="DetailsSong">
        <span v-for="(item, index) in textSplit(DetailsSong.description)" :key="index">
          {{item}}
          <br />
        </span>
      </div>
    </div>
    <!-- 第二种模版 -->
    <div
      class="SongListHead head-tow"
      v-if="!(DetailsSong.coverImgUrl&&DetailsSong.backgroundCoverUrl)"
    >
      <div class="Bg" :style="{backgroundImage:Bgimgs}"></div>
      <div class="head-fl">
        <img :src="DetailsSong.coverImgUrl||DetailsSong.backgroundCoverUrl" alt="as" />
        <span></span>
        <i class="fa fa-headphones">{{NumCount(DetailsSong.playCount)}}</i>
        <span>歌单</span>
      </div>
      <div class="head-fr">
        <h4>{{DetailsSong.name}}</h4>
        <div class="logo-box">
          <div class="logo">
            <img :src="DetailsSong.creator.avatarUrl" alt />
            <i class="fa fa-vimeo"></i>
          </div>
          <span>网易云音乐</span>
        </div>
      </div>
    </div>
    <div class="describe">
      <div class="lable">
        <p>
          标签:
          <span v-for="(item, index) in DetailsSong.tags" :key="index">{{item}}</span>
        </p>
        <div class="text" :class="[flag?'on':'off']">
          <p>
            简介:
            <span v-for="(item, index) in textSplit(DetailsSong.description)" :key="index">
              {{item}}
              <br />
            </span>
          </p>
          <i class="fa fa-angle-down" @click="flag=!flag"></i>
        </div>
      </div>
    </div>
    <div class="Song-list">
      <h3 id="list-head">歌曲列表</h3>
      <ul>
        <single-song
          @onPlayer="$emit('onPlayer',$event)"
          :item="item"
          v-for="(item, index) in SongItem"
          :key="index"
          :index="index+1"
          :flag="true"
          :songList="SongItem"
        ></single-song>
      </ul>
    </div>
  </div>
</template>

<script>
import SingleSong from "../components/singleSong.vue";
export default {
  props: ["DetailsSong", "series"],
  data() {
    return {
      flag:false,
    }
  },
  computed: {
    Bgimgs() {
      return "url(" + this.DetailsSong.coverImgUrl + ")";
    },
    Bgimgs2() {
      return "url(" + this.DetailsSong.backgroundCoverUrl + ")";
    },
    SongItem() {
      return this.DetailsSong.tracks;
    }
  },
  methods: {
    saveSongList(){
      window.localStorage.setItem("SongList",this.DetailsSong)
    },
    textSplit(txt) {
      return txt.split("\n");
    },
    NumCount(num) {
      if (num <= 10000) {
        return (num / 1000).toFixed(1) + "千";
      } else if (num <= 100000000) {
        return (num / 10000).toFixed(1) + "万";
      } else {
        return (num / 100000000).toFixed(1) + "亿";
      }
    }
  },
  components: {
    SingleSong
  }
};
</script>

<style lang="less" scope>
.describe {
  padding-top: 10px;
  margin: 0 15px;
  .lable > p {
    margin-bottom: 10px;
    line-height: 20px;
    margin-right: -10px;
    span {
      display: inline-block;
      margin-right: 10px;
      padding: 1px 8px;
      font-size: 12px;
      border: 1px solid rgba(0, 0, 0, 0.2);
      border-radius: 16px;
    }
  }
  .text{
    position: relative;
    padding-bottom: 18px;
    line-height: 19px;
    color: #666;
    p{
            text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      word-wrap: break-word;
      white-space: normal;
      overflow: hidden;
      font-size: 16px;
    }
    .fa{
      color: rgb(138, 138, 138);
      font-size: 24px;
      position: absolute;
      bottom: 2px;
      right: 5px;
    }
  }
  .text.off{

    p{
      -webkit-line-clamp: 3;

    }
    .fa {
      transform: rotate(0deg)
    }
    
  }
  .text.on{
    .fa {
           transform: rotate(-180deg)
    }
  }
}
.SongList {
  .SongListHead {
    position: relative;
    padding: 40px 20px;
    height: 130px;
    box-sizing: content-box;
    background-size: cover;
    background-position: center;
    color: white;
    overflow: hidden;
    &.head-one {
      h4 {
        font-size: 18px;
      }
      &::after {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        filter: blur(20px);
      }
      p {
        font-size: 8px;
        span {
          background: rgba(174, 171, 171, 0.5);
          padding: 1px 2px;
          color: #d0d0d0;
          margin: 10px 0 0 3px;
          display: inline-block;
        }
      }
      .SongListContent {
        margin-top: 20px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        overflow: hidden;
        -webkit-box-orient: vertical;
        color: #d0d0d0;
        span {
          font-size: 14px;
        }
      }
    }
    &.head-tow {
      display: flex;
      position: relative;
      z-index: 1;
      margin-top: 36px;
      &::after {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.25);
      }
      .Bg {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        -webkit-filter: blur(20px);
        z-index: 0;
        filter: blur(20px);
        background-size: 150%;
        background-position: center;
      }

      .head-fl {
        width: 126px;
        height: 126px;
        position: relative;
        z-index: 2;
        img {
          width: 100%;
        }
        i {
          position: absolute;
          top: 2px;
          right: 2px;
          font-size: 12px;
        }
        span {
          display: block;
          position: absolute;
          left: 0;
          top: 10px;
          background: #e4393c9a;
          font-size: 12px;
          border-radius: 0 10px 10px 0;
          padding: 1px 5px;
        }
      }
      .head-fr {
        padding-left: 16px;
        position: relative;
        z-index: 9;
        font-size: 17px;
        line-height: 1.3em;
        flex: 1;
        .logo-box {
          padding-top: 20px;
          display: flex;

          .logo {
            width: 30px;
            height: 30px;
            display: inline-block;
            padding: 0px 4px 0px 0;
            img {
              height: 100%;
              border-radius: 50%;
            }
            position: relative;
            i {
              background: #e4393c;
              font-size: 6px;
              font-weight: 100;
              border-radius: 50%;
              padding: 2px;
              position: absolute;
              right: 0;
              bottom: 0;
            }
          }
          span {
            display: 1;
            line-height: 30px;
            color: #bbbbbb;
          }
        }
      }
    }
  }
}
</style>