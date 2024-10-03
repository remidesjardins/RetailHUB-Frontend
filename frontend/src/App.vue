<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
  created(){
    this.$store.commit("initializeCart");
  },
    mounted() {
    this.$router.push('/');
  },
  };
</script>
  <style>
*{
  font-family: 'Arial', sans-serif;

}
</style>