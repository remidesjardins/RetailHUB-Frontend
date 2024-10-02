<template>
  <div class="overlay">
    <div class="stock-correction-form">
      <div class="form-header">
        <h2>Stock correction</h2>
        <button @click="$emit('close')" class="close-btn">
          <i class="fa-solid fa-xmark fa-xl"></i>
        </button>
      </div>

      <form @submit.prevent="correctStock">
        <!-- SKU Code -->
        <div class="form-row">
          <div class="form-group">
            <label for="sku">SKU Code</label>
            <input type="text" id="sku" v-model="correction.SKU" placeholder="Enter SKU Code" required />
          </div>
        </div>

        <!-- Stock Adjustment -->
        <div class="form-row">
          <div class="form-group">
            <label for="adjustment">N°</label>
            <input type="number" id="adjustment" v-model="correction.adjustment" placeholder="Stock Adjustment" required />
          </div>
        </div>

        <button type="submit" class="submit-btn">Correct product</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      correction: {
        SKU: '',
        adjustment: ''
      }
    };
  },
  methods: {
    async correctStock() {
      // Ensure that SKU and adjustment values are provided
      if (!this.correction.SKU || !this.correction.adjustment) {
        alert("Please fill in both SKU Code and Stock Adjustment.");
        return;
      }

      try {
        // Fetch the current stock for the given SKU
        const response = await fetch(`https://com.servhub.fr/api/products/${this.correction.SKU}`);
        if (!response.ok) {
          alert(`Error fetching product with SKU: ${this.correction.SKU}`);
          return;
        }

        const product = await response.json();

        // Update the current stock by adding/subtracting the adjustment
        const updatedStock = product.Current_stock + Number(this.correction.adjustment);

        // Prepare the data for the stock correction
        const stockCorrectionData = {
          SKU: this.correction.SKU,
          Current_stock: updatedStock,
        };

        // Make the API call to update the stock
        const updateResponse = await fetch(`https://com.servhub.fr/api/products/${this.correction.SKU}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(stockCorrectionData),
        });

        // Handle the response from the server
        if (updateResponse.ok) {
          const result = await updateResponse.json();
          alert(`Stock corrected successfully for SKU: ${this.correction.SKU}`);
          console.log('Stock correction response:', result);
          this.$emit('close');  // Close the form after successful submission
        } else {
          const errorData = await updateResponse.json();
          alert(`Error correcting stock: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error during stock correction:', error);
        alert('An error occurred while correcting the stock.');
      }
    }
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

.stock-correction-form {
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