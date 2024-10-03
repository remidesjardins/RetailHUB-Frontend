<template>

  <div class="home-container">
    <NavBar class="navbar"></NavBar>
    <div class="content">
      <Header :searchQuery="searchQuery" @search="handleSearch" id="Header"/>

      <ProductList
            :productList="filteredProducts"
            :text="'Recent Products'"
            :isEmpty="isEmpty"
            @productSelected="showProductDetailsOverlay"
        />
      <ProductDetails
          v-if="showProductDetails"
          :product="selectedProduct"
          @close="closeProductDetailsOverlay"
      />
      <CommandBoxes></CommandBoxes>
    </div>
  </div>
</template>

<script>
// Import the ProductList component
import Header  from "@/components/Header.vue";
import ProductList from '@/components/ProductList.vue';
import NavBar from "@/components/NavBar.vue";
import CommandBoxes from "@/components/CommandBoxes.vue";
import ProductDetails from "@/components/ProductDetails.vue";

export default {
  components: {
    CommandBoxes,
    ProductList,
    NavBar,
    ProductDetails,
    Header,
  },
  data() {
    return {
      searchQuery: "",
      products: [],  // Reactive array to store products
      selectedProduct: null, // Store the selected product
      showProductDetails: false, // Toggle for product details overlay
      isEmpty: false,
    };
  },
  computed: {
    filteredProducts() {
      if (this.searchQuery.trim() === "") {
        console.log(this.products);
        return this.products; // If no search query, return all books
      }
      return this.products.filter(product => {
        return product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            product.SKU.toString().includes(this.searchQuery.toLowerCase());
      });
    },
    searchTitle() {
      return this.searchQuery.trim() === "" ? "Recent search" : "Search Result";
    },
  },
  created() {
    // Fetch products initially
    this.fetchInitialProducts();
  },
  methods: {
    fetchInitialProducts() {
      console.log("NOW");
      fetch('https://com.servhub.fr/api/products')
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            this.updateProducts(data);
          })
          .catch(error => {
            console.error('Error fetching products:', error.message);
          });
    },
    updateProducts(productList) {
      this.products = productList;
      this.isEmpty = productList.length === 0;
      console.log("FDFSJF: ", this.products);
    },
    showProductDetailsOverlay(product) {
      console.log('Displaying product details:', product); // Check if this is logged
      this.selectedProduct = product; // Set the selected product
      this.showProductDetails = true; // Show the overlay
    },
    closeProductDetailsOverlay() {
      this.showProductDetails = false; // Close the overlay
    },
    handleSearch(query) {
      this.searchQuery = query;
    }
  },
  mounted() {
    this.polling = setInterval(() => {
      this.fetchInitialProducts();
    }, 5000);
  }


};
</script>

<style scoped>
.home-container {
  margin-left: 60px;
  max-width: 100vw;
  flex-wrap: nowrap;
  overflow-x: auto;
  flex-direction: row;
  height: 100vh;
}


.content {
  margin-left: 20px;
  flex-grow: 1;
  padding: 20px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 20px;
  height: 100%; /* Ensure the content takes full height */
}


</style>s