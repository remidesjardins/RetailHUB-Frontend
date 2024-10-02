<template>
  <div class="overlay" @click.self="closeDetails">
    <div class="product-details" @click.stop>
      <span class="close-button" @click="closeDetails"><i class="fa-solid fa-xmark fa-2xl"></i></span>

      <!-- Left content: Image, Category, Price -->
      <div class="left-content">
        <h1 class="product-title">{{ product.name }}</h1>
        <span class="category-label">{{ product.category }}</span>
        <span class="sku">{{ product.SKU }}</span>
        <img :src="product.Image" alt="Product image" />
        <div class="stock-info">
          <span>Available stock:</span>
          <div class="stock-level">
            <span class="stock-number">{{ product.Current_stock }}</span>
            <span class="stock-location">{{ product.Slot }}</span>
          </div>

        </div>
        <div class="price">{{ product.price }} $</div>
        <button class="add-to-cart" @click="addToCart(product)">Add to cart</button>
      </div>

      <!-- Right content: Overview -->
      <div class="summary">
        <h3>Overview</h3>
        <p>{{ product.Details }}</p>
      </div>

      <!-- Action icons (Modify and Delete) -->
      <div class="bottom-right-buttons">
        <button @click="showUpdateForm = true" class="icon-button">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button @click="deleteProduct(product.SKU)" class="icon-button delete-button">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>
  </div>

  <div v-if="showUpdateForm" class="overlay">
    <div class="modal">
      <button @click="goToUpdateProduct(product.SKU)">Update</button>
    </div>
  </div>

  <!-- Update Form Modal -->
  <div class="overlay" v-if="showUpdateForm">
    <ModifyProductForm
        :productSKU="product.SKU"
        @close="showUpdateForm = false"
    />
  </div>
</template>

<script>

import ModifyProductForm from '@/components/ModifyProductForm.vue'; // Path to your new ModifyProductForm.vue file

export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
    visible: Boolean
  },
  data() {
    return {
      showUpdateForm: false,
      productImage: "https://via.placeholder.com/150?text=No+Image" // Default product image
    };
  },
  methods: {
    deleteProduct(productSKU) {
      if (confirm("Are you sure you want to delete this product?")) {
        // Send DELETE request to the backend
        console.log(productSKU);
        fetch(`https://com.servhub.fr/api/products/${productSKU}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        })
            .then(response => {
              if (response.ok) {
                console.log(`Product ${productSKU} deleted successfully.`);
                this.$emit('productDeleted', productSKU);
              } else {
                alert('Failed to delete the product.');
              }
            })
            .catch(error => {
              console.error('Error deleting product:', error);
              alert('An error occurred while deleting the product.');
            });
      }
    },
    goToUpdateProduct(productSKU) {
      this.$router.push({ name: "UpdateProduct", params: { productSKU } });
    },
    closeDetails() {
      this.$emit('close');
    },
    // Optional method to fetch a product image (if available)
    fetchProductImage() {
      this.productImage = "https://via.placeholder.com/150?text=No+Image";
    },
    addToCart(product) {
      this.$store.commit("addToCart", product);
    }
  },
  components: {
    ModifyProductForm,
  },
  mounted() {
    this.fetchProductImage(); // Fetch the product image on mount
    console.log('Product details:', this.product);

  }
};
</script>

<style scoped>
/* Overlay Styles */
.overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);  /* Darkened background */
  z-index: 999;  /* Ensure it's on top */
}



.product-details {
  background-color: white;
  border-radius: 30px; /* Rounded corners */
  padding: 20px;
  max-width: 900px;
  max-height: 90vh;
  width: 900px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  z-index: 10;
  overflow: hidden; /* Ensure content stays inside the rounded borders */
}

.left-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40%;
}

.left-content img {
  width: 150px;
  margin-bottom: 10px;
}

.left-content .product-title {
  text-align: left;
  font-size: 25px;
  font-weight: bold;
}

.price {
  font-size: 24px;
  margin-bottom: 10px;
}

.add-to-cart {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 25px;
  background-color: #d3d3d3;
  color: black;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
}

.summary {
  width: 55%;
  padding-left: 30px;
}

.summary h3 {
  margin-bottom: 10px;
}

.close-button {
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
}

.category-label {
  background-color: orange;
  border-radius: 10px;
  padding: 5px 10px;
  margin-bottom: 20px;
  color: white;
  font-weight: bold;
  font-size: 16px;
}

.stock-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.stock-level {
  display: flex;
  align-items: center;
}

.stock-number {
  background-color: green;
  border-radius: 50%;
  padding: 10px;
  color: white;
  font-weight: bold;
  margin-right: 10px;
}

.stock-location {
  color: #333;
}

.bottom-right-buttons {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 38px;
  color: #007bff;
}

.icon-button:hover {
  color: #0056b3;
}

.delete-button {
  color: red;
}

.delete-button:hover {
  color: darkred;
}
</style>