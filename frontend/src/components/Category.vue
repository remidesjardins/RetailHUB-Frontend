<!-- CategoryOverlay.vue -->
<template>
  <div v-if="show" class="overlay">
    <div class="overlay-content">
      <h3>Manage Categories</h3>
      <form @submit.prevent="addCategory">
        <input
            v-model="newCategory"
            type="text"
            placeholder="Enter new category"
            class="input-field"
        />
        <button type="submit" class="submit-btn">Add Category</button>
      </form>

      <h4>Existing Categories</h4>
      <ul>
        <li v-for="category in categories" :key="category" class="category-item">
          <span>{{ category.name }}</span>
          <button @click="removeCategory(category)" class="remove-btn">Remove</button>
        </li>
      </ul>

      <button @click="closeOverlay" class="close-btn">Close</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    categories: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      newCategory: "",
    };
  },
  methods: {
    async addCategory() {
      if (this.newCategory.trim() !== "") {
        try {
          const response = await fetch('https://com.servhub.fr/api/categories', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: this.newCategory }),
          });
          if (response.ok) {
            const createdCategory = await response.json();

            // Ensure the createdCategory has the correct fields (_id and name)
            if (createdCategory._id && createdCategory.name) {
              // Emit new category to parent (AddProductForm)
              this.$emit("addCategory", createdCategory);

              // Add the new category to the local array to update the overlay
              this.categories.push(createdCategory);

              // Clear the input field
              this.newCategory = "";
            }
          } else {
            console.error("Failed to add category");
          }
        } catch (error) {
          console.error("Error adding category:", error);
        }
      }
    },
    removeCategory(category) {
      console.log("Category to delete : ", category);
      this.$emit("removeCategory", category);
    },
    closeOverlay() {
      this.$emit("closeOverlay");
    },
  },
};
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.overlay-content {
  background: white;
  padding: 20px;
  border-radius: 20px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.input-field {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 25px;
  font-size: 16px;
}

.submit-btn,
.close-btn,
.remove-btn {
  margin-top: 10px;
  padding: 10px;
  background-color: #4CAF50;
  border: none;
  color: white;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.submit-btn:hover,
.close-btn:hover {
  background-color: #45a049;
}

.close-btn {
  background-color: #a6a5a5;
}

.close-btn:hover {
  background-color: #888;
}

.remove-btn {
  background-color: #f44336;
  margin-left: auto;
}

.remove-btn:hover {
  background-color: #e53935;
}

ul {
  padding-left: 0;
  margin-top: 10px;
}

li {
  list-style: none;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-item span {
  flex-grow: 1;
  font-size: 16px;
  padding-right: 10px;
}
</style>