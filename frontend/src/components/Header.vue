<template>
  <header class="header">
    <SearchBar :searchQuery="searchQuery" @search="emitSearchQuery" />

    <div class="icons" @click="goToCart">
      <i class="fa fa-shopping-cart"></i>
    </div>
  </header>
</template>

<script>
import SearchBar from "@/components/SearchBar.vue";

export default {
  name: "Header",
  props: ['searchQuery'],
  components: {SearchBar},
  methods: {
    emitSearchQuery(query) {
      this.$emit("search", query);
    },
    goToCart() {
      this.$router.push({name: "Bag"});
    }
  }
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: white;
}
.search-bar input {
  padding: 10px;
  font-size: 16px;
  width: 300px;
}
.icons {
  font-size: 24px;
}
</style>