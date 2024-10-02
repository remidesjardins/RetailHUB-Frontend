<template>
  <div class="overlay">
    <div class="receipt-parcel-form">
      <div class="form-header">
        <h2>Receipt of a Parcel</h2>
        <button @click="$emit('close')" class="close-btn">
          <i class="fa-solid fa-xmark fa-xl"></i>
        </button>
      </div>

      <form @submit.prevent="handleReceipt">
        <!-- SKU Code and Number of products received -->
        <div class="form-row">
          <div class="form-group">
            <label for="sku">SKU Code</label>
            <input type="text" id="sku" v-model="parcel.SKU" placeholder="Enter SKU code" required />
          </div>
        </div>

        <div class="form-group">
          <label for="received-amount">No. of Products Received</label>
          <input type="number" id="received-amount" v-model="parcel.receivedAmount" placeholder="Enter the quantity received" required />
        </div>

        <button type="submit" class="submit-btn">Add product</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      parcel: {
        SKU: '',
        receivedAmount: ''
      },
    };
  },
  methods: {
    async handleReceipt() {
      if (!this.parcel.SKU || !this.parcel.receivedAmount) {
        alert("Please enter both SKU and the received amount.");
        return;
      }

      try {
        // Fetch the current stock level from the database
        const response = await fetch(`https://com.servhub.fr/api/products/${this.parcel.SKU}`);
        const product = await response.json();

        if (!product || !product.Current_stock) {
          alert("Product not found or no current stock information.");
          return;
        }

        const newStockLevel = parseInt(product.Current_stock) + parseInt(this.parcel.receivedAmount);
        console.log(newStockLevel);

        // Update the stock level in the database
        const updateResponse = await fetch(`https://com.servhub.fr/api/products/${this.parcel.SKU}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ Current_stock: newStockLevel }),
        });

        if (updateResponse.ok) {
          alert(`Stock updated successfully. New stock level: ${newStockLevel}`);
          this.$emit('close'); // Close the form after submission
        } else {
          alert("Failed to update stock level.");
        }
      } catch (error) {
        console.error("Error handling the receipt:", error);
        alert("An error occurred while processing the request.");
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

.receipt-parcel-form {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
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
}
</style>