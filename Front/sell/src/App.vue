<template>
  <div id="app">
<!--    <img src="./assets/logo.png">-->
    <v-header></v-header>
    <div class="tab">
      <div class="tab-item">
        <router-link to="{path: '/goods'}">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="{path: '/ratings'}">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="{path: '/seller'}">商家</router-link>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import header from './components/header/header.vue'
export default {
  name: 'App',
  components: {'v-header': header}
}
</script>

<style>
  .tab{
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
  }
  .tab-item{
    flex: 1;
    text-align: center;
  }
/*#app {*/
/*  font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
/*  -webkit-font-smoothing: antialiased;*/
/*  -moz-osx-font-smoothing: grayscale;*/
/*  text-align: center;*/
/*  color: #2c3e50;*/
/*  margin-top: 60px;*/
/*}*/
</style>
