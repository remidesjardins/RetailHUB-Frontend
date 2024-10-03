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
          <input type="number" id="price" v-model="product.price" step="any" placeholder="Enter price" required />
        </div>
      </div>
      <!-- Image URL and Slot -->
      <div class="form-row">
        <div class="form-group">
          <label for="Image">Image URL</label>
          <input type="text" id="Image" v-model="product.Image" placeholder="Enter an URL" required />
        </div>
        <div class="form-group">
          <label for="slot">Slot</label>
          <input type="text" id="Slot" v-model="product.Slot" placeholder="Enter slot" required />
        </div>
      </div>
      <!-- Category Checkbox and Add Category -->
      <div class="form-row">
        <div class="form-group category-group">
          <label for="categorySelect" class="category-label">Select Category</label>
          <div class="category-wrapper">
            <select id="categorySelect" class="category-select" v-model="selectedCategory">
              <option v-for="category in categories" :key="category._id" :value="category._id">
                {{ category.name }}
              </option>
            </select>
            <button type="button" class="category-btn" @click="openCategoryOverlay">Add Category</button>
          </div>
        </div>
      </div>

      <!-- Overview text area -->
      <div class="form-group">
        <label for="overview">Overview</label>
        <textarea id="overview" v-model="product.Details" placeholder="Enter product overview" required></textarea>
      </div>
      <button type="submit" class="submit-btn">Modify product</button>
    </form>

  <!-- Include the CategoryOverlay component -->
  <CategoryOverlay
      :show="showCategoryOverlay"
      :categories="categories"
      @addCategory="addCategory"
      @removeCategory="removeCategory"
      @closeOverlay="closeCategoryOverlay"
  />
</div>

</template>

<script>
import CategoryOverlay from "@/components/Category.vue";

export default {
  components: {CategoryOverlay},
  props: ['productSKU'],
  data() {
    return {
      product: {
        name: '',
        SKU: '',
        price: '',
        category: '',
        Details: '',
        Image: '',
        Slot: '',
      },
      showCategoryOverlay: false,
      selectedCategory: '',
      categories: [],
    };
  },
  mounted() {
    this.fetchProductDetails();
  },
  created() {
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await fetch('https://com.servhub.fr/api/categories');
        console.log(response);
        if (response.ok) {
          this.categories = await response.json(); // Assume the response is an array of categories
        } else {
          console.error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    addCategory(newCategory) {
      // Push the new category to the list of categories for the dropdown
      if (newCategory._id && newCategory.name) {
        this.categories.push(newCategory);
        // Optionally, set the newly added category as the selected category
        this.selectedCategory = newCategory._id;
      }
    },
    async removeCategory(category) {
      try {
        const response = await fetch(`https://com.servhub.fr/api/categories/${category._id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          this.categories = this.categories.filter(cat => cat._id !== category._id); // Use _id to filter the correct category
        } else {
          console.error('Failed to remove category');
        }
      } catch (error) {
        console.error('Error removing category:', error);
      }
    },
    async fetchProductDetails() {
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
      console.log("PRODUCT TO MODIFY : ", this.product);
      try {
        const selectedCategoryObj = this.categories.find(cat => cat._id === this.selectedCategory);
        if (selectedCategoryObj) {
          this.product.category = selectedCategoryObj.name; // Set the category name
        }
        console.log("Category updated : ", this.product.category);
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
    },
    openCategoryOverlay() {
      this.showCategoryOverlay = true;
    },
    closeCategoryOverlay() {
      this.showCategoryOverlay = false;
    },
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

.category-label{
  margin-top: 15px;
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

.category-wrapper {
  display: flex;
  align-items: center;
}

.category-select {
  width: 70%;
  padding: 10px;
  font-size: 16px;
  border-radius: 25px;
  border: 1px solid black;
  background-color: white;
  appearance: none;
  background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><polygon fill="%23666" points="0,5 10,15 20,5"/></svg>');
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 15px;
}

.category-btn {
  padding: 10px 15px;
  margin-left: 10px;
  background-color: #a6a5a5;
  color: black;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.category-btn:hover {
  background-color: #aac4f6;
}
</style>