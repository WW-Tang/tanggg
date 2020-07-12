<template>
  <li @click="playSong()" :class="{'playing':playing}">
    <div class="num" v-if="flag&&!search">
      <span class="list-num">{{number(index)}}</span>
      <div class="Song-msg">
        <div class="Song-name">
          <h6>
            {{item.name}}
            <span v-if="item.alia[0]!=null">({{item.alia[0]}})</span>
          </h6>

          <p>
            <i v-if="SQ">SQ</i>
            {{item.ar[0].name}}-{{item.al.name}}
          </p>
        </div>
        <span>
          <i class="play fa fa-play"></i>
        </span>
      </div>
    </div>
    <div class="nonum" v-if="!flag&&!search">
      <span class="list-num" v-if="flag">{{number(index)}}</span>
      <div class="Song-msg">
        <div class="Song-name">
          <h6>
            {{item.name.trim()}}
            <span
              v-if="item.song.album.alias[0]!=null"
            >({{item.song.album.alias[0]}})</span>
          </h6>
          <p>
            <i>SQ</i>
            {{item.song.artists[0].name}}-{{item.song.album.name}}
          </p>
        </div>
        <span>
          <i class="play fa fa-play-circle-o"></i>
        </span>
      </div>
    </div>
    <div class="Song-msg" v-if="search">
      <div class="Song-name" v-if="searchResultList">
        <h6 v-html="replaceKeyword(searchResultList.name)"></h6>
        <p>
          <i>SQ</i>
          <span v-html="replaceKeyword('-'+searchResultList.artists[0].name+'-')"></span>
          <span v-html="replaceKeyword(searchResultList.album.name)"></span>
        </p>
      </div>
      <span>
        <i class="play-s fa fa-play-circle-o"></i>
      </span>
    </div>
  </li>
</template>

<script>
export default {
  props: ["item", "index", "flag", "SQ", "songList", "search","searchResultList","currentSongList","text"],
  data() {
    return {
      isActive: false,
      playing:false
    };
  },
  methods: {
    number(num) {
      return (num = num < 10 ? "0" + num : num);
    },
    playSong() {
      window.console.log(this.$route)
      this.playing=true
      if (this.search) {
      this.$emit("onPlayer",[this.searchResultList.id,this.songList]);
        
      }else{
      this.$emit("onPlayer",[this.item.id,this.songList]);
      this.isActive = true;
      }
    },
    replaceKeyword(txt) {
      return txt.replace(this.text, `<span class='hl'>${this.text}</span>`);
    },

  }
};
</script>

<style lang="less" scoped>
li {
padding: 5px 0;
.Song-msg {
  padding-left: 10px;
  flex: 1;
  display: flex;
  .Song-name{
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
    .play-s {
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
  box-sizing: content-box;
  .nonum {
    padding: 0px 10px;
    padding-right: 0;
    .Song-msg span .play {
      font-size: 26px;
    }
  }
  color: #ababab;
  overflow: hidden;

  .list-num {
    line-height: 40px;
    margin: 0 10px;
    display: block;
  }
  .Song-msg {
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
        font-size: 16px;
        font-weight: 100;
      }
    }
  }
  .num {
    display: flex;
  }
  &.active {
    background: #e4393c;
    color: white;
    .play {
      border-color: white;
    }
    .Song-msg .Song-name h6 {
      color: rgb(238, 238, 238);
    }
    .Song-msg {
      .Song-name {
        h6 span {
          color: #dfdfdf;
        }
        p i {
          color: white;
        }
      }
    }
  }
}
</style>