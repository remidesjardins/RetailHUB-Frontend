<template>
  <div>
    <h2>{{ this.text }}</h2>
    <div class="product-list">
      <div class="product-list-container"
           ref="productSlider"
           @mousedown="handleMouseDown"
           @mousemove="handleMouseMove"
           @mouseup="handleMouseUp"
           @mouseleave="handleMouseLeave">        <button @click="slideLeft" class="slider-btn left">‹</button>
        <div v-if="productList.length > 0" class="product-slider">
          <div
              v-for="product in productList"
              :key="product.SKU"
              class="product"
              @click="selectProduct(product)"
          >
            <img :src="product.Image || getProductImage(product.SKU)" alt="product image" class="product-image" />
            <div class="product-id">{{ product.SKU }}</div>
            <div class="product-details">
              <div class="product-name">{{ product.name }}</div>
              <div class="product-price">{{ product.price }} $</div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="product-name" id="empty-title">Oups… <br />Nothing here yet</div>
        </div>
      </div>
      <button @click="slideRight" class="slider-btn right">›</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    productList: {
      type: Array,
      default: () => [] // Ensure default is an empty array to avoid undefined
    },
    text: String,
    isEmpty: Boolean,
  },
  data() {
    return {
      imageCache: {}, // Cache to store fetched images
      startX: 0,
    };
  },
  methods: {
    selectProduct(product) {
      this.$emit("productSelected", product); // Emit event when product is selected
      console.log('Product selected:', product);
    },
    fetchProducts() {
      fetch("https://com.servhub.fr/api/products")
          .then((response) => response.json())
          .then((result) => {
            console.log(result); // Check the fetched product data
            this.$emit("updateProducts", result); // Emit to parent to update productList
            result.forEach((product) => this.getProductImage(product.SKU));
          })
          .catch((error) => console.log("Error fetching products:", error));
    },
    updateProducts(products) {
      this.products = products;
      this.isEmpty = products.length === 0;
    },
    getProductImage(SKU) {
      if (this.imageCache[SKU]) {
        return this.imageCache[SKU];
      }

      const productImageUrl = `https://via.placeholder.com/100`; // Replace with actual logic
      this.imageCache[SKU] = productImageUrl;
      return productImageUrl;
    },
    slideRight() {
      const firstProduct = this.productList.shift(); // Remove the first product
      this.productList.push(firstProduct); // Add it to the end of the list
    },
    slideLeft() {
      const lastProduct = this.productList.pop(); // Remove the last product
      this.productList.unshift(lastProduct); // Add it to the beginning of the list
    },
    handleTouchStart(event) {
      this.startX = event.touches[0].clientX;
    },
    handleTouchEnd(event) {
      const endX = event.changedTouches[0].clientX;
      if (this.startX > endX) {
        this.slideRight(); // Swipe left, move slider right
      } else {
        this.slideLeft(); // Swipe right, move slider left
      }
    },
    handleMouseDown(event) {
      this.startX = event.pageX;
      this.scrollLeft = this.$refs.productSlider.scrollLeft;
    },
    handleMouseMove(event) {
      if (!this.isDragging) return;
      const x = event.pageX - this.startX;
      this.$refs.productSlider.scrollLeft = this.scrollLeft - x;
    },
    handleMouseUp() {
      this.isDragging = false;
    },
    handleMouseLeave() {
      this.isDragging = false;
    },
  },
  mounted() {
    this.fetchProducts();
    console.log('PRODUCTLIST:', this.productList); // Check if productList is passed and correctly logged

  },
};
</script>

<style scoped>
.product-list-container {
  display: flex;
  overflow-x: auto; /* Enable native horizontal scrolling */
  scroll-behavior: smooth; /* Enable smooth scrolling */
}

.product-slider {
  display: flex; /* Align the products horizontally */
  flex-wrap: nowrap; /* Prevent wrapping of products */
  gap: 10px; /* Add some space between products */
}

.product {
  min-width: 200px;
  max-width: 200px;
  height: 200px;
  padding: 10px;
  border-radius: 20px;
  background: linear-gradient(to bottom right, #aac4f6, #c2d7f4);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
  margin: 10px;
  display: flex;
  flex-direction: column;
  flex: 0 0 auto; /* Ensure each product is a fixed size */
  justify-content: space-between;
  transition: transform 0.2s ease-in-out;
  scroll-snap-align: center; /* Optional: make the product snap to center when scrolling */

}

.product:hover {
  transform: scale(1.05);
}

.product-image {
  width: auto;
  height: auto;
  max-width: 70%;
  border-radius: 15%;
  max-height: 60%;
  margin: 20px auto;
}

.product-id {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.product-details {
  position: absolute;
  left: 10px;
  bottom: 20px;
  text-align: left;
}

.product-name {
  font-size: 18px;
  font-weight: bold;
}

.product-price {
  font-size: 18px;
  color: #000;
}



button {
  background-color: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

button .right{
  position: absolute;
  right: 20px;
}

button:focus {
  outline: none;
}
</style>