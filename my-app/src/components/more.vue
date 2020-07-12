<template>
  <div :class="[{'more-show':isMore},'more']" @click="$emit('moreHide')">
    <div class="more-fun">
      <h3>{{currentMusic.al.name}}</h3>
      <ul>
        <li>
          <div class="icon">
            <i class="iconfont icon-ren"></i>
          </div>
          <span>歌手信息</span>
        </li>
        <li>
          <div class="icon">
            <i class="iconfont icon-MV"></i>
          </div>
          <span>分享</span>
        </li>
        <li>
          <div class="icon">
            <i class="iconfont icon-MV"></i>
          </div>
          <span>分享</span>
        </li>
        <li>
          <div class="icon">
            <i class="iconfont icon-MV"></i>
          </div>
          <span>分享</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isMore: Boolean,
    currentMusic: Object
  },
  data() {
    return {};
  },
  methods: {
    moreHide() {
      this.isMore = false;
    }
  }
};
</script>

<style lang="less" scoped>
.more {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  transition: all 0.5s;
  opacity: 0;
  visibility: hidden;
  h3 {
    margin-bottom: 10px;
    font-size: 18px;
  }
  .more-fun {
    position: absolute;
    right: 0;
    left: 0;
    bottom: -100%;
    background: rgb(247, 247, 247);
    transition: all 0.6s;
    padding: 10px 20px;
    color: rgb(54, 54, 54);
    ul {
      li {
        padding: 10px 0;
        display: inline-block;
        text-align: center;
        width: 23%;
        margin:0px 1%;
            margin-bottom: 10px;
        .icon {
          border-radius: 10px;
          background: #d3d3d3;
          padding: 10px 0;
          margin:0 5px;
          margin-bottom: 5px;
        }
        span {
          font-size: 14px;
        }
        .iconfont {
          font-size: 30px;
          color: #e4393c;
        }
      }
    }
  }
  &.more-show {
    display: block;
    background: rgba(0, 0, 0, 0.3);
    visibility: visible;
    opacity: 1;
    .more-fun {
      position: absolute;
      right: 0;
      left: 0;
      bottom: 0;
      transition: all 0.2s;
    }
  }
}
</style>