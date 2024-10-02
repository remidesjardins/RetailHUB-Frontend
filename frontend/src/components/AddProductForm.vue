<template>
  <div class="overlay">
    <div class="add-product-form">
      <div class="form-header">
        <h2>Add Product</h2>
        <button @click="$emit('close')" class="close-btn">
          <i class="fa-solid fa-xmark fa-xl"></i>
        </button>
      </div>

      <form @submit.prevent="addProduct">
        <!-- Product Name, SKU, and Price on the same line -->
        <div class="form-row">
          <div class="form-group">
            <label for="name">Name</label>
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

        <!-- Image URL -->
        <div class="form-row">
          <div class="form-group">
            <label for="Image">Image URL</label>
            <input type="text" id="imageUrl" v-model="product.Image" placeholder="Enter image URL" required />
          </div>

          <div class="form-group">
            <label for="slot">Slot</label>
            <input type="text" id="slot" v-model="product.Slot" placeholder="Enter slot" />
          </div>
        </div>

        <!-- Category Checkbox and Add Category -->
        <div class="form-row">
          <div class="form-group">
              <div class="category-section">
                <label for="categories">Categories</label>
                <select v-model="selectedCategory">
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
                <button type="button" @click="openCategoryOverlay">Add Category</button>
              </div>
            </div>
        </div>div>

        <!-- Stock, Reorder Level -->
        <div class="form-row">
          <div class="form-group">
            <label for="current-stock">Current Stock</label>
            <input type="number" id="current-stock" v-model="product.Current_stock" placeholder="Enter stock" required />
          </div>

          <div class="form-group">
            <label for="reorder-level">Reorder Level</label>
            <input type="number" id="reorder-level" v-model="product.Reorder_level" placeholder="Enter reorder level" required />
          </div>
        </div>

        <!-- Overview text area -->
        <div class="form-group">
          <label for="overview">Details</label>
          <textarea id="overview" v-model="product.Details" placeholder="Enter product details" required></textarea>
        </div>

        <button type="submit" class="submit-btn">Add product</button>
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
  </div>
</template>


<script>

import CategoryOverlay from '@/components/Category.vue';


export default {
  data() {
    return {
      product: {
        name: '',
        category: '',
        SKU: '',
        price: '',
        Current_stock: '',
        Reorder_level: '',
        Details: '',
        Image: '',
        Slot: ''
      },
      showCategoryOverlay: false,
      selectedCategory: '',
      categories: [],
    };
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
    async addCategory(newCategory) {
      try {
        console.log("Category to add : ", newCategory);
        const response = await fetch('https://com.servhub.fr/api/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: newCategory }), // Assuming the API expects a 'name' field
        });
        if (response.ok) {
          const createdCategory = await response.json();
          this.categories.push(createdCategory); // Add the new category to the list
        } else {
          console.error('Failed to add category');
        }
      } catch (error) {
        console.error('Error adding category:', error);
      }
    },
    async removeCategory(category) {
      try {
        console.log("Category to REMOVE: ", category);
        console.log(category._id);
        const response = await fetch(`https://com.servhub.fr/api/categories/${category._id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          this.categories = this.categories.filter(cat => cat.id !== category.id); // Remove the deleted category from the list
        } else {
          console.error('Failed to remove category');
        }
      } catch (error) {
        console.error('Error removing category:', error);
      }
    },
    submitForm() {
      // Handle form submission
      console.log('Form submitted with category ID:', this.selectedCategory);
    },
    async addProduct() {
      try {
        // Send POST request to add the product
        const response = await fetch("https://com.servhub.fr/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.product),
        });

        // Check if the request was successful
        if (response.ok) {
          const result = await response.json();
          console.log('Product added successfully:', result);
          alert(`Product "${this.product.name}" added successfully!`);

          // Emit event to close the form
          this.$emit('close');
        } else {
          const result = await response.json();
          console.error('Failed to add product:', result);
          alert(`Failed to add product: ${result.message}`);
        }
      } catch (error) {
        console.error('Error adding product:', error);
        alert('An error occurred while adding the product.');
      }
    },
    openCategoryOverlay() {
      this.showCategoryOverlay = true;
    },
    closeCategoryOverlay() {
      this.showCategoryOverlay = false;
    },
  },
  components: {
    CategoryOverlay,
  }
};
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.add-product-form {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
}
.add-product-form {
  background: white;
  padding: 20px;
  border-radius: 30px;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
.form-group textarea {
  width: 95%;
  padding: 10px;
  border: 1px solid black;
  border-radius: 25px;
  font-size: 16px;
}

.category-section {
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
</style>