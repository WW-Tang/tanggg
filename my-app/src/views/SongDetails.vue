<template>
  <div class="Details" v-if="DetailsSong">
    <p class="goBack">
      <i class="fa fa-mail-reply" @click="$router.go(-1)"></i>
    </p>
    <song-list v-if="DetailsSong.coverImgUrl!=null||DetailsSong.backgroundCoverUrl!=null" :DetailsSong="DetailsSong" :series="false" @onPlayer="$emit('onPlayer',$event)"></song-list>
  </div>
</template>

<script>
import SongList from "../components/SongList.vue";
export default {
  components: {
    SongList
  },
  data() {
    return {
      DetailsSong: null
    };
  },
  methods: {
    getRecommedSong(id) {
      this.axios
        .get("http://musicapi.leanapp.cn/playlist/detail", {
          params: {
            id: id
          }
        })
        .then(response => {
          ({ playlist: this.DetailsSong } = response.data);
          window.console.log(this.DetailsSong)
        });
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getRecommedSong(to.query.id);
    });
  }
};
</script>

<style>
.goBack {
  position:fixed;
  top: 0;
  color: #222222;
  font-size: 20px;
  width: 100%;
  z-index: 9;
  background:rgba(250, 249, 249, 0.5);
}
.goBack i {
  margin-left: 5px;
  padding: 8px 10px;
}
</style>