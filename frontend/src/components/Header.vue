<!--
  =====================================================
  Project: RetailHub
  File: Header.vue
  Description: Component for the main header, including search functionality and cart navigation.
  Participants:
    - Alexandre Borny
    - Maël Castellan
    - Laura Donato
    - Rémi Desjardins
  =====================================================
-->

<template>
  <!-- Main header container -->
  <header class="header">
    <!-- SearchBar component with two-way binding for searchQuery and emitting search events -->
    <SearchBar :searchQuery="searchQuery" @search="emitSearchQuery" />

    <!-- Shopping cart icon with click event to navigate to the cart page -->
    <div class="icons" @click="goToCart">
      <i class="fa fa-shopping-cart"></i>
    </div>
  </header>
</template>

<script>
/**
 * Header Component
 * Renders the main header of the RetailHub application, including the search bar and shopping cart icon.
 */
import SearchBar from "@/components/SearchBar.vue";

export default {
  name: "Header",

  /**
   * Props received from the parent component.
   * @prop {String} searchQuery - The current search query entered by the user.
   */
  props: ['searchQuery'],

  components: {
    SearchBar,
  },

  methods: {
    /**
     * Emits the search query to the parent component when a search is performed.
     * @param {String} query - The search query entered by the user.
     */
    emitSearchQuery(query) {
      this.$emit("search", query);
    },

    /**
     * Navigates the user to the shopping cart page when the cart icon is clicked.
     */
    goToCart() {
      this.$router.push({ name: "Bag" });
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