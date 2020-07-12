<template>
  <div id="audio" :class="{on:isShow}">
    <audio :src="getSongId" autoplay controls ref="audio"></audio>
    <div class="player" v-if="SongMsg&&!musicBox" @click.self="musicBox=true" @touchstart="touches" ref="isMusic">
      <div class="song-img">
        <img :src="SongMsg.data.songs[0].al.picUrl" alt />
      </div>
      <div class="song-operation">
        <div class="operation-top">
          <div class="song-msg">
            <h3>{{SongMsg.data.songs[0].name}}</h3>
            <p>{{SongMsg.data.songs[0].ar[0].name}}-{{SongMsg.data.songs[0].al.name}}</p>
          </div>
          <ul class="song-btn">
            <li>
              <i class="fa fa-step-backward" @click.stop="toggleMusic(currentId,-1)"></i>
            </li>
            <li>
              <i :class="[toggle?'fa fa-pause':'fa fa-play']" @click.stop="toggleBtn"></i>
            </li>
            <li>
              <i class="fa fa-step-forward" @click.stop="toggleMusic(currentId,1)"></i>
            </li>
          </ul>
        </div>
        <div class="operation-bottom">
          <span class="sliding"></span>
          <input class="plan" @input="handleChange" v-model="currentValue" type="range" />
        </div>
      </div>
    </div>
    <div
      v-if="SongMsg"
      @click="setVolume=false"
      :class="[musicBox?'show-box':'hide-box','music-box']"
    >
      <div class="music-box-head">
        <span>
          <i class="fa fa-close" @click="musicBox=false"></i>
        </span>
        <p>now Playing</p>
        <span>
          <i class="fa fa-ellipsis-h" @click="isMore=true"></i>
        </span>
      </div>
      <!-- 这里是可切换的部分 -->
      <div v-if="!lyric" class="slider" @click="lyric=!lyric">
        <div class="song-img">
          <img :src="SongMsg.data.songs[0].al.picUrl" alt />
        </div>
        <div class="music-message">
          <span class="collect">
            <i class="fa fa-heart"></i>
          </span>
          <div class="music-name">
            <p class="name-m">{{SongMsg.data.songs[0].name}}</p>
            <p class="single-m">{{SongMsg.data.songs[0].ar[0].name}}</p>
          </div>
          <span>
            <i class="fa fa-indent" @click.stop="currentPlayList=true"></i>
          </span>
        </div>
      </div>
      <!-- 歌词 -->
      <div v-if="lyric" class="slider lyric" @click="lyric=!lyric">
        <p class="mark-line" ref="markLine">
          <i></i>
        </p>
        <ul class="lyric-box" ref="lyricBox" style="top:0px;" @touchstart="scrollLyric">
          <li
            :class="{'playing-lyric':index==lyricId-1}"
            v-for="(item, index) in lyricShow()"
            :key="index"
          >{{item.text||"-----------------"}}</li>
        </ul>
      </div>
      <!-- 当前歌曲的信息 -->
      <div class="music-box-footer">
        <div class="current-music">
          <!-- 进度条 -->
          <div class="progress">
            <p class="operation-bottom">
              <span class="sliding"></span>
              <input class="plan" @input="handleChange" v-model="currentValue" type="range" />
            </p>
            <p class="time">
              <span class="now">{{now}}</span>
              <span class="end">{{end}}</span>
            </p>
          </div>
        </div>
        <!-- 控制条 -->
        <div class="music-operation">
          <span>
            <i v-if="Pattern==0" class="fa fa-random pattern" @click="Pattern=1"></i>
            <i v-if="Pattern==1" class="fa fa-refresh pattern" @click="Pattern=2"></i>
            <i v-if="Pattern==2" class="fa fa-repeat pattern" @click="Pattern=0"></i>
          </span>
          <div class="toggle-box">
            <p>
              <span>
                <i class="fa fa-step-backward" @click.stop="toggleMusic(currentId,-1)"></i>
              </span>
              <span>
                <i
                  @click="toggleBtn"
                  :class="[toggle?'fa fa-pause':'fa fa-play']"
                  ref="toggleBtn"
                ></i>
              </span>
              <span>
                <i class="fa fa-step-forward" @click.stop="toggleMusic(currentId,1)"></i>
              </span>
            </p>
          </div>
          <span :class="[setVolume?'volume-on':'volume-off','volume']">
            <i @click.stop="setVolume=!setVolume" class="fa fa-volume-up"></i>
            <div class="volume-plan">
              <div class="slider-box">
                <div class="sliding-volume"></div>
                <input type="range" class="volume-slider" v-model="volumeValue" />
              </div>
            </div>
          </span>
        </div>
      </div>
      <div
        :class="[{open:currentPlayList},'currentPlayList-box']"
        @click.self="currentPlayList=false"
      >
        <div class="currentPlayList">
          <div class="currentBox-head">
            <p v-if="Pattern==0">
              <span>
                <i class="fa fa-random pattern" @click="Pattern=1"></i>
              </span>
              随机播放({{currentSongList.length}})
            </p>
            <p v-if="Pattern==1">
              <span>
                <i class="fa fa-refresh pattern" @click="Pattern=2"></i>
              </span>
              列表循环({{currentSongList.length}})
            </p>
            <p v-if="Pattern==2">
              <span>
                <i class="fa fa-repeat pattern" @click="Pattern=0"></i>
              </span>
              单曲循环({{currentSongList.length}})
            </p>
          </div>
          <ul>
            <li @click="currentId=item.id" v-for="(item, index) in currentSongList" :key="index">
              <div class="Song-msg">
                <div class="Song-name" v-if="item.song!=null">
                  <h6>{{item.name.trim()}}</h6>
                  <p>
                    <i>SQ</i>
                    {{item.song.artists[0].name}}-{{item.song.album.name}}
                  </p>
                </div>
                <div class="Song-name" v-else-if="item.ar!=null">
                  <h6>{{item.name.trim()}}</h6>
                  <p>
                    <i>SQ</i>
                    {{item.ar[0].name}}-{{item.al.name}}
                  </p>
                </div>
                <div class="Song-name" v-else>
                  <h6>{{item.name.trim()}}</h6>
                  <p>
                    <i>SQ</i>
                    {{item.artists[0].name}}-{{item.album.name}}
                  </p>
                </div>
                <span>
                  <i class="play fa fa-play-circle-o"></i>
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
       <more :isMore="isMore" @moreHide="isMore=false" :currentMusic="SongMsg.data.songs[0]"></more>
    </div>
   
  </div>
</template>
<script>
import more from '../components/more.vue'
export default {
  components:{
    more,
  },
  props: ["SongId", "currentSongList"],
  data() {
    return {
      SongMsg: null,
      isShow: false,
      toggle: false,
      musicBox: false,
      songListId: [],
      currentId: this.SongId,
      count: 0,
      currentValue: 0,
      Pattern: 1,
      randomList: [],
      currentPlayList: false,
      lyric: false,
      now: "00:00",
      end: "00:00",
      setVolume: false,
      volumeValue: 0,
      lyricTxt: "",
      lyricMsg: [],
      lyricId: 0,
      TimeId: "",
      lyricTimeId: null,
      isScorll: false,
      isMore:false,
      touchStart:false,
      touchEnd:false,
    };
  },

  watch: {
    Pattern() {
      this.randomList = window.localStorage.getItem("songListId").split(",");
    },
    isShow() {
      this.$emit("toggle", this.isShow);
    },
    SongId() {
      this.currentId = this.SongId;
    },
    volumeValue() {
      let audio = this.$el.querySelector("audio");
      this.$el.querySelector(".sliding-volume").style.height =
        this.volumeValue + "%";
      audio.volume = this.volumeValue / 100;
    },
    toggle() {
      if (this.lyricTimeId) {
        clearInterval(this.lyricTimeId);
        this.lyricTimeId = 0;
      }

      if (this.toggle) {
        this.lyricTimeId = window.setInterval(() => {
          this.lyricScroll();
          if (this.$el.querySelector(".playing-lyric") && !this.isScorll) {
            let lyricBox = this.$refs.lyricBox;
            let currentHeight = this.$el.querySelector(".playing-lyric")
              .offsetHeight;
            lyricBox.style.top =
              -(currentHeight * this.lyricId - 1) + currentHeight + "px";
          }
        }, 200);
      } else {
        setInterval(this.lyricTimeId);
      }
    },
    //歌词位置
    lyricId() {
      if (this.$el.querySelector(".playing-lyric") && !this.isScorll) {
        let lyricBox = this.$refs.lyricBox;
        
        let currentHeight = this.$el.querySelector(".playing-lyric")
          .offsetHeight;
        lyricBox.style.top = -(currentHeight*this.lyricId)+ "px";
      }
    }
  },
  computed: {
    getSongId() {
      this.getSongMsg(this.currentId);
      let arr = [];
      this.currentSongList.forEach(e => {
        arr.push(e.id);
      });
      //不能删除
      window.localStorage.setItem("songListId", arr);
      return (
        "https://music.163.com/song/media/outer/url?id=" +
        this.currentId +
        ".mp3"
      );
    }
  },
  methods: {
    //手动滚动歌词
    scrollLyric(event) {
      let nowY = event.touches[0].clientY;
      let lyricBox = this.$refs.lyricBox;
      let currentTop = parseInt(lyricBox.style.top);
      let markLine = this.$refs.markLine;
      markLine.style.opacity = 1;
      lyricBox.style.transition = "all 0s";
      this.isScorll = true;
      let itemHeight = this.$el.querySelector(".playing-lyric").offsetHeight;
      let audio = this.$el.querySelector("audio");
      let scrollDistance;
      let s;
      lyricBox.ontouchmove = event => {
        scrollDistance =
          parseInt(lyricBox.style.top) > 0 ? 0 : parseInt(lyricBox.style.top);
        let endY = event.touches[0].clientY;
        s = nowY - endY;
        lyricBox.style.top = currentTop - s + "px";
      };
      lyricBox.ontouchend = () => {
        if (s) {
          window.console.log("xx");
          let currentLyricIndex = Math.round(scrollDistance / itemHeight);
          audio.currentTime = this.lyricMsg[Math.abs(currentLyricIndex)].time;
          lyricBox.style.transition = "all 0.5s";
          markLine.style.opacity = 0;
        }
        this.isScorll = false;
      };
    },
    // 歌词滚动
    lyricScroll() {
      let audio = this.$el.querySelector("audio");
      let currentTime = audio.currentTime;

      for (let i = 0; i < this.lyricMsg.length; i++) {
        if (this.lyricMsg[i].time >= currentTime) {
          this.lyricId = i;

          break;
        }
      }
    },

    // 歌词
    lyricShow() {
      let lyricArr = [];

      this.lyricTxt.split("\n").forEach((element, index) => {
        let everySentence = element.slice(1, 10);
        if (element) {
          lyricArr[index] = {
            time:
              Number(everySentence.slice(0, 2)) * 60 +
              Number(everySentence.slice(3)),
            text: element.slice(11).trim()
          };
        } else {
          element = "-------------";
          lyricArr[index] = {
            time:
              Number(everySentence.slice(0, 2)) * 60 +
              Number(everySentence.slice(3)),
            text: element.slice(11).trim()
          };
        }
      });
      this.lyricMsg = lyricArr;
      
      return lyricArr;
    },
    //改变当前的播放进度
    handleChange() {
      this.toggle = true;
      this.currentValue = this.$el.querySelector(".plan").value;
      let audio = this.$el.querySelector("audio");
      audio.play();
      audio.currentTime =
        ((this.currentValue / 100) * this.SongMsg.data.songs[0].dt) / 1000;
      if (this.$el.querySelector(".sliding")) {
        let progressDom = this.$el.querySelectorAll(".sliding");
        for (let i = 0; i < progressDom.length; i++) {
          progressDom[i].style.width = this.currentValue + "%";
        }
      }
    },
    // 转换时间
    translateTime(t) {
      let m = parseInt(t / 60);
      m = m < 10 ? "0" + m : m;
      let s = parseInt(t % 60);
      s = s < 10 ? "0" + s : s;
      return m + ":" + s;
    },
    playProgress() {
      let audio = this.$el.querySelector("audio");
      let currentTime = audio.currentTime;
      if (this.SongMsg) {
        this.currentValue =
          (currentTime / (this.SongMsg.data.songs[0].dt / 1000)) * 100;

        this.end = this.translateTime(this.SongMsg.data.songs[0].dt / 1000);
        this.now = this.translateTime(currentTime);

        if (this.$el.querySelector(".sliding")) {
          let progressDom = this.$el.querySelectorAll(".sliding");
          for (let i = 0; i < progressDom.length; i++) {
            progressDom[i].style.width = this.currentValue + "%";
          }
        }
        if (this.currentValue >= 99.5) {
          this.toggleMusic(this.currentId, 1);
        }
      }
    },
    //切换音乐
    toggleMusic(ids, num) {
      window.console.log(event,"ssss")
      let arr = window.localStorage.getItem("songListId").split(",");
      this.count = arr.indexOf(String(ids));
      // this.currentSongList[this.count].isActive = true;
      if (this.Pattern == 1) {
        if (this.count + num < 0) {
          this.currentId = arr[arr.length - 1];
          this.getSongMsg(arr[arr.length - 1]);
        } else if (this.count + num > arr.length - 1) {
          this.currentId = arr[0];
          this.getSongMsg(arr[0]);
        } else {
          this.currentId = arr[this.count + num];
          this.getSongMsg(arr[this.count + num]);
        }
      } else if (this.Pattern == 0) {
        let rand = Math.floor(Math.random() * this.randomList.length);
        this.currentId = this.randomList[rand];
        this.getSongMsg(this.randomList[rand]);
        if (this.randomList.length > 1) {
          this.randomList.splice(rand, 1);
        } else {
          this.randomList = window.localStorage
            .getItem("songListId")
            .split(",");
        }
      } else {
        let audio = this.$el.querySelector("audio");
        audio.currentTime = 0;
      }
    },
    touches() {
      let musicBox=this.$refs.isMusic
      this.touchStart=true
      musicBox.ontouchend = () => {
        this.touchEnd=true
        if(this.touchStart&&this.touchEnd){
          this.musicBox=true
          window.console.log("ooo")
        }
      };
    },
    //  touches() {
    //   let musicBox=this.$refs.isMusic
    //   let nowX = event.touches[0].clientX;
    //   let nowY = event.touches[0].clientY;
    //   this.touchStart=true
    //   musicBox.ontouchend = (event) => {
    //     let endX = event.changedTouches[0].clientX;
    //     let endY = event.changedTouches[0].clientY;
    //     let x=Math.abs(nowX-endX)
    //     let y=Math.abs(nowY-endY)
    //     this.touchEnd=true
    //     if(this.touchStart&&this.touchEnd){
    //       this.musicBox=true
    //     }
    //   };
    // },
    //是否暂停
    toggleBtn() {
      if (this.toggle) {
        this.toggle = !this.toggle;
        this.$refs.audio.pause();
        clearInterval(this.TimeId);
        clearInterval(this.lyricTimeId);
      } else {
        this.toggle = !this.toggle;
        this.$refs.audio.play();
        this.getSongMsg(this.currentId);
      }
    },

    getSongMsg(ids) {
      if (!ids) {
        this.axios
          .get("https://music.kele8.cn/song/detail?ids=" + this.SongId)
          .then(response => {
            this.SongMsg = response;
            this.isShow = true;
            this.toggle = true;
          });
        this.axios
          .get("https://music.kele8.cn/lyric?id=" + this.SongId)
          .then(response => {
            ({ lyric: this.lyricTxt } = response.data.lrc);
          });
        window.console.log("第一次拿");
      }
      clearInterval(this.TimeId);
      this.TimeId = window.setInterval(() => {
        this.playProgress();
      }, 1000);
      this.axios
        .get("https://music.kele8.cn/song/detail?ids=" + ids)
        .then(response => {
          this.SongMsg = response;
          this.isShow = true;
          this.toggle = true;
        });
      this.axios
        .get("https://music.kele8.cn/lyric?id=" + ids)
        .then(response => {
          ({ lyric: this.lyricTxt } = response.data.lrc);
        });
    }
  }
};
</script>

<style lang="less" scoped>
audio{
  display:none;
}
// 歌词
.lyric {
  padding: 20px 0;
  position: relative;
  overflow: hidden;
  .mark-line {
    width: 70%;
    position: fixed;
    margin: 0 15%;
    padding: 34px 0;
    top: 33%;
    opacity: 0;
    transition: all 0.3s;
    i {
      display: block;
      border-bottom: 1px dashed black;
      width: 100%;
    }
  }
  .lyric-box {
    padding-top: 45%;
    padding-bottom: 54%;
    text-align: center;
    font-size: 14px;
    transition: all 0.5s;
    width: 100%;
    position: absolute;
    top: 0px;
    li {
      padding: 5px 0;
      line-height: 24px;
      &.playing-lyric {
        color: red;
      }
    }
  }
}
.Song-msg {
  padding: 10px;
  padding-right: 0px;
  flex: 1;
  display: flex;
  .Song-name {
    float: left;
    flex: 1 1 auto;
    overflow: hidden;
    h6 {
      color: #444444;
      font-size: 17px;
      line-height: 25px;
      display: flex;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      overflow: hidden;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;

      span {
        color: #ababab;
        flex: 1 0 auto;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: normal;
      }
    }
    p {
      font-size: 12px;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      overflow: hidden;
      -webkit-box-orient: vertical;
      line-height: 15px;
      color: #909090;
      i {
        display: inline-block;
        height: 8px;
        font-size: 8px;
        width: 12px;
        color: #e4393c;
        margin-right: 3px;
        font-style: normal;
      }
    }
  }
  & > span {
    display: flex;
    float: right;
    .play {
      display: inline-block;
      margin: 0 10px;
      line-height: 40px;
      text-align: center;
      font-size: 18px;
      font-weight: 100;
      color: #ababab;
      font-size: 26px;
    }
  }
}
// 歌词
.slider.lyric {
  background: linear-gradient(
    -135deg,
    rgb(255, 255, 255) 0%,
    rgba(238, 238, 238, 0.707) 30%,
    rgba(240, 240, 240, 0.735) 70%,
    rgb(255, 255, 255) 100%
  );
}
.operation-bottom {
  overflow: hidden;
}
.currentPlayList-box {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #98989892;
  transition: 0.6s;
  visibility: hidden;
  .currentPlayList {
    border-radius: 20px 20px 0 0;
    height: 55%;
    position: absolute;
    top: 100%;
    bottom: 0;
    transition: all 0.6s;
    left: 0;
    right: 0;
    background: #ffffffdb;
    overflow: auto;
    color: #333333;
    .currentBox-head {
      border-bottom: 0.5px solid rgba(167, 167, 167, 0.933);
      overflow: hidden;
      height: 40px;
      p {
        transition: all 0.6s;
        padding: 10px 20px;
        position: fixed;
        left: 0;
        right: 0;
        background: #fffdfd;
        line-height: 20px;
        border-radius: 20px 20px 0 0;
        top: 100%;
        color: #333333;
        span {
          margin-right: 8px;
          i {
            font-size: 18px;
            color: #c7c7c7;
            &.fa-repeat {
              position: relative;
              &::after {
                content: "1";
                display: inline-block;
                color: #c7c7c7;
                font-size: 8px;
                position: absolute;
                top: 50%;
                left: 50%;
                -webkit-transform: translate(-50%, -50%);
                transform: translate(-50%, -50%);
              }
            }
          }
        }
      }
    }
  }
  &.currentPlayList-box.open {
    visibility: visible;
    .currentPlayList {
      top: 45%;
    }
    .currentBox-head p {
      top: 45%;
    }
  }
}
.music-message {
  width: 100%;
  line-height: 50px;
  padding: 5px 10px;
  display: flex;

  span {
    display: inline-block;
    width: 40px;
    text-align: center;
    line-height: 80px;
    i {
      font-size: 22px;
      color: rgb(199, 199, 199);
      font-weight: 100;
    }
  }
  .music-name {
    flex: 1;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    padding-top: 10px;
    .name-m {
      line-height: 30px;
      font-size: 16px;
    }
    .single-m {
      line-height: 35px;
      color: #acacac;
      font-size: 12px;
      font-weight: 100;
    }
  }
}
.plan {
  width: 100%;
  height: 3px;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  background: #e76264;
  border-radius: 6px;
  transition: all 0.5s;
}
.sliding {
  display: inline-block;
  position: absolute;
  background: #e76264;
  top: 0;
  left: 0;
  transition: all 0.5s;
  border-radius: 10px;
  &::before {
    content: "";
    display: block;
    height: 140%;
    top: -1px;
    border-radius: 50%;
    box-shadow: -2px 0 8px 2px rgb(69, 236, 255);
    background: #f5f5f6;
    position: absolute;
  }
}
.slider {
  height: 100%;
  max-height: 65%;
  .song-img {
    overflow: hidden;
  }
  img {
    height: 280px;
  }
}
.music-box-footer {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 25%;
  .music-operation {
    flex: 1;
    display: flex;
    align-items: center;
    position: relative;
    span {
      display: inline-block;
      width: 5%;
      min-width: 40px;
      text-align: center;
      margin: 0 15px;
      color: #c7c7c7;
      i {
        font-size: 22px;
      }
      .fa-repeat {
        position: relative;
        &::after {
          content: "1";
          display: inline-block;
          color: #c7c7c7;
          font-size: 8px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
      &.volume {
        position: relative;
        .volume-slider {
          opacity: 0;
          position: absolute;
          z-index: 999;
          transform-origin: left;
          top: 110px;
          left: 3px;
          transform: rotate(-90deg);
        }
      }
      &.volume-off {
        .volume-plan {
          position: absolute;
          top: 0px;
          left: 0px;
        }
      }
      &.volume-on {
        .volume-plan {
          position: absolute;
          padding: 18px 22px;
          top: -160px;
          bottom: 155%;
          right: -5px;
          left: -5px;
          background: #d8d8d8;
          z-index: 50;
          border-radius: 8px;
          box-shadow: 0 11px 30px -7px rgba(171, 171, 171, 0.966);
          &::after {
            content: "";
            display: block;
            width: 15px;
            height: 15px;
            background: #d8d8d8;
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translate(-50%, 50%) rotate(45deg);
            border-radius: 1px;
          }
          .slider-box {
            width: 6px;
            height: 100%;
            background: #ffffff;
            border-radius: 5px;
            position: relative;
            .sliding-volume {
              display: inline-block;
              position: absolute;
              width: 100%;
              background: #e76283;
              right: 0;
              bottom: 0;
              height: 100%;
              border-radius: 5px;
              margin: 0;
              &::after {
                content: "";
                display: block;
                height: 7px;
                width: 7px;
                position: absolute;
                top: -3px;
                border-radius: 6px;
                background: white;
                box-shadow: 0px 3px 8px 2px #45ecff;
              }
            }
          }
        }
      }
    }
    .toggle-box {
      flex: 1 0 auto;
      p {
        display: flex;
        justify-content: center;
        align-items: center;
        span {
          margin: 0 10px;
          width: 40px;
          height: 40px;
          line-height: 40px;
          background: #e1e1e1;
          border-radius: 50%;
          color: WHITE;
          &:nth-child(2) {
            width: 60px;
            height: 60px;
            line-height: 60px;
            font-size: 22px;
            box-shadow: 0px 5px 10px 0 rgba(154, 154, 154, 0.789);
            background: linear-gradient(
              -125deg,
              rgb(255, 116, 241) 35%,
              rgb(255, 132, 102)
            );
          }
        }
      }
    }
  }

  .current-music {
    height: 25%;
    padding: 10px 0;
    padding-top: 25px;
  }
  .progress {
    height: 36px;
    padding-top: 5px;
    padding-bottom: 25px;
    padding: 0px 15px;

    p.operation-bottom {
      height: 6px;
      border-radius: 8px;
      background: #e1e1e1;
      position: relative;
      .sliding {
        height: 6px;

        &::before {
          width: 8px;
          right: -4px;
        }
      }
    }
    .time {
      background: white;
      overflow: hidden;
      color: rgb(84, 84, 84);
      font-size: 12px;
      padding-top: 5px;
      &::before {
        content: "";
        display: block;
        clear: both;
      }
      .now {
        float: left;
      }
      .end {
        float: right;
      }
    }
  }
  .music-operation {
    height: 52%;
  }
}
//大播放条
.music-box {
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  background: #fffdfd;
  opacity: 0;
  transition: all 0.7s;
  .music-box-head {
    width: 100%;
    line-height: 50px;
    padding: 5px 10px;
    display: flex;
    height: 100%;
    max-height: 10%;
    span {
      display: inline-block;
      width: 40px;
      text-align: center;
      i {
        font-size: 24px;
        color: rgb(199, 199, 199);
        font-weight: 100;
      }
    }
    p {
      flex: 1 0 auto;
      text-align: center;
      font-size: 18px;
      font-weight: 600;
    }
  }
  &.show-box {
    opacity: 1;
    margin-top: 0%;
  }
  &.hide-box {
    opacity: 0;
    margin-top: 180%;
  }
  .song-img {
    padding: 20px 40px;
    padding-bottom: 30px;
    img {
      box-shadow: 0 10px 20px 0px #9d9d9dd2;
      border-radius: 7px;
      width: 100%;
      vertical-align: middle;
    }
  }
}
// 小播放条
#audio {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 10vh;
  bottom: -10vh;
  z-index: 99;
  transition: all 0.7s;
  &.on {
    bottom: -0vh;
  }

  .player {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #f5f5f6;
    z-index: 101;
    padding: 10px 10px;
    display: flex;
    .song-img {
      width: 20%;
      max-height: 100%;
      img {
        height: 100%;
        box-shadow: 0 8px 10px rgba(69, 69, 69, 0.5);
        border-radius: 4px;
      }
    }
    .song-operation {
      flex: 1;
      display: flex;
      flex-direction: column;
      .operation-bottom {
        height: 7px;
        border-radius: 5px;
        padding-top: 2px;
        background: #e1e1e1;
        position: relative;
        .sliding {
          height: 5px;
          &::before {
            right: -3px;
            width: 7px;
          }
        }
      }

      .operation-top {
        flex: 1 0 auto;
        .song-msg {
          width: 50%;
          float: left;
          h3 {
            color: #333333;
            font-size: 16px;
            font-weight: 600;
            line-height: 22px;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            overflow: hidden;
            -webkit-box-orient: vertical;
            text-overflow: ellipsis;
          }
          p {
            font-size: 12px;
            color: #787878;
            line-height: 16px;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            overflow: hidden;
            -webkit-box-orient: vertical;
            text-overflow: ellipsis;
            .sliding {
              height: 5px;

              &::before {
                width: 7px;
                right: -3px;
              }
            }
          }
        }
        .song-btn {
          width: 50%;
          display: flex;
          height: 100%;
          li {
            width: 30%;
            flex: 1 0 auto;
            display: flex;
            height: 100%;
            align-items: center;
            justify-content: center;
            i {
              color: white;
              background: #d1d1d1;
              text-align: center;
              display: block;
              width: 32px;
              height: 32px;
              border-radius: 50%;
              line-height: 32px;
              font-size: 18px;
            }
          }
          li:nth-child(2) {
            i {
              background: linear-gradient(
                -125deg,
                rgb(255, 106, 240) 55%,
                rgb(255, 118, 83)
              );
              box-shadow: 0 5px 10px rgba(69, 69, 69, 0.381);
            }
          }
        }
      }
    }
  }
}
</style>