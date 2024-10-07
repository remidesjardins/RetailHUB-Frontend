<!--
  =====================================================
  Project: RetailHub
  File: PlaceProductForm.vue
  Description: Component for placing a product by assigning it to a specific slot within RetailHub.
  Participants:
    - Alexandre Borny
    - Maël Castellan
    - Laura Donato
    - Rémi Desjardins
  =====================================================
-->

<template>
  <!-- Overlay container to focus on the Place Product form -->
  <div class="overlay">
    <!-- Form container for placing a product -->
    <div class="place-product-form">
      <!-- Form header with title and close button -->
      <div class="form-header">
        <h2>Place Product</h2>
        <button @click="$emit('close')" class="close-btn">
          <i class="fa-solid fa-xmark fa-xl"></i>
        </button>
      </div>

      <!-- Form for placing the product -->
      <form @submit.prevent="placeProduct">
        <!-- Row for SKU Code input -->
        <div class="form-row">
          <div class="form-group">
            <label for="sku">SKU Code</label>
            <input
                type="text"
                id="sku"
                v-model="placement.SKU"
                placeholder="Enter SKU Code"
                required
            />
          </div>
        </div>

        <!-- Row for Slot Code input -->
        <div class="form-row">
          <div class="form-group">
            <label for="slotCode">Slot Code</label>
            <input
                type="text"
                id="slotCode"
                v-model="placement.slotCode"
                placeholder="Enter Slot Code"
                required
            />
          </div>
        </div>

        <!-- Submit button to place the product -->
        <button type="submit" class="submit-btn">Place Product</button>
      </form>
    </div>
  </div>
</template>

<script>
/**
 * PlaceProductForm Component
 * Provides a form for assigning a product to a specific slot within RetailHub.
 */
export default {
  data() {
    return {
      /**
       * Object holding the placement details entered by the user.
       * @type {Object}
       * @property {string} SKU - The Stock Keeping Unit code of the product.
       * @property {string} slotCode - The code of the slot where the product will be placed.
       */
      placement: {
        SKU: '',
        slotCode: '',
      },
    };
  },
  methods: {
    /**
     * Handles the form submission to place the product.
     * Validates input fields, sends a PUT request to update the product's slot,
     * and provides user feedback based on the API response.
     */
    async placeProduct() {
      // Validate that both SKU and Slot Code are provided
      if (!this.placement.SKU || !this.placement.slotCode) {
        window.alert("Please fill in both SKU Code and Slot Code.");
        return;
      }

      try {
        // Prepare the data for placing the product
        const placementData = {
          SKU: this.placement.SKU.trim(),
          Slot: this.placement.slotCode.trim(),
        };

        // Make the API call to update the Slot Code for the product
        const response = await fetch(`https://com.servhub.fr/api/products/${this.placement.SKU}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(placementData),
        });

        // Handle the response from the server
        if (response.ok) {
          const result = await response.json();
          window.alert(`Product placed successfully with Slot Code: ${this.placement.slotCode}`);
          console.log('Product placement response:', result);
          this.$emit('close'); // Close the form after successful submission
        } else {
          const errorData = await response.json();
          window.alert(`Error placing product: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error during product placement:', error);
        window.alert('An error occurred while placing the product.');
      }
    },
  },
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

.place-product-form {
  background-color: white;
  padding: 20px;
  border-radius: 30px;
  width: 100%;
  max-width: 400px;
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
  margin-bottom: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid black;
  border-radius: 25px;
  font-size: 16px;
}

.submit-btn {
  padding: 10px 20px;
  background-color: #a6a5a5;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
}

.submit-btn:hover {
  background-color: #45a049;
}
</style>