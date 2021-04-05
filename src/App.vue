<template>
  <div id="app">
    <div class="container">
      <router-view></router-view>

     
    </div>
  </div>
</template>

<script>

export default {
  name: "App",

  components: {
  },
};
</script>

<style scoped>
.navi {
  margin-top: 20px;
  width: 200px;
  display: flex;
  justify-content: space-between;
}
button {
  margin-top: 20px;
}
</style>
