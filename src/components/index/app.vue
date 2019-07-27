<template>
  <div id='xxx'>
    <router-view name='head' :index='pindex'></router-view>
    <router-view name='content'></router-view>
    <router-view name='footer'></router-view>
  </div>
</template>
<script>
import Nav from './nav'
export default {
  name: 'AppIndex',
  props: {
    pindex: 0
  },
  data () {
    return {}
  },
  components: {
    Nav
  }
}
</script>
<style scoped>
#xxx {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}
</style>
