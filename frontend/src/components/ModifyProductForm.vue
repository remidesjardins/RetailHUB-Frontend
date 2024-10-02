<template>
  <div class="modify-product-form">
    <div class="form-header">
      <h2>Modify Product</h2>
      <button @click="$emit('close')" class="close-btn">
        <i class="fa-solid fa-xmark fa-xl"></i>
      </button>
    </div>

    <form @submit.prevent="modifyProduct">
      <!-- Product Name, SKU, and Price on the same line -->
      <div class="form-row">
        <div class="form-group">
          <label for="name">Product Name</label>
          <input type="text" id="name" v-model="product.name" placeholder="Enter product name" required />
        </div>

        <div class="form-group">
          <label for="sku">SKU</label>
          <input type="text" id="sku" v-model="product.SKU" placeholder="Enter SKU" required />
        </div>

        <div class="form-group">
          <label for="price">Price</label>
          <input type="number" id="price" v-model="product.price" placeholder="Enter price" required />
        </div>
      </div>

      <!-- Category Checkbox and Add Category -->
      <div class="form-group">
        <label for="category">Category</label>
        <div class="category-row">
          <input type="checkbox" id="tech-category" v-model="product.category" value="Tech" />
          <label for="tech-category">Tech</label>
          <button type="button" class="add-category-btn">+ Add category</button>
        </div>
      </div>

      <!-- Overview text area -->
      <div class="form-group">
        <label for="overview">Overview</label>
        <textarea id="overview" v-model="product.Details" placeholder="Enter product overview" required></textarea>
      </div>

      <button type="submit" class="submit-btn">Modify product</button>
    </form>
  </div>
</template>

<script>
export default {
  props: ['productSKU'],
  data() {
    return {
      product: {
        name: '',
        SKU: '',
        price: '',
        category: 'Tech', // Example default category
        Details: '',
      }
    };
  },
  mounted() {
    this.fetchProductDetails();
  },
  methods: {
    async fetchProductDetails() {
      console.log(this.productSKU);
      try {
        const response = await fetch(`https://com.servhub.fr/api/products/${this.productSKU}`);        const data = await response.json();
        if (data) {
          this.product = { ...this.product, ...data };
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    },
    async modifyProduct() {
      try {
        const response = await fetch(`https://com.servhub.fr/api/products/${this.productSKU}`, {          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(this.product),
        });

        const result = await response.json();
        if (response.ok) {
          alert(`Product "${this.product.name}" updated successfully!`);
          this.$emit('close');  // Close the form after submission
        } else {
          alert("Error updating product: " + result.message);
        }
      } catch (error) {
        console.error("Error updating product:", error);
      }
    }
  }
};
</script>

<style scoped>
.modify-product-form {
  background: white;
  padding: 20px;
  border-radius: 30px;
  width: 50%;  /* Adjust as per your preference */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);  /* Add some shadow */
  position: relative;
  overflow: hidden;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: gray;
}

.form-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.form-group {
  flex: 1;
  margin-right: 15px;
}

.form-group:last-child {
  margin-right: 0;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 95%;
  padding: 10px;
  border: 1px solid black;
  border-radius: 25px;
  font-size: 16px;
}

.form-group textarea {
  resize: vertical;
}

.category-row {
  display: flex;
  align-items: center;
}

.add-category-btn {
  margin-left: 20px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 20px;
  cursor: pointer;
}

.submit-btn {
  padding: 10px 20px;
  background-color: #a6a5a5;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
}

.submit-btn:hover {
  background-color: #45a049;
}
</style>