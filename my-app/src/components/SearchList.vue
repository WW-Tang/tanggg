<template>
  <li @click="handleClick">
    <i class="fa fa-search"></i>
    <span>{{recommendItem.keyword}}</span>
  </li>
</template>

<script>
export default {
  props: ["recommendItem"],

  methods: { 
handleClick(){
  this.$emit('outDetails',this.recommendItem.keyword)
}
      
  },
};
</script>

<style scoped>
li {
  line-height: 40px;
  display: flex;
}
li i.fa{
    display: block;
    width: 40px;
    height: 100%;
    text-align: center;
    line-height: 40px;
    color:#c7c7c79e;
    font-size: 18px;
}
li span{
    flex: 0 1 auto;    
    font-size: 16px;
  border-bottom: 1px solid #eeeeee9e;
  color: #404040;
  font-weight: 100;
}
</style>