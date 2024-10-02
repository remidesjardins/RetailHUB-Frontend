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
        <li v-for="category in categories" :key="category">
          {{ category.name }}
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
    addCategory() {
      if (this.newCategory.trim() !== "") {
        this.$emit("addCategory", this.newCategory);
        this.newCategory = "";
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
}

.overlay-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  max-width: 90%;
}

.input-field {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
}

.submit-btn, .close-btn, .remove-btn {
  margin-top: 10px;
  padding: 10px;
  background-color: #4CAF50;
  border: none;
  color: white;
  cursor: pointer;
}

.remove-btn {
  background-color: #f44336;
  margin-left: 10px;
}

ul {
  padding-left: 0;
}

li {
  list-style: none;
  margin-bottom: 5px;
}
</style>