<template>
  <div>
    <div class="home-search">
      <div class="search-inp">
        <form action="" @submit="getBestMate(),getSearchDetails(searchTxt)">
          <input
          type="text"
          placeholder="搜索歌曲、歌手、专辑"
          v-model.trim="searchTxt"
          @focus="outDetails=false,swich=false"
          @input="searchContent(),swich=true"
        />
        <i class="fa fa-search fl"></i>
        <i @click="searchTxt=''" class="fa fa-times-circle fr" v-show="searchTxt!==''"></i>
        </form>
      </div>
      <div class="search-hot" v-if="searchTxt===''">
        <p>热门搜索</p>
        <ul class="search-hot-list">
          <li
            @click="searchTxt=item.first,getBestMate(),getSearchDetails(searchTxt)"
            v-for="(item, index) in searchHot"
            :key="index"
          >{{item.first}}</li>
        </ul>
        <ul class="search-history" v-for="(item, index) in searchHistory" :key="index">
          <li
            @click="searchTxt=item,getBestMate(),getSearchDetails(searchTxt),searchHistory.unshift(searchHistory.splice(searchHistory.indexOf(item),1)[0])"
          >
            <span>
              <i class="fa fa-clock-o"></i>
            </span>
            <p>
              {{item}}
              <i class="fa fa-close" @click.stop="delHistory(item)"></i>
            </p>
          </li>
        </ul>
      </div>
      <div class="search-recommend" v-if="searchTxt!==''&&!outDetails">
        <p @click="getBestMate(),getSearchDetails(searchTxt)" class="search-btn">搜索“{{searchTxt.trim()}}”</p>
        <ul>
          <search-list
            :recommendItem="item"
            v-for="(item, index) in searchRecommend"
            :key="index"
            :keyword="searchTxt"
            @outDetails="searchTxt=$event,getSearchDetails($event),getBestMate()"
          ></search-list>
        </ul>
      </div>
      <div class="search-detail" v-if="outDetails&&searchTxt!==''">
        <p class="detail">最佳匹配</p>
        <!-- 最佳匹配 -->
        <div class="search-best-mate" v-if="bestMate">
          <!-- 专辑 -->
          <div
            class="search-best-album search-best"
            @click="getMoreMssage(bestMate.album[0].id,'album')"
            v-if="bestMate.album"
          >
            <h5>
              <img :src="bestMate.album[0].blurPicUrl" alt />
            </h5>
            <div class="message-box">
              <div class="message">
                <p v-html="'专辑:'+replaceKeyword(bestMate.album[0].name)"></p>
                <span
                  class="single-name hl"
                  v-html="replaceKeyword(bestMate.album[0].artists[0].name)"
                ></span>
              </div>
              <i class="fa fa-angle-right"></i>
            </div>
          </div>
          <!-- 歌手 -->
          <div
            class="search-best-song search-best"
            @click="getMoreMssage(bestMate.artist[0].id,'single')"
            v-if="bestMate.artist"
          >
            <h5>
              <img :src="bestMate.artist[0].img1v1Url" alt />
            </h5>
            <div class="message-box">
              <div class="message">
                <p v-html="'歌手:'+replaceKeyword(bestMate.artist[0].name)"></p>
              </div>
              <i class="fa fa-angle-right"></i>
            </div>
          </div>
          <!-- MV -->
          <div class="search-best-Mv search-best-mv" v-if="bestMate.mv">
            <h5>
              <img :src="bestMate.mv[0].cover" alt />
              <i class="fa fa-play"></i>
            </h5>
            <div class="message-box">
              <div class="message">
                <p v-html="'MV:'+replaceKeyword(bestMate.mv[0].name)"></p>
                <span class="single-name" v-html="replaceKeyword(bestMate.mv[0].artistName)"></span>
              </div>
              <i class="fa fa-angle-right"></i>
            </div>
          </div>
        </div>
        <ul v-if="searchResult&&searchTxt!=''">
          <song
            @onPlayer="$emit('onPlayer',$event)"
            v-for="(item, index) in searchResult.songs"
            :key="index"
            :searchResultList="item"
            :text="searchTxt"
            :search="true"
            :songList="searchResult.songs"
          ></song>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import searchList from "../components/SearchList.vue";
// import searchDetails from "../components/SearchDetails.vue";
import song from "../components/singleSong.vue";
export default {
  components: {
    searchList,
    // searchDetails
    song
  },
  data() {
    return {
      searchHot: [],
      searchTxt: "",
      searchRecommend: null,
      searchResult: null,
      outDetails: false,
      bestMate: null,
      searchHistory: [],
      moreMessage: null,
      swich: false
    };
  },
  created() {
    this.getSeatchHot();
  },
  methods: {
    handleEnd(event) {
      window.console.log(event);
    },
    // 搜索MV&歌手&专辑的详细信息
    getMoreMssage(id, kind) {
      if (kind == "MV") {
        this.axios
          .get("https://music.kele8.cn/mv/url?id=" + id)
          .then(response => {
            window.console.log(response);
          });
      } else if (kind == "album") {
        this.axios
          .get("https://music.kele8.cn/album/detail/dynamic?id=" + id)
          .then(response => {
            window.console.log(response);
          });
      } else if (kind == "single") {
        this.axios
          .get("https://music.kele8.cn/artist/desc?id=" + id)
          .then(response => {
            window.console.log(response);
          });
      }
    },
    // 替换关键字
    replaceKeyword(txt) {
      return txt.replace(
        this.searchTxt,
        `<span class='hl'>${this.searchTxt}</span>`
      );
    },
    // 删除搜索记录
    delHistory(txt) {
      this.searchHistory.splice(this.searchHistory.indexOf(txt), 1);
      window.localStorage.setItem(
        "history",
        JSON.stringify(this.searchHistory)
      );
    },
    //搜索最佳匹配
    getBestMate() {
      if (this.searchTxt) {
        
      this.axios
        .get(
          "https://music.kele8.cn/search/multimatch?keywords=" + this.searchTxt
        )
        .then(response => {
          ({ result: this.bestMate } = response.data);
        });
      }

    },
    //搜索结果
    getSearchDetails(txt) {
      if (this.searchHistory.indexOf(txt) < 0 &&this.searchTxt!="") {
        this.searchHistory.unshift(txt);
        window.localStorage.setItem(
          "history",
          JSON.stringify(this.searchHistory)
        );
        
      }
      if (this.searchTxt!="") {
        this.outDetails = true;
        this.axios
          .get("https://music.kele8.cn/search?keywords=" + this.searchTxt)
          .then(response => {
            ({ result: this.searchResult } = response.data);
          });
      }
    },
    //热搜
    getSeatchHot() {
      if (window.localStorage.getItem("history")) {
        this.searchHistory = JSON.parse(window.localStorage.getItem("history"));
      }
      this.axios
        .get("https://music.kele8.cn/search/hot")
        .then(response => {
          ({ hots: this.searchHot } = response.data.result);
          window.console.log(response)
        });
    },
    //搜索推荐
    searchContent() {
      if (this.searchTxt == "") {
        this.outDetails = false;
      }this.searchTxt
      let flag = true;
      if (flag&&this.searchTxt) {
        flag = false;
        this.axios
          .get(
            "https://music.kele8.cn/search/suggest?keywords=" +
              this.searchTxt +
              "&type=mobile"
          )
          .then(response => {
            ({ allMatch: this.searchRecommend } = response.data.result);
          });
        setTimeout(() => {
          flag = true;
        }, 500);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.hl {
  color: #507daf;
  font-style: normal;
}
.search-history {
  li {
    display: flex;
    span {
      display: block;
      width: 30px;
      text-align: center;
      i {
        color: rgb(194, 194, 194);
        font-size: 18px;
        line-height: 45px;
      }
    }
    p {
      flex: 1 0 auto;
      line-height: 45px;
      margin: 0;
      font-size: 14px;
      color: #333;
      padding: 0;
      border-bottom: 0.5px solid rgba(0, 0, 0, 0.2);
      i {
        float: right;
        color: rgb(111, 111, 111);
        font-size: 18px;
        line-height: 45px;
        font-weight: 100;
        margin-right: 10px;
      }
    }
  }
}
.search-best-mate {
  .search-best {
    display: flex;
    padding: 8px 10px;
    padding-left: 0;
    margin-left: 10px;
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.2);
    h5 {
      width: 50px;
      height: 50px;
      margin-right: 15px;
      img {
        width: 100%;
      }
    }
  }
  .search-best-mv,
  .search-best-album .message-box {
    p {
      line-height: 26px;
    }
    .single-name {
      color: rgb(174, 174, 174);
      font-size: 12px;
      line-height: 15px;
    }
  }
  .search-best-mv {
    display: flex;
    padding: 8px 10px;
    padding-left: 0;
    margin-left: 10px;
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.2);
    h5 {
      position: relative;
      width: 100px;
      height: 50px;
      margin-right: 15px;
      img {
        width: 100%;
        height: 50px;
      }
      i {
        position: absolute;
        display: inline-block;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 12px;
        background: rgba(126, 126, 126, 0.347);
        width: 27px;
        height: 27px;
        text-align: center;
        line-height: 27px;
        border-radius: 50%;
        color: white;
      }
    }
  }

  .message-box {
    flex: 1 0 auto;
    display: flex;
    .message {
      display: inline-block;
      flex: 1 0 auto;
    }
    .fa {
      width: 40px;
      float: right;
      line-height: 50px;
      font-size: 26px;
      color: #a9a9a9;
      text-align: center;
    }
  }
  .search-best-song {
    .message-box {
      display: flex;
      .message {
        line-height: 50px;
        font-size: 17px;
        color: #333333;
        display: inline-block;
        flex: 1 0 auto;
      }
      .fa {
        width: 40px;
        float: right;
      }
    }
  }
}
.search-inp {
  padding: 15px 10px;
  position: relative;
  border-bottom: 1px solid #eeeeee9e;
  input {
    border-radius: 20px;
    outline: none;
    border: none;
    background: #ebecec;
    width: 100%;
    height: 30px;
    padding: 0 30px;
  }
  i.fl {
    position: absolute;
    top: 22px;
    left: 15px;
    font-size: 14px;
    color: rgb(194, 194, 194);
  }
  i.fr {
    position: absolute;
    top: 22px;
    right: 15px;
    font-size: 16px;
    color: rgb(194, 194, 194);
  }
}
.search-hot {
  padding: 15px 10px 0 10px;
  p {
    margin-bottom: 0;
    font-size: 12px;
    color: rgb(148, 148, 148);
    padding-left: 3px;
    padding-top: 2px;
    margin-bottom: 10px;
  }
  .search-hot-list {
    li {
      display: inline-block;
      border-radius: 15px;
      border: 1px solid #d3d4da;
      height: 28px;
      margin-right: 8px;
      margin-bottom: 8px;
      padding: 0 14px;
      font-size: 14px;
      line-height: 28px;
      color: #333;
    }
  }
}
.search-recommend {
  p {
    padding: 5px 10px;
    color: #507daf;
    line-height: 40px;
    border-bottom: 0.5px solid #d6d6d6cb;
    font-size: 16px;
  }
}
.search-detail {
  padding-top: 8px;
  p.detail {
    margin-left: 10px;
    font-size: 12px;
    line-height: 16px;
    color: #666;
  }
}
</style>